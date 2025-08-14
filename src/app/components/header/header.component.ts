import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CAppService } from "../../services/app.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CUser } from "src/app/model/entities/user";
import { CAuthService } from "../../services/auth.service";

@Component({
    selector: "the-header",
    templateUrl: "header.component.html",
    styleUrls: ["header.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CHeaderComponent implements OnInit {
    public panelLangsActive: boolean = false; 
    public panelAccountActive: boolean = false;
    public panelFavoritesActive: boolean = false;
    public panelInorderActive: boolean = false;
    public panelUnviewedActive: boolean = false;
    public panelMobActive: boolean = false;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    set popupLoginActive(v: boolean) {this.appService.popupLoginActive = v;}
    get authenticated(): boolean {return this.authService.authData !== null;}
    get user(): CUser {return this.authService.user;}    

    public ngOnInit(): void {
        this.initBehavior();
    }

    private initBehavior(): void {
        window.addEventListener("show-panel", (event: CustomEvent) => this.showPanel(event.detail));
    }

    public onTogglePanel(name: string, event: PointerEvent): void {        
        event.stopPropagation();
        this[`panel${name}Active`] ? this.hidePanel(name) : this.showPanel(name);        
    }    

    private hidePanel(name: string): void {
        this[`panel${name}Active`] = false;
    }

    private showPanel(name: string): void {
        this[`panel${name}Active`] = true;
        ["Langs", "Account", "Favorites", "Inorder", "Unviewed"]
            .filter(x => x !== name)
            .forEach(name => this[`panel${name}Active`] = false); // close all panels except current  
    }
}