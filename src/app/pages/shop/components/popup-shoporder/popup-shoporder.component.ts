import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CPopupComponent } from 'src/app/components/popups/popup.component';
import { ICartItem } from 'src/app/model/cart-item.interface';
import { IShoporderCreate } from 'src/app/model/dto/shoporder.create';
import { CUser } from 'src/app/model/entities/user';
import { IKeyValue } from 'src/app/model/keyvalue';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CCartService } from 'src/app/services/cart.service';
import { CShoporderRepository } from 'src/app/services/repositories/shoporder.repository';

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
  @Input() public user: CUser;

  public tg = this.authService.user?.tg_username;
  public wallet = this.authService.user?.wallet;
  public comment = '';
  public errors: IKeyValue<string> = {};
  public sending = false;
  public sent = false;

  constructor(
    protected override appService: CAppService,
    protected shoporderRepository: CShoporderRepository,
    protected cartService: CCartService,
    protected router: Router,
    private authService: CAuthService
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
        wallet: this.wallet,
        comment: this.comment,
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

      this.onClose();
    } catch (err) {
      this.appService.notifyError(err);
      this.sending = false;
    }
  }

  private validate(): boolean {
    let error = false;
    this.errors['name'] = null;
    this.errors['email'] = null;

    if (!this.tg) {
      this.errors['tg'] = 'required';
      error = true;
    }

    if (!this.wallet) {
      this.errors['wallet'] = 'required';
      error = true;
    }
    // maybe later
    return !error;
  }
}
