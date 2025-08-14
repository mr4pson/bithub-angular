import { Injectable } from "@angular/core";
import { ISorting } from "src/app/model/sorting";

@Injectable()
export class CListStatGuidesService {
    public sorting: ISorting = {name: "order-createdat-desc", sortBy: "created_at", sortDir: -1};
    public part: number = 0;
    public favorites: boolean = false;
    public search: string = "";
}
