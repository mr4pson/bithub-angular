import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { IDeskProblem, TDeskMode } from "src/app/model/entities/desk";
import { ILang } from "src/app/model/entities/lang";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";

@Component({
    selector: "desk-problem",
    templateUrl: "desk-problem.component.html",
    styleUrls: ["desk-problem.component.scss"],
})
export class CDeskProblemComponent {
    @Input() public problem: IDeskProblem;
    @Input() public mode: TDeskMode;
    @Input() public loading: boolean = false;
    @Input() public deleting: boolean = false;
    @Output() private editProblem: EventEmitter<void> = new EventEmitter();
    @Output() private viewProblem: EventEmitter<void> = new EventEmitter();
    @Output() private deleteProblem: EventEmitter<void> = new EventEmitter();

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
    ) {}

    get user(): CUser {return this.authService.user;}
    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public onEdit(): void {
        this.editProblem.emit();
    }

    public onView(): void {
        this.problem.has_unviewed_comments = false;
        this.viewProblem.emit();
    }

    public onDelete(): void {
        this.deleteProblem.emit();
    }

    public onDragStart(event: DragEvent): void {
        event.dataTransfer.setData("text", JSON.stringify(this.problem));
        window.dispatchEvent(new CustomEvent("problem:dragstart", {detail: {from: this.problem.desk_id}}));
    }

    public onDragEnd(event: DragEvent): void {
        window.dispatchEvent(new Event("problem:dragend"));
    }    
}
