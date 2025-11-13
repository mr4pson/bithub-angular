import { Component, Input } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { IWords } from 'src/app/model/entities/words';
import { ILang } from 'src/app/model/entities/lang';
import { ITool } from 'src/app/model/entities/tool';

@Component({
  selector: 'list-tools',
  templateUrl: 'list-tools.component.html',
  styleUrls: ['list-tools.component.scss'],
})
export class CListToolsComponent {
  @Input() public tools: ITool[];
  @Input() public loading: boolean;

  constructor(private appService: CAppService) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
}
