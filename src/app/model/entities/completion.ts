import { IEntity } from "./_entity";
import { TTaskType } from "./task";

export interface ICompletion {
    user: ICompletionUser;
    progress: number;
    tasks: ICompletionTask[];
}

export interface ICompletionTask {
    task_id: number;
    task_type: TTaskType;
    completed: boolean;
}

export interface ICompletionUser extends IEntity {
    email: string;
    name: string;
    wallet: string;
}
