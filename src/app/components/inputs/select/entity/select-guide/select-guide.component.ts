import { Component } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CSelectEndlessComponent } from "../select-endless.component";
import { CGuideRepository } from "src/app/services/repositories/guide.repository";
import { CGuide } from "src/app/model/entities/guide";

@Component({
    selector: "select-guide",
    templateUrl: "select-guide.component.html",
    styleUrls: ["../../select.component.scss"],
})
export class CSelectGuideComponent extends CSelectEndlessComponent<CGuide> {
    protected override sortBy: string = "created_at";
    protected override sortDir: number = -1;

    constructor(
        protected override appService: CAppService,
        protected guideRepository: CGuideRepository,
    )
    {
        super(appService);
    }

    protected async initCurrentItem(): Promise<void> {
        try {
            this.currentItem = this.currentValue ? await this.guideRepository.loadOne(this.currentValue) : null;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    protected async initItems(): Promise<void> {
        try {
            this.loadingMore = false; // можем прервать подгрузку
            this.items = null;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной прокрутке при добавлении новых элементов после момента, когда первый кусок загружен
            await this.appService.pause(300);
            const filter = {search: this.search};
            const chunk = await this.guideRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);
            this.items = chunk.data;
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    protected async onScroll(): Promise<void> {
        try {
            if (!this.canLoadMore) return;
            this.loadingMore = true;
            this.part++;
            const filter = {created_at_less: this.started_at, search: this.search};
            const chunk = await this.guideRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);
            if (!this.loadingMore) return; // подгрузка может быть прервана
            this.items = [...this.items, ...chunk.data];
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;
            this.loadingMore = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}