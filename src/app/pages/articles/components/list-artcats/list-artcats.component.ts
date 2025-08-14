import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CArtcatRepository } from "src/app/services/repositories/artcat.repository";
import { IArtcat } from "src/app/model/entities/artcat";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "list-artcats",
    templateUrl: "list-artcats.component.html",
    styleUrls: ["list-artcats.component.scss"],
})
export class CListArtcatsComponent implements OnInit {
    @Input() public value: number = null;
    @Output() private valueChange: EventEmitter<number> = new EventEmitter();
    public artcats: IArtcat[] = [];

    constructor(
        private appService: CAppService,
        private artcatRepository: CArtcatRepository,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.initArtcats();
    }

    private async initArtcats(): Promise<void> {
        try {
            this.artcats = await this.artcatRepository.loadAll();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onSelect(id: number): void {
        this.valueChange.emit(id);
    }
}