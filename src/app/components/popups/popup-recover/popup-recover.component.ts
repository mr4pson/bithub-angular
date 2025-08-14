import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CAuthGuard } from "src/app/services/guards/auth.guard";
import { IUserRecover, IUserVerify } from "src/app/model/entities/user";

@Component({
    selector: "popup-recover",
    templateUrl: "popup-recover.component.html",
    styleUrls: [
        "../../../styles/popups.scss",
        "../../../styles/forms.scss",
    ],
})
export class CPopupRecoverComponent extends CPopupComponent implements OnChanges {
    public email: string = "";
    public code: string = "";
    public codeSent: boolean = false;
    public codeSending: boolean = false;
    public password: string = "";
    public password2: string = "";
    public errors: IKeyValue<string> = {};
    public formSending: boolean = false;
    public passwordChanged: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected authService: CAuthService,
        protected authGuard: CAuthGuard,
    )
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        !this.active && this.reset();
    }

    // это именно ручное закрытие, для программного использовать activeChange или другую процедуру
    public override onClose(): void {
        super.onClose();
        this.authGuard.resetBlockedUrl(); // при ручном закрытии тот урл, на который нас не пустили, становится неактуальным
    }

    private reset(): void {
        this.password = "";
        this.password2 = "";
        this.code = "";
        this.passwordChanged = false;
        this.errors = {};
    }

    public async onLogin(): Promise<void> {
        this.activeChange.emit(false); // не onClose!
        await this.appService.pause(500);
        this.appService.popupLoginActive = true;
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validateForm()) return;
            this.formSending = true;
            const dto: IUserRecover = {email: this.email, code: this.code, password: this.password};
            const statusCode = await this.authService.recover(dto);
            this.formSending = false;

            if (statusCode === 200) {
                this.passwordChanged = true;
                return;
            }

            if (statusCode === 404) {
                this.errors["email"] = "email-not-exists";
                return;
            }

            if (statusCode === 401) {
                this.errors["code"] = "code-invalid";
                return;
            }

            this.activeChange.emit(false); // не onClose!
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.formSending = false;
        }
    }

    public async onSendCode(): Promise<void> {
        try {
            if (!this.validateEmail()) return;
            this.codeSending = true;
            const dto: IUserVerify = {email: this.email, lang_id: this.lang.id};
            await this.authService.verify(dto);
            this.codeSending = false;
            this.codeSent = true;
            await this.appService.pause(3000);
            this.codeSent = false;
        } catch (err) {
            this.appService.notifyError(err);
            this.codeSending = false;
        }
    }

    private validateForm(): boolean {
        let error = false;
        this.errors["email"] = null;
        this.errors["code"] = null;
        this.errors["password"] = null;
        this.errors["password2"] = null;

        if (!this.appService.validateEmail(this.email)) {
            this.errors["email"] = "email";
            error = true;
        }

        if (!this.code) {
            this.errors["code"] = "required";
            error = true;
        }

        if (this.password.length < 6) {
            this.errors["password"] = "password";
            error = true;
        }

        if (this.password2 !== this.password) {
            this.errors["password2"] = "password2";
            error = true;
        }

        return !error;
    }

    private validateEmail(): boolean {
        let error = false;
        this.errors["email"] = null;

        if (!this.appService.validateEmail(this.email)) {
            this.errors["email"] = "email";
            error = true;
        }

        return !error;
    }
}