import { Component, Input } from '@angular/core';
import { CAppService } from '../../services/app.service';
import { ILang } from 'src/app/model/entities/lang';
import { TSubscription } from '../popups/popup-subscription/constants';
import { ISubscriptionTariff } from 'src/app/model/entities/subscription.tariff';

@Component({
  selector: 'app-subscription',
  templateUrl: 'subscription.component.html',
  styleUrls: ['subscription.component.scss'],
})
export class CSubscriptionComponent {
  @Input() public subscription: TSubscription;
  @Input() public tariff: ISubscriptionTariff;
  @Input() public active: boolean;
  @Input() public disabled: boolean = false;

  get subscriptionMonthPrice() {
    const price = this.subscription.price?.find(
      (priceItem) => priceItem.period === this.tariff.period
    );

    return price ? price.monthPrice : 0;
  }

  get subscriptionTotalPrice() {
    const price = this.subscription.price?.find(
      (priceItem) => priceItem.period === this.tariff.period
    );

    return price ? price.value : 0;
  }

  constructor(private appService: CAppService) {}

  get lang(): ILang {
    return this.appService.lang.value;
  }
}
