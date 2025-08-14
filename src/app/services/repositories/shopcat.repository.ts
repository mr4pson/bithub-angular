import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IShopcat } from 'src/app/model/entities/shopcat';

@Injectable()
export class CShopcatRepository {
    constructor(private dataService: CDataService) {}

    public loadAll(): Promise<IShopcat[]> {
        return new Promise((resolve, reject) =>
            this.dataService
                .shopcatsAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error),
                    error: err => reject(err.message),
                }));
    }
}
