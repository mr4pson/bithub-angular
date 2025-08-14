import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IShopitem } from "src/app/model/entities/shopitem";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CShopitemRepository } from "src/app/services/repositories/shopitem.repository";

@Component({
    selector: "item-shop-page",
    templateUrl: "item.shop.page.html",
    styleUrls: ["item.shop.page.scss"],
})
export class CItemShopPage {
    public shopitem: IShopitem = null;
    public shoporderPopupActive: boolean = false;

    constructor(
        private appService: CAppService,
        private shopitemRepository: CShopitemRepository,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
    get content(): string {return this.shopitem.content[this.lang.slug];}
    get img(): string {return this.shopitem.img;}
    get title(): string {return this.shopitem.name[this.lang.slug];}
    get h1(): string {return this.shopitem.name[this.lang.slug];}
    get date(): string {return this.shopitem.date;}
    get price(): number {return this.shopitem.price;}

    public async ngOnInit(): Promise<void> {
        this.route.params.subscribe(async p => {
            await this.initShopitem(parseInt(p["id"]));
            this.initSEO();
        });
    }

    private async initShopitem(id: number): Promise<void> {
        try {
            if (id === this.shopitem?.id) return;
            this.shopitem = null;
            await this.appService.pause(300);
            this.shopitem = await this.shopitemRepository.loadOne(id);
        } catch (err) {
            err === 404 ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`) : this.appService.notifyError(err);
        }
    }

    private initSEO(): void {
        this.appService.setTitle(this.title);
        this.appService.setMeta("name", "description", "");
    }

    public onOrder(): void {
        this.shoporderPopupActive = true;
    }
}