import {Injectable} from '@angular/core';

import {Nullable} from '@shared/types';

@Injectable()
export class LocalStorageService {
  getItem(key: string): Nullable<string> {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
