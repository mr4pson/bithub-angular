import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CAppService } from '../app.service';
import { CAuthService } from '../auth.service';
import { CGuideRepository } from '../repositories/guide.repository';

@Injectable()
export class GuideGuard {
  constructor(
    private authService: CAuthService,
    private appService: CAppService,
    private router: Router,
    private guideRepository: CGuideRepository
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const isActivated = !!this.authService.authData;

    if (!isActivated) {
      this.appService.popupLoginActive = true;
      this.router.navigateByUrl(`/`);
    }

    return isActivated;

    // return from(this.guideRepository.loadOne(id)).pipe(
    //   tap((guide) =>
    //     console.log(guide.type !== GuideTypes.Gem, !!this.authService.authData)
    //   ),
    //   map(
    //     (guide) => guide.type !== GuideTypes.Gem || !!this.authService.authData
    //   ),
    //   tap((isActivated) => {
    //     console.log(isActivated);
    //     if (!isActivated) {
    //       this.appService.popupLoginActive = true;
    //       this.router.navigateByUrl(`/`);
    //     }
    //   })
    // );
  }
}
