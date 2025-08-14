import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { IDrop } from "src/app/model/entities/drop";

@Component({
    selector: "list-drops",
    templateUrl: "list-drops.component.html",
    styleUrls: [
        "list-drops.component.scss",
        "../../../../styles/data.scss",
    ],
})
export class CListDropsComponent {
    @Input() public drops: IDrop[];
    @Input() public loading: boolean;

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
}
