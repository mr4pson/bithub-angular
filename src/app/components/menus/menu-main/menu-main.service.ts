import { Injectable } from "@angular/core";
import { CAppService } from "src/app/services/app.service";
import { CPageRepository } from "src/app/services/repositories/page.repository";
import { IPage } from "src/app/model/entities/page";

@Injectable()
export class CMenuMainService {
    public pages: IPage[] = [];

    constructor(
        private appService: CAppService,
        private pageRepository: CPageRepository,
    ) 
    {
        this.initPages();
    }

    private async initPages(): Promise<void> {
        try {
			this.pages = await this.pageRepository.loadMenuMain();
		} catch (err) {
			this.appService.notifyError(err);	
		}
    }
}