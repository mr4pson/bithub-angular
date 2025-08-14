import { Injectable } from "@angular/core";
import { TGuideEarnings, TGuideStatus } from "src/app/model/entities/guide";
import { ISorting } from "src/app/model/sorting";

@Injectable()
export class CListGuidesService {
    public cat_id: number = undefined;
    public sorting: ISorting = {name: "order-createdat-desc", sortBy: "created_at", sortDir: -1};
    public search: string = "";
    public part: number = 0;
    public favorites: boolean = false;
    public status: TGuideStatus = null;
    public earnings: TGuideEarnings = null;
}
