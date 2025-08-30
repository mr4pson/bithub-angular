import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILang } from 'src/app/model/entities/lang';
import { CUser, IUserVerify } from 'src/app/model/entities/user';
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
export class CProfileFinancesComponent implements OnInit {
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
    this.appService.popupLimitActive = true;
  }

  public async onSendCode(): Promise<void> {
    try {
      this.codeSending = true;

      const dto: IUserVerify = {
        email: this.user.email,
        lang_id: this.lang.id,
      };

      await this.authService.verify(dto);
      this.codeSending = false;
      this.codeSent = true;
      await this.appService.pause(3000);
      this.codeSent = false;
    } catch (err) {
      this.appService.notifyError(err);
      this.codeSending = false;
    }
  }

  public async verifyAccount() {
    try {
      this.verifySending = true;

      const resp = await this.userService.verify(
        this.code as unknown as number
      );

      this.verifySending = false;
      this.verifySent = true;

      if (resp.statusCode === 200) {
        this.verified = { isVerified: true };
      }
      if (resp.statusCode === 401) {
        this.errors['code'] = 'code-invalid';
        return;
      }
    } catch (err) {
      this.appService.notifyError(err);
      this.verifySending = false;
    }
  }

  ngOnInit(): void {
    this.verified = { isVerified: this.user.verified };
  }
}
