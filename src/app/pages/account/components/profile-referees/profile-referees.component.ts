import { Component, Input } from '@angular/core';
import { cfg } from 'src/app/app.config';
import { ILang } from 'src/app/model/entities/lang';
import { CUser } from 'src/app/model/entities/user';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';

@Component({
  selector: 'profile-referees',
  templateUrl: 'profile-referees.component.html',
  styleUrls: ['profile-referees.component.scss'],
})
export class CProfileRefereesComponent {
  @Input() public user: CUser;
  public copied: boolean = false;

  constructor(private appService: CAppService) {}

  get lang(): ILang {
    return this.appService.lang.value;
  }
  get words(): IWords {
    return this.appService.words;
  }

  public async onCopy(): Promise<void> {
    const ref_link = this.user.ref_link ?? this.user.uuid;
    window.navigator.clipboard.writeText(
      `${cfg.siteUrl}/${this.lang.slug}/register/ref/${ref_link}`
    );
    this.copied = true;
    await this.appService.pause(1000);
    this.copied = false;
  }
}
