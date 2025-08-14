import { Component, Input, ViewEncapsulation } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "profile-finances",
    templateUrl: "profile-finances.component.html",
    styleUrls: ["profile-finances.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CProfileFinancesComponent {
    @Input() public user: CUser;

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    get freetasksLimit(): string {return this.appService.settings["site-freetasks"];}

    public onPaySubscription(): void {
        this.appService.popupSubscriptionActive = true;
    }

    public onPayLimit(): void {
        this.appService.popupLimitActive = true;
    }
}