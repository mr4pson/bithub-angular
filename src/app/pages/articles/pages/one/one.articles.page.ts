import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IArticle } from 'src/app/model/entities/article';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CArticleRepository } from 'src/app/services/repositories/article.repository';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get content(): SafeHtml {
    const raw = this.article?.content?.[this.lang.slug] ?? '';

    return this.sanitizer.bypassSecurityTrustHtml(raw);
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

      // Заменяем пустые якоря на якоря с пробелом, чтобы браузер не обрезал id
      this.fixEmptyAnchors();

      // После загрузки статьи пробуем найти первый <a id="..."></a> в контенте и проскроллить к нему
      await this.scrollToFirstAnchor();
    } catch (err) {
      err === 404
        ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`)
        : this.appService.notifyError(err);
    }
  }

  // Заменяет пустые якоря <a id="..."></a> на <a id="..."> </a>
  private fixEmptyAnchors(): void {
    try {
      const langSlug = this.appService.lang.value.slug;
      if (!this.article?.content?.[langSlug]) {
        return;
      }
      // Заменяем <a id="..."></a> на <a id="..."> </a>
      this.article.content[langSlug] = this.article.content[langSlug].replace(
        /<a\s+([^>]*?)id=["']([^"']+)["']([^>]*)>(\s*)<\/a>/gi,
        '<a href="$2" $1id="$2"$3></a>'
      );
    } catch (e) {
      console.warn('fixEmptyAnchors failed', e);
    }
  }

  // Ищет id якоря (сначала из hash в URL, иначе - первый <a id="..."> в контенте) и делает scrollIntoView
  private async scrollToFirstAnchor(): Promise<void> {
    try {
      // Попробовать взять id из хэша URL (#test)
      let id: string = '';
      try {
        const rawHash = this.document?.location?.hash || '';
        if (rawHash && rawHash.startsWith('#')) {
          id = decodeURIComponent(rawHash.slice(1));
        }
      } catch (e) {
        // игнорируем ошибки чтения hash
      }

      if (!id) {
        return;
      }

      // Ждем отрисовки контента в DOM
      await this.appService.pause(50);

      // Ищем элемент сначала по getElementById, затем внутри контейнера .a-content
      let el: Element = this.document.getElementById(id) as Element;
      if (!el) {
        const contentDiv = this.document.querySelector('.a-content') as Element;
        if (contentDiv) {
          // безопасный селектор поиска по атрибуту id
          const safeId = id.replace(/"/g, '\\"');
          el = contentDiv.querySelector(`[id="${safeId}"]`);
        }
      }

      if (el && typeof (el as HTMLElement).scrollIntoView === 'function') {
        (el as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } catch (e) {
      console.warn('scrollToFirstAnchor failed', e);
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
