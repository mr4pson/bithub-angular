import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CSelectGenericComponent } from "../select-generic.component";
import { CTask } from "src/app/model/entities/task";
import { CAppService } from "src/app/services/app.service";
import { CGuideRepository } from "src/app/services/repositories/guide.repository";
import { CTaskRepository } from "src/app/services/repositories/task.repository";

@Component({
    selector: "select-task",
    templateUrl: "select-task.component.html",
    styleUrls: ["../../select.component.scss"],
})
export class CSelectTaskComponent extends CSelectGenericComponent<CTask> implements OnChanges {
    @Input() protected guide_id: number;

    constructor(
        protected override appService: CAppService,
        protected guideRepository: CGuideRepository,
        protected taskRepository: CTaskRepository,
    )
    {
        super(appService);
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        changes["guide_id"] && this.initItems();
    }

    protected async initCurrentItem(): Promise<void> {
        try {
            this.currentItem = this.currentValue ? await this.taskRepository.loadOne(this.currentValue) : null;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    protected async initItems(): Promise<void> {
        try {
            if (!this.guide_id) {
                this.items = [];
                return;
            }

            this.items = null;
            await this.appService.pause(300);
            const guide = await this.guideRepository.loadOne(this.guide_id);
            this.items = guide.tasks;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}