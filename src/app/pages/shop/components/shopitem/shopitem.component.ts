import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { IShopitem } from "src/app/model/entities/shopitem";

@Component({
    selector: "the-shopitem",
    templateUrl: "shopitem.component.html",
    styleUrls: ["shopitem.component.scss"],
})
export class CShopitemComponent {
    @Input() public shopitem: IShopitem;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
    get authenticated(): boolean {return this.authService.authData !== null;}
}
