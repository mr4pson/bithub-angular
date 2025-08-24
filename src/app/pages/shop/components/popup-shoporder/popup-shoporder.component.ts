import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IKeyValue } from 'src/app/model/keyvalue';
import { CAppService } from 'src/app/services/app.service';
import { IShoporderCreate } from 'src/app/model/dto/shoporder.create';
import { CShoporderRepository } from 'src/app/services/repositories/shoporder.repository';
import { CPopupComponent } from 'src/app/components/popups/popup.component';
import { ICartItem } from 'src/app/model/cart-item.interface';
import { CCartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'popup-shoporder',
  templateUrl: 'popup-shoporder.component.html',
  styleUrls: [
    '../../../../styles/popups.scss',
    '../../../../styles/forms.scss',
  ],
})
export class CPopupShoporderComponent
  extends CPopupComponent
  implements OnChanges
{
  @Input() public cartItems: ICartItem[];

  public tg: string = '';
  public comment: string = '';
  public errors: IKeyValue<string> = {};
  public sending: boolean = false;
  public sent: boolean = false;

  constructor(
    protected override appService: CAppService,
    protected shoporderRepository: CShoporderRepository,
    protected cartService: CCartService,
    protected router: Router
  ) {
    super(appService);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    changes['active'] && !this.active && this.reset();
  }

  private reset(): void {
    this.comment = '';
    this.sending = this.sent = false;
    this.errors = {};
  }

  public async onSubmit(): Promise<void> {
    try {
      if (!this.validate()) return;

      this.sending = true;

      await this.appService.pause(300);

      const payload: IShoporderCreate = {
        items: this.cartItems.map((cartItem) => ({
          shopitem_id: cartItem.product.id,
          qty: cartItem.quantity,
        })),
        tg: this.tg,
        comment: this.comment,
        lang_slug: this.lang.slug,
      };

      const url = await this.shoporderRepository.create(payload);

      this.sending = false;
      this.cartService.clear();

      window.open(url);

      this.onClose();
      this.router.navigate(['/']);
    } catch (err) {
      this.appService.notifyError(err);
      this.sending = false;
    }
  }

  private validate(): boolean {
    let error = false;
    // maybe later
    return !error;
  }
}
