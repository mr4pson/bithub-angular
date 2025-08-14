import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "input-search",
    templateUrl: "input-search.component.html",
    styleUrls: ["input-search.component.scss"],
})
export class CInputSearchComponent implements OnChanges {
    @Input() public value: string;
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();
    public currentValue: string = "";

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public ngOnChanges(changes: SimpleChanges): void {        
        if (changes["value"] && changes["value"].currentValue !== this.currentValue) {            
            this.currentValue = this.value;
        }
    }

    public onSubmit(): void {
        this.valueChange.emit(this.currentValue);
    }

    public onReset(): void {
        this.currentValue = "";
        this.value && this.onSubmit();
    }
}