import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CUser } from 'src/app/model/entities/user';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CInorderRepository } from 'src/app/services/repositories/inorder.repository';
import { CPopupComponent } from '../popup.component';

@Component({
  selector: 'popup-inorder',
  templateUrl: 'popup-inorder.component.html',
  styleUrls: ['../../../styles/popups.scss', 'popup-inorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupInorderComponent
  extends CPopupComponent
  implements OnInit, OnChanges
{
  public amount: number = 20;
  public loading: boolean = false;

  constructor(
    protected override appService: CAppService,
    protected inorderRepository: CInorderRepository,
    protected authService: CAuthService
  ) {
    super(appService);
  }

  get user(): CUser {
    return this.authService.user;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    !this.active && this.reset();
  }

  private reset(): void {
    this.amount = 20;
  }

  public async onSubmit(): Promise<void> {
    try {
      this.loading = true;
      const url = await this.inorderRepository.create({
        amount: this.amount,
        lang_slug: this.lang.slug,
      });
      this.loading = false;
      window.open(url, '_blank');
      this.onClose();
    } catch (err) {
      this.appService.notifyError(err);
      this.loading = false;
    }
  }

  public override onClose(): void {
    super.onClose();
  }
}
