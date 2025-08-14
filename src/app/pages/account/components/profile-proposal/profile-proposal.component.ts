import { Component, Input } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAppService } from "src/app/services/app.service";
import { CProposalRepository } from "src/app/services/repositories/proposal.repository";

@Component({
    selector: "profile-proposal",
    templateUrl: "profile-proposal.component.html",
    styleUrls: [
        "profile-proposal.component.scss",
        "../../../../styles/forms.scss",
    ],
})
export class CProfileProposalComponent {
    @Input() public user: CUser;
    public content: string = "";
    public errors: IKeyValue<string | boolean> = {};
    public sending: boolean = false;
    public sent: boolean = false;

    constructor(
        private appService: CAppService,
        private proposalRepository: CProposalRepository,
    ) {}

    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validate()) return;
            this.sending = true;
            await this.appService.pause(300);
            await this.proposalRepository.create(this.content);
            this.content = "";
            this.sending = false;
            this.sent = true;
            await this.appService.pause(1000);
            this.sent = false;
        } catch (err) {
            this.sending = false;
            this.appService.notifyError(err);
        }
    }

    private validate(): boolean {
        let error = false;
        this.content = this.content.trim();
        this.errors["content"] = null;

        if (!this.content.length) {
            this.errors["content"] = "required";
            error = true;
        }

        return !error;
    }
}
