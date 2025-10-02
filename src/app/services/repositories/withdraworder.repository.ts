import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IWithdraworderCreate } from 'src/app/model/dto/withxdraworder.create';

@Injectable()
export class CWithdraworderRepository {
  constructor(private dataService: CDataService) {}

  public create(dto: IWithdraworderCreate): Promise<string> {
    return new Promise((resolve, reject) =>
      this.dataService.withdrawordersCreate(dto).subscribe({
        next: (res) =>
          res.statusCode === 201 ? resolve(res.data) : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }
}
