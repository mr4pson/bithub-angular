import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IArticle } from 'src/app/model/entities/article';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CArticleRepository } from 'src/app/services/repositories/article.repository';

@Component({
  selector: 'one-articles-page',
  templateUrl: 'one.articles.page.html',
  styleUrls: ['one.articles.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class COneArticlesPage {
  public article: IArticle = null;

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private articleRepository: CArticleRepository,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get content(): string {
    return this.article?.content[this.lang.slug];
  }
  get img(): string {
    return this.article.img;
  }
  get h1(): string {
    return this.article.h1[this.lang.slug] || this.article.name[this.lang.slug];
  }
  get title(): string {
    return (
      this.article.title[this.lang.slug] || this.article.name[this.lang.slug]
    );
  }
  get description(): string {
    return this.article.description[this.lang.slug];
  }
  get yt_content(): string {
    return this.article.yt_content;
  }
  get date(): string {
    return this.article.date;
  }
  get readtime(): number {
    return this.article.readtime;
  }
  get authenticated(): boolean {
    return this.authService.authData !== null;
  }

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (p) => {
      p['slug'] !== this.article?.slug && (await this.initArticle(p['slug']));
      this.initSEO();
    });
  }

  private async initArticle(slug: string): Promise<void> {
    try {
      this.article = null;
      await this.appService.pause(300);
      this.article = await this.articleRepository.loadOne(slug);

      this.updateCanonicalLink(
        this.article.canonical[this.appService.lang.value.slug]
      );
    } catch (err) {
      err === 404
        ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`)
        : this.appService.notifyError(err);
    }
  }

  private initSEO(): void {
    this.appService.setTitle(this.title);
    this.appService.setMeta('name', 'description', this.description);
  }

  private updateCanonicalLink(newCanonicalUrl: string) {
    const canonicalLink = this.document.querySelector('link[rel="canonical"]');
    const metaDes = this.document.querySelector('meta[name="description"]');
    console.log('canonical link', canonicalLink);
    if (canonicalLink) {
      console.log('Canonical tag updated', canonicalLink);
      this.renderer.setAttribute(canonicalLink, 'href', newCanonicalUrl);
    }
  }
}
