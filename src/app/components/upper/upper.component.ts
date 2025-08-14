import { Component, HostListener, OnInit } from "@angular/core";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "the-upper",
    templateUrl: "upper.component.html",
    styleUrls: ["upper.component.scss"],
})
export class CUpperComponent implements OnInit {
    public visible: boolean = false;

    constructor(private appService: CAppService) {}

    public ngOnInit(): void {
        this.appService.win.addEventListener("scroll", this.onScroll.bind(this));
    }

    private onScroll(): void {
        this.visible = this.appService.win.scrollTop > 500;
    }

    public onClick(): void {
        this.appService.win.scrollTo({top: 0, behavior: "smooth"});
    }
}