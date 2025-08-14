import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CCatRepository } from "src/app/services/repositories/cat.repository";
import { ICat } from "src/app/model/entities/cat";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "list-cats",
    templateUrl: "list-cats.component.html",
    styleUrls: ["list-cats.component.scss"],
})
export class CListCatsComponent implements OnInit {
    @Input() public value: number = null;
    @Output() private valueChange: EventEmitter<number> = new EventEmitter();
    public cats: ICat[] = [];

    constructor(
        private appService: CAppService,
        private catRepository: CCatRepository,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.initCats();
    }

    private async initCats(): Promise<void> {
        try {
            this.cats = await this.catRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onSelect(id: number): void {
        this.valueChange.emit(id);
    }
}