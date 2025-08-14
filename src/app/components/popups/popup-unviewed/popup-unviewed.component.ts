import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { CPopupComponent } from "../popup.component";
import { CAppService } from "src/app/services/app.service";
import { CTaskRepository } from "src/app/services/repositories/task.repository";
import { CTask } from "src/app/model/entities/task";
import { Router } from "@angular/router";

@Component({
    selector: "popup-unviewed",
    templateUrl: "popup-unviewed.component.html",
    styleUrls: [
        "../../../styles/popups.scss",
        "popup-unviewed.component.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupUnviewedComponent extends CPopupComponent implements OnChanges {
    @Input() public guide_id: number = null;

    public tasks: CTask[] = null;
    protected sortBy: string = "created_at";
    protected sortDir: number = -1;
    public viewing: boolean = false;
    public viewed: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected taskRepository: CTaskRepository,
        protected router: Router,
    )
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["active"]?.currentValue) { // именно по смене active, не guide_id, т.к. может появиться обновление, появится колокольчик через сокетное сообщение, а guide_id может и не поменяться
            this.initTasks();
        }
    }

    private async initTasks(): Promise<void> {
        try {
            this.tasks = null;
            const chunk = await this.taskRepository.loadUnviewedChunk(0, 999, this.sortBy, this.sortDir, {guide_id: this.guide_id}); // нет смысла делать подгрузку, их тут в пределах пары десятков, на самом деле
            this.tasks = chunk.data;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public async onTaskClick(i: number): Promise<void> {
        this.onClose();
        await this.appService.pause(300);
        this.router.navigateByUrl(`/${this.lang.slug}/guide/${this.guide_id}?task=${this.tasks[i].id}`);
    }

    public async onViewed(): Promise<void> {
        try {
            this.viewing = true;
            await this.appService.pause(300);
            const guideIds = await this.taskRepository.viewed({guide_id: this.guide_id});
            window.dispatchEvent(new Event("unviewed:reload")); // сообщение в кнопку "новое в гайдах"
            window.dispatchEvent(new Event(`unviewed:unset:${guideIds[0]}`)); // сообщение в плашку гайда
            this.viewing = false;
            this.viewed = true;
            await this.appService.pause(1000);
            this.viewed = false;
            this.onClose();
        } catch (err) {
            this.appService.notifyError(err);
            this.viewing = false;
        }
    }
}
