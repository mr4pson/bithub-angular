import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { CUser } from 'src/app/model/entities/user';
import { CChunk } from 'src/app/model/dto/chunk';
import { IGetList } from 'src/app/model/dto/getlist';

@Injectable()
export class CUserRepository {
  constructor(private dataService: CDataService) {}

  public loadOne(id: number): Promise<CUser> {
    return new Promise((resolve, reject) =>
      this.dataService.usersOne(id).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(new CUser().build(res.data))
            : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }

  public loadChildrenChunk(
    part: number = 0,
    chunkLength: number = 10,
    sortBy: string = 'id',
    sortDir: number = 1,
    filter: any = {}
  ): Promise<CChunk<CUser>> {
    const dto: IGetList = {
      from: part * chunkLength,
      q: chunkLength,
      sortBy,
      sortDir,
      filter,
    };
    return new Promise((resolve, reject) =>
      this.dataService.usersChildrenChunk(dto).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(
                new CChunk<CUser>(
                  res.data.map((d) => new CUser().build(d)),
                  res.elementsQuantity,
                  res.pagesQuantity
                )
              )
            : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }

  public loadRefereesChunk(
    part: number = 0,
    chunkLength: number = 10,
    sortBy: string = 'id',
    sortDir: number = 1,
    filter: any = {}
  ): Promise<CChunk<CUser>> {
    const dto: IGetList = {
      from: part * chunkLength,
      q: chunkLength,
      sortBy,
      sortDir,
      filter,
    };
    return new Promise((resolve, reject) =>
      this.dataService.usersRefereesChunk(dto).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(
                new CChunk<CUser>(
                  res.data.map((d) => new CUser().build(d)),
                  res.elementsQuantity,
                  res.pagesQuantity
                )
              )
            : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }

  public canBeParent(uuid: string): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersCanBeParent(uuid).subscribe({
        next: (res) => resolve(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public isExists(uuid: string): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersIsExists(uuid).subscribe({
        next: (res) => resolve(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public verify(code: number): Promise<{ statusCode: number; error: string }> {
    return new Promise((resolve, reject) =>
      this.dataService.verify(code).subscribe({
        next: (res) =>
          res.statusCode === 200 ? resolve(res as any) : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }
}
