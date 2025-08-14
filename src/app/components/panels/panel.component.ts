import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { CAppService } from "../../services/app.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Directive()
export abstract class CPanelComponent implements OnInit {
    @Input() public active: boolean = false;
    @Output() protected activeChange: EventEmitter<boolean> = new EventEmitter();
    public unique: number = 0;

    constructor(protected appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.unique = this.appService.rndId();
    }

    public onClose(): void {
        this.activeChange.emit(false);
    }

    @HostListener("window:click", ["$event"])
    public onClick(event: PointerEvent): void {   
        if (this.active && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`panel-${this.unique}`])) {
            this.onClose();
        }
    } 
}