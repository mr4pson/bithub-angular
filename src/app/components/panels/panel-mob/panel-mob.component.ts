import { AfterViewInit, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "panel-mob",
    templateUrl: "panel-mob.component.html",
    styleUrls: ["panel-mob.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CPanelMobComponent implements AfterViewInit {
    @Input() public active: boolean = false;
    @Output() private activeChange: EventEmitter<boolean> = new EventEmitter();

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
        
    public ngAfterViewInit(): void {
        this.initBehavior();
    }

    private async initBehavior(): Promise<void> {
        const elements = await this.appService.querySelectorAll(".mm-menu a");    
        elements.forEach(element => element.addEventListener("click", () => this.onClose()));        
    }

    public onClose(): void {
        this.activeChange.emit(false);
    }
}