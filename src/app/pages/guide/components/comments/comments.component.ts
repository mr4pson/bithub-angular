import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ICommentCreate } from "src/app/model/dto/comment.create";
import { IComment } from "src/app/model/entities/comment";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { IKeyValue } from "src/app/model/keyvalue";
import { CAppService } from "src/app/services/app.service";
import { CCommentRepository } from "src/app/services/repositories/comment.repository";

@Component({
    selector: "guide-comments",
    templateUrl: "comments.component.html",
    styleUrls: ["comments.component.scss"],
})
export class CCommentsComponent implements OnInit {
    @Input() public guide_id: number;
    @ViewChild("container", {static: false}) private containerRef: ElementRef;

    // list
    public comments: IComment[] = null;
    public loading: boolean = false;
    public pagesQuantity: number = 0;
    public part: number = 0;
    private chunkLength: number = 10;
    // form
    public content: string = "";
    public captchaToken: string = null;
    public errors: IKeyValue<string | boolean> = {};
    public sending: boolean = false;
    public sent: boolean = false;

    constructor(
        private appService: CAppService,
        private commentRepository: CCommentRepository,
    ) {}

    get filter(): any {return {guide_id: this.guide_id};}
    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}
    get container(): HTMLElement {return this.containerRef.nativeElement;}

    //////////////////
    // lifecycle
    //////////////////

    ngOnInit(): void {
        this.initComments();
    }

    public async initComments(): Promise<void> {
        try {
            this.loading = true;
            await this.appService.pause(300);
            const chunk = await this.commentRepository.loadChunk(this.part, this.chunkLength, "created_at", 1, this.filter);

            if (this.part > 0 && !chunk.data.length) { // after deleting or updating may be current part is out of possible diapason
                this.part--;
                this.initComments();
                return;
            }

            this.comments = chunk.data;
            this.pagesQuantity = chunk.pagesQuantity;
            this.loading = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    ///////////////////
    // events
    ///////////////////

    public onPartChange(): void {
        this.appService.win.scrollTo({top: this.container.offsetTop - 70, behavior: "smooth"});
        this.initComments();
    }

    public async onSend(): Promise<void> {
        try {
            if (!this.validateForm()) return;
            this.sending = true;
            const dto: ICommentCreate = {content: this.content, guide_id: this.guide_id, captchaToken: this.captchaToken};
            await this.commentRepository.create(dto);
            this.captchaToken = null; // каптча одноразовая, как выяснилось
            this.content = "";
            this.sending = false;
            this.sent = true;
            await this.appService.pause(5000);
            this.sent = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onReplyTo(name: string): void {
        this.content += `[r]${name}[/r], `;
    }

    ////////////////
    // utils
    ////////////////

    private validateForm(): boolean {
        let error = false;
        this.errors["content"] = null;
        this.errors["captcha-token"] = false;
        this.content = this.content.trim();

        if (!this.content) {
            this.errors["content"] = "required";
            error = true;
        }

        if (!this.captchaToken) {
            this.errors["captcha-token"] = true;
            error = true;
        }

        return !error;
    }
}