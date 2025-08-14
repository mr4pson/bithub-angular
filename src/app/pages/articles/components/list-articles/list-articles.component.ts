import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { IArticle } from "src/app/model/entities/article";

@Component({
    selector: "list-articles",
    templateUrl: "list-articles.component.html",
    styleUrls: ["list-articles.component.scss"],
})
export class CListArticlesComponent {
    @Input() public articles: IArticle[];
    @Input() public loading: boolean;
    
    constructor(private appService: CAppService) {}
    
    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
}
