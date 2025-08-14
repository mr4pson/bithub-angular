import { Component, HostListener, OnInit } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "the-help",
    templateUrl: "help.component.html",
    styleUrls: ["help.component.scss"],
})
export class CHelpComponent implements OnInit {
    public active: boolean = false;
    public unique: number = null;

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.unique = this.appService.rndId();
    }

    @HostListener("window:click", ["$event"])
    public onClick(event: PointerEvent): void {   
        if (this.active && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`help-${this.unique}`])) {
            this.active = false;
        }
    }
}
