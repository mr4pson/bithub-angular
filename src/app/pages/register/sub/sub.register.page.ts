import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Timeout } from "src/app/decorators/timeout";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CUserRepository } from "src/app/services/repositories/user.repository";

// регистарция субаккаунта
@Component({
    selector: "sub-register-page",
    templateUrl: "sub.register.page.html",
})
export class CSubRegisterPage implements OnInit {
    public found: boolean = null;
    public children_exhausted: boolean = false;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private userRepository: CUserRepository,
        private route: ActivatedRoute,
    ) {}

    get words(): IWords {return this.appService.words;}      
    get lang(): ILang {return this.appService.lang.value;}  

    @Timeout(0)
    public ngOnInit(): void {
        this.authService.logout();
        this.initSEO();
        this.initParent();
    }

    private async initParent(): Promise<void> {
        try {
            await this.appService.pause(500);
            const statusCode = await this.userRepository.canBeParent(this.route.snapshot.params["uuid"]);
            
            if (statusCode === 200) {
                this.found = true;
                await this.appService.pause(500);
                this.appService.popupRegisterActive = true;
                return;
            }

            if (statusCode === 404) {
                this.found = false;
                return;
            }

            if (statusCode === 409) {
                this.found = true;
                await this.appService.pause(500);
                this.children_exhausted = true;
                return;
            }
            
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private initSEO(): void {
        this.appService.setTitle(this.words["register-sub"]?.["title"]?.[this.lang.slug]); 
    }
}