import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { ISubscriptionTariff } from 'src/app/model/entities/subscription.tariff';
import { IOnetimeTariff } from 'src/app/model/entities/onetime.tariff';

@Injectable()
export class CTariffRepository {    
    constructor(private dataService: CDataService) {}

    public loadSubscriptionAll(): Promise<ISubscriptionTariff[]> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .tariffsSubscriptionAll()
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  
    
    public loadOnetimeOne(code: string): Promise<IOnetimeTariff> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .tariffsOnetimeOne(code)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }  
}
