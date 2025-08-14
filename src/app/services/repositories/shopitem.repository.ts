import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { IShopitem } from "src/app/model/entities/shopitem";
import { IGetList } from "src/app/model/dto/getlist";
import { CChunk } from "src/app/model/dto/chunk";
import { IReadingUpdate } from "src/app/model/dto/reading.update";

@Injectable()
export class CShopitemRepository {
    constructor(private dataService: CDataService) {}

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<IShopitem>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};
        return new Promise((resolve, reject) =>
            this.dataService
                .shopitemsChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IShopitem>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }

    public loadOne(id: number): Promise<IShopitem> {
        return new Promise((resolve, reject) =>
            this.dataService
                .shopitemsOne(id)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode),
                    error: err => reject(err.message),
                }));
    }
}
