import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Material } from '../models/material.model';
import { StorageService } from './storage.service';
import { MovimentacaoService } from './movimentacao.service';

@Injectable({
  providedIn: 'root'
})
export class AlmoxarifadoService {

  private readonly STORAGE_KEY = 'materiais';

  private materiaisSubject =
    new BehaviorSubject<Material[]>([]);

  materiais$ = this.materiaisSubject.asObservable();

  constructor(
    private storage: StorageService,
    private movimentacaoService: MovimentacaoService
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

  getById(id: string): Material | undefined {
    return this.getAll().find(m => m.id === id);
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
    this.registrarSaida(id, quantidade, 'Sistema');
  }

  registrarEntrada(
    materialId: string,
    quantidade: number,
    responsavel: string,
    observacao?: string
  ): void {
    const material = this.getById(materialId);

    if (!material) {
      return;
    }

    material.quantidade += quantidade;
    this.update(material);

    this.movimentacaoService.add({
      id: crypto.randomUUID(),
      materialId: material.id,
      materialNome: material.nome,
      tipo: 'ENTRADA',
      quantidade,
      data: new Date().toISOString(),
      responsavel,
      observacao
    });
  }

  registrarSaida(
    materialId: string,
    quantidade: number,
    responsavel: string,
    observacao?: string,
    viaturaId?: string
  ): void {
    const material = this.getById(materialId);

    if (!material) {
      return;
    }

    material.quantidade -= quantidade;

    if (material.quantidade < 0) {
      material.quantidade = 0;
    }

    this.update(material);

    this.movimentacaoService.add({
      id: crypto.randomUUID(),
      materialId: material.id,
      materialNome: material.nome,
      tipo: 'SAIDA',
      quantidade,
      data: new Date().toISOString(),
      responsavel,
      observacao,
      viaturaId
    });
  }
}
