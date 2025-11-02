import {
  Component,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CAuthGuard } from 'src/app/services/guards/auth.guard';
import { CPopupComponent } from '../popup.component';

@Component({
  selector: 'popup-login',
  templateUrl: 'popup-login.component.html',
  styleUrls: ['../../../styles/popups.scss', '../../../styles/forms.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPopupLoginComponent extends CPopupComponent implements OnChanges {
  public timer = 5;
  public interval: any;
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

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && changes['active'].currentValue) {
      this.timer = 5;

      this.interval = setInterval(() => {
        if (this.timer === 1) {
          window.open('https://t.me/bithab_bot?start=auth_1', '_blank');
          this.stopInterval();
        }

        this.timer -= 1;
      }, 1000);
    }
  }

  public stopInterval() {
    clearInterval(this.interval);
    this.onClose();
  }
}
