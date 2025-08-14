import { CEntity, IEntity } from "./_entity";

export class CProblemComment extends CEntity {
    public problem_id: number;
    public user_id: number;
    public user_name: string;
    public user_img: string;
    public content: string;
    public created_at: Date;

    public override build(o: IProblemComment): CProblemComment {
        for (let field in o) {
            if (field === "created_at") {
                this[field] = o[field] ? new Date(o[field]) : null;
            } else {
                this[field] = o[field];
            }
        }

        return this;
    }
}

export interface IProblemComment extends IEntity {
    readonly problem_id: number;
    readonly user_id: number;
    readonly user_name: string;
    readonly user_img: string;
    readonly content: string;
    readonly created_at: string;
}

export interface IProblemCommentCreate {
    readonly problem_id: number;
    readonly content: string;
}
