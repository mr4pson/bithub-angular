import { Component } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { ILang } from "src/app/model/entities/lang";

@Component({
    selector: "menu-langs",
    templateUrl: "menu-langs.component.html",
    styleUrls: ["menu-langs.component.scss"],
})
export class CMenuLangsComponent {
    constructor(private appService: CAppService) {}

    get langs(): ILang[] {return this.appService.langs;}
    get lang(): ILang {return this.appService.lang.value;}

    public getLangLink(lang: ILang, mode: "url" | "fragment" | "queryParams"): any {
        return this.appService.getLangLink(lang, mode);
    }
}
