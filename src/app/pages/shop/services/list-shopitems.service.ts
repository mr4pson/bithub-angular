import { Injectable } from "@angular/core";
import { ISorting } from "src/app/model/sorting";

@Injectable()
export class CListShopitemsService {
    public shopcat_id: number = undefined;
    public sorting: ISorting = {name: "order-date-desc", sortBy: "date", sortDir: -1};
    public search: string = "";
    public part: number = 0;
}
