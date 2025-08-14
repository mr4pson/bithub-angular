import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CGuide } from "src/app/model/entities/guide";
import { CSimplePage } from "src/app/pages/simple.page";
import { CAppService } from "src/app/services/app.service";
import { CGuideRepository } from "src/app/services/repositories/guide.repository";
import { CPageRepository } from "src/app/services/repositories/page.repository";
import { CListStatGuidesService } from "../services/list-statguides.service";
import { ISorting } from "src/app/model/sorting";

@Component({
    selector: "stats-page",
    templateUrl: "stats.page.html",
    styleUrls: ["stats.page.scss"],
})
export class CStatsPage extends CSimplePage implements OnInit {
    public guides: CGuide[] = null;
    public loading: boolean = false;
    public pagesQuantity: number = 0;
    private chunkLength: number = 12;
    public sortings: ISorting[] = [
        {name: "order-createdat-desc", sortBy: "created_at", sortDir: -1},
        {name: "order-createdat-asc", sortBy: "created_at", sortDir: 1},
    ];

    constructor(
        protected override appService: CAppService,
        protected listService: CListStatGuidesService,
        protected override pageRepository: CPageRepository,
        protected guideRepository: CGuideRepository,
        protected override route: ActivatedRoute,
        protected override router: Router,
    )
    {
        super(appService, pageRepository, route, router);
    }

    get sorting(): ISorting {return this.listService.sorting;}
    set sorting(v: ISorting) {this.listService.sorting = v;}
    get part(): number {return this.listService.part;}
    set part(v: number) {this.listService.part = v;}
    get favorites(): boolean {return this.listService.favorites;}
    set favorites(v: boolean) {this.listService.favorites = v;}
    get search(): string {return this.listService.search;}
    set search(v: string) {this.listService.search = v;}
    get filter(): any {return {search: this.search, favorites: this.favorites};}

    public async ngOnInit(): Promise<void> {
        this.initGuides();
        await this.initPage('stats');
        this.route.params.subscribe(p => this.initSEO());
    }

    public async initGuides(): Promise<void> {
        try {
            this.loading = true;
            await this.appService.pause(300);
            const chunk = await this.guideRepository.loadStatChunk(this.part, this.chunkLength, this.sorting.sortBy, this.sorting.sortDir, this.filter);

            if (this.part > 0 && !chunk.data.length) { // after deleting or updating may be current part is out of possible diapason
                this.part--;
                this.initGuides();
                return;
            }

            this.guides = chunk.data;
            this.pagesQuantity = chunk.pagesQuantity;
            this.loading = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onPartChange(): void {
        this.appService.win.scrollTop && this.appService.win.scrollTo({top: 0, behavior: "smooth"});
        this.initGuides();
    }

    public onSortingChange(): void {
        this.part = 0;
        this.initGuides();
    }

    public onFilterChange(): void {
        this.part = 0;
        this.initGuides();
    }

    public onSearchChange(): void {
        this.part = 0;
        this.initGuides();
    }
}