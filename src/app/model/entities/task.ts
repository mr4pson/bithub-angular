import { IMultilangable } from '../multilangable';
import { CEntity, IEntity } from './_entity';
import { CGuide, IGuide } from './guide';

export class CTask extends CEntity {
  public guide_id: number;
  public price?: number;
  public time?: number;
  public type?: TTaskType;
  public contenttype?: TTaskContentType;
  public name?: IMultilangable;
  public content?: IMultilangable;
  public yt_content?: string;
  public actual_until?: Date;
  public actual: boolean;
  public availableWithSubscription?: boolean;
  public created_at?: Date;
  public completed?: boolean;
  // relations
  public guide?: CGuide;

  public override build(o: ITask): CTask {
    for (let field in o) {
      if (['actual_until', 'created_at'].includes(field)) {
        this[field] = o[field] ? new Date(o[field]) : null;
      } else if (field === 'guide') {
        this[field] = o[field] ? new CGuide().build(o[field]) : null;
      } else {
        this[field] = o[field];
      }
    }

    return this;
  }
}

export type TTaskContentType = 'html' | 'yt';
export type TTaskType = 'main' | 'extra';

export interface ITask extends IEntity {
  guide_id: number;
  price?: number;
  time?: number;
  type?: TTaskType;
  name?: IMultilangable;
  contenttype?: TTaskContentType;
  content?: IMultilangable;
  yt_content?: string;
  actual_until?: string;
  actual: boolean;
  created_at?: string;
  completed?: boolean;
  // relations
  guide?: IGuide;
}
