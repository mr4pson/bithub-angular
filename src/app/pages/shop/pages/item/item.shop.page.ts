import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IShopitem } from 'src/app/model/entities/shopitem';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CShopitemRepository } from 'src/app/services/repositories/shopitem.repository';
import { CCartService } from 'src/app/services/cart.service';
import { ICartItem } from 'src/app/model/cart-item.interface';
import { CAuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'item-shop-page',
  templateUrl: 'item.shop.page.html',
  styleUrls: ['item.shop.page.scss'],
})
export class CItemShopPage {
  public shopitem: IShopitem = null;
  public shoporderPopupActive: boolean = false;
  public quantity: number = 1;
  public selectedShopItems: ICartItem[] = [];

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private shopitemRepository: CShopitemRepository,
    private cartService: CCartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get isInCart(): boolean {
    return this.cartService
      .getItems()
      .some((item) => item.product.id === this.shopitem?.id);
  }

  get isLoggedIn(): boolean {
    return !!this.authService.authData;
  }

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get content(): string {
    return this.shopitem.content[this.lang.slug];
  }
  get img(): string {
    return this.shopitem.img;
  }
  get title(): string {
    return this.shopitem.name[this.lang.slug];
  }
  get h1(): string {
    return this.shopitem.name[this.lang.slug];
  }
  get date(): string {
    return this.shopitem.date;
  }
  get calculatedPrice(): number {
    const { discount, price } = this.shopitem;
    return discount ? price - (price * discount) / 100 : price;
  }
  get user() {
    return this.authService.user;
  }

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (p) => {
      await this.initShopitem(parseInt(p['id']));
      this.initSEO();
    });
  }

  private async initShopitem(id: number): Promise<void> {
    try {
      if (id === this.shopitem?.id) return;

      this.shopitem = null;

      await this.appService.pause(300);

      this.shopitem = await this.shopitemRepository.loadOne(id);
      this.quantity =
        this.shopitem.min_items_num > 0 ? this.shopitem.min_items_num : 1;
      this.selectedShopItems = [
        { product: this.shopitem, quantity: this.quantity },
      ];
    } catch (err) {
      err === 404
        ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`)
        : this.appService.notifyError(err);
    }
  }

  public async addToCart(): Promise<void> {
    if (!this.shopitem) return;
    this.cartService.add(this.shopitem, this.quantity);
    // this.appService.notifyError('Товар добавлен в корзину!'); // Можно заменить на notifySuccess, если есть
  }

  private initSEO(): void {
    this.appService.setTitle(this.title);
    this.appService.setMeta('name', 'description', '');
  }

  public redirectoTgSupport(): void {
    window.open('https://t.me/usdeurcny', '_blank');
  }
}
