import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CPanelComponent } from "../panel.component";
import { CTaskRepository } from "src/app/services/repositories/task.repository";
import { CPanelUnviewedService } from "./panel-unviewed.service";
import { CTask } from "src/app/model/entities/task";

@Component({
    selector: "panel-unviewed",
    templateUrl: "panel-unviewed.component.html",
    styleUrls: [
        "../panel.component.scss",
        "panel-unviewed.component.scss"
    ],
})
export class CPanelUnviewedComponent extends CPanelComponent implements OnChanges, AfterViewInit {
    @ViewChild("container", {static: false}) protected containerRef: ElementRef;

    public tasks: CTask[] = null;
    protected part: number = 0;
    protected chunkLength: number = 20;
    protected sortBy: string = "created_at";
    protected sortDir: number = -1;
    protected exhausted: boolean = false;
    public loadingMore: boolean = false;
    private started_at: Date = null;
    public viewing: boolean = false;
    public viewed: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected panelService: CPanelUnviewedService,
        protected taskRepository: CTaskRepository,
    )
    {
        super(appService);
    }

    get favorites(): boolean {return this.panelService.favorites;}
    set favorites(v: boolean) {this.panelService.setFavorites(v);}
    get container(): HTMLElement {return this.containerRef.nativeElement;}
    get scrolledToBottom(): boolean {return this.container.scrollTop >= this.container.scrollHeight - this.container.offsetHeight - 100;}
    get canLoadMore(): boolean {return this.tasks?.length /*важно,чтоб не было подгрузки до первой загрузки*/ && !this.loadingMore && !this.exhausted && this.scrolledToBottom;}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["active"].currentValue) {
            this.initTasks();
        }
    }

    public ngAfterViewInit(): void {
        this.container.addEventListener("scroll", this.onScroll.bind(this));
    }

    public async initTasks(): Promise<void> {
        try {
            this.loadingMore = false; // можем прервать подгрузку
            this.tasks = null;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной прокрутке при добавлении новых элементов после момента, когда первый кусок загружен
            const filter = {favorites: this.favorites};
            await this.appService.pause(300);
            const chunk = await this.taskRepository.loadUnviewedChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);
            this.tasks = chunk.data;
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
            const filter = {created_at_less: this.started_at, favorites: this.favorites};
            const chunk = await this.taskRepository.loadUnviewedChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);
            if (!this.loadingMore) return; // подгрузка может быть прервана
            this.tasks = [...this.tasks, ...chunk.data];
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;
            this.loadingMore = false;
        } catch (err) {
            this.appService.notifyError(err);
            this.loadingMore = false;
        }
    }

    public async onViewed(): Promise<void> {
        try {
            this.loadingMore = false;
            this.viewing = true;
            await this.appService.pause(300);
            const guideIds = await this.taskRepository.viewed({favorites: this.favorites});
            window.dispatchEvent(new Event("unviewed:reload")); // сообщение в кнопку "новое в гайдах"
            guideIds.forEach(id => window.dispatchEvent(new Event(`unviewed:unset:${id}`))); // сообщение в плашки гайдов
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

    public onFavoritesChange(): void {
        this.initTasks();
        window.dispatchEvent(new Event("unviewed:reload")); // сообщение в кнопку "новое в гайдах"
    }
}
