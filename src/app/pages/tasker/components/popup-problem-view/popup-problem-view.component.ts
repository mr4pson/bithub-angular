import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { CProblem } from "src/app/model/entities/problem";
import { CAppService } from "src/app/services/app.service";
import { CProblemRepository } from "src/app/services/repositories/problem.repository";
import { CAuthService } from "src/app/services/auth.service";
import { CUser } from "src/app/model/entities/user";
import { TDeskMode } from "src/app/model/entities/desk";
import { CPopupComponent } from "src/app/components/popups/popup.component";

@Component({
    selector: "popup-problem-view",
    templateUrl: "popup-problem-view.component.html",
    styleUrls: [
        "../../../../styles/popups.scss",
        "popup-problem-view.component.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupProblemViewComponent extends CPopupComponent implements OnChanges {
    @Input() public id: number;
    @Input() public mode: TDeskMode;
    @Output() private idChange: EventEmitter<number> = new EventEmitter();

    public problem: CProblem = null;

    constructor(
        protected override appService: CAppService,
        protected authService: CAuthService,
        protected problemRepository: CProblemRepository,
    )
    {
        super(appService);
    }

    get user(): CUser {return this.authService.user;}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["active"].currentValue) { // именно при активации, потому что problem_id может не поменяться, а перезагрузить надо, потому что изменения уже внесены
            this.initProblem();
        }
    }

    protected async initProblem(): Promise<void> {
        try {
            this.problem = null;
            if (!this.id) return;
            this.problem = await this.problemRepository.loadOneViewable(this.id);
            this.problem.content = this.problem.content?.replace(/\n/g, "<br>");
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public override onClose(): void {
        super.onClose();
        this.idChange.emit(null);
    }
}
