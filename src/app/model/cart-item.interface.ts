import { IShopitem } from './entities/shopitem';

export interface ICartItem {
  product: IShopitem;
  quantity: number;
}
