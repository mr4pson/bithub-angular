import { Component, OnInit } from '@angular/core';
import { CCartService } from 'src/app/services/cart.service';
import { ICartItem } from 'src/app/model/cart-item.interface';
import { ILang } from 'src/app/model/entities/lang';
import { CAppService } from 'src/app/services/app.service';
import { IWords } from 'src/app/model/entities/words';

@Component({
  selector: 'cart-shop-page',
  templateUrl: 'cart.shop.page.html',
  styleUrls: ['cart.shop.page.scss'],
})
export class CCartShopPage implements OnInit {
  public items: ICartItem[] = [];
  public total: number = 0;
  public shoporderPopupActive: boolean = false;

  get lang(): ILang {
    return this.appService.lang.value;
  }

  get words(): IWords {
    return this.appService.words;
  }

  constructor(
    public cartService: CCartService,
    private appService: CAppService
  ) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.calcTotal();
  }

  onAmountChange(item: ICartItem, i: number) {
    if (item.quantity < 1) item.quantity = 1;
    this.calcTotal();
  }

  calcTotal() {
    this.total = this.items.reduce(
      (sum, item, i) => sum + item.product.price * item.quantity,
      0
    );
  }

  removeItem(i: number) {
    this.cartService.remove(i);
    this.items.splice(i, 1);
    this.calcTotal();
  }

  order() {
    this.shoporderPopupActive = true;
  }
}
