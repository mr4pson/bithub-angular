import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { CProblemComment } from "src/app/model/entities/problem.comment";
import { IProblemComment } from "src/app/model/entities/problem.comment";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CProblemCommentRepository } from "src/app/services/repositories/problem.comment.repository";
import { CSocketService } from "src/app/services/socket.service";

@Component({
    selector: "problem-comments",
    templateUrl: "problem-comments.component.html",
    styleUrls: ["problem-comments.component.scss"],
})
export class CProblemCommentsComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
    @Input() public problem_id: number;
    @ViewChild("container", {static: false}) protected containerRef: ElementRef;

    public newComment: string = "";
    public comments: CProblemComment[] = null;
    private part: number = 0;
    private chunkLength: number = 10;
    private sortBy: string = "created_at";
    private sortDir: number = -1;
    private exhausted: boolean = false;  
    public loadingMore: boolean = false;
    private started_at: Date = null;
    private lid: number = null;

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private socketService: CSocketService,
        private commentRepository: CProblemCommentRepository,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}  
    get user(): CUser {return this.authService.user;}
    get container(): HTMLElement {return this.containerRef.nativeElement;}
    get scrolledToTop(): boolean {return this.container.scrollHeight - this.container.offsetHeight + this.container.scrollTop < 100;}
    get canLoadMore(): boolean {return this.comments?.length /*важно,чтоб не было подгрузки до первой загрузки*/ && !this.loadingMore && !this.exhausted && this.scrolledToTop;}  

    public ngAfterViewInit(): void {
        this.container.addEventListener("scroll", this.onScroll.bind(this));
    }

    public ngOnChanges(): void {
        this.initComments();
    }

    public ngOnInit(): void {
        this.lid = this.socketService.on("problem-comment", data => this.onComment(data));    
    }

    public ngOnDestroy(): void {
        this.socketService.off([this.lid]);
    }

    private async initComments(): Promise<void> {
        try {
            this.loadingMore = false; // можем прервать подгрузку
            this.comments = null;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной прокрутке при добавлении новых элементов после момента, когда первый кусок загружен
            const filter = {problem_id: this.problem_id};
            await this.appService.pause(300);
            const chunk = await this.commentRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);
            this.comments = chunk.data;
            this.exhausted = this.part + 1 >= chunk.pagesQuantity; 
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private async onScroll(): Promise<void> {
        try {           
            if (!this.canLoadMore) return;
            this.loadingMore = true;
            this.part++;   
            const filter = {created_at_less: this.started_at, problem_id: this.problem_id};
            const chunk = await this.commentRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);
            if (!this.loadingMore) return; // подгрузка может быть прервана            
            this.comments = [...this.comments, ...chunk.data];
            this.exhausted = this.part + 1 >= chunk.pagesQuantity; 
            this.loadingMore = false;
        } catch (err) {
            this.appService.notifyError(err);
            this.loadingMore = false;
        }
    }

    public async onCreate(): Promise<void> {
        try {
            this.newComment = this.newComment.trim();
            if (!this.newComment.length) return;
            const content = this.newComment;
            this.newComment = "";
            await this.commentRepository.create({content, problem_id: this.problem_id});
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onKeyUp(event: KeyboardEvent): void {
        if (event.key === "Enter" && !event.shiftKey) {   
            event.preventDefault();         
            this.onCreate();
        }
    }   

    public onComment(data: IProblemComment): void {
        if (data.problem_id !== this.problem_id) return;
        const comment = new CProblemComment().build(data);
        this.comments.unshift(comment);
    }
}
