import { Component, OnInit } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CPageRepository } from 'src/app/services/repositories/page.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { CShopitemRepository } from 'src/app/services/repositories/shopitem.repository';
import { CAuthService } from 'src/app/services/auth.service';
import { ISorting } from 'src/app/model/sorting';
import { CSimplePage } from 'src/app/pages/simple.page';
import { IShopitem } from 'src/app/model/entities/shopitem';
import { CListShopitemsService } from '../../services/list-shopitems.service';

@Component({
  selector: 'index-shop-page',
  templateUrl: 'index.shop.page.html',
  styleUrls: ['index.shop.page.scss'],
})
export class CIndexShopPage extends CSimplePage implements OnInit {
  public shopitems: IShopitem[] = null;
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
    protected listService: CListShopitemsService,
    protected shopitemRepository: CShopitemRepository,
    protected override pageRepository: CPageRepository,
    protected override route: ActivatedRoute,
    protected override router: Router
  ) {
    super(appService, pageRepository, route, router);
  }

  get shopcat_id(): number {
    return this.listService.shopcat_id;
  }
  set shopcat_id(v: number) {
    this.listService.shopcat_id = v;
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
    return { search: this.search, shopcat_id: this.shopcat_id };
  }

  public async ngOnInit(): Promise<void> {
    this.initShopitems();
    await this.initPage('shop');
    this.route.params.subscribe((p) => this.initSEO());
  }

  public async initShopitems(): Promise<void> {
    try {
      this.loading = true;
      await this.appService.pause(300);
      const chunk = await this.shopitemRepository.loadChunk(
        this.part,
        this.chunkLength,
        this.sorting.sortBy,
        this.sorting.sortDir,
        this.filter
      );

      if (this.part > 0 && !chunk.data.length) {
        // after deleting or updating may be current part is out of possible diapason
        this.part--;
        this.initShopitems();
        return;
      }

      this.shopitems = chunk.data;
      this.pagesQuantity = chunk.pagesQuantity;
      this.loading = false;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  public onPartChange(): void {
    this.appService.win.scrollTop &&
      this.appService.win.scrollTo({ top: 0, behavior: 'smooth' });
    this.initShopitems();
  }

  public onCatChange(): void {
    this.part = 0;
    this.initShopitems();
  }

  public onSortingChange(): void {
    this.part = 0;
    this.initShopitems();
  }

  public onSearchChange(): void {
    this.part = 0;
    this.initShopitems();
  }
}
