import { Component, Input } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { IShopitem } from 'src/app/model/entities/shopitem';
import { Router } from '@angular/router';

@Component({
  selector: 'the-shopitem',
  templateUrl: 'shopitem.component.html',
  styleUrls: ['shopitem.component.scss'],
})
export class CShopitemComponent {
  @Input() public shopitem: IShopitem;

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private router: Router
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get authenticated(): boolean {
    return this.authService.authData !== null;
  }

  public handleOpenShopitem(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.shopitem.available_for && !this.authService.authData) {
      this.appService.popupLoginActive = true;

      return;
    }

    if (
      (this.authService.user?.subType === 'dg-pro' &&
        this.shopitem.available_for === 'dg-team') ||
      (!this.authService.user?.subType &&
        ['dg-pro', 'dg-team'].includes(this.shopitem.available_for))
    ) {
      this.appService.popupSubscriptionActive = true;
      this.appService.popupIsGemType = true;

      return;
    }

    this.router.navigate([this.lang.slug, 'shop', this.shopitem.id]);
  }
}
