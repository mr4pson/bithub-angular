import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CGuide,
  TGuideEarnings,
  TGuideStatus,
} from 'src/app/model/entities/guide';
import { ISorting } from 'src/app/model/sorting';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CCatRepository } from 'src/app/services/repositories/cat.repository';
import { CGuideRepository } from 'src/app/services/repositories/guide.repository';
import { CPageRepository } from 'src/app/services/repositories/page.repository';
import { CSimplePage } from '../../simple.page';
import { CListGuidesService } from '../services/list-guides.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class CHomePage extends CSimplePage implements OnInit, OnDestroy {
  public guides: CGuide[] = null;
  public loading: boolean = false;
  public pagesQuantity: number = 0;
  private chunkLength: number = 12;
  public slug: string = null;
  public sortings: ISorting[] = [
    { name: 'order-createdat-desc', sortBy: 'created_at', sortDir: -1 },
    { name: 'order-createdat-asc', sortBy: 'created_at', sortDir: 1 },
    { name: 'order-price-asc', sortBy: 'price', sortDir: 1 },
    { name: 'order-price-desc', sortBy: 'price', sortDir: -1 },
    { name: 'order-bs-desc', sortBy: 'bh_score', sortDir: -1 },
    { name: 'order-bs-asc', sortBy: 'bh_score', sortDir: 1 },
    { name: 'order-invest-desc', sortBy: 'invest', sortDir: -1 },
    { name: 'order-invest-asc', sortBy: 'invest', sortDir: 1 },
  ];
  private subscription: Subscription;

  constructor(
    protected override appService: CAppService,
    protected authService: CAuthService,
    protected listService: CListGuidesService,
    protected guideRepository: CGuideRepository,
    protected override pageRepository: CPageRepository,
    protected override route: ActivatedRoute,
    protected override router: Router,
    private catRepository: CCatRepository
  ) {
    super(appService, pageRepository, route, router);
  }

  get cat_id(): number {
    return this.listService.cat_id;
  }
  set cat_id(v: number) {
    this.listService.cat_id = v;
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
  get favorites(): boolean {
    return this.listService.favorites;
  }
  set favorites(v: boolean) {
    this.listService.favorites = v;
  }
  get status(): TGuideStatus {
    return this.listService.status;
  }
  set status(v: TGuideStatus) {
    this.listService.status = v;
  }
  get earnings(): TGuideEarnings {
    return this.listService.earnings;
  }
  set earnings(v: TGuideEarnings) {
    this.listService.earnings = v;
  }
  get authenticated(): boolean {
    return this.authService.authData !== null;
  }

  public async ngOnInit(): Promise<void> {
    this.subscription = this.route.params
      .pipe(
        tap(async (p) => {
          this.slug = p['slug'];
          this.initGuides();
          await this.initPage('home');
          this.initSEO();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getFilter() {
    const cat = this.catRepository.cats.find((cat) => cat.slug === this.slug);
    this.cat_id = cat?.id;

    return {
      search: this.search,
      cat_id: cat?.id,
      favorites: this.favorites,
      status: this.status,
      earnings: this.earnings,
    };
  }

  public async initGuides(): Promise<void> {
    try {
      this.loading = true;
      await this.catRepository.loadAll();
      await this.appService.pause(300);

      const chunk = await this.guideRepository.loadChunk(
        this.part,
        this.chunkLength,
        this.sorting.sortBy,
        this.sorting.sortDir,
        this.getFilter()
      );

      if (this.part > 0 && !chunk.data.length) {
        // after deleting or updating may be current part is out of possible diapason
        this.part--;
        this.initGuides();
        return;
      }

      this.guides = chunk.data;
      this.pagesQuantity = chunk.pagesQuantity;
      this.loading = false;
    } catch (err) {
      this.appService.notifyError(err);
      this.loading = false;
    }
  }

  public onPartChange(): void {
    this.appService.win.scrollTop &&
      this.appService.win.scrollTo({ top: 0, behavior: 'smooth' });
    this.initGuides();
  }

  public onCatChange(): void {
    this.part = 0;
    this.initGuides();
  }

  public onSortingChange(): void {
    this.part = 0;
    this.initGuides();
  }

  public onSearchChange(): void {
    this.part = 0;
    this.initGuides();
  }

  public onFilterChange(): void {
    this.part = 0;
    this.initGuides();
  }
}
