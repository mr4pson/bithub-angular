import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CSelectComponent } from "../../select.component";

@Component({
    selector: "select-simple",
    templateUrl: "select-simple.component.html",
    styleUrls: ["../../select.component.scss"],
})
export class CSelectSimpleComponent extends CSelectComponent {
    @Input() public items: string[];
    @Input() public dict: string;
    @Input() public word: string;
    @Input() public value: string;
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();

    public onSelect(item: string): void {
        this.valueChange.emit(item);
        this.close();
    }
}