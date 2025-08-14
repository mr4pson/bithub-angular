import { IMultilangable } from "../multilangable";
import { IEntity } from "./_entity";

export interface ISubscriptionTariff extends IEntity {
    readonly price: number;
    readonly period: number;
    readonly top: boolean;
    readonly name: IMultilangable;
    readonly note: IMultilangable;
}