import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";

@Component({
    selector: "profile-security",
    templateUrl: "profile-security.component.html",
    styleUrls: ["profile-security.component.scss"],
})
export class CProfileSecurityComponent {
    public popupPasswordActive: boolean = false;
    public deactivating: boolean = false;
    public deactivated: boolean = false;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private router: Router,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public async onDeactivate(): Promise<void> {
        try {
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;
            this.deactivating = true;
            await this.appService.pause(300);
            await this.authService.deactivate();
            this.deactivating = false;
            this.deactivated = true;
            await this.appService.pause(300);
            this.authService.logout();
            this.router.navigateByUrl(`/${this.lang.slug}`);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
