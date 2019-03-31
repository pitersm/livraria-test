import { Injectable } from '@angular/core';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor() { }
  items: Item[];

  getItem(name: string) {
    return JSON.parse(localStorage.getItem(name)) as Item;
  }

  saveItem(item: Item) {
    localStorage.setItem(item.name, JSON.stringify(item));
  }

  listItems() {
    this.items = [];
    for (let i = 0, len = localStorage.length; i < len; i++) {
      const key = localStorage.key(i);
      this.items.push(JSON.parse(localStorage.getItem(key)) as Item);
    }
    return this.items;
  }

  checkIfExists(name: string) {
    return this.listItems().map((i) => i.name).includes(name);
  }

  deleteItem(name: string) {
    localStorage.removeItem(name);
  }

  showLocalStorage() {
    let amount = 0;
    let size = 0;
    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(amount, key, value);
      size += key.length + value.length;
      amount++;
    }
    console.log('Total entries:', amount);
    console.log('Total size:', size);
  }
}
