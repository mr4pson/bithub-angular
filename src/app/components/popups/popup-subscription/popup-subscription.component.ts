import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CPopupComponent } from '../popup.component';
import { CAppService } from 'src/app/services/app.service';
import { ISubscriptionTariff } from 'src/app/model/entities/subscription.tariff';
import { CTariffRepository } from 'src/app/services/repositories/tariff.repository';
import { IPromocode } from 'src/app/model/entities/promocode';
import { CAuthService } from 'src/app/services/auth.service';
import { CUser } from 'src/app/model/entities/user';
import { IOutorderCreate } from 'src/app/model/dto/outorder.create';
import { COutorderRepository } from 'src/app/services/repositories/outorder.repository';
import { SUBSCRIPTION_LIST, TSubscription } from './constants';
import { Router } from '@angular/router';

@Component({
  selector: 'popup-subscription',
  templateUrl: 'popup-subscription.component.html',
  styleUrls: [
    '../../../styles/popups.scss',
    'popup-subscription.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupSubscriptionComponent
  extends CPopupComponent
  implements OnInit, OnChanges
{
  public tariffs: ISubscriptionTariff[] = null;
  public subscriptions = SUBSCRIPTION_LIST;
  public selectedTariff: ISubscriptionTariff = null;
  public selectedSubscription: TSubscription = this.subscriptions[0];
  public promocode: IPromocode = null;
  public loading: boolean = false;
  public error: string = null;
  public done: boolean = false;

  constructor(
    public override appService: CAppService,
    protected authService: CAuthService,
    protected tariffRepository: CTariffRepository,
    protected outourderRepository: COutorderRepository,
    private router: Router
  ) {
    super(appService);
  }

  get user(): CUser {
    return this.authService.user;
  }
  get subscriptionTotalPrice() {
    const price = this.selectedSubscription.price?.find(
      (priceItem) => priceItem.period === this.selectedTariff.period
    );

    return price ? price.value : 0;
  }
  get total(): string {
    const priceItem = this.selectedSubscription?.price?.find(
      (priceItem) => priceItem.period === this.selectedTariff.period
    );
    const price = priceItem ? priceItem.value : 0;

    return (
      price - (this.promocode ? (price / 100) * this.promocode.discount : 0)
    ).toFixed(2);
  }
  get tariffUntil(): string {
    if (!this.selectedTariff) return '';
    const date = new Date();
    date.setDate(date.getDate() + this.selectedTariff.period);
    return this.appService.formattedDate(date);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.initTariffs();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes['active'].currentValue) {
      this.error = null;
    }
  }

  private async initTariffs(): Promise<void> {
    try {
      this.tariffs = await this.tariffRepository.loadSubscriptionAll();
      this.selectedTariff = this.tariffs[0] || null;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  public onRecharge(event: PointerEvent): void {
    event.stopPropagation();
    this.onClose();
    window.dispatchEvent(new CustomEvent('show-panel', { detail: 'Inorder' }));
  }

  public async onPay(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      const dto: IOutorderCreate = {
        subscriptionType: this.selectedSubscription.type,
        code: this.promocode?.code,
        q: 1,
      };
      await this.appService.pause(300);
      const statusCode = await this.outourderRepository.create(dto);
      this.loading = false;

      if (statusCode === 201) {
        this.done = true;
        await this.appService.pause(1000);
        this.done = false;
        this.onClose();
        this.authService.load(); // здесь мы специально не отправляем релоад через сокет с сервера, чтобы загрузка юзера не произошла до закрытия окна, потому что может измениться состояние кошелька, и если нет денег на покупку, то перестроится окно и т.д.
        window.dispatchEvent(new Event('user:reload')); // сообщаем внешним компонентам (чтобы не тащить многоуровневые связи, например, в CIndexAccountPage)
        return;
      }

      if (statusCode === 409) {
        this.error = 'promocode';
        return;
      }

      if (statusCode === 410) {
        this.error = 'insufficient';
        return;
      }

      this.appService.notifyError(
        this.words['errors']?.['unexpected']?.[this.lang.slug]
      );
    } catch (err) {
      this.appService.notifyError(err);
      this.loading = false;
    }
  }

  public override onClose(): void {
    if (this.appService.popupIsGemType) {
      this.router.navigate(['/']);
    }

    this.appService.popupIsGemType = false;
    this.activeChange.emit(false);
  }
}
