import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IDatemarkGetList, IDatemarkToggle } from "src/app/model/dto/datemarks";

@Injectable()
export class CDatemarkRepository {
    constructor(private dataService: CDataService) {}

    public loadAll(dto: IDatemarkGetList): Promise<number[]> {
        return new Promise((resolve, reject) =>
            this.dataService
                .datemarksAll(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.error),
                    error: err => reject(err.message),
                }));
    }

    public toggle(dto: IDatemarkToggle): Promise<void> {
        return new Promise((resolve, reject) =>
            this.dataService
                .datamarksToggle(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve() : reject(res.error),
                    error: err => reject(err.message),
                }));
    }
}
