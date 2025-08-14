import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CPageRepository } from "src/app/services/repositories/page.repository";
import { ActivatedRoute, Router } from "@angular/router";
import { CDropRepository } from "src/app/services/repositories/drop.repository";
import { ISorting } from "src/app/model/sorting";
import { CSimplePage } from "src/app/pages/simple.page";
import { IDrop } from "src/app/model/entities/drop";
import { CListDropsService } from "../services/list-drops.service";

@Component({
    selector: "drops-page",
    templateUrl: "drops.page.html",
    styleUrls: ["drops.page.scss"],
})
export class CDropsPage extends CSimplePage implements OnInit {
    public drops: IDrop[] = null;
    public loading: boolean = false;
    public pagesQuantity: number = 0;
    private chunkLength: number = 10;
    public sortings: ISorting[] = [
        {name: "order-date-desc", sortBy: "id", sortDir: -1},
        {name: "order-date-asc", sortBy: "id", sortDir: 1},
    ];

    constructor(
        protected override appService: CAppService,
        protected listService: CListDropsService,
        protected dropRepository: CDropRepository,
        protected override pageRepository: CPageRepository,
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

    public async ngOnInit(): Promise<void> {
        this.initDrops();
        await this.initPage('drops');
        this.route.params.subscribe(p => this.initSEO());
    }

    public async initDrops(): Promise<void> {
        try {
            this.loading = true;
            await this.appService.pause(300);
            const chunk = await this.dropRepository.loadChunk(this.part, this.chunkLength, this.sorting.sortBy, this.sorting.sortDir, {});

            if (this.part > 0 && !chunk.data.length) { // after deleting or updating may be current part is out of possible diapason
                this.part--;
                this.initDrops();
                return;
            }

            this.drops = chunk.data;
            this.pagesQuantity = chunk.pagesQuantity;
            this.loading = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onPartChange(): void {
        this.appService.win.scrollTop && this.appService.win.scrollTo({top: 0, behavior: "smooth"});
        this.initDrops();
    }

    public onSortingChange(): void {
        this.part = 0;
        this.initDrops();
    }
}
