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

  getByViaturaId(viaturaId: string): Manutencao[] {
    return this.subject.value.filter(m => m.viaturaId === viaturaId);
  }

  add(m: Manutencao): void {
    const list = this.subject.value;
    list.push(m);
    this.save(list);
  }

  delete(id: string): void {
    this.save(this.subject.value.filter(m => m.id !== id));
  }
}
