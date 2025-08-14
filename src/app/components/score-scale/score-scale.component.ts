import { Component, Input } from "@angular/core";

@Component({
    selector: "score-scale",
    templateUrl: "score-scale.component.html",
    styleUrls: ["score-scale.component.scss"],
})
export class CScoreScaleComponent {
    @Input() public value: number;

    get valid_value(): number {
        if (this.value < 0) return 0;
        if (this.value > 1000) return 1000;
        return this.value;
    }

    get left(): string {return `calc(${this.valid_value / 10}% - 5px)`;}
}