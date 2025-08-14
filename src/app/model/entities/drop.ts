import { IMultilangable } from "../multilangable";

export interface IDrop {
    id: number;
    name: string;
    img: string;
    drop: string;
    early: boolean;
    score: number;
    spending_money: number;
    spending_time: number;
    tasks: IMultilangable;
    term: number;
    fundrising: string;
    invest: number;
    cat: string;
    date: IMultilangable;
}
