import { IEntity } from "./_entity";

export interface IComment extends IEntity {
    readonly is_admin: boolean;
    readonly userName?: string;
    readonly userImg?: string;
    readonly userLetter: string;
    readonly content: string;
    readonly created_at: string;
}
