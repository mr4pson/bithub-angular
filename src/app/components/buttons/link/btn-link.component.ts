import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { TBusyState } from "src/app/model/busy.state";
import { cfg } from "src/app/app.config";
import { CUser } from "src/app/model/entities/user";
import { CAuthService } from "src/app/services/auth.service";

@Component({
    selector: "btn-link",
    templateUrl: "btn-link.component.html",
    styleUrls: ["btn-link.component.scss"],
})
export class CBtnLinkComponent {
    @Input() public guide_id: number;
    public state: TBusyState = null;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
    get user(): CUser {return this.authService.user;}

    public async onCopy(event: PointerEvent): Promise<void> {
        event.preventDefault();
        event.stopPropagation();
        if (this.state) return;
        this.state = "busy";
        window.navigator.clipboard.writeText(`${cfg.siteUrl}/${this.lang.slug}/register/ref/${this.user.uuid}?redirect=/${this.lang.slug}/guide/${this.guide_id}`);
        await this.appService.pause(300);
        this.state = "done";
        await this.appService.pause(1000);
        this.state = null;
    }
}