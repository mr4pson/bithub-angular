import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILang } from 'src/app/model/entities/lang';
import { ITool } from 'src/app/model/entities/tool';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CToolRepository } from 'src/app/services/repositories/tool.repository';

@Component({
  selector: 'one-tools-page',
  templateUrl: 'one.tools.page.html',
  styleUrls: ['one.tools.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class COneToolsPage {
  public tool: ITool = null;

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private toolRepository: CToolRepository,
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
    return this.tool?.content[this.lang.slug];
  }
  get img(): string {
    return this.tool.img;
  }
  get h1(): string {
    return this.tool.h1[this.lang.slug] || this.tool.name[this.lang.slug];
  }
  get title(): string {
    return this.tool.title[this.lang.slug] || this.tool.name[this.lang.slug];
  }
  get description(): string {
    return this.tool.description[this.lang.slug];
  }
  get yt_content(): string {
    return this.tool.yt_content;
  }
  get date(): string {
    return this.tool.date;
  }
  get readtime(): number {
    return this.tool.readtime;
  }
  get authenticated(): boolean {
    return this.authService.authData !== null;
  }

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (p) => {
      p['slug'] !== this.tool?.slug && (await this.initTool(p['slug']));
      this.initSEO();
    });
  }

  private async initTool(slug: string): Promise<void> {
    try {
      this.tool = null;
      await this.appService.pause(300);
      this.tool = await this.toolRepository.loadOne(slug);

      this.updateCanonicalLink(
        this.tool.canonical[this.appService.lang.value.slug]
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
