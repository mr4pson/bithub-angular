import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IGuideNoteSave } from "src/app/model/dto/guide.note.save";

@Injectable()
export class CGuideNoteRepository {
    constructor(private dataService: CDataService) {}  

    public save(dto: IGuideNoteSave): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .guideNotesSave(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error),
                    error: err => reject(err.message),
                })
        );
    }
}
