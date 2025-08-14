import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IPromocode } from 'src/app/model/entities/promocode';

@Injectable()
export class CPromocodeRepository {    
    constructor(private dataService: CDataService) {}

    public loadOne(code: string): Promise<IPromocode> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .promocodesOne(code)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode === 409 ? res.statusCode : res.error), 
                    error: err => reject(err.message),
                }));
    }    
}
