import { Component, OnDestroy, OnInit } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CPageRepository } from 'src/app/services/repositories/page.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { CUser, IUserUpdate } from 'src/app/model/entities/user';
import { CAuthService } from 'src/app/services/auth.service';
import { CSimplePage } from 'src/app/pages/simple.page';

@Component({
  selector: 'account-page',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class CAccountPage extends CSimplePage implements OnInit, OnDestroy {
  public user: CUser = null;
  public updating: boolean = false;
  public updated: boolean = false;
  public tgUpdating: boolean = false;
  public tgUpdated: boolean = false;

  constructor(
    protected override appService: CAppService,
    private authService: CAuthService,
    protected override pageRepository: CPageRepository,
    protected override route: ActivatedRoute,
    protected override router: Router
  ) {
    super(appService, pageRepository, route, router);
  }

  public async ngOnInit(): Promise<void> {
    this.initUser();
    window.addEventListener('user:reload', this.initUser.bind(this)); // реакция на покупки
    await this.initPage('account');
    this.route.params.subscribe((p) => this.initSEO());
  }

  public ngOnDestroy(): void {
    window.removeEventListener('user:reload', this.initUser);
  }

  private async initUser(): Promise<void> {
    try {
      await this.appService.pause(300);
      this.user = await this.authService.loadMe();
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  public async updateUser(): Promise<void> {
    try {
      this.updating = true;
      const dto: IUserUpdate = {
        name: this.user.name,
        wallet: this.user.wallet,
        lang_id: this.user.lang_id,
        img: this.user.img,
        tg_username: this.user.tg_username,
        tg_tasks: this.user.tg_tasks,
        tg_guides: this.user.tg_guides,
        tg_articles: this.user.tg_articles,
        tg_deadlines: this.user.tg_deadlines,
        tz: this.user.tz,
      };
      await this.appService.pause(300);
      this.user = await this.authService.updateMe(dto);
      this.authService.load();
      this.updating = false;
      this.updated = true;
      await this.appService.pause(1000);
      this.updated = false;
    } catch (err) {
      this.appService.notifyError(err);
      this.updating = false;
    }
  }
}
