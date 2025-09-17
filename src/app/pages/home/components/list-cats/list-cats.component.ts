import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CCatRepository } from 'src/app/services/repositories/cat.repository';

@Component({
  selector: 'list-cats',
  templateUrl: 'list-cats.component.html',
  styleUrls: ['list-cats.component.scss'],
})
export class CListCatsComponent {
  @Input() public value: number = null;
  @Output() private valueChange: EventEmitter<number> = new EventEmitter();

  constructor(
    private appService: CAppService,
    public catRepository: CCatRepository
  ) {}

  get lang(): ILang {
    return this.appService.lang.value;
  }
  get words(): IWords {
    return this.appService.words;
  }

  public onSelect(id: number): void {
    this.valueChange.emit(id);
  }
}
