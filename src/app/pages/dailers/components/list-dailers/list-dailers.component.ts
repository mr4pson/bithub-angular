import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { IDailer } from "src/app/model/entities/dailer";

@Component({
    selector: "list-dailers",
    templateUrl: "list-dailers.component.html",
    styleUrls: [
        "list-dailers.component.scss",
        "../../../../styles/data.scss",
    ],
})
export class CListDailersComponent {
    @Input() public loading: boolean;
    @Input() public dailers: IDailer[];
    @Output() private editDailer: EventEmitter<number> = new EventEmitter();
    @Output() private deleteDailer: EventEmitter<number> = new EventEmitter();

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public onEdit(i: number): void {
        this.editDailer.emit(i);
    }

    public onDelete(i: number): void {
        this.deleteDailer.emit(i);
    }
}
