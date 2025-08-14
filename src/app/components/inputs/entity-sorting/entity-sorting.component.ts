import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { ISorting } from "src/app/model/sorting";

@Component({
    selector: "entity-sorting",
    templateUrl: "entity-sorting.component.html",
    styleUrls: ["entity-sorting.component.scss"],
})
export class CEntitySortingComponent implements OnInit {
    @Input() public items: ISorting[];
    @Input() public value: ISorting;
    @Output() private valueChange: EventEmitter<ISorting> = new EventEmitter();

    public unique: number = null;
    public active: boolean = false;    
    
    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public ngOnInit(): void {
        this.unique = this.appService.rndId();
    }

    public close(): void {
        this.active = false;
    }

    public onSelect(item: ISorting): void {
        this.valueChange.emit(item);
        this.close();
    }

    @HostListener("window:click", ["$event"])
    public onClick(event: PointerEvent): void {
        if (this.active && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`ss.value-${this.unique}`, `ss.items-${this.unique}`])) {
            this.close();
        }
    }
}