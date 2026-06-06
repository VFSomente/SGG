import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Manutencao } from '../models/manutencao.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ManutencaoService {
  private readonly STORAGE_KEY = 'manutencoes';

  private subject = new BehaviorSubject<Manutencao[]>([]);

  manutencoes$ = this.subject.asObservable();

  constructor(private storage: StorageService) {
    this.load();
  }

  private load(): void {
    const dados = this.storage.get<Manutencao[]>(this.STORAGE_KEY) || [];
    this.subject.next(dados);
  }

  private save(list: Manutencao[]): void {
    this.storage.save(this.STORAGE_KEY, list);
    this.subject.next(list);
  }

  getAll(): Manutencao[] {
    return this.subject.value;
  }

  getByViatura(viaturaId: string): Manutencao[] {
    return this.getAll().filter(m => m.viaturaId === viaturaId);
  }

  getByViaturaId(viaturaId: string): Manutencao[] {
    return this.getByViatura(viaturaId);
  }

  add(m: Manutencao): void {
    const list = this.getAll();
    list.push(m);
    this.save(list);
  }

  update(m: Manutencao): void {
    const list = this.getAll();
    const idx = list.findIndex(x => x.id === m.id);
    if (idx !== -1) {
      list[idx] = m;
      this.save(list);
    }
  }

  delete(id: string): void {
    this.save(this.getAll().filter(m => m.id !== id));
  }
}
