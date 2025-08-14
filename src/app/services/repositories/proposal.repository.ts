import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";

@Injectable()
export class CProposalRepository {    
    constructor(private dataService: CDataService) {}

    public create(content: string): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .proposalsCreate(content)
                .subscribe({
                    next: res => res.statusCode === 201 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }
}
