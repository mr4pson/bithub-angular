import { Component, Input } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { ITool } from 'src/app/model/entities/tool';

@Component({
  selector: 'the-tool',
  templateUrl: 'tool.component.html',
  styleUrls: ['tool.component.scss'],
})
export class CToolComponent {
  @Input() public tool: ITool;

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
  get authenticated(): boolean {
    return this.authService.authData !== null;
  }
}
