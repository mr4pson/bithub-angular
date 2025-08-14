import { IMultilangable } from "../multilangable";
import { CEntity, IEntity } from "./_entity";

export class CProblem extends CEntity {
    public desk_id: number;
    public user_id: number; // исполнитель
    public guide_id: number;
    public task_id: number;
    public content: string;
    public actual_until: string;
    public created_at: Date;
    // relations
    public user?: IProblemUser;
    public guide?: IProblemGuide;
    public task?: IProblemTask;

    public override build(o: IProblem): CProblem {
        for (let field in o) {
            if (field === "created_at") {
                this[field] = o[field] ? new Date(o[field]) : null;
            } else {
                this[field] = o[field];
            }
        }

        return this;
    }

    public init(desk_id: number, user_id: number): CProblem {
        this.desk_id = desk_id;
        this.user_id = user_id;
        this.guide_id = null;
        this.task_id = null;
        this.content = "";
        return this;
    }
}

export interface IProblem extends IEntity {
    readonly desk_id: number;
    readonly user_id: number; // исполнитель
    readonly guide_id: number;
    readonly task_id: number;
    readonly content: string;
    readonly created_at: string;
    // relations
    readonly user?: IProblemUser;
    readonly guide?: IProblemGuide;
    readonly task?: IProblemTask;
}

export interface IProblemUser extends IEntity {
    readonly name: string;
    readonly img: string;
}

export interface IProblemGuide extends IEntity {
    readonly name: IMultilangable;
    readonly img: string;
}

export interface IProblemTask extends IEntity {
    readonly name: IMultilangable;
}
