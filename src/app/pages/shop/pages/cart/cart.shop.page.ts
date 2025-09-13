import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICartItem } from 'src/app/model/cart-item.interface';
import { IShoporderCreate } from 'src/app/model/dto/shoporder.create';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CCartService } from 'src/app/services/cart.service';
import { CShoporderRepository } from 'src/app/services/repositories/shoporder.repository';

@Component({
  selector: 'cart-shop-page',
  templateUrl: 'cart.shop.page.html',
  styleUrls: ['cart.shop.page.scss'],
})
export class CCartShopPage implements OnInit {
  public items: ICartItem[] = [];
  public total: number = 0;
  public sending = false;
  public shoporderPopupActive: boolean = false;

  get lang() {
    return this.appService.lang.value;
  }

  get words() {
    return this.appService.words;
  }

  get user() {
    return this.authService.user;
  }

  getShopItemPrice(cartItem: ICartItem) {
    const { discount, price } = cartItem.product;
    return discount ? price - (price * discount) / 100 : price;
  }

  constructor(
    public cartService: CCartService,
    private appService: CAppService,
    private authService: CAuthService,
    protected shoporderRepository: CShoporderRepository,
    protected router: Router
  ) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.calcTotal();
  }

  handleQuantityChange(value: number, item: ICartItem) {
    item.quantity = value;
    this.calcTotal();
  }

  calcTotal() {
    this.total = this.items.reduce(
      (sum, item, i) => sum + this.getShopItemPrice(item) * item.quantity,
      0
    );
  }

  removeItem(i: number) {
    this.cartService.remove(i);
    this.calcTotal();
  }

  async order() {
    if (!this.user.tg_username || !this.user.wallet) {
      this.shoporderPopupActive = true;

      return;
    }

    this.sending = true;

    const payload: IShoporderCreate = {
      items: this.items.map((cartItem) => ({
        shopitem_id: cartItem.product.id,
        qty: cartItem.quantity,
      })),
      tg: this.user.tg_username,
      wallet: this.user.wallet,
      comment: '',
      lang_slug: this.lang.slug,
    };

    const url = await this.shoporderRepository.create(payload);

    this.sending = false;
    this.cartService.clear();

    if (url) {
      window.open(url);
      this.router.navigate(['/']);
    } else {
      this.router.navigate([this.lang.slug, 'payment-success']);
    }
  }
}
