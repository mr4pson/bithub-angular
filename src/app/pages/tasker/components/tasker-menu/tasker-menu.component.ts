import { Component } from "@angular/core";
import { TDeskMode } from "src/app/model/entities/desk";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CTaskerService } from "src/app/pages/tasker/services/tasker.service";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "tasker-menu",
    templateUrl: "tasker-menu.component.html",
    styleUrls: ["tasker-menu.component.scss"],
})
export class CTaskerMenuComponent {
    constructor(
        private appService: CAppService,
        private taskerService: CTaskerService,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    get mode(): TDeskMode {return this.taskerService.mode;}

    public setMode(mode: TDeskMode): void {
        this.taskerService.setMode(mode);
    }
}
