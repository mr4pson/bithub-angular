import { Component, OnInit } from "@angular/core";
import { CSimplePage } from "../../simple.page";
import { CAppService } from "src/app/services/app.service";
import { CPageRepository } from "src/app/services/repositories/page.repository";
import { ActivatedRoute, Router } from "@angular/router";
import { CTaskerService } from "../services/tasker.service";
import { CAuthService } from "src/app/services/auth.service";
import { CUser } from "src/app/model/entities/user";
import { TDeskMode } from "src/app/model/entities/desk";

@Component({
    selector: "tasker-page",
    templateUrl: "tasker.page.html",
    styleUrls: ["tasker.page.scss"],
})
export class CTaskerPage extends CSimplePage implements OnInit {
    constructor(
        protected override appService: CAppService,
        protected authService: CAuthService,
        protected taskerService: CTaskerService,
        protected override  pageRepository: CPageRepository,
        protected override  route: ActivatedRoute,
        protected override  router: Router,
    )
    {
        super(appService, pageRepository, route, router);
    }

    get mode(): TDeskMode {return this.taskerService.mode;}
    get user(): CUser {return this.authService.user;}

    public async ngOnInit(): Promise<void> {
        await this.initPage('tasker');
        this.route.params.subscribe(p => this.initSEO());
    }
}