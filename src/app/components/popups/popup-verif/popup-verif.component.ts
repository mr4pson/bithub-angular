import {
  Component,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { IUserVerify } from 'src/app/model/entities/user';
import { IKeyValue } from 'src/app/model/keyvalue';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CUserRepository } from 'src/app/services/repositories/user.repository';
import { CPopupComponent } from '../popup.component';

@Component({
  selector: 'popup-verif',
  templateUrl: 'popup-verif.component.html',
  styleUrls: [
    '../../../styles/popups.scss',
    '../../../styles/forms.scss',
    './popup-verif.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupVerifComponent extends CPopupComponent implements OnChanges {
  public code: string = '';
  public errors: IKeyValue<string | boolean> = {};
  public codeSent: boolean = false;
  public codeSending: boolean = false;
  public verifySent: boolean = false;
  public verifySending: boolean = false;

  constructor(
    protected override appService: CAppService,
    protected authService: CAuthService,
    private userService: CUserRepository
  ) {
    super(appService);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    !this.active && this.reset();
  }

  private reset(): void {
    this.code = '';
    this.errors = {};
  }

  public onCodeChange(e: KeyboardEvent) {
    this.code = (e.target as any).value;
  }

  public async onSendCode(): Promise<void> {
    try {
      this.codeSending = true;

      const dto: IUserVerify = {
        email: this.authService.user.email,
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
        this.onClose();
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
}
