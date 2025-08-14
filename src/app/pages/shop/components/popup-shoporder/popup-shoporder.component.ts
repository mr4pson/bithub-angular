import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAppService } from "src/app/services/app.service";
import { IShoporderCreate } from "src/app/model/dto/shoporder.create";
import { CShoporderRepository } from "src/app/services/repositories/shoporder.repository";
import { CPopupComponent } from "src/app/components/popups/popup.component";

@Component({
    selector: "popup-shoporder",
    templateUrl: "popup-shoporder.component.html",
    styleUrls: [
        "../../../../styles/popups.scss",
        "../../../../styles/forms.scss",
    ],
})
export class CPopupShoporderComponent extends CPopupComponent implements OnChanges {
    @Input() public shopitem_id: number;

    public tg: string = "";
    public comment: string = "";
    public errors: IKeyValue<string> = {};
    public sending: boolean = false;
    public sent: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected shoporderRepository: CShoporderRepository,
    )
    {
        super(appService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        changes["active"] && !this.active && this.reset();
    }

    private reset(): void {
        this.comment = "";
        this.sending = this.sent = false;
        this.errors = {};
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validate()) return;
            this.sending = true;
            await this.appService.pause(300);
            const dto: IShoporderCreate = {shopitem_id: this.shopitem_id, tg: this.tg, comment: this.comment};
            await this.shoporderRepository.create(dto);
            this.sending = false;
            this.sent = true;
        } catch (err) {
            this.appService.notifyError(err);
            this.sending = false;
        }
    }

    private validate(): boolean {
        let error = false;
        // maybe later
        return !error;
    }
}