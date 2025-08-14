import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ILang } from "src/app/model/entities/lang";
import { IUserEnterByToken } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CGoogleService } from "src/app/services/google.service";
import { CAuthGuard } from "src/app/services/guards/auth.guard";

@Component({
    selector: "google-entered-page",
    templateUrl: "google-entered.page.html",
})
export class CGoogleEnteredPage implements OnInit {
    constructor(
        private appService: CAppService,        
        private googleService: CGoogleService,
        private authService: CAuthService,  
        private authGuard: CAuthGuard,
        private router: Router,       
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.enter();
    }

    private async enter(): Promise<void> {
        try {
            const token = this.googleService.getToken();
            const dto: IUserEnterByToken = {type: "Google", lang_id: this.lang.id, token};
            const statusCode = await this.authService.enterByToken(dto);

            if ([200,201].includes(statusCode)) {
                const url = this.authGuard.getBlockedUrl() || `/${this.lang.slug}/account`;
                this.router.navigateByUrl(url);                   
                return;     
            }

            if (statusCode === 402) {
                this.appService.notifyError(this.words['errors']?.['denied']?.[this.lang.slug]);    
                this.router.navigateByUrl(`/${this.lang.slug}`);                   
                return;
            }

            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
            this.router.navigateByUrl(`/${this.lang.slug}`);
        } catch (err) {
            this.appService.notifyError(err);
            this.router.navigateByUrl(`/${this.lang.slug}`);
        }
    }
}
