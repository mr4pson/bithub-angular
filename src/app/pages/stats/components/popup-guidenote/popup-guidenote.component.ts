import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CGuideNoteRepository } from "src/app/services/repositories/guide.note.repository";
import { IGuideNoteSave } from "src/app/model/dto/guide.note.save";
import { CGuide } from "src/app/model/entities/guide";
import { CPopupComponent } from "src/app/components/popups/popup.component";

@Component({
    selector: "popup-guidenote",
    templateUrl: "popup-guidenote.component.html",
    styleUrls: [
        "../../../../styles/forms.scss",
        "../../../../styles/popups.scss",
        "popup-guidenote.component.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupGuideNoteComponent extends CPopupComponent implements OnChanges {
    @Input() public guide: CGuide = null;
    public content: string = "";
    public loading: boolean = false;
    public done: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected guideNoteRepository: CGuideNoteRepository,
    )
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["guide"]) {
            this.content = this.guide?.note;
        }
    }

    public async onSave(): Promise<void> {
        try {
            this.loading = true;
            await this.appService.pause(300);
            const dto: IGuideNoteSave = {guide_id: this.guide.id, content: this.content};
            await this.guideNoteRepository.save(dto);
            this.guide.note = this.content;
            this.loading = false;
            this.done = true;
            await this.appService.pause(1000);
            this.done = false;
            this.onClose();
        } catch (err) {
            this.appService.notifyError(err);
            this.loading = false;
        }
    }
}