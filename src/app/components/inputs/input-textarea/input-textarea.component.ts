import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "input-textarea",
    templateUrl: "input-textarea.component.html",
    styleUrls: ["input-textarea.component.scss"],
})
export class CInputTextareaComponent {
    @Input() public value: string = "";
    @Input() public error: string = null;
    @Input() public placeholder: string = "";
    @Input() public maxlength: number = 255;
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();
    public currentValue: string = "";

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"]) {
            this.currentValue = this.value;
        }
    }    

    public onChange(): void {
        this.valueChange.emit(this.currentValue);
    }
}