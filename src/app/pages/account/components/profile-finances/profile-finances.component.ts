import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SUBSCRIPTION_LIST } from 'src/app/components/popups/popup-subscription/constants';
import { ILang } from 'src/app/model/entities/lang';
import { CUser } from 'src/app/model/entities/user';
import { IWords } from 'src/app/model/entities/words';
import { IKeyValue } from 'src/app/model/keyvalue';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CUserRepository } from 'src/app/services/repositories/user.repository';

@Component({
  selector: 'profile-finances',
  templateUrl: 'profile-finances.component.html',
  styleUrls: [
    'profile-finances.component.scss',
    '../../../../styles/forms.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CProfileFinancesComponent {
  @Input() public user: CUser;

  public code: string = '';
  public errors: IKeyValue<string | boolean> = {};
  public codeSent: boolean = false;
  public codeSending: boolean = false;
  public verifySent: boolean = false;
  public verifySending: boolean = false;

  verified$$ = new BehaviorSubject({ isVerified: false });
  verified$ = this.verified$$.asObservable();

  get verified() {
    return this.verified$$.getValue();
  }

  set verified(value: { isVerified: boolean }) {
    this.verified$$.next(value);
  }

  get subscriptionName() {
    const subscription = SUBSCRIPTION_LIST.find(
      (sub) =>
        sub.type === this.user.subType || (!this.user.subType && !sub.type)
    );

    return subscription?.name;
  }

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private userService: CUserRepository
  ) {}

  get lang(): ILang {
    return this.appService.lang.value;
  }
  get words(): IWords {
    return this.appService.words;
  }
  get freetasksLimit(): string {
    return this.appService.settings['site-freetasks'];
  }

  public onPaySubscription(): void {
    this.appService.popupSubscriptionActive = true;
  }

  public onPayLimit(): void {
    if (this.user.subType !== 'dg-team') {
      this.appService.popupSubscriptionActive = true;
      this.appService.popupIsGemType = true;

      return;
    }

    this.appService.popupLimitActive = true;
  }
}
