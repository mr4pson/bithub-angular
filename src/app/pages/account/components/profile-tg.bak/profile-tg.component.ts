import { Component, Input, OnInit } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "profile-tg",
    templateUrl: "profile-tg.component.html",
    styleUrls: ["profile-tg.component.scss"],
})
export class CProfileTgComponent implements OnInit {
    @Input() public user: CUser;
    public link: string = "";

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    
    public ngOnInit(): void {
        this.initLink();
    }

    private initLink(): void {
        const botName = this.appService.settings["tgbot-name"];
        this.link = this.appService.settings["tgbot-starturl"]
            .replace(/{{bot_name}}/g, botName)
            .replace(/{{user_uuid}}/g, this.user.uuid);
    }
}
