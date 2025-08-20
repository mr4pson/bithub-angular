import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CAuthService } from '../auth.service';
import { CAppService } from '../app.service';

@Injectable()
export class CAuthGuard {
  private blockedUrl: string = null;
  private guarded: string[] = ['stats', 'tasker', 'account', 'guide'];

  constructor(
    private authService: CAuthService,
    private appService: CAppService,
    private router: Router
  ) {
    this.init();
  }

  private init(): void {
    this.blockedUrl = localStorage.getItem('blockedUrl') || null;
  }

  public getBlockedUrl(): string {
    const blockedUrl = this.blockedUrl;
    this.blockedUrl && this.resetBlockedUrl(); // reset after usage
    return blockedUrl;
  }

  public resetBlockedUrl(): void {
    localStorage.removeItem('blockedUrl');
    this.blockedUrl = null;
  }

  public setBlockedUrl(url: string): void {
    this.blockedUrl = url;
    localStorage.setItem('blockedUrl', this.blockedUrl);
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.authData) {
      return true;
    }

    const urlParts = window.location.pathname.split('/');
    this.guarded.includes(urlParts[2]) && this.router.navigateByUrl(`/`); // ввод защищенного урла в адресную строку (т.е. я не пытаюсь туда идти через приложение, а уже влез напрямую)
    this.appService.popupLoginActive = true;
    // запомним куда шли, после логина перебросим
    this.blockedUrl = state.url;
    localStorage.setItem('blockedUrl', this.blockedUrl);
    return false;
  }
}
