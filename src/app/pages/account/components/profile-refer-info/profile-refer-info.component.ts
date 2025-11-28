import { Component, Input } from '@angular/core';
import { cfg } from 'src/app/app.config';
import { ILang } from 'src/app/model/entities/lang';
import { CUser } from 'src/app/model/entities/user';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CUserRepository } from 'src/app/services/repositories/user.repository';

@Component({
  selector: 'profile-refer-info',
  templateUrl: 'profile-refer-info.component.html',
  styleUrls: ['profile-refer-info.component.scss'],
})
export class CProfileReferInfoComponent {
  @Input() public user: CUser;
  public copied: boolean = false;
  public referralPurchaseCount = 0;
  public potentialReferralEarnings = 0;

  constructor(
    private appService: CAppService,
    protected userRepository: CUserRepository
  ) {
    this.initData();
  }

  get lang(): ILang {
    return this.appService.lang.value;
  }
  get words(): IWords {
    return this.appService.words;
  }

  private async initData(): Promise<void> {
    try {
      this.referralPurchaseCount =
        await this.userRepository.getReferralsPurchaseCount();
      this.potentialReferralEarnings =
        await this.userRepository.getPotentialReferralEarnings();
    } catch (err) {
      this.appService.notifyError(err);
    }
  }
}
