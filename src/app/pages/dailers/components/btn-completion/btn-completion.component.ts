import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { IDailer } from "src/app/model/entities/dailer";
import { CDailerRepository } from "src/app/services/repositories/dailer.repository";

@Component({
    selector: "btn-completion",
    templateUrl: "btn-completion.component.html",
    styleUrls: ["btn-completion.component.scss"],
})
export class CBtnCompletionComponent {
    @Input() public dailer: IDailer;
    public loading: boolean = false;

    constructor(
        private appService: CAppService,
        private dailerRepository: CDailerRepository,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public async onToggle(): Promise<void> {
        try {
            if (this.loading) return;                        
            this.loading = true;
            this.dailer.completed = !this.dailer.completed;
            await this.appService.pause(300);
            await this.dailerRepository.save(this.dailer);
            this.loading = false;
        } catch (err) {
            this.appService.notifyError(err);
            this.loading = false;
        }
    }    
}