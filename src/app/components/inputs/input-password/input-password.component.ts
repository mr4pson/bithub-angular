import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: "input-password",
    templateUrl: "input-password.component.html",
    styleUrls: ["input-password.component.scss"],    
})
export class CInputPasswordComponent implements OnChanges {
    @Input() private value: string;
    @Input() public error: boolean = false;
    @Input() public placeholder: string = "";
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();
    public currentValue: string = "";
    public visible: boolean = false;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"]) {
            this.currentValue = this.value;
        }
    }    

    public onChange(): void {
        this.valueChange.emit(this.currentValue);
    }
}
