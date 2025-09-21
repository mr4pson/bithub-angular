import { Component, OnInit } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CPageRepository } from 'src/app/services/repositories/page.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { CArticleRepository } from 'src/app/services/repositories/article.repository';
import { CAuthService } from 'src/app/services/auth.service';
import { ISorting } from 'src/app/model/sorting';
import { CSimplePage } from 'src/app/pages/simple.page';
import { IArticle } from 'src/app/model/entities/article';
import { CListArticlesService } from '../../services/list-articles.service';

@Component({
  selector: 'index-articles-page',
  templateUrl: 'index.articles.page.html',
  styleUrls: ['index.articles.page.scss'],
})
export class CIndexArticlesPage extends CSimplePage implements OnInit {
  public articles: IArticle[] = null;
  public loading: boolean = false;
  public pagesQuantity: number = 0;
  private chunkLength: number = 12;
  public sortings: ISorting[] = [
    { name: 'order-date-desc', sortBy: 'date', sortDir: -1 },
    { name: 'order-date-asc', sortBy: 'date', sortDir: 1 },
  ];

  constructor(
    protected override appService: CAppService,
    protected authService: CAuthService,
    protected listService: CListArticlesService,
    protected articleRepository: CArticleRepository,
    protected override pageRepository: CPageRepository,
    protected override route: ActivatedRoute,
    protected override router: Router
  ) {
    super(appService, pageRepository, route, router);
  }

  get artcat_id(): number {
    return this.listService.artcat_id;
  }
  set artcat_id(v: number) {
    this.listService.artcat_id = v;
  }
  get sorting(): ISorting {
    return this.listService.sorting;
  }
  set sorting(v: ISorting) {
    this.listService.sorting = v;
  }
  get search(): string {
    return this.listService.search;
  }
  set search(v: string) {
    this.listService.search = v;
  }
  get part(): number {
    return this.listService.part;
  }
  set part(v: number) {
    this.listService.part = v;
  }
  get filter(): any {
    return {
      search: this.search,
      artcat_id: this.artcat_id,
    };
  }
  get authenticated(): boolean {
    return this.authService.authData !== null;
  }

  public async ngOnInit(): Promise<void> {
    this.initArticles();
    await this.initPage('education');
    this.route.params.subscribe((p) => this.initSEO());
  }

  public async initArticles(): Promise<void> {
    try {
      this.loading = true;
      await this.appService.pause(300);
      const chunk = await this.articleRepository.loadChunk(
        this.part,
        this.chunkLength,
        this.sorting.sortBy,
        this.sorting.sortDir,
        this.filter
      );

      if (this.part > 0 && !chunk.data.length) {
        // after deleting or updating may be current part is out of possible diapason
        this.part--;
        this.initArticles();
        return;
      }

      this.articles = chunk.data;
      this.pagesQuantity = chunk.pagesQuantity;
      this.loading = false;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  public onPartChange(): void {
    this.appService.win.scrollTop &&
      this.appService.win.scrollTo({ top: 0, behavior: 'smooth' });
    this.initArticles();
  }

  public onCatChange(): void {
    this.part = 0;
    this.initArticles();
  }

  public onSortingChange(): void {
    this.part = 0;
    this.initArticles();
  }

  public onSearchChange(): void {
    this.part = 0;
    this.initArticles();
  }
}
