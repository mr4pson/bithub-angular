import { Component, Input, OnInit } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CTaskRepository } from "src/app/services/repositories/task.repository";
import { CPanelUnviewedService } from "../../panels/panel-unviewed/panel-unviewed.service";

@Component({
    selector: "btn-unviewed",
    templateUrl: "btn-unviewed.component.html",
})
export class CBtnUnviewedComponent implements OnInit {
    @Input() public active: boolean = false;
    public q: number = 0;

    constructor(
        private taskRepository: CTaskRepository,
        private appService: CAppService,
        private panelService: CPanelUnviewedService,
    ) {}

    get favorites(): boolean {return this.panelService.favorites;}

    public ngOnInit(): void {
        this.initQ();
        window.addEventListener("unviewed:reload", this.initQ.bind(this));
    }    

    private async initQ(): Promise<void> {
        try {
            this.q = await this.taskRepository.unviewedQuantity(this.favorites);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
