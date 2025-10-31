import { IMultilangable } from '../multilangable';
import { CEntity, IEntity } from './_entity';
import { CTask, ITask } from './task';

export enum GuideTypes {
  FullStepsAvaliable = 'full_steps_available',
  TwoStepsAvailable = 'two_steps_available',
  LimitAfterAuthAvailable = 'limit_after_auth_available',
  Gem = 'gem',
}

export class CGuide extends CEntity {
  public slug?: string;
  public img?: string;
  public invest?: number;
  public bh_score?: number;
  public name: IMultilangable;
  public content?: IMultilangable;
  public contentshort?: IMultilangable;
  public earnings?: TGuideEarnings;
  public price: number;
  public time: number;
  public status?: TGuideStatus;
  public hit?: boolean;
  public created_at?: Date;
  public favorited?: boolean;
  public type?: GuideTypes;
  public steps_limit?: number;
  public progress?: number;
  public note?: string;
  public has_unviewed?: boolean;
  public remind_at?: string;
  public executed_at?: string;
  // relations
  public links?: IGuideLink[];
  public tasks?: CTask[];
  public isTasksBlocked?: boolean;
  public isJustViewed?: boolean;
  public isTestPeriodEnded?: boolean;
  public guidesViewedCount?: number;

  public override build(o: IGuide): CGuide {
    for (let field in o) {
      if (field === 'created_at') {
        this[field] = o[field] ? new Date(o[field]) : null;
      } else if (field === 'tasks') {
        this[field] = o[field].map((t) => new CTask().build(t));
      } else {
        this[field] = o[field];
      }
    }

    return this;
  }
}

export interface IGuide extends IEntity {
  img: string;
  invest?: number;
  bh_score?: number;
  name: IMultilangable;
  content?: IMultilangable;
  contentshort?: IMultilangable;
  earnings?: TGuideEarnings;
  price: number;
  time: number;
  status?: TGuideStatus;
  hit?: boolean;
  created_at?: string;
  favorited?: boolean;
  progress?: number;
  note?: string;
  has_unviewed?: boolean;
  remind_at?: string;
  executed_at?: string;
  // relations
  links?: IGuideLink[];
  tasks?: ITask[];
  isTasksBlocked?: boolean;
  isJustViewed?: boolean;
  isTestPeriodEnded?: boolean;
  guidesViewedCount?: number;
}

export interface IGuideLink extends IEntity {
  img: string;
  value: string;
  name: string;
}

export type TGuideStatus = 'current' | 'ending' | 'expired';

export type TGuideEarnings =
  | 'none'
  | 'drop'
  | 'possible_drop'
  | 'early_access'
  | 'points';
