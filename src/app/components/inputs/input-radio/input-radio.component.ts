import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: "input-radio",
    templateUrl: "input-radio.component.html",
    styleUrls: ["input-radio.component.scss"],
})
export class CInputRadioComponent implements OnChanges {
    @Input() public value: boolean = false;
    @Input() public title: string = "";
    @Input() public compact: boolean = false;
    @Output() private valueChange: EventEmitter<boolean> = new EventEmitter();
    public currentValue: boolean = false;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"]) {
            this.currentValue = this.value;
        }
    }

    public onClick(): void {
        this.valueChange.emit(!this.currentValue);
    }
}
