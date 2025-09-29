import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CAppService } from './services/app.service';
import { CLangRepository } from './services/repositories/lang.repository';
import { CSettingRepository } from './services/repositories/setting.repository';
import { CWordRepository } from './services/repositories/word.repository';
import { CFileRepository } from './services/repositories/file.repository';
import { NavigationStart, Router } from '@angular/router';
import { ISettings } from './model/entities/settings';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CAppComponent {
  @ViewChild('win', { static: false }) private winRef: ElementRef;
  private settingsReady: boolean = false;
  private langsReady: boolean = false;
  private wordsReady: boolean = false;
  private filesReady: boolean = false;

  constructor(
    private appService: CAppService,
    private langRepository: CLangRepository,
    private settingRepository: CSettingRepository,
    private wordRepository: CWordRepository,
    private fileRepository: CFileRepository,
    private router: Router
  ) {}

  get settings(): ISettings {
    return this.appService.settings;
  }
  get ready(): boolean {
    return (
      this.settingsReady &&
      this.settings['active'] === '1' &&
      this.langsReady &&
      this.wordsReady &&
      this.filesReady
    );
  }
  get url(): string[] {
    return this.appService.url;
  }
  get regMode(): boolean {
    return this.appService.regMode;
  }
  get popupLoginActive(): boolean {
    return this.appService.popupLoginActive;
  }
  set popupLoginActive(v: boolean) {
    this.appService.popupLoginActive = v;
  }
  get popupVerifActive(): boolean {
    return this.appService.popupVerifActive;
  }
  set popupVerifActive(v: boolean) {
    this.appService.popupVerifActive = v;
  }
  get popupRegisterActive(): boolean {
    return this.appService.popupRegisterActive;
  }
  set popupRegisterActive(v: boolean) {
    this.appService.popupRegisterActive = v;
  }
  get popupRecoverActive(): boolean {
    return this.appService.popupRecoverActive;
  }
  set popupRecoverActive(v: boolean) {
    this.appService.popupRecoverActive = v;
  }
  get popupSubscriptionActive(): boolean {
    return this.appService.popupSubscriptionActive;
  }
  set popupSubscriptionActive(v: boolean) {
    this.appService.popupSubscriptionActive = v;
  }
  get popupInorderActive(): boolean {
    return this.appService.popupInorderActive;
  }
  set popupInorderActive(v: boolean) {
    this.appService.popupInorderActive = v;
  }
  get popupLimitActive(): boolean {
    return this.appService.popupLimitActive;
  }
  set popupLimitActive(v: boolean) {
    this.appService.popupLimitActive = v;
  }

  public async ngOnInit(): Promise<void> {
    await Promise.all([
      this.initSettings(),
      this.initLangs(),
      this.initWords(),
      this.initFiles(),
      this.initTheme(),
    ]);
    this.initIface();
  }

  public async ngAfterViewInit(): Promise<void> {
    this.appService.win = this.winRef.nativeElement;
  }

  private async initSettings(): Promise<void> {
    try {
      this.appService.settings = await this.settingRepository.loadAll();
      this.settingsReady = true;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  private async initLangs(): Promise<void> {
    try {
      this.appService.langs = await this.langRepository.loadAll();
      this.initLang(this.router.url.split('/')[1]);
      this.langsReady = true;
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe((event: NavigationStart) =>
          this.initLang(event.url.split('/')[1])
        );
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  private initLang(slug: string): void {
    if (!slug) {
      this.appService.setLang(this.appService.langs[0]);
      return;
    }

    const lang = this.appService.langs.find((l) => l.slug === slug);

    if (!lang) {
      this.appService.setLang(this.appService.langs[0]);
      this.router.navigateByUrl(
        `/${this.appService.lang.value.slug}/errors/404`
      );
      return;
    }

    this.appService.setLang(lang);
  }

  private async initWords(): Promise<void> {
    try {
      this.appService.words = await this.wordRepository.loadAll();
      this.wordsReady = true;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  private async initFiles(): Promise<void> {
    try {
      this.appService.files = await this.fileRepository.loadAll();
      this.filesReady = true;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  private initTheme(): void {
    let theme = localStorage.getItem('theme');

    if (!theme) {
      theme = 'dark';
      localStorage.setItem('theme', theme);
    }

    document.documentElement.classList.add(theme);
  }

  private async initIface(): Promise<void> {
    const splash = document.getElementById('splash');
    await this.appService.pause(500);
    splash.classList.add('transparent');
    await this.appService.pause(500);
    splash.remove();
  }

  // <a class="routerlink"> to router-like behavior
  @HostListener('document:click', ['$event'])
  public onClick(event: Event): void {
    if (event.target instanceof HTMLAnchorElement) {
      const element = event.target as HTMLAnchorElement;
      if (element.classList.contains('routerlink')) {
        event.preventDefault();
        const route = element.getAttribute('href');
        route && this.router.navigateByUrl(route);
      }
    }
  }
}
