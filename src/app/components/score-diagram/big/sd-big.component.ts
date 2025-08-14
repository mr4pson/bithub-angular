import { Component } from "@angular/core";
import { CScoreDiagramComponent } from "../score-diagram.component";

@Component({
    selector: "sd-big",
    templateUrl: "sd-big.component.html",
    styleUrls: ["sd-big.component.scss"],
})
export class CScoreDiagramBigComponent extends CScoreDiagramComponent {
    get status(): string {
        if (this.currentValue === 0) return "bs-null";
        if (this.currentValue > 0 && this.currentValue <= 200) return "bs-weak";
        if (this.currentValue > 200 && this.currentValue <= 400) return "bs-pers";
        if (this.currentValue > 400 && this.currentValue <= 600) return "bs-good";
        if (this.currentValue > 600 && this.currentValue <= 800) return "bs-great";
        return "bs-super";
    }

    get siteUrl(): string {return `/${this.lang.slug}/${this.appService.settings["bs-link"]}`;}
}

