import { IMultilangable } from '../multilangable';
import { IEntity } from './_entity';

export interface IShopitem extends IEntity {
  readonly date: string;
  readonly img: string;
  readonly price: number;
  readonly name: IMultilangable;
  readonly min_items_num?: number;
  readonly content?: IMultilangable;
  readonly contentshort?: IMultilangable;
}
