import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CGuideRepository } from "src/app/services/repositories/guide.repository";
import { CGuide } from "src/app/model/entities/guide";
import { CPanelComponent } from "../panel.component";

@Component({
    selector: "panel-favorites",
    templateUrl: "panel-favorites.component.html",
    styleUrls: [
        "../panel.component.scss",
        "panel-favorites.component.scss"
    ],
})
export class CPanelFavoritesComponent extends CPanelComponent implements OnChanges, AfterViewInit {
    @ViewChild("container", {static: false}) protected containerRef: ElementRef;

    public guides: CGuide[] = null;
    protected part: number = 0;
    protected chunkLength: number = 20;
    protected sortBy: string = "created_at";
    protected sortDir: number = -1;
    protected exhausted: boolean = false;
    public loadingMore: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected guideRepository: CGuideRepository,
    )
    {
        super(appService);
    }

    get container(): HTMLElement {return this.containerRef.nativeElement;}
    get scrolledToBottom(): boolean {return this.container.scrollTop >= this.container.scrollHeight - this.container.offsetHeight - 100;}
    get canLoadMore(): boolean {return this.guides?.length /*важно,чтоб не было подгрузки до первой загрузки*/ && !this.loadingMore && !this.exhausted && this.scrolledToBottom;}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["active"].currentValue) {
            this.initGuides();
        }
    }

    public ngAfterViewInit(): void {
        this.container.addEventListener("scroll", this.onScroll.bind(this));
    }

    protected async initGuides(): Promise<void> {
        try {
            this.loadingMore = false; // можем прервать подгрузку
            this.guides = null;
            this.part = 0;
            // здесь я не храню started_at, как это обычно нужно сделать для предотвращения дублей, потому что среди этих сущностей не может появиться новая без участия этого же юзера
            await this.appService.pause(300);
            const chunk = await this.guideRepository.loadFavoritesChunk(this.part, this.chunkLength, this.sortBy, this.sortDir);
            this.guides = chunk.data;
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
            const chunk = await this.guideRepository.loadFavoritesChunk(this.part, this.chunkLength, this.sortBy, this.sortDir);
            if (!this.loadingMore) return; // подгрузка может быть прервана
            this.guides = [...this.guides, ...chunk.data];
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;
            this.loadingMore = false;
        } catch (err) {
            this.appService.notifyError(err);
            this.loadingMore = false;
        }
    }
}
