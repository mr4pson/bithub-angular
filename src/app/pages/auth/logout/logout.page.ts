import { Component, OnInit } from "@angular/core";
import { CAuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { ILang } from "src/app/model/entities/lang";
import { CAppService } from "src/app/services/app.service";
import { Timeout } from "src/app/decorators/timeout";

@Component({
    selector: "logout-page",
    template: "",
})
export class CLogoutPage implements OnInit {
    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private router: Router,        
    ) {}

    get lang(): ILang {return this.appService.lang.value;}

    @Timeout(0)
    public async ngOnInit(): Promise<void> {                
        this.authService.logout();            
        this.router.navigateByUrl(`/${this.lang.slug}`);
    }
}