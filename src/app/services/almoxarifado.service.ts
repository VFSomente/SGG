import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Material } from '../models/material.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AlmoxarifadoService {

  private readonly STORAGE_KEY = 'materiais';

  private materiaisSubject =
    new BehaviorSubject<Material[]>([]);

  materiais$ = this.materiaisSubject.asObservable();

  constructor(
    private storage: StorageService
  ) {
    this.load();
  }

  private load(): void {
    const dados =
      this.storage.get<Material[]>(this.STORAGE_KEY) || [];

    this.materiaisSubject.next(dados);
  }

  private save(data: Material[]): void {
    this.storage.save(this.STORAGE_KEY, data);
    this.materiaisSubject.next(data);
  }

  getAll(): Material[] {
    return this.materiaisSubject.value;
  }

  add(material: Material): void {
    const lista = this.getAll();

    lista.push(material);

    this.save(lista);
  }

  update(material: Material): void {
    const lista = this.getAll();

    const index =
      lista.findIndex(m => m.id === material.id);

    if (index >= 0) {
      lista[index] = material;
      this.save(lista);
    }
  }

  delete(id: string): void {
    const lista =
      this.getAll().filter(m => m.id !== id);

    this.save(lista);
  }

  entrada(id: string, quantidade: number): void {
    const item =
      this.getAll().find(x => x.id === id);

    if (!item) return;

    item.quantidade += quantidade;

    this.update(item);
  }

  saida(id: string, quantidade: number): void {
    const item =
      this.getAll().find(x => x.id === id);

    if (!item) return;

    item.quantidade -= quantidade;

    if (item.quantidade < 0) {
      item.quantidade = 0;
    }

    this.update(item);
  }
}