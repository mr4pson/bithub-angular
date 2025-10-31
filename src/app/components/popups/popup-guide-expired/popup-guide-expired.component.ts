import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CAuthGuard } from 'src/app/services/guards/auth.guard';
import { CPopupComponent } from '../popup.component';

@Component({
  selector: 'popup-guide-expired',
  templateUrl: 'popup-guide-expired.component.html',
  styleUrls: ['../../../styles/popups.scss', '../../../styles/forms.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupGuideExpiredComponent extends CPopupComponent {
  constructor(
    protected override appService: CAppService,
    protected authGuard: CAuthGuard
  ) {
    super(appService);
  }

  public override onClose(): void {
    super.onClose();
    this.authGuard.resetBlockedUrl();
  }
}
