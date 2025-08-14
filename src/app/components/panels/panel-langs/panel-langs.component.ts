import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CPanelComponent } from "../panel.component";

@Component({
    selector: "panel-langs",
    templateUrl: "panel-langs.component.html",
    styleUrls: ["panel-langs.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CPanelLangsComponent extends CPanelComponent implements OnInit {
    override ngOnInit(): void {
        super.ngOnInit();
        this.initBehavior();
    }

    private initBehavior(): void {
        this.appService.lang.subscribe(() => this.onClose());
    }
}