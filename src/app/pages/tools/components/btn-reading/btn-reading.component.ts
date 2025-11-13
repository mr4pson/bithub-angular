import { Component, Input } from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { IWords } from 'src/app/model/entities/words';
import { ILang } from 'src/app/model/entities/lang';
import { CToolRepository } from 'src/app/services/repositories/tool.repository';
import { ITool } from 'src/app/model/entities/tool';

@Component({
  selector: 'btn-reading',
  templateUrl: 'btn-reading.component.html',
  styleUrls: ['btn-reading.component.scss'],
})
export class CBtnReadingComponent {
  @Input() public tool: ITool;
  public loading: boolean = false;

  constructor(
    private appService: CAppService,
    private toolRepository: CToolRepository
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }

  public async onToggle(event: PointerEvent): Promise<void> {
    try {
      event.preventDefault();
      event.stopPropagation();

      if (!this.loading) {
        const was_read = !this.tool.was_read;
        this.loading = true;
        await this.appService.pause(300);
        await this.toolRepository.updateReading({
          tool_id: this.tool.id,
          was_read,
        });
        this.loading = false;
        this.tool.was_read = was_read;
      }
    } catch (err) {
      this.appService.notifyError(err);
      this.loading = false;
    }
  }
}
