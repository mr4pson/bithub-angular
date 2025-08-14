import { Component } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CUserRepository } from "src/app/services/repositories/user.repository";
import { CUser } from "src/app/model/entities/user";
import { CSelectEndlessComponent } from "../select-endless.component";

@Component({
    selector: "select-user",
    templateUrl: "select-user.component.html",
    styleUrls: ["../../select.component.scss"],
})
export class CSelectUserComponent extends CSelectEndlessComponent<CUser> {
    protected override sortBy: string = "name";

    constructor(
        protected override appService: CAppService,
        protected authService: CAuthService,
        protected userRepository: CUserRepository,
    )
    {
        super(appService);
    }

    protected async initCurrentItem(): Promise<void> {
        try {
            this.currentItem = this.currentValue ? await this.userRepository.loadOne(this.currentValue) : null;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    protected async initItems(): Promise<void> {
        try {
            this.loadingMore = false; // можем прервать подгрузку
            this.items = null;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной прокрутке при добавлении новых элементов после момента, когда первый кусок загружен
            await this.appService.pause(300);
            const me = await this.authService.loadMe();
            const chunk = await this.userRepository.loadChildrenChunk(this.part, this.chunkLength, this.sortBy, this.sortDir);
            this.items = [me, ...chunk.data];
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    protected async onScroll(): Promise<void> {
        try {
            if (!this.canLoadMore) return;
            this.loadingMore = true;
            this.part++;
            const filter = {created_at_less: this.started_at};
            const chunk = await this.userRepository.loadChildrenChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);
            if (!this.loadingMore) return; // подгрузка может быть прервана
            this.items = [...this.items, ...chunk.data];
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;
            this.loadingMore = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}