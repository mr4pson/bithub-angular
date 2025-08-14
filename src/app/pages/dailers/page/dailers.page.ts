import { Component, OnInit } from "@angular/core";
import { CSimplePage } from "../../simple.page";
import { IDailer } from "src/app/model/entities/dailer";
import { CDailerRepository } from "src/app/services/repositories/dailer.repository";
import { CPageRepository } from "src/app/services/repositories/page.repository";
import { CAppService } from "src/app/services/app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CListDailersService } from "../services/list-dailers.service";

@Component({
    selector: "dailers-page",
    templateUrl: "dailers.page.html",
    styleUrls: ["dailers.page.scss"],
})
export class CDailersPage extends CSimplePage implements OnInit {
    // list
    public dailers: IDailer[] = null;
    public loading: boolean = false;
    public pagesQuantity: number = 0;
    private chunkLength: number = 20;
    // edit/create
    public editDailer: IDailer = null;
    public editDailerPopupActive: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected listService: CListDailersService,
        protected override pageRepository: CPageRepository,
        protected dailerRepository: CDailerRepository,
        protected override route: ActivatedRoute,
        protected override router: Router,
    )
    {
        super(appService, pageRepository, route, router);
    }

    get part(): number {return this.listService.part;}
    set part(v: number) {this.listService.part = v;}

    ///////////////////
    // init
    ///////////////////

    public async ngOnInit(): Promise<void> {
        this.initDailers();
        await this.initPage('dailers');
        this.route.params.subscribe(p => this.initSEO());
    }

    public async initDailers(): Promise<void> {
        try {
            this.loading = true;
            await this.appService.pause(300);
            const chunk = await this.dailerRepository.loadChunk(this.part, this.chunkLength, "id", 1);

            if (this.part > 0 && !chunk.data.length) { // after deleting or updating may be current part is out of possible diapason
                this.part--;
                this.initDailers();
                return;
            }

            this.dailers = chunk.data;
            this.pagesQuantity = chunk.pagesQuantity;
            this.loading = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    /////////////////
    // actions
    /////////////////

    public onEdit(i: number = null): void {
        this.editDailer = i !== null ? window.structuredClone(this.dailers[i]) : {name: "", link: "", comment: ""};
        this.editDailerPopupActive = true;
    }

    public async onDelete(i: number): Promise<void> {
        try {
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;
            this.loading = true;
            await this.dailerRepository.delete(this.dailers[i].id);
            this.initDailers();
        } catch (err) {
            this.loading = false;
            this.appService.notifyError(err);
        }
    }

    public onPartChange(): void {
        this.appService.win.scrollTop && this.appService.win.scrollTo({top: 0, behavior: "smooth"});
        this.initDailers();
    }
}
