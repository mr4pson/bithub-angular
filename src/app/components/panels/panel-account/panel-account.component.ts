import { Component, OnInit } from '@angular/core';
import { CPanelComponent } from '../panel.component';
import { CAuthService } from 'src/app/services/auth.service';
import { CAppService } from 'src/app/services/app.service';

@Component({
  selector: 'panel-account',
  templateUrl: 'panel-account.component.html',
  styleUrls: ['panel-account.component.scss'],
})
export class CPanelAccountComponent extends CPanelComponent implements OnInit {
  get url(): string[] {
    return this.appService.url;
  }

  constructor(
    private authService: CAuthService,
    override appService: CAppService
  ) {
    super(appService);
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.appService.popupVerifActive =
      this.authService.user && !this.authService.user.verified;
  }
}
