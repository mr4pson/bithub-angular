import { IMultilangable } from "../multilangable";

export interface IBaxer {
    readonly id: number;
    readonly img: IMultilangable;
    readonly link: IMultilangable;
    // iface
    dontShow?: boolean;
}
