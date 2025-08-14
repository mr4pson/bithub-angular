import { IEntity } from "./_entity";

export interface IDesk extends IEntity {
    name: string;
    problems: IDeskProblem[];
}

export interface IDeskProblem extends IEntity {
    desk_id: number;
    content: string;
    has_unviewed_comments: boolean;
    created_at: string;
    user: IDeskProblemUser;
    guide: IDeskProblemGuide;    
}

export interface IDeskProblemUser extends IEntity {
    name: string;
    img: string;
}

export interface IDeskProblemGuide extends IEntity  {
    img: string;
}

export type TDeskMode = "public" | "private";
