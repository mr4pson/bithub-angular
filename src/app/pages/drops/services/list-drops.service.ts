import { Injectable } from "@angular/core";
import { ISorting } from "src/app/model/sorting";

@Injectable()
export class CListDropsService {
    public sorting: ISorting = {name: "order-date-desc", sortBy: "id", sortDir: -1};
    public part: number = 0;
}
