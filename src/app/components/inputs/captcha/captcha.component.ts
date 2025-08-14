import { Component, EventEmitter, Input, NgZone, OnInit, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CCaptchaService } from "./captcha.service";
import { first } from "rxjs";

// используется hcaptcha (у recaptcha не хватает события, когда пользователь закрывает окно, не разгадав каптчу)
@Component({
    selector: "the-captcha",
    templateUrl: "captcha.component.html",
    styleUrls: ["captcha.component.scss"],
})
export class CCaptchaComponent implements OnInit {
    @Input() public value: string = null;
    @Input() public error: boolean = false;
    @Input() public title: string = "";
    @Output() public valueChange: EventEmitter<string> = new EventEmitter();
    private widget_id: any = null;
    public busy: boolean = false;

    constructor(
        private appService: CAppService,
        private captchaService: CCaptchaService,
        private ngZone: NgZone,
    ) {}
    
    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    get captchaApi(): any {return window["hcaptcha"];}

    public ngOnInit(): void {
        this.captchaService.loaded
            .pipe(first(v => v)) // first true
            .subscribe(() => this.widget_id = this.captchaService.initWidget(this.onSolved.bind(this), this.onError.bind(this), this.onClosed.bind(this), this.onExpired.bind(this)));        
    }

    public onClick(): void {
        this.busy = true;
        this.captchaApi?.execute(this.widget_id);
    }
    
    public async onSolved(token: string): Promise<void> {
        try {
            this.ngZone.run(() => {
                this.busy = false;
                this.valueChange.emit(token);
            });
        } catch (err) {
            this.busy = false;
            this.appService.notifyError(err);
        }  
    }

    public onExpired(): void {
        this.ngZone.run(() => this.valueChange.emit(null));
    }

    public onOpened(): void {
        // nothing for now
    }    

    public onClosed(): void {
        this.ngZone.run(() => this.busy = false);
    }

    public onError(): void {
        this.ngZone.run(() => this.busy = false);
    }
}