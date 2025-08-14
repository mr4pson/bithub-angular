import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { CChunk } from "src/app/model/dto/chunk";
import { IGetList } from "src/app/model/dto/getlist";
import { CGuide } from "src/app/model/entities/guide";
import { IFavoritionUpdate } from "src/app/model/dto/favorition.update";
import { ICompletion } from "src/app/model/entities/completion";

@Injectable()
export class CGuideRepository {
    constructor(private dataService: CDataService) {}

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<CGuide>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};
        return new Promise((resolve, reject) =>
            this.dataService
                .guidesChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<CGuide>(res.data.map(d => new CGuide().build(d)), res.elementsQuantity, res.pagesQuantity)) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }

    public loadFavoritesChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1): Promise<CChunk<CGuide>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir};
        return new Promise((resolve, reject) =>
            this.dataService
                .guidesFavoritesChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<CGuide>(res.data.map(d => new CGuide().build(d)), res.elementsQuantity, res.pagesQuantity)) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }

    public loadStatChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<CGuide>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};
        return new Promise((resolve, reject) =>
            this.dataService
                .guidesStatChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<CGuide>(res.data.map(d => new CGuide().build(d)), res.elementsQuantity, res.pagesQuantity)) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }

    public loadStatCompletions(guide_id: number): Promise<ICompletion[]> {
        return new Promise((resolve, reject) =>
            this.dataService
                .guidesStatCompletions(guide_id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }

    public loadOne(id: number): Promise<CGuide> {
        return new Promise((resolve, reject) =>
            this.dataService
                .guidesOne(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CGuide().build(res.data)) : reject(res.statusCode === 404 ? res.statusCode : res.error),
                    error: err => reject(err.message)
                }));
    }

    public loadProgress(id: number): Promise<number> {
        return new Promise((resolve, reject) =>
            this.dataService
                .guidesProgress(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }

    public updateFavorition(dto: IFavoritionUpdate): Promise<void> {
        return new Promise((resolve, reject) =>
            this.dataService
                .guidesUpdateFavorition(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error),
                    error: err => reject(err.message),
                }));
    }
}