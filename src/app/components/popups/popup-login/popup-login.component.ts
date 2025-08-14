import { Component, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CAuthGuard } from "src/app/services/guards/auth.guard";
import { Router } from "@angular/router";
import { CGoogleService } from "src/app/services/google.service";
import { IUserLogin } from "src/app/model/entities/user";

@Component({
    selector: "popup-login",
    templateUrl: "popup-login.component.html",
    styleUrls: [
        "../../../styles/popups.scss",
        "../../../styles/forms.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupLoginComponent extends CPopupComponent implements OnChanges {
    public email: string = "";
    public password: string = "";
    public captchaToken: string = "";
    public errors: IKeyValue<string | boolean> = {};
    public sending: boolean = false;

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
        this.captchaToken = "";
        this.errors = {};
    }

    public async onRegister(): Promise<void> {
        this.activeChange.emit(false); // не onClose!
        await this.appService.pause(500);
        this.appService.popupRegisterActive = true;
    }

    public async onRecover(): Promise<void> {
        this.activeChange.emit(false); // не onClose!
        await this.appService.pause(500);
        this.appService.popupRecoverActive = true;
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validate()) return;
            this.sending = true;
            const dto: IUserLogin = {email: this.email, password: this.password, captchaToken: this.captchaToken};
            const statusCode = await this.authService.login(dto);
            this.captchaToken = null; // каптча одноразовая, как выяснилось
            this.sending = false;

            if (statusCode === 200) {
                this.activeChange.emit(false); // не onClose!
                const url = this.authGuard.getBlockedUrl() || `/${this.lang.slug}/account`;
                this.router.navigateByUrl(url);
                return;
            }

            if (statusCode === 401) {
                this.errors["form"] = "denied";
                await this.appService.pause(2000);
                this.errors["form"] = null;
                return;
            }

            this.activeChange.emit(false); // не onClose!
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.sending = false;
        }
    }

    private validate(): boolean {
        let error = false;
        this.errors["email"] = null;
        this.errors["password"] = null;
        this.errors["captcha-token"] = false;

        if (!this.email) {
            this.errors["email"] = "required";
            error = true;
        }

        if (!this.password) {
            this.errors["password"] = "required";
            error = true;
        }

        if (!this.captchaToken) {
            this.errors["captcha-token"] = true;
            error = true;
        }

        return !error;
    }

    public onEnterWithGoogle(): void {
        this.googleService.signIn();
    }
}