import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private hasLocalStorage(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch {
      return false;
    }
  }

  save<T>(key: string, data: T): void {
    if (!this.hasLocalStorage()) return;

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore storage errors on server or private mode
    }
  }

  get<T>(key: string): T | null {
    if (!this.hasLocalStorage()) return null;

    try {
      const data = localStorage.getItem(key);

      if (!data) return null;

      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    if (!this.hasLocalStorage()) return;

    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  clear(): void {
    if (!this.hasLocalStorage()) return;

    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }
}