import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { ICompletionUpdate } from "src/app/model/dto/completion.update";
import { CTask } from "src/app/model/entities/task";
import { CChunk } from "src/app/model/dto/chunk";
import { IGetList } from "src/app/model/dto/getlist";
import { IViewed } from "src/app/model/dto/viewed";

@Injectable()
export class CTaskRepository {
    constructor(private dataService: CDataService) {}

    public loadOne(id: number): Promise<CTask> {
        return new Promise((resolve, reject) => 
            this.dataService
                .tasksOne(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CTask().build(res.data)) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }

    public loadPaidOne(id: number): Promise<CTask> {
        return new Promise((resolve, reject) => 
            this.dataService
                .tasksPaidOne(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CTask().build(res.data)) : reject([409,410].includes(res.statusCode) ? res.statusCode : res.error), 
                    error: err => reject(err.message)
                }));
    }
    
    public updateCompletion(dto: ICompletionUpdate): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .tasksUpdateCompletion(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error),
                    error: err => reject(err.message),
                }));
    }

    public loadUnviewedChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<CTask>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .tasksUnviewedChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<CTask>(res.data.map(d => new CTask().build(d)), res.elementsQuantity, res.pagesQuantity)) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }

    public unviewedQuantity(favorites: boolean): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .tasksUnviewedQuantity(favorites)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error),
                    error: err => reject(err.message),
                }));
    }

    public viewed(dto: IViewed): Promise<number[]> {
        return new Promise((resolve, reject) => 
            this.dataService
                .tasksViewed(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error),
                    error: err => reject(err.message),
                }));
    }
}