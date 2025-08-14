import { IMultilangable } from "../multilangable";
import { IEntity } from "./_entity";

export interface IArtcat extends IEntity {
    name: IMultilangable;
}