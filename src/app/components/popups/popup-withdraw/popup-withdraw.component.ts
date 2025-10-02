import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CUser } from 'src/app/model/entities/user';
import { IKeyValue } from 'src/app/model/keyvalue';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CWithdraworderRepository } from 'src/app/services/repositories/withdraworder.repository';
import { CPopupComponent } from '../popup.component';
import { IWithdraworderCreate } from 'src/app/model/dto/withxdraworder.create';

@Component({
  selector: 'popup-withdraw',
  templateUrl: 'popup-withdraw.component.html',
  styleUrls: ['../../../styles/popups.scss', 'popup-withdraw.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupWithdrawComponent
  extends CPopupComponent
  implements OnInit, OnChanges
{
  public tg = this.authService.user?.tg_username;
  public wallet = this.authService.user?.wallet;
  public amount: number = 100;
  public comment = '';
  public errors: IKeyValue<string> = {};
  public loading: boolean = false;
  public sending = false;
  public sent = false;

  constructor(
    protected override appService: CAppService,
    protected withdraworderRepository: CWithdraworderRepository,
    protected authService: CAuthService
  ) {
    super(appService);
  }

  get user(): CUser {
    return this.authService.user;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    changes['active'] && !this.active && this.reset();
  }

  private reset(): void {
    this.comment = '';
    this.amount = 100;
    this.sending = this.sent = false;
    this.errors = {};
  }

  public async onSubmit(): Promise<void> {
    try {
      if (!this.validate()) return;

      this.sending = true;

      await this.appService.pause(300);

      const payload: IWithdraworderCreate = {
        tg: this.tg,
        amount: this.amount,
        wallet: this.wallet,
        comment: this.comment,
        lang_slug: this.lang.slug,
      };

      await this.withdraworderRepository.create(payload);

      this.sent = true;
      this.loading = false;
    } catch (err) {
      this.appService.notifyError(err);
      this.loading = false;
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

    if (!this.amount) {
      this.errors['amount'] = 'required';
      error = true;
    }

    return !error;
  }

  public override onClose(): void {
    this.reset();
    super.onClose();
  }
}
