import { Component, Input } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";
import { IArticle } from "src/app/model/entities/article";
import { CArticleRepository } from "src/app/services/repositories/article.repository";

@Component({
    selector: "btn-reading",
    templateUrl: "btn-reading.component.html",
    styleUrls: ["btn-reading.component.scss"],
})
export class CBtnReadingComponent {
    @Input() public article: IArticle;
    public loading: boolean = false;

    constructor(
        private appService: CAppService,
        private articleRepository: CArticleRepository,
    ) {}

    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public async onToggle(event: PointerEvent): Promise<void> {
        try {
            event.preventDefault();
            event.stopPropagation();   

            if (!this.loading) {
                const was_read = !this.article.was_read;
                this.loading = true;
                await this.appService.pause(300);
                await this.articleRepository.updateReading({article_id: this.article.id, was_read});
                this.loading = false;
                this.article.was_read = was_read;            
            }            
        } catch (err) {
            this.appService.notifyError(err);
            this.loading = false;
        }
    }    
}