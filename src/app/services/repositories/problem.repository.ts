import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { CProblem } from 'src/app/model/entities/problem';
import { IProblemUpdateDesk } from 'src/app/model/dto/problem.update.desk';

@Injectable()
export class CProblemRepository {    
    constructor(private dataService: CDataService) {}

    public loadOneEditable(id: number): Promise<CProblem> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .problemsOneEditable(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CProblem().build(res.data)) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }
    
    public loadOneViewable(id: number): Promise<CProblem> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .problemsOneViewable(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CProblem().build(res.data)) : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }

    public create(x: CProblem): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .problemsCreate(x)
                .subscribe({
                    next: res => res.statusCode === 201 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }

    public update(x: CProblem): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .problemsUpdate(x)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }

    public delete(id: number): Promise<void> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .problemsDelete(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    } 
    
    public updateViewing(id: number): Promise<void> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .problemsUpdateViewing(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    } 

    public updateDesk(dto: IProblemUpdateDesk): Promise<void> {        
        return new Promise((resolve, reject) =>             
            this.dataService
                .problemsUpdateDesk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error), 
                    error: err => reject(err.message),
                }));
    }
}
