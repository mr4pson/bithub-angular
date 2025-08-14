import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CShopcatRepository } from "src/app/services/repositories/shopcat.repository";
import { IShopcat } from "src/app/model/entities/shopcat";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "list-shopcats",
    templateUrl: "list-shopcats.component.html",
    styleUrls: ["list-shopcats.component.scss"],
})
export class CListShopcatsComponent implements OnInit {
    @Input() public value: number = null;
    @Output() private valueChange: EventEmitter<number> = new EventEmitter();
    public shopcats: IShopcat[] = [];

    constructor(
        private appService: CAppService,
        private shopcatRepository: CShopcatRepository,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.initShopcats();
    }

    private async initShopcats(): Promise<void> {
        try {
            this.shopcats = await this.shopcatRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onSelect(id: number): void {
        this.valueChange.emit(id);
    }
}