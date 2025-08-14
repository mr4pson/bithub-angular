import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CGuide } from "src/app/model/entities/guide";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Component({
    selector: "the-guide",
    templateUrl: "guide.component.html",
    styleUrls: ["guide.component.scss"],
})
export class CGuideComponent implements OnInit, OnDestroy {
    @Input() public guide: CGuide;
    @Output() getUnviewed: EventEmitter<void> = new EventEmitter();
    @Output() editDatemarks: EventEmitter<void> = new EventEmitter();

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
    get authenticated(): boolean {return this.authService.authData !== null;}

    public ngOnInit(): void {
        window.addEventListener(`unviewed:unset:${this.guide.id}`, this.onUnsetUnviewed.bind(this));
    }

    public ngOnDestroy(): void {
        window.removeEventListener(`unviewed:unset:${this.guide.id}`, this.onUnsetUnviewed);
    }

    public onGetUnviewed(event: PointerEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.getUnviewed.emit();
    }

    private onUnsetUnviewed(): void {
        this.guide.has_unviewed = false;
    }

    public onEditDatemarks(event: PointerEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.editDatemarks.emit();
    }
}