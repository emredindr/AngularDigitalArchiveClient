import { Injectable } from '@angular/core';
// import * as localForage from 'localforage';

@Injectable()
export class LocalStorageService {

  getItem(key: string): any {
    if (!localStorage) return;
    return localStorage.getItem(key);
  }

  setItem(key: string, value: any): void {
    if (!localStorage) return;
    if (value === null) value = undefined;
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (!localStorage) return;
    localStorage.removeItem(key);
  }
}
