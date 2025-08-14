import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CGuide } from "src/app/model/entities/guide";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "the-statguide",
    templateUrl: "statguide.component.html",
    styleUrls: ["statguide.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CStatGuideComponent {
    @Input() public guide: CGuide;
    @Output() private editGuideNote: EventEmitter<void> = new EventEmitter();
    @Output() private viewCompletions: EventEmitter<void> = new EventEmitter();

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public onEditGuideNote(): void {
        this.editGuideNote.emit();
    }

    public onViewCompletions(): void {
        this.viewCompletions.emit();
    }
}