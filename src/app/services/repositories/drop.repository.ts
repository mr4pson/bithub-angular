import { Injectable } from "@angular/core";
import { CDataService } from "../data.service";
import { CChunk } from "src/app/model/dto/chunk";
import { IGetList } from "src/app/model/dto/getlist";
import { IDrop } from "src/app/model/entities/drop";

@Injectable()
export class CDropRepository {
    constructor(private dataService: CDataService) {}

    public loadChunk(part: number = 0, chunkLength: number = 10, sortBy: string = "id", sortDir: number = 1, filter: any = {}): Promise<CChunk<IDrop>> {
        const dto: IGetList = {from: part * chunkLength, q: chunkLength, sortBy, sortDir, filter};
        return new Promise((resolve, reject) =>
            this.dataService
                .dropsChunk(dto)
                .subscribe({
                    next: res => res.statusCode === 200 ? resolve(new CChunk<IDrop>(res.data, res.elementsQuantity, res.pagesQuantity)) : reject(res.error),
                    error: err => reject(err.message)
                }));
    }
}
