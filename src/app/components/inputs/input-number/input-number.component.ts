import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: "input-number",
    templateUrl: "input-number.component.html",
    styleUrls: ["input-number.component.scss"],
})
export class CInputNumberComponent implements OnChanges {
    @Input() public value: number = 0;
    @Input() public min: number = null;
    @Input() public max: number = null;
    @Input() public step: number = 1;
    @Output() private valueChange: EventEmitter<number> = new EventEmitter();
    public currentValue: number = 0;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"]) {
            this.currentValue = this.value;
        }
    }

    public onValueChanged(): void {
        if (this.min !== null && this.currentValue < this.min) {
            this.currentValue = this.min;
        }

        if (this.max !== null && this.currentValue > this.max) {
            this.currentValue = this.max;
        }

        this.valueChange.emit(this.currentValue);
    }

    public onDecrease(): void {
        if (this.min !== null) {
            if (this.currentValue - 1 >= this.min) {
                this.currentValue--;
            }
        } else {
            this.currentValue--;
        }

        this.valueChange.emit(this.currentValue);
    }

    public onIncrease(): void {
        if (this.max !== null) {
            if (this.currentValue + 1 <= this.max) {
                this.currentValue++;
            }
        } else {
            this.currentValue++;
        }

        this.valueChange.emit(this.currentValue);
    }
}