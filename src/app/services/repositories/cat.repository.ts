import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { ICat } from 'src/app/model/entities/cat';

@Injectable()
export class CCatRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<ICat[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .catsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
