import { Component, Input } from "@angular/core";
import { ISubscriptionTariff } from "src/app/model/entities/subscription.tariff";
import { CAppService } from "../../services/app.service";
import { ILang } from "src/app/model/entities/lang";

@Component({
    selector: "the-tariff",
    templateUrl: "tariff.component.html",
    styleUrls: ["tariff.component.scss"],
})
export class CTariffComponent {
    @Input() public tariff: ISubscriptionTariff;
    @Input() public active: boolean;

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
}
