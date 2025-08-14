import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IBaxer } from 'src/app/model/entities/baxer';

@Injectable()
export class CBaxerRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<IBaxer[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .baxersAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
