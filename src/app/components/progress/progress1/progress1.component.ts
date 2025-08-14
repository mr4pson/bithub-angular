import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CGuideRepository } from "src/app/services/repositories/guide.repository";

@Component({
    selector: "the-progress1",
    templateUrl: "progress1.component.html",
    styleUrls: ["progress1.component.scss"],
})
export class CProgress1Component {    
    @Input() public value: number;

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}    
}
