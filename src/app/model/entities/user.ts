import { CEntity, IEntity } from './_entity';

export class CUser extends CEntity {
  public uuid: string;
  public lang_id: number;
  public parent_id: number;
  public parent_email: string;
  public referrer_id: number;
  public email: string;
  public name: string;
  public wallet: string;
  public img: string;
  public ref_link: string;
  public money: number;
  public points: number;
  public subType?: 'dg-pro' | 'dg-team';
  public paid_at: Date;
  public paid_until: Date;
  public freetasks: number;
  public children_limit: number;
  public children_q: number;
  public overdue: boolean;
  public referral_percent: number;
  public refEarnings?: number; // сумма заработанная на рефералах
  public tg_username: string;
  public tg_tasks: boolean;
  public tg_guides: boolean;
  public tg_articles: boolean;
  public tg_deadlines: boolean;
  public viewedGuidesCount?: number;
  public tz: number;
  public verified: boolean;
  public created_at: Date;

  public override build(o: IUser | CUser): CUser {
    for (let field in o) {
      if (['paid_at', 'paid_until', 'created_at'].includes(field)) {
        this[field] = o[field] ? new Date(o[field]) : null;
      } else {
        this[field] = o[field];
      }
    }

    return this;
  }
}

export interface IUser extends IEntity {
  readonly uuid: string;
  readonly lang_id: number;
  readonly parent_id: number;
  readonly referrer_id: number;
  readonly email: string;
  readonly name: string;
  readonly wallet: string;
  readonly img: string;
  readonly money: number;
  readonly points: number;
  readonly paid_at: string;
  readonly paid_until: string;
  readonly freetasks: number;
  readonly children_limit: number;
  readonly children_q: number;
  readonly overdue: boolean;
  readonly referral_percent: number;
  readonly tg_tasks: boolean;
  readonly tg_guides: boolean;
  readonly tg_articles: boolean;
  readonly tg_deadlines: boolean;
  readonly tz: number;
  readonly created_at: string;
}

export interface IUserAuthData {
  readonly id: number;
  readonly token: string;
}

export interface IUserEnterByToken {
  readonly type: 'Google' | 'Apple';
  readonly lang_id: number;
  readonly token: string;
}

export interface IUserLogin {
  readonly email: string;
  readonly password: string;
  readonly captchaToken: string;
}

export interface IUserRecover {
  readonly email: string;
  readonly code: string;
  readonly password: string;
}

export interface IUserRegister {
  readonly lang_id: number;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly wallet: string;
  readonly parent_uuid: string;
  readonly referrer_uuid: string;
  readonly captchaToken: string;
}

export interface IUserUpdatePassword {
  readonly oldpassword: string;
  readonly newpassword: string;
}

export interface IUserUpdate {
  readonly lang_id: number;
  readonly name: string;
  readonly wallet: string;
  readonly img: string;
  readonly ref_link: string;
  readonly tg_username: string;
  readonly tg_tasks: boolean;
  readonly tg_guides: boolean;
  readonly tg_articles: boolean;
  readonly tg_deadlines: boolean;
  readonly tz: number;
}

export interface IUserVerify {
  readonly lang_id: number;
  readonly email: string;
}
