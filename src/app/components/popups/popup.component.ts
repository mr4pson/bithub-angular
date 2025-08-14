import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { CAppService } from "../../services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";

@Directive()
export abstract class CPopupComponent implements OnInit {
    @Input() public active: boolean; // удобнее сделать через внешний параметр, чтобы можно было повесить OnChanges
    @Output() protected activeChange: EventEmitter<boolean> = new EventEmitter();
    public unique: number = 0;

    constructor(protected appService: CAppService) {}

    get words(): IWords {return this.appService.words;}      
    get lang(): ILang {return this.appService.lang.value;}  

    public ngOnInit(): void {
        this.unique = this.appService.rndId();
    }

    public onClose(): void {
        this.activeChange.emit(false);
    }

    @HostListener("mousedown", ["$event"])
    public onClick(event: PointerEvent): void {        
        if (this.active && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`popup-${this.unique}`])) {
            this.onClose();
        }
    } 
}