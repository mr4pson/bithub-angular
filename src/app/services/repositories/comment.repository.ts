import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IComment } from "src/app/model/entities/comment";
import { IGetList } from "src/app/model/dto/getlist";
import { CChunk } from "src/app/model/dto/chunk";
import { ICommentCreate } from "src/app/model/dto/comment.create";

@Injectable()
export class CCommentRepository {
    constructor(private dataService: CDataService) {}

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "created_at", sortDir: number = 1, filter: any = {}): Promise<CChunk<IComment>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};
        return new Promise((resolve, reject) =>
            this.dataService
                .commentsChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IComment>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }

    public create(dto: ICommentCreate): Promise<void> {
        return new Promise((resolve, reject) =>
            this.dataService
                .commentsCreate(dto)
                .subscribe({
                    next: res => res.statusCode === 201 ? resolve() : reject(res.error),
                    error: err => reject(err.message),
                }));
    }
}
