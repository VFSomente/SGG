import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movimentacao } from '../models/movimentacao.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {
  private readonly STORAGE_KEY = 'movimentacoes';

  private subject = new BehaviorSubject<Movimentacao[]>([]);

  movimentacoes$ = this.subject.asObservable();

  constructor(private storage: StorageService) {
    this.load();
  }

  private load(): void {
    const dados = this.storage.get<Movimentacao[]>(this.STORAGE_KEY) || [];
    this.subject.next(dados);
  }

  private save(list: Movimentacao[]): void {
    this.storage.save(this.STORAGE_KEY, list);
    this.subject.next(list);
  }

  getAll(): Movimentacao[] {
    return this.subject.value;
  }

  add(item: Movimentacao): void {
    const list = [...this.getAll(), item];
    this.save(list);
  }

  delete(id: string): void {
    this.save(this.getAll().filter(item => item.id !== id));
  }

  getByMaterial(materialId: string): Movimentacao[] {
    return this.getAll().filter(item => item.materialId === materialId);
  }

  getByViatura(viaturaId: string): Movimentacao[] {
    return this.getAll().filter(item => item.viaturaId === viaturaId);
  }
}
