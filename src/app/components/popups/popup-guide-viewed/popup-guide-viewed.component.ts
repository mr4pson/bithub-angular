import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CAuthGuard } from 'src/app/services/guards/auth.guard';
import { CPopupComponent } from '../popup.component';

@Component({
  selector: 'popup-guide-viewed',
  templateUrl: 'popup-guide-viewed.component.html',
  styleUrls: ['../../../styles/popups.scss', '../../../styles/forms.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupGuideViewedComponent extends CPopupComponent {
  @Input() guidesViewedCount: number = 0;

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
