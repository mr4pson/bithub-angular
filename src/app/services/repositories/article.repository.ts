import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IArticle } from "src/app/model/entities/article";
import { IGetList } from "src/app/model/dto/getlist";
import { CChunk } from "src/app/model/dto/chunk";
import { IReadingUpdate } from "src/app/model/dto/reading.update";

@Injectable()
export class CArticleRepository {
    constructor(private dataService: CDataService) {}

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<IArticle>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .articlesChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IArticle>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }

    public loadOne(slug: string): Promise<IArticle> {
        return new Promise((resolve, reject) => 
            this.dataService
                .articlesOne(slug)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode), 
                    error: err => reject(err.message),
                }));
    }   

    public updateReading(dto: IReadingUpdate): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .articlesUpdateReading(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error),
                    error: err => reject(err.message),
                }));
    }
}
