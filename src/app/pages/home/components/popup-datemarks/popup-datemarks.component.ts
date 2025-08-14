import { Component, Input, ViewEncapsulation } from "@angular/core";
import { CPopupComponent } from "src/app/components/popups/popup.component";
import { CGuide } from "src/app/model/entities/guide";
import { CUser } from "src/app/model/entities/user";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";

@Component({
    selector: "popup-datemarks",
    templateUrl: "popup-datemarks.component.html",
    styleUrls: [
        "../../../../styles/popups.scss",
        "popup-datemarks.component.scss",
    ],
})
export class CPopupDatemarksComponent extends CPopupComponent {
    @Input() public guide: CGuide;

    constructor(
        protected override appService: CAppService,
        protected authService: CAuthService,
    )
    {
        super(appService);
    }

    get user(): CUser {return this.authService.user;}
    get remindTxt(): string {
        if (!this.user) return "";
        const botName = this.appService.settings["tgbot-name"];
        const tgLink = this.appService.settings["tgbot-starturl"]
            .replace(/{{bot_name}}/g, botName)
            .replace(/{{user_uuid}}/g, this.user.uuid);
        return this.words["guides"]?.["remind"]?.[this.lang.slug]?.replace("{{tgbot}}", tgLink) + ":";
    }
}
