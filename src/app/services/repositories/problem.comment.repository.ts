import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { CChunk } from "src/app/model/dto/chunk";
import { CProblemComment, IProblemCommentCreate } from "src/app/model/entities/problem.comment";
import { IGetList } from "src/app/model/dto/getlist";

@Injectable()
export class CProblemCommentRepository {
    constructor(private dataService: CDataService) {}   

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<CProblemComment>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .problemCommentsChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<CProblemComment>(res.data.map(d => new CProblemComment().build(d)), res.elementsQuantity, res.pagesQuantity)) : reject(res.error), 
                    error: err => reject(err.comment),
                }));
    }

    public create(dto: IProblemCommentCreate): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .problemCommentsCreate(dto)
                .subscribe({
                    next: res => res.statusCode === 201 ? resolve() : reject(res.error), 
                    error: err => reject(err.comment),
                }));
    }
}