import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { IDesk, IDeskProblem, TDeskMode } from "src/app/model/entities/desk";
import { ILang } from "src/app/model/entities/lang";
import { CProblem } from "src/app/model/entities/problem";
import { IProblemComment } from "src/app/model/entities/problem.comment";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CDeskRepository } from "src/app/services/repositories/desk.repository";
import { CProblemRepository } from "src/app/services/repositories/problem.repository";
import { CSocketService } from "src/app/services/socket.service";

@Component({
    selector: "the-desk",
    templateUrl: "desk.component.html",
    styleUrls: ["desk.component.scss"],
})
export class CDeskComponent implements OnInit, OnDestroy {
    @Input() public desk: IDesk;
    @Input() public mode: TDeskMode;
    private lid: number = null;        

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private socketService: CSocketService,
        private deskRepository: CDeskRepository,
        private problemRepository: CProblemRepository,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    get user(): CUser {return this.authService.user;}
    get editable(): boolean {return this.mode === "private" || !this.user.parent_id;}

    public ngOnInit(): void {
        this.lid = this.socketService.on("problem-comment", data => this.onComment(data));  
        window.addEventListener("problem:dragstart", this.onProblemDragStart.bind(this));
        window.addEventListener("problem:dragend", this.onProblemDragEnd.bind(this));
        window.addEventListener(`problem:remove:from:${this.desk.id}`, this.onRemoveProblem.bind(this));
    }

    public ngOnDestroy(): void {
        this.socketService.off([this.lid]);
        window.removeEventListener("problem:dragstart", this.onProblemDragStart);
        window.removeEventListener("problem:dragend", this.onProblemDragEnd);
        window.removeEventListener(`problem:remove:from:${this.desk.id}`, this.onRemoveProblem);
    }

    /////////////////////////
    // desk edition
    /////////////////////////

    @Output() private deskDeleted: EventEmitter<void> = new EventEmitter();
    public edit: boolean = false;
    public updating: boolean = false;
    public deleting: boolean = false;
    private prevName: string = "";

    public async onEdit(): Promise<void> {
        this.prevName = this.desk.name;
        this.edit = true;
        const input = await this.appService.getElementById(`desknameinput-${this.desk.id}`);
        input.focus();
    }

    public onNameKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
			event.preventDefault();
			this.onUpdate();
		}
    }

    public async onUpdate(): Promise<void> {
        try {
            this.updating = true;
            await this.appService.pause(300);
            await this.deskRepository.update(this.desk);
            this.updating = false;
            this.edit = false;
        } catch (err) {
            this.updating = false;
            this.appService.notifyError(err);
        }
    }

    public async onDelete(): Promise<void> {
        try {
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;
            this.deleting = true;
            await this.appService.pause(300);
            await this.deskRepository.delete(this.desk.id);
            this.deskDeleted.emit();
            this.deleting = false;
        } catch (err) {
            this.deleting = false;
            this.appService.notifyError(err);
        }
    }

    @HostListener("window:click", ["$event"])
    private onClick(event: PointerEvent): void {
        if (this.edit && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`desknameinput-${this.desk.id}`, `desknameupdate-${this.desk.id}`, `desknameedit-${this.desk.id}`])) {
            this.edit = false;
            this.desk.name = this.prevName;
        }
    }

    /////////////////////
    // problem edition
    ////////////////////

    public editProblem: CProblem = null;
    public editProblemPopupActive: boolean = false;
    public editProblemLoadingIndex: number = null;
    public editProblemDeletingIndex: number = null;
    public reloading: boolean = false;

    public onAddProblem(): void {
        const user_id = this.mode === "private" ? this.user.id : null;
        this.editProblem = new CProblem().init(this.desk.id, user_id);
        this.editProblemPopupActive = true;
    }

    public async onEditProblem(i: number): Promise<void> {
        try {
            this.editProblemLoadingIndex = i;
            await this.appService.pause(300);
            this.editProblem = await this.problemRepository.loadOneEditable(this.desk.problems[i].id);
            this.editProblemPopupActive = true;
            this.editProblemLoadingIndex = null;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public async onDeleteProblem(i: number): Promise<void> {
        try {
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;
            this.editProblemDeletingIndex = i;
            await this.appService.pause(300);
            await this.problemRepository.delete(this.desk.problems[i].id);
            this.onUpdateDesk();
            this.editProblemDeletingIndex = null;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public async onUpdateDesk(): Promise<void> {
        try {
            this.reloading = true;
            await this.appService.pause(300);
            this.desk = await this.deskRepository.loadOne(this.desk.id);
            this.reloading = false;
        } catch (err) {
            this.reloading = false;
            this.appService.notifyError(err);
        }
    }

    ////////////////////
    // problem viewing
    ////////////////////

    public viewProblemId: number = null;
    public viewProblemPopupActive: boolean = false;

    public onViewProblem(i: number): void {
        this.viewProblemId = this.desk.problems[i].id;
        this.viewProblemPopupActive = true;
    }    

    ///////////////////
    // messages
    ///////////////////

    private async onComment(data: IProblemComment): Promise<void> {
        try {
            // это сообщение не по той задаче, которая сейчас просматривается
            if (data.problem_id !== this.viewProblemId) { 
                const problem = this.desk.problems.find(p => p.id === data.problem_id);
                problem && (problem.has_unviewed_comments = true);
                return;
            } 
        
            // это сообщение по той задаче, которая сейчас просматривается
            // поскольку мы сейчас смотрим эту задачу и видим эти сообщения, то обновим дату просмотра задачи, чтобы потом это сообщение не считалось новым
            await this.problemRepository.updateViewing(data.problem_id);
        } catch (err) {
            this.appService.notifyError(err);
        }        
    }

    ///////////////////
    // drag'n'drop
    ///////////////////

    public dropable: boolean = false;
    public drop2me: boolean = false;

    private onProblemDragStart(event: CustomEvent): void {
        if (event.detail.from !== this.desk.id) {
            this.dropable = true;
        }        
    }

    private onProblemDragEnd(): void {
        this.dropable = false;
    }

    public onDragOver(event: DragEvent): void {
        event.preventDefault(); // by default we can't drop, cancel this behavior  
        event.stopPropagation();      
    }

    public onDragEnter(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.drop2me = true;
    }

    public onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.drop2me = false;
    }

    public async onDrop(event: DragEvent): Promise<void> {
        try {
            event.preventDefault();
            event.stopPropagation();
            this.drop2me = false;
            const problem = JSON.parse(event.dataTransfer.getData("text")) as IDeskProblem;
            // Манипуляции с досками и списками задач было бы удобнее вынести на уровень выше, и там из одной доски удалить, в другую добавить, 
            // однако выяснилось, что angular не всегда ловит изменения в массиве (типа splice) во вложенных компонентах (у нас на уровень выше есть массив досок, на этом уровне массив задач, по которому строятся компоненты этих задач, на каком-то уровне происходит затык).
            // Поэтому остаемся на этом уровне, одна доска получает новую задачу, и дает команду другой доске удалить задачу.
            const old_desk_id = problem.desk_id;
            problem.desk_id = this.desk.id;
            this.desk.problems.push(problem);
            this.desk.problems.sort((a, b) => a.created_at.localeCompare(b.created_at));
            window.dispatchEvent(new CustomEvent(`problem:remove:from:${old_desk_id}`, {detail: {problem_id: problem.id}}));
            window.dispatchEvent(new Event("problem:dragend"));
            await this.problemRepository.updateDesk({problem_id: problem.id, desk_id: problem.desk_id});
        } catch (err) {
            this.appService.notifyError(err);
        }        
    }

    public onRemoveProblem(event: CustomEvent): void {
        const index = this.desk.problems.findIndex(p => p.id === event.detail.problem_id);
        this.desk.problems.splice(index, 1);
    }
}
