import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IOutorderCreate } from 'src/app/model/dto/outorder.create';

@Injectable()
export class COutorderRepository {
  constructor(private dataService: CDataService) {}

  public create(
    dto: IOutorderCreate
  ): Promise<{ statusCode: number; data: string }> {
    return new Promise((resolve, reject) =>
      this.dataService.outordersCreate(dto).subscribe({
        next: (res: any) => resolve(res),
        error: (err) => reject(err.message),
      })
    );
  }
}
