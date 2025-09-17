import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { ICat } from 'src/app/model/entities/cat';

@Injectable()
export class CCatRepository {
  public cats: ICat[] = [];
  constructor(private dataService: CDataService) {}

  public loadAll(): Promise<ICat[]> {
    return new Promise((resolve, reject) =>
      this.dataService.catsAll().subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.cats = res.data;

            return resolve(res.data);
          }

          return reject(res.error);
        },
        error: (err) => reject(err.message),
      })
    );
  }
}
