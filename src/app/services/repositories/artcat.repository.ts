import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IArtcat } from 'src/app/model/entities/artcat';

@Injectable()
export class CArtcatRepository {    
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<IArtcat[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .artcatsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
