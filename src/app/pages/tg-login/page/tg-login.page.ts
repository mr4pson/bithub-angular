import { Component, OnDestroy, OnInit } from '@angular/core';
import { CSimplePage } from '../../simple.page';
import { ActivatedRoute } from '@angular/router';
import { CTgLoginService } from '../services/tg-login.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { CAuthService } from 'src/app/services/auth.service';
import { CAppService } from 'src/app/services/app.service';

@Component({
  selector: 'tg-login-page',
  templateUrl: 'tg-login.page.html',
  styleUrls: ['tg-login.page.scss'],
})
export class CTgLoginPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private tgLoginService: CTgLoginService,
    private appService: CAppService,
    private authService: CAuthService
  ) {}

  public ngOnInit(): void {
    try {
      const tgId = Number(this.route.snapshot.params['tgId']);
      const params = this.route.snapshot.queryParams as unknown as {
        expires: number;
        userData: any;
        signature: string;
      };
      this.tgLoginService
        .login(tgId, params)
        .pipe(
          tap((data: any) => {
            this.authService.init(data.data);
            this.authService.save();
            console.log(data);
          }),
          catchError((err) => {
            this.appService.notifyError(err);

            return EMPTY;
          })
        )
        .subscribe();
    } catch (err) {
      console.error('tg-login: error parsing URL', err);
    }
  }
}
