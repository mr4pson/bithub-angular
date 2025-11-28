import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CPopupComponent } from '../popup.component';
import { CAppService } from 'src/app/services/app.service';
import { CTariffRepository } from 'src/app/services/repositories/tariff.repository';
import { IPromocode } from 'src/app/model/entities/promocode';
import { CAuthService } from 'src/app/services/auth.service';
import { CUser } from 'src/app/model/entities/user';
import { IOutorderCreate } from 'src/app/model/dto/outorder.create';
import { COutorderRepository } from 'src/app/services/repositories/outorder.repository';
import { IOnetimeTariff } from 'src/app/model/entities/onetime.tariff';

@Component({
  selector: 'popup-limit',
  templateUrl: 'popup-limit.component.html',
  styleUrls: ['../../../styles/popups.scss', 'popup-limit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupLimitComponent
  extends CPopupComponent
  implements OnInit, OnChanges
{
  public tariff: IOnetimeTariff = null;
  public q: number = 1;
  public promocode: IPromocode = null;
  public loading: boolean = false;
  public error: string = null;
  public done: boolean = false;

  constructor(
    protected override appService: CAppService,
    protected authService: CAuthService,
    protected tariffRepository: CTariffRepository,
    protected outourderRepository: COutorderRepository
  ) {
    super(appService);
  }

  get user(): CUser {
    return this.authService.user;
  }
  get total(): string {
    const amount = this.tariff.price * this.q;
    return (
      amount - (this.promocode ? (amount / 100) * this.promocode.discount : 0)
    ).toFixed(2);
  }

  public override ngOnInit(): void {
    this.initTariff();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes['active'].currentValue) {
      this.error = null;
    }
  }

  private async initTariff(): Promise<void> {
    try {
      this.tariff = await this.tariffRepository.loadOnetimeOne('subacc');
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
        tariff_id: this.tariff.id,
        code: this.promocode?.code,
        lang_slug: this.lang.slug,
        q: this.q,
      };
      await this.appService.pause(300);
      const { statusCode } = await this.outourderRepository.create(dto);
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
}
