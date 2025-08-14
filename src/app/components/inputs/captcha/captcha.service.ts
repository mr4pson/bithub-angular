import { Injectable } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { BehaviorSubject } from "rxjs";

// for Hcaptcha only, but it is full analogue of Recaptcha
@Injectable()
export class CCaptchaService {
    public loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private appService: CAppService) {
        this.init();
    }

    get captchaKey(): string {return this.appService.settings[`hcaptcha-public`];}
    get captchaApi(): any {return window["hcaptcha"];}

    public initWidget(onSolved: (token:string) => void, onError: () => void, onClosed: () => void, onExpired: () => void = null): string {
        const div = document.createElement("div");
        document.body.appendChild(div);
        const params = {
            "sitekey": this.captchaKey,
            "size": "invisible",
            "callback": onSolved,
            "error-callback": onError,
            "close-callback": onClosed, 
            "expired-callback": onExpired,
        };
        const widgetId = this.captchaApi?.render(div, params);
        return widgetId;
    }

    /////////////////
    // utils
    /////////////////

    private init(): void {
        window["onCaptchaLoad"] = this.onLoad.bind(this);
        const element = document.createElement("script");
        element.src = this.appService.settings[`hcaptcha-front-url`];
        element.async = true;  
        element.defer = true;         
        document.body.appendChild(element);
    }

    private onLoad(): void {
        this.loaded.next(true);
    }       
}
