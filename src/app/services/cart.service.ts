import { Injectable } from '@angular/core';
import { IShopitem } from 'src/app/model/entities/shopitem';
import { ICartItem } from '../model/cart-item.interface';

@Injectable()
export class CCartService {
  private storageKey = 'cart_items';
  private items: ICartItem[] = [];

  constructor() {
    this.load();
  }

  public add(product: IShopitem, quantity: number): void {
    this.items.push({ product, quantity });
    this.save();
  }

  public getItems(): ICartItem[] {
    return this.items;
  }

  public clear(): void {
    this.items = [];
    this.save();
  }

  public remove(index: number): void {
    this.items.splice(index, 1);
    this.save();
  }

  private save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      // handle storage error if needed
    }
  }

  private load(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      this.items = data ? JSON.parse(data) : [];
    } catch (e) {
      this.items = [];
    }
  }
}
