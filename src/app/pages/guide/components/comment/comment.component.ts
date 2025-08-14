import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IComment } from "src/app/model/entities/comment";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "the-comment",
    templateUrl: "comment.component.html",
    styleUrls: ["comment.component.scss"],
})
export class CCommentComponent {
    @Input() public comment: IComment;
    @Output() private replyTo: EventEmitter<string> = new EventEmitter();

    constructor(private appService: CAppService) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
    get adminImg(): string {return this.appService.files["comment-logo"]?.fileurl;}

    public onNameClick(): void {
        const name = this.comment.is_admin ? this.words['common']?.['admin']?.[this.lang.slug] : this.comment.userName;
        this.replyTo.emit(name);
    }
}
