import { Component, Input } from "@angular/core";
import { ITask } from "src/app/model/entities/task";

@Component({
    selector: "the-progress2",
    templateUrl: "progress2.component.html",
    styleUrls: ["progress2.component.scss"],
})
export class CProgress2Component {
    @Input() public tasks: ITask[] = [];
}
