import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { IDesk, TDeskMode } from "src/app/model/entities/desk";
import { ILang } from "src/app/model/entities/lang";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CDeskRepository } from "src/app/services/repositories/desk.repository";

@Component({
    selector: "list-desks",
    templateUrl: "list-desks.component.html",
    styleUrls: ["list-desks.component.scss"],
})
export class CListDesksComponent implements OnChanges {
    @Input() public mode: TDeskMode;
    public desks: IDesk[] = null;

    constructor(
        private deskRepository: CDeskRepository,
        private appService: CAppService,
        private authService: CAuthService,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    get user(): CUser {return this.authService.user;}

    public ngOnChanges(changes: SimpleChanges): void {
        this.initDesks();
    }

    private async initDesks(): Promise<void> {
        try {
            this.desks = null;
            await this.appService.pause(300);
            this.desks = await this.deskRepository.loadAll(this.mode);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onDelete(i: number): void {
        this.desks.splice(i, 1);
    }

    public onCreate(desk: IDesk): void {
        this.desks.push(desk);
    }    
}
