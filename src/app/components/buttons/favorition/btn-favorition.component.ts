import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CGuideRepository } from "src/app/services/repositories/guide.repository";
import { CGuide } from "src/app/model/entities/guide";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";

@Component({
    selector: "btn-favorition",
    templateUrl: "btn-favorition.component.html",
    styleUrls: ["btn-favorition.component.scss"],
})
export class CBtnFavoritionComponent {
    @Input() public guide: CGuide;
    public loading: boolean = false;

    constructor(
        private appService: CAppService,
        private guideRepository: CGuideRepository,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public async onToggle(event: PointerEvent): Promise<void> {
        try {
            event.preventDefault();
            event.stopPropagation();   

            if (!this.loading) {
                const favorited = !this.guide.favorited;
                this.loading = true;
                await this.appService.pause(300);
                await this.guideRepository.updateFavorition({guide_id: this.guide.id, favorited});
                window.dispatchEvent(new Event("unviewed:reload")); // сообщение в кнопку "новое в гайдах"
                this.loading = false;
                this.guide.favorited = favorited;            
            }            
        } catch (err) {
            this.appService.notifyError(err);
            this.loading = false;
        }
    }    
}