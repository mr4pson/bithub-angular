import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IDailer } from 'src/app/model/entities/dailer';
import { IGetList } from 'src/app/model/dto/getlist';
import { CChunk } from 'src/app/model/dto/chunk';

@Injectable()
export class CDailerRepository {    
    constructor(private dataService: CDataService) {}

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<IDailer>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};        
        return new Promise((resolve, reject) => 
            this.dataService
                .dailersChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IDailer>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.error), 
                    error: err => reject(err.message)
                }));
    }
    
    public save(x: IDailer): Promise<IDailer> {
        return new Promise((resolve, reject) => 
            this.dataService
                .dailersSave(x)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }

    public delete(id: number): Promise<void> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .dailersDelete(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    } 
}
