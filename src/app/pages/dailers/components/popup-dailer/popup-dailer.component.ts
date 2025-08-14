import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { CPopupComponent } from "src/app/components/popups/popup.component";
import { IDailer } from "src/app/model/entities/dailer";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAppService } from "src/app/services/app.service";
import { CDailerRepository } from "src/app/services/repositories/dailer.repository";

@Component({
    selector: "popup-dailer",
    templateUrl: "popup-dailer.component.html",
    styleUrls: [
        "../../../../styles/forms.scss",
        "../../../../styles/popups.scss",
        "popup-dailer.component.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupDailerComponent extends CPopupComponent {
    @Input() public dailer: IDailer;
    @Output() private dailerSaved: EventEmitter<void> = new EventEmitter();

    public errors: IKeyValue<string> = {};
    public saving: boolean = false;
    public saved: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected dailerRepository: CDailerRepository,
    )
    {
        super(appService);
    }

    public override onClose(): void {
        super.onClose();
        this.errors = {};
    }

    public async onSave(): Promise<void> {
        try {
            if (!this.validate()) return;
            this.saving = true;
            await this.appService.pause(300);
            const dailer = await this.dailerRepository.save(this.dailer);
            this.saving = false;
            this.saved = true;
            await this.appService.pause(1000);
            this.saved = false;
            this.onClose();
            this.dailerSaved.emit();
        } catch (err) {
            this.saving = false;
            this.onClose();
            this.appService.notifyError(err);
        }
    }

    private validate(): boolean {
        let error = false;
        this.errors["name"] = null;

        if (!this.dailer.name) {
            this.errors["name"] = "required";
            error = true;
        }

        return !error;
    }
}