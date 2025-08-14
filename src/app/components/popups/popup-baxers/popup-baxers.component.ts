import { Component, HostListener, OnInit } from "@angular/core";
import { IBaxer } from "src/app/model/entities/baxer";
import { CAppService } from "src/app/services/app.service";
import { CBaxerRepository } from "src/app/services/repositories/baxer.repository";
import { CPopupBaxersService } from "./popup-baxers.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "popup-baxers",
    templateUrl: "popup-baxers.component.html",
    styleUrls: ["popup-baxers.component.scss"],
})
export class CPopupBaxersComponent implements OnInit {
    public active: boolean = false;
    public baxers: IBaxer[] = [];
    public dontShowIds: number[] = [];
    public step: number = 0;
    public unique: number = 0;

    constructor(
        private appService: CAppService,
        private baxerRepository: CBaxerRepository,
        private popupBaxersService: CPopupBaxersService,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    ngOnInit(): void {
        this.unique = this.appService.rndId();
        this.initBaxers();        
    }

    private async initBaxers(): Promise<void> {
        try {
            if (this.popupBaxersService.shown) return; // показываем один раз за время сессии            
            const baxers = await this.baxerRepository.loadAll();
            this.dontShowIds = this.getDontShowIds();

            // выбираем только те, которые не были заблокированы кнопкой "не показывать"
            for (let b of baxers) {
                if (!this.dontShowIds.includes(b.id)) {
                    this.baxers.push(b);
                }
            }

            this.active = this.baxers.length > 0;
            this.popupBaxersService.shown = true;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    /////////////////////
    // actions
    /////////////////////

    public onClose(): void {
        this.active = false;
    }

    public onBack(): void {
        this.step = this.step ? this.step - 1 : this.baxers.length - 1;
    }

    public onNext(): void {
        this.step = this.step < this.baxers.length - 1 ? this.step + 1 : 0;
    }

    @HostListener("mousedown", ["$event"])
    public onClick(event: PointerEvent): void {        
        if (this.active && !this.appService.pathHasIds(event.composedPath() as HTMLElement[], [`popup-${this.unique}`])) {
            this.onClose();
        }
    }

    public onDontShowChanged(baxer: IBaxer): void {        
        const index = this.dontShowIds.indexOf(baxer.id);

        if (baxer.dontShow) {
            index === -1 && this.dontShowIds.push(baxer.id); // добавляем, если такого еще не было в списке "не показывать"
        } else {
            index !== -1 && this.dontShowIds.splice(index, 1); // удаляем, если такой был в списке "не показывать"
        }

        localStorage.setItem("dsb", JSON.stringify(this.dontShowIds));
    }

    //////////////////
    // utils
    //////////////////

    private getDontShowIds(): number[] {
        const strIds = localStorage.getItem("dsb");
        return strIds ? JSON.parse(strIds) : [];
    }
}