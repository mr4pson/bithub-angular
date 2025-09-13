import { Component, OnInit } from '@angular/core';
import { ICartItem } from 'src/app/model/cart-item.interface';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CCartService } from 'src/app/services/cart.service';

@Component({
  selector: 'cart-shop-page',
  templateUrl: 'cart.shop.page.html',
  styleUrls: ['cart.shop.page.scss'],
})
export class CCartShopPage implements OnInit {
  public items: ICartItem[] = [];
  public total: number = 0;
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
    private authService: CAuthService
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
    this.shoporderPopupActive = true;
  }
}
