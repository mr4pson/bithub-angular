import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IDesk, TDeskMode } from 'src/app/model/entities/desk';

@Injectable()
export class CDeskRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(mode: TDeskMode): Promise<IDesk[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .desksAll(mode)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  

    public loadOne(id: number): Promise<IDesk> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .desksOne(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  
    
    public update(dto: IDesk): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .desksUpdate(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .desksDelete(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }

    public create(mode: TDeskMode): Promise<IDesk> {
        return new Promise((resolve, reject) => 
            this.dataService
                .desksCreate(mode)
                .subscribe({
                    next: res => res.statusCode === 201 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }
}
