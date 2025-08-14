import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IDesk, TDeskMode } from "src/app/model/entities/desk";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CDeskRepository } from "src/app/services/repositories/desk.repository";

@Component({
    selector: "desk-create",
    templateUrl: "desk-create.component.html",
    styleUrls: ["desk-create.component.scss"],
})
export class CDeskCreateComponent {
    @Input() public mode: TDeskMode;
    @Output() private deskCreated: EventEmitter<IDesk> = new EventEmitter();    
    public creating: boolean = false;

    constructor(
        private deskRepository: CDeskRepository,
        private appService: CAppService,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public async onCreate(): Promise<void> {
        try {
            this.creating = true;
            await this.appService.pause(300);
            const desk = await this.deskRepository.create(this.mode);
            this.creating = false;
            this.deskCreated.emit(desk);
        } catch (err) {
            this.creating = false;
            this.appService.notifyError(err);
        }
    }
}