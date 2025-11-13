import { Injectable } from '@angular/core';
import { CChunk } from 'src/app/model/dto/chunk';
import { IGetList } from 'src/app/model/dto/getlist';
import { IReadingUpdate } from 'src/app/model/dto/reading.update';
import { ITool } from 'src/app/model/entities/tool';
import { CDataService } from '../data.service';

@Injectable()
export class CToolRepository {
  constructor(private dataService: CDataService) {}

  public loadChunk(
    part: number = 0,
    chunkLength: number = 10,
    sortBy: string = 'id',
    sortDir: number = 1,
    filter: any = {}
  ): Promise<CChunk<ITool>> {
    const dto: IGetList = {
      from: part * chunkLength,
      q: chunkLength,
      sortBy,
      sortDir,
      filter,
    };
    return new Promise((resolve, reject) =>
      this.dataService.toolsChunk(dto).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(
                new CChunk<ITool>(
                  res.data,
                  res.elementsQuantity,
                  res.pagesQuantity
                )
              )
            : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }

  public loadOne(slug: string): Promise<ITool> {
    return new Promise((resolve, reject) =>
      this.dataService.toolsOne(slug).subscribe({
        next: (res) =>
          res.statusCode === 200 ? resolve(res.data) : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public updateReading(dto: IReadingUpdate): Promise<void> {
    return new Promise((resolve, reject) =>
      this.dataService.toolsUpdateReading(dto).subscribe({
        next: (res) => (res.statusCode === 200 ? resolve() : reject(res.error)),
        error: (err) => reject(err.message),
      })
    );
  }
}
