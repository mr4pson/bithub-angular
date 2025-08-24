import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IShoporderCreate } from 'src/app/model/dto/shoporder.create';

@Injectable()
export class CShoporderRepository {
  constructor(private dataService: CDataService) {}

  public create(dto: IShoporderCreate): Promise<string> {
    return new Promise((resolve, reject) =>
      this.dataService.shopordersCreate(dto).subscribe({
        next: (res) =>
          res.statusCode === 201 ? resolve(res.data) : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }
}
