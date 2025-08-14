import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { CProblem } from "src/app/model/entities/problem";
import { CAuthService } from "src/app/services/auth.service";
import { CAppService } from "src/app/services/app.service";
import { CUser } from "src/app/model/entities/user";
import { IKeyValue } from "src/app/model/keyvalue";
import { CProblemRepository } from "src/app/services/repositories/problem.repository";
import { TDeskMode } from "src/app/model/entities/desk";
import { CPopupComponent } from "src/app/components/popups/popup.component";

// редактирование внутри таскера как новых, так и существующих задач
@Component({
    selector: "popup-problem-edit",
    templateUrl: "popup-problem-edit.component.html",
    styleUrls: [
        "../../../../styles/forms.scss",
        "../../../../styles/popups.scss",
        "popup-problem-edit.component.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupProblemEditComponent extends CPopupComponent {
    @Input() public problem: CProblem;
    @Input() public mode: TDeskMode;
    @Output() private updateDesk: EventEmitter<void> = new EventEmitter();

    public errors: IKeyValue<string> = {};
    public saving: boolean = false;
    public saved: boolean = false;
    public deleting: boolean = false;
    public deleted: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected authService: CAuthService,
        protected problemRepository: CProblemRepository,
    )
    {
        super(appService);
    }

    get user(): CUser {return this.authService.user;} // компонент вставлен в шаблон так, что user в этот момент уже существует

    public override onClose(): void {
        super.onClose();
        this.errors = {};
    }

    public async onSave(): Promise<void> {
        try {
            if (!this.validate()) return;
            this.saving = true;
            await this.appService.pause(300);
            const f = this.problem.id ? "update" : "create";
            await this.problemRepository[f](this.problem);
            this.saving = false;
            this.saved = true;
            await this.appService.pause(1000);
            this.saved = false;
            this.onClose();
            this.updateDesk.emit();
        } catch (err) {
            this.saving = false;
            this.onClose();
            this.appService.notifyError(err);
        }
    }

    public async onDelete(): Promise<void> {
        try {
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;
            this.deleting = true;
            await this.appService.pause(300);
            await this.problemRepository.delete(this.problem.id);
            this.deleting = false;
            this.deleted = true;
            await this.appService.pause(1000);
            this.deleted = false;
            this.onClose();
            this.updateDesk.emit();
        } catch (err) {
            this.deleting = false;
            this.appService.notifyError(err);
        }
    }

    private validate(): boolean {
        let error = false;
        this.errors["user_id"] = null;
        this.errors["content"] = null;

        if (!this.problem.user_id) {
            this.errors["user_id"] = "required";
            error = true;
        }

        if (!this.problem.content.length) {
            this.errors["content"] = "required";
            error = true;
        }

        return !error;
    }
}
