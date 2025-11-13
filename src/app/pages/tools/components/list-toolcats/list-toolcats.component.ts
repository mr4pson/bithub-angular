import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ILang } from 'src/app/model/entities/lang';
import { IToolcat } from 'src/app/model/entities/toolcat';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CToolcatRepository } from 'src/app/services/repositories/toolcat.repository';

@Component({
  selector: 'list-toolcats',
  templateUrl: 'list-toolcats.component.html',
  styleUrls: ['list-toolcats.component.scss'],
})
export class CListToolcatsComponent implements OnInit {
  @Input() public value: number = null;
  @Output() private valueChange: EventEmitter<number> = new EventEmitter();
  public toolcats: IToolcat[] = [];

  constructor(
    private appService: CAppService,
    private tocatRepository: CToolcatRepository
  ) {}

  get lang(): ILang {
    return this.appService.lang.value;
  }
  get words(): IWords {
    return this.appService.words;
  }

  public ngOnInit(): void {
    this.initToolcats();
  }

  private async initToolcats(): Promise<void> {
    try {
      this.toolcats = await this.tocatRepository.loadAll();
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  public onSelect(id: number): void {
    this.valueChange.emit(id);
  }
}
