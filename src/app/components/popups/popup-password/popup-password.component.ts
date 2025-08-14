import { Component, OnChanges } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { CAppService } from "src/app/services/app.service";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAuthService } from "src/app/services/auth.service";

@Component({
    selector: "popup-password",
    templateUrl: "popup-password.component.html",
    styleUrls: [
        "../../../styles/forms.scss",
        "../../../styles/popups.scss",
        "popup-password.component.scss",
    ],
})
export class CPopupPasswordComponent extends CPopupComponent implements OnChanges {
    public oldpassword: string = "";
    public newpassword: string = "";
    public newpassword2: string = "";
    public sending: boolean = false;
    public done: boolean = false;
    public errors: IKeyValue<string> = {};

    constructor(
        protected override appService: CAppService,
        protected authSerice: CAuthService,
    )
    {
        super(appService);
    }

    public ngOnChanges(): void {
        !this.active && this.reset();
    }

    private reset(): void {
        this.oldpassword = "";
        this.newpassword = "";
        this.newpassword2 = "";
        this.errors = {};
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validate()) return;
            this.sending = true;
            await this.appService.pause(300);
            const statusCode = await this.authSerice.updatePassword({oldpassword: this.oldpassword, newpassword: this.newpassword});
            this.sending = false;

            if (statusCode === 200) {
                this.done = true;
                await this.appService.pause(1000);
                this.done = false;
                this.onClose();
                return;
            }

            if (statusCode === 401) {
                this.errors["oldpassword"] = "password-invalid";
                return;
            }

            this.onClose();
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.sending = false;
        }
    }

    private validate(): boolean {
        let error = false;
        this.errors["oldpassword"] = null;
        this.errors["newpassword"] = null;
        this.errors["newpassword2"] = null;

        if (!this.oldpassword.length) {
            this.errors["oldpassword"] = "required";
            error = true;
        }

        if (this.newpassword.length < 6) {
            this.errors["newpassword"] = "password";
            error = true;
        }

        if (this.newpassword2 !== this.newpassword) {
            this.errors["newpassword2"] = "password2";
            error = true;
        }

        return !error;
    }
}