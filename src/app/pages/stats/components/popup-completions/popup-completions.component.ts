import { Component, Input, OnChanges, ViewEncapsulation } from "@angular/core";
import { CPopupComponent } from "src/app/components/popups/popup.component";
import { ICompletion } from "src/app/model/entities/completion";
import { CGuide } from "src/app/model/entities/guide";
import { CAppService } from "src/app/services/app.service";
import { CGuideRepository } from "src/app/services/repositories/guide.repository";

@Component({
    selector: "popup-completions",
    templateUrl: "popup-completions.component.html",
    styleUrls: [
        "../../../../styles/popups.scss",
        "popup-completions.component.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupCompletionsComponent extends CPopupComponent implements OnChanges {
    @Input() public guide: CGuide;
    public completions: ICompletion[] = null;

    constructor(
        protected override appService: CAppService,
        protected guideRepostitory: CGuideRepository,
    )
    {
        super(appService);
    }

    ngOnChanges(): void {
        this.initCompletions();
    }

    private async initCompletions(): Promise<void> {
        try {
            this.completions = null;
            if (!this.guide) return;
            await this.appService.pause(300);
            this.completions = await this.guideRepostitory.loadStatCompletions(this.guide.id);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
