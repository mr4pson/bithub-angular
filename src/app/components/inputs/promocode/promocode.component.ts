import { Component, EventEmitter, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CPromocodeRepository } from "src/app/services/repositories/promocode.repository";
import { ILang } from "src/app/model/entities/lang";
import { IPromocode } from "src/app/model/entities/promocode";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "promo-code",
    templateUrl: "promocode.component.html",
    styleUrls: ["promocode.component.scss"],
})
export class CPromocodeComponent {
    public code: string = "";
    public loading: boolean = false;
    public applied: boolean = false;
    public error: boolean = false;
    @Output() private promocodeLoaded: EventEmitter<IPromocode> = new EventEmitter();

    constructor(
        private appService: CAppService,
        private promocodeRepository: CPromocodeRepository,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public onSubmit(): void {
        this.applied ? this.reset() : this.apply();
    }
   
    public async apply(): Promise<void> {
        try {
            if (!this.code.length) return;
            this.error = false;
            this.loading = true;
            const promocode = await this.promocodeRepository.loadOne(this.code);            
            this.promocodeLoaded.emit(promocode);
            this.loading = false;
            this.applied = true;
        } catch (err) {
            this.loading = false;
            err === 409 ? (this.error = true) : this.appService.notifyError(err);
        }
    }

    public reset(): void {
        this.code = "";
        this.applied = false;
        this.promocodeLoaded.emit(null);
    }
}