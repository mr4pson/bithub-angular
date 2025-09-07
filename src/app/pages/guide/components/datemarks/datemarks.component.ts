import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CGuide } from 'src/app/model/entities/guide';
import { ILang } from 'src/app/model/entities/lang';
import { CUser } from 'src/app/model/entities/user';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'the-datemarks',
  templateUrl: 'datemarks.component.html',
  styleUrls: ['datemarks.component.scss'],
})
export class CDatemarksComponent {
  @Input() public guide: CGuide;
  @ViewChild('content', { static: false })
  protected contentElementRef: ElementRef;
  private active: boolean = false;

  constructor(
    private appService: CAppService,
    private authService: CAuthService
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get contentElement(): HTMLElement {
    return this.contentElementRef.nativeElement;
  }
  get user(): CUser {
    return this.authService.user;
  }
  get remindTxt(): string {
    if (!this.user) return '';
    const botName = this.appService.settings['tgbot-name'];
    const tgLink = this.appService.settings['tgbot-starturl']
      .replace(/{{bot_name}}/g, botName)
      .replace(/{{user_uuid}}/g, this.user.uuid);
    return (
      this.words['guides']?.['remind']?.[this.lang.slug]?.replace(
        '{{tgbot}}',
        tgLink
      ) + ':'
    );
  }

  public onToggle(): void {
    if (this.active === null) return; // toggling not finished
    this.active ? this.onClose() : this.onOpen();
  }

  private async onOpen(): Promise<void> {
    if (!['dg-pro', 'dg-team'].includes(this.user.subType)) {
      this.appService.popupSubscriptionActive = true;

      return;
    }

    this.active = null;
    this.contentElement.style.maxHeight =
      this.contentElement.scrollHeight + 'px';
    await this.appService.pause(300);
    this.contentElement.style.maxHeight = 'none';
    this.active = true;
  }

  private async onClose(): Promise<void> {
    this.active = null;
    this.contentElement.style.maxHeight =
      this.contentElement.scrollHeight + 'px';
    await this.appService.pause(0);
    this.contentElement.style.maxHeight = '0';
    await this.appService.pause(300);
    this.active = false;
  }
}
