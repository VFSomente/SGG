import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Viatura } from '../models/viatura.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ViaturaService {

  private readonly STORAGE_KEY = 'viaturas';

  private viaturasSubject =
    new BehaviorSubject<Viatura[]>([]);

  viaturas$ = this.viaturasSubject.asObservable();

  constructor(
    private storage: StorageService
  ) {
    this.load();
  }

  private load(): void {
    const dados =
      this.storage.get<Viatura[]>(this.STORAGE_KEY) || [];

    this.viaturasSubject.next(dados);
  }

  private save(data: Viatura[]): void {
    this.storage.save(this.STORAGE_KEY, data);
    this.viaturasSubject.next(data);
  }

  getAll(): Viatura[] {
    return this.viaturasSubject.value;
  }

  getById(id: string): Viatura | undefined {
    return this.getAll().find(v => v.id === id);
  }

  add(viatura: Viatura): void {
    const lista = this.getAll();

    lista.push(viatura);

    this.save(lista);
  }

  update(viatura: Viatura): void {
    const lista = this.getAll();

    const index =
      lista.findIndex(v => v.id === viatura.id);

    if (index !== -1) {
      lista[index] = viatura;
      this.save(lista);
    }
  }

  delete(id: string): void {
    this.save(
      this.getAll().filter(v => v.id !== id)
    );
  }
}