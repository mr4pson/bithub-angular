import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Timeout } from "src/app/decorators/timeout";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "expandable-text",
    templateUrl: "expandable.component.html",
    styleUrls: ["expandable.component.scss"],
})
export class CExpandableComponent implements AfterViewInit {
    @Input() public value: string;
    @ViewChild("container", {static: false}) protected containerRef: ElementRef;
    public expanded: boolean = null;

    constructor(protected appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    get container(): HTMLElement {return this.containerRef.nativeElement;}

    @Timeout(1)
    ngAfterViewInit(): void {
        this.expanded = this.container.scrollHeight <= 200;
    }

    public expand(): void {
        this.container.style.maxHeight = this.container.scrollHeight + "px";
        this.expanded = true;
    }
}
