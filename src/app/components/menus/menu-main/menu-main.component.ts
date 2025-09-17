import { Component } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { ILang } from 'src/app/model/entities/lang';
import { IPage } from 'src/app/model/entities/page';
import { CMenuMainService } from './menu-main.service';

@Component({
  selector: 'menu-main',
  templateUrl: 'menu-main.component.html',
  styleUrls: ['menu-main.component.scss'],
})
export class CMenuMainComponent {
  constructor(
    private appService: CAppService,
    private menumainService: CMenuMainService
  ) {}

  get pages(): IPage[] {
    return this.menumainService.pages;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get url(): string[] {
    return this.appService.url;
  }

  public getPageLink(page: IPage): string {
    return page.slug === 'home'
      ? `/${this.lang.slug}`
      : `/${this.lang.slug}/${page.slug}`;
  }

  public isPageActive(page: IPage): boolean {
    return page.slug === 'home'
      ? !this.url[2] || this.url[2] === 'guides'
      : this.url[2] === page.slug;
  }
}
