import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Missao } from '../models/missao.model';
import { StorageService } from './storage.service';
import { ViaturaService } from './viatura.service';

@Injectable({ providedIn: 'root' })
export class MissaoService {
  private readonly STORAGE_KEY = 'missoes';

  private subject = new BehaviorSubject<Missao[]>([]);

  missoes$ = this.subject.asObservable();

  constructor(
    private storage: StorageService,
    private viaturaService: ViaturaService
  ) {
    this.load();
  }

  private load(): void {
    const dados = this.storage.get<Missao[]>(this.STORAGE_KEY) || [];
    this.subject.next(dados);
  }

  private save(list: Missao[]): void {
    this.storage.save(this.STORAGE_KEY, list);
    this.subject.next(list);
  }

  getByViaturaId(viaturaId: string): Missao[] {
    return this.subject.value.filter(m => m.viaturaId === viaturaId);
  }

  getAll(): Missao[] {
    return this.subject.value;
  }

  update(missao: Missao): void {
    const list = this.subject.value;
    const idx = list.findIndex(m => m.id === missao.id);
    if (idx !== -1) {
      list[idx] = missao;
      this.save(list);
    }
  }

  add(m: Missao): void {
    const list = this.subject.value;
    list.push(m);
    this.save(list);

    // Atualizar odômetro da viatura automaticamente
    const kmChegada = m.kmChegada || m.kmSaida;
    const viatura = this.viaturaService.getById(m.viaturaId);
    if (viatura) {
      viatura.odometroAtual = kmChegada;
      this.viaturaService.update(viatura);
    }
  }

  delete(id: string): void {
    this.save(this.subject.value.filter(m => m.id !== id));
  }
}
