import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { IInorderCreate } from 'src/app/model/dto/inorder.create';

@Injectable()
export class CInorderRepository {
  constructor(private dataService: CDataService) {}

  public create(dto: IInorderCreate): Promise<string> {
    return new Promise((resolve, reject) =>
      this.dataService.inordersCreate(dto).subscribe({
        next: (res) =>
          res.statusCode === 201 ? resolve(res.data) : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }
}
