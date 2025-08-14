import { IMultilangable } from "../multilangable";
import { IEntity } from "./_entity";

export interface IShopcat extends IEntity {
    name: IMultilangable;
}
