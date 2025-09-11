import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ICartItem } from 'src/app/model/cart-item.interface';
import { CAppService } from 'src/app/services/app.service';
import { CCartService } from 'src/app/services/cart.service';
import { CPanelComponent } from '../panel.component';

@Component({
  selector: 'panel-cart',
  templateUrl: 'panel-cart.component.html',
  styleUrls: ['../panel.component.scss', 'panel-cart.component.scss'],
})
export class PanelCartComponent extends CPanelComponent {
  @Input() override active: boolean = false;

  constructor(
    protected override appService: CAppService,
    public cartService: CCartService,
    private router: Router
  ) {
    super(appService);
  }

  get items(): ICartItem[] {
    return this.cartService.getItems();
  }

  getShopItemPrice(cartItem: ICartItem) {
    const { discount, price } = cartItem.product;
    return discount ? price - (price * discount) / 100 : price;
  }

  goToCart() {
    this.router.navigate([`/${this.appService.lang.value.slug}/shop/cart`]);
    this.onClose();
  }

  override onClose(): void {
    this.active = false;
    this.activeChange.emit(false);
  }
}
