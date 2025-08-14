import { Directive, HostListener, Input, OnInit } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Directive()
export abstract class CSelectComponent implements OnInit {
    @Input() public disabled: boolean = false;
    @Input() public error: boolean = false;

    public unique: number = null;
    public active: boolean = false;

    constructor(protected appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public ngOnInit(): void {
        this.unique = this.appService.rndId();
    }

    public onToggle(): void {
        this.active ? this.close() : this.open();
    }

    protected open(): void {
        this.active = true;
    }

    protected close(): void {
        this.active = false;
    }

    @HostListener("window:click", ["$event"])
    protected onClick(event: PointerEvent): void {
        if (this.active && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`sc-value-${this.unique}`, `sc-items-${this.unique}`])) {
            this.close();
        }
    }
}