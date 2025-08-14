import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CAuthGuard } from "src/app/services/guards/auth.guard";
import { Router } from "@angular/router";
import { CGoogleService } from "src/app/services/google.service";
import { IUserRegister, IUserVerify } from "src/app/model/entities/user";

@Component({
    selector: "popup-register",
    templateUrl: "popup-register.component.html",
    styleUrls: [
        "../../../styles/popups.scss",
        "../../../styles/forms.scss",
    ],
})
export class CPopupRegisterComponent extends CPopupComponent implements OnChanges {
    public name: string = "";
    public email: string = "";
    public code: string = "";
    public codeSent: boolean = false;
    public codeSending: boolean = false;
    public password: string = "";
    public password2: string = "";
    public wallet: string = "";
    public captchaToken: string = "";
    public errors: IKeyValue<string | boolean> = {};
    public formSending: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected googleService: CGoogleService,
        protected authService: CAuthService,
        protected authGuard: CAuthGuard,
        protected router: Router,
    )
    {
        super(appService);
    }

    get regMode(): boolean {return this.appService.regMode;}
    get url(): string[] {return this.appService.url;}

    public ngOnChanges(changes: SimpleChanges): void {
        !this.active && this.reset();
    }

    // это именно ручное закрытие, для программного использовать activeChange или другую процедуру
    public override onClose(): void {
        if (this.regMode) return;
        super.onClose();
        this.authGuard.resetBlockedUrl(); // при ручном закрытии тот урл, на который нас не пустили, становится неактуальным
    }

    private reset(): void {
        this.password = "";
        this.password2 = "";
        this.code = "";
        this.captchaToken = "";
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
            const dto: IUserRegister = {
                lang_id: this.lang.id,
                name: this.name,
                email: this.email,
                code: this.code,
                password: this.password,
                wallet: this.wallet,
                parent_uuid: this.url[2] === "register" && this.url[3] === "sub" ? this.url[4] : null,
                referrer_uuid: this.url[2] === "register" && this.url[3] === "ref" ? this.url[4] : null,
                captchaToken: this.captchaToken,
            };
            const statusCode = await this.authService.register(dto);
            this.captchaToken = null; // каптча одноразовая, как выяснилось
            this.formSending = false;

            if (statusCode === 201) {
                this.activeChange.emit(false); // не onClose!
                const url = this.authGuard.getBlockedUrl() || `/${this.lang.slug}/account`;
                this.router.navigateByUrl(url);
                return;
            }

            if (statusCode === 409) {
                this.errors["email"] = "email-exists";
                return;
            }

            if (statusCode === 401) {
                this.errors["code"] = "code-invalid";
                return;
            }

            if (statusCode === 410) {
                this.errors["form"] = "no-parent";
                await this.appService.pause(2000);
                this.errors["form"] = null;
                return;
            }

            if (statusCode === 411) {
                this.errors["form"] = "children-exhausted";
                await this.appService.pause(2000);
                this.errors["form"] = null;
                return;
            }

            if (statusCode === 412) {
                this.errors["form"] = "no-referrer";
                await this.appService.pause(2000);
                this.errors["form"] = null;
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

    protected validateForm(): boolean {
        let error = false;
        this.errors["name"] = null;
        this.errors["email"] = null;
        this.errors["code"] = null;
        this.errors["password"] = null;
        this.errors["password2"] = null;
        this.errors["captcha-token"] = false;

        if (!this.name) {
            this.errors["name"] = "required";
            error = true;
        }

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

        if (!this.captchaToken) {
            this.errors["captcha-token"] = true;
            error = true;
        }

        return !error;
    }

    protected validateEmail(): boolean {
        let error = false;
        this.errors["email"] = null;

        if (!this.appService.validateEmail(this.email)) {
            this.errors["email"] = "email";
            error = true;
        }

        return !error;
    }

    public onEnterWithGoogle(): void {
        this.googleService.signIn();
    }
}