import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { IShopitem } from "src/app/model/entities/shopitem";

@Component({
    selector: "list-shopitems",
    templateUrl: "list-shopitems.component.html",
    styleUrls: ["list-shopitems.component.scss"],
})
export class CListShopitemsComponent {
    @Input() public shopitems: IShopitem[];
    @Input() public loading: boolean;

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
}
