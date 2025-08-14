import { Component } from "@angular/core";
import { CPanelComponent } from "../panel.component";

@Component({
    selector: "panel-account",
    templateUrl: "panel-account.component.html",
    styleUrls: ["panel-account.component.scss"],
})
export class CPanelAccountComponent extends CPanelComponent {
    get url(): string[] {return this.appService.url;}    
}