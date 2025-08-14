import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { IKeyValue } from "src/app/model/keyvalue";
import { ITZ, timezones } from "src/app/model/tz";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";

@Component({
    selector: "profile-personal",
    templateUrl: "profile-personal.component.html",
    styleUrls: [
        "profile-personal.component.scss",
        "../../../../styles/forms.scss",
    ],
})
export class CProfilePersonalComponent implements OnInit {
    @Input() public user: CUser;
    @Input() public busy: boolean;
    @Input() public done: boolean;
    @Output() private saveData: EventEmitter<void> = new EventEmitter();

    public errors: IKeyValue<string | boolean> = {};
    public tgLink: string = "";
    public gettingTgInvite: boolean = false;
    public timezones: ITZ[] = timezones;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get langs(): ILang[] {return this.appService.langs;}
    get words(): IWords {return this.appService.words;}

    ngOnInit(): void {
        this.initTglink();
    }

    private initTglink(): void {
        const botName = this.appService.settings["tgbot-name"];
        this.tgLink = this.appService.settings["tgbot-starturl"]
            .replace(/{{bot_name}}/g, botName)
            .replace(/{{user_uuid}}/g, this.user.uuid);
    }

    public onSubmit(): void {
        this.validate() && this.saveData.emit();
    }

    public async onGetTgInvite(): Promise<void> {
        try {
            this.gettingTgInvite = true;
            await this.appService.pause(300);
            const res = await this.authService.getTgInvite();
            console.log(res);
            this.gettingTgInvite = false;

            if (res.statusCode === 200) {
                const a = document.createElement("a");
                a.href = res.data;
                a.target = "_blank";
                a.click();
                return;
            }

            if (res.statusCode === 401) {
                this.appService.popupSubscriptionActive = true;
                return;
            }

            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.gettingTgInvite = false;
            this.appService.notifyError(err);
        }
    }

    protected validate(): boolean {
        let error = false;
        this.errors["name"] = null;
        this.errors["wallet"] = null;

        if (!this.user.name) {
            this.errors["name"] = "required";
            error = true;
        }

        /*
        if (!this.user.wallet) {
            this.errors["wallet"] = "required";
            error = true;
        }
        */

        return !error;
    }
}