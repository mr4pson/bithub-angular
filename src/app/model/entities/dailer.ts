import { IEntity } from "./_entity";

export interface IDailer extends IEntity {
    name: string;
    link: string;
    comment: string;
    completed?: boolean;
}
