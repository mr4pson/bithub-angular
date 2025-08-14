import { IMultilangable } from "../multilangable";
import { IEntity } from "./_entity";

export interface ICat extends IEntity {
    name: IMultilangable;
}