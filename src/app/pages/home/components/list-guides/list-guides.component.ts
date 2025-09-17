import { Component, Input } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { IWords } from 'src/app/model/entities/words';
import { ILang } from 'src/app/model/entities/lang';
import { CGuide } from 'src/app/model/entities/guide';
import { CAuthService } from 'src/app/services/auth.service';
import { CUser } from 'src/app/model/entities/user';

@Component({
  selector: 'list-guides',
  templateUrl: 'list-guides.component.html',
  styleUrls: ['list-guides.component.scss'],
})
export class CListGuidesComponent {
  @Input() public guides: CGuide[];
  @Input() public loading: boolean;

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
  get user(): CUser {
    return this.authService.user;
  }

  ////////////////////
  // unviewed panel
  ////////////////////

  public puActive: boolean = false;
  public puGuideId: number = null;

  public onGetUnviewed(i: number): void {
    this.puGuideId = this.guides[i].id;
    this.puActive = true;
  }

  ////////////////////
  // datemarks panel
  ////////////////////

  public pdGuide: CGuide = null;
  public pdActive: boolean = false;

  public onEditDatemarks(i: number): void {
    this.pdGuide = this.guides[i];
    this.pdActive = true;
  }
}
