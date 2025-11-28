import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timeout } from 'src/app/decorators/timeout';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CAuthGuard } from 'src/app/services/guards/auth.guard';
import { CUserRepository } from 'src/app/services/repositories/user.repository';

// регистарция реферала
@Component({
  selector: 'ref-register-page',
  templateUrl: 'ref.register.page.html',
})
export class CRefRegisterPage implements OnInit {
  public found: boolean = null;

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private authGuard: CAuthGuard,
    private userRepository: CUserRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get redirect(): string {
    return this.route.snapshot.queryParams['redirect'];
  }
  get authenticated(): boolean {
    return this.authService.authData !== null;
  }

  @Timeout(0)
  public ngOnInit(): void {
    if (!this.initBehavior()) return;
    this.initSEO();
    this.initReferer();
  }

  // Ранее мы просто разлогинивали залогиненного юзера, если он попал на эту страницу.
  // (При регистрации субаккаунтов так и осталось.)
  // Теперь понадобились гибридные ссылки - юзеры делятся гайдами через реферальные ссылки с редиректом,
  // поэтому залогиненного отправляем либо на редирект, либо на главную, а незалогиненного регистрируем как реферала, а потом редиректим
  private initBehavior(): boolean {
    if (this.authenticated) {
      this.router.navigateByUrl(this.redirect || `/${this.lang.slug}`);
      return false;
    }

    this.authGuard.setBlockedUrl(this.redirect || null); // искусственно подсовываем урл, на который перекинет форма
    return true;
  }

  private async initReferer(): Promise<void> {
    try {
      await this.appService.pause(500);
      const statusCode = await this.userRepository.isExists(
        this.route.snapshot.params['uuid']
      );

      if (statusCode === 200) {
        this.found = true;
        await this.userRepository.trackReferralView(
          this.route.snapshot.params['uuid']
        );
        await this.appService.pause(500);
        this.appService.popupRegisterActive = true;
        return;
      }

      if (statusCode === 404) {
        this.found = false;
        return;
      }

      this.appService.notifyError(
        this.words['errors']?.['unexpected']?.[this.lang.slug]
      );
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  private initSEO(): void {
    this.appService.setTitle(
      this.words['register-ref']?.['title']?.[this.lang.slug]
    );
  }
}
