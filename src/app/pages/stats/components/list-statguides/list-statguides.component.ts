import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { CGuide } from "src/app/model/entities/guide";

@Component({
    selector: "list-statguides",
    templateUrl: "list-statguides.component.html",
    styleUrls: ["list-statguides.component.scss"],
})
export class CListStatGuidesComponent {
    @Input() public guides: CGuide[];
    @Input() public loading: boolean;

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    ///////////////////////
    // guide note edition
    ///////////////////////

    public guideToEditNote: CGuide = null;
    public notePopupActive: boolean = false;

    public onEditGuideNote(i: number): void {
        this.guideToEditNote = this.guides[i];
        this.notePopupActive = true;
    }

    //////////////////////////////
    // guide completions view
    //////////////////////////////

    public completionsGuide: CGuide = null;
    public completionsPopupActive: boolean = false;

    public onViewCompletions(i: number): void {
        this.completionsGuide = this.guides[i];
        this.completionsPopupActive = true;
    }
}
