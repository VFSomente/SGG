import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Material } from '../../models/material.model';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { AlmoxarifadoFormComponent } from '../almoxarifado-form/almoxarifado-form.component';

@Component({
  selector: 'app-almoxarifado',

  standalone: true,
  imports: [CommonModule, FormsModule, AlmoxarifadoFormComponent],
  templateUrl: './almoxarifado.component.html',
  styleUrls: ['./almoxarifado.component.css']
})
export class AlmoxarifadoComponent implements OnInit {

  materiais: Material[] = [];
  materiaisFiltrados: Material[] = [];

  pesquisa = '';
  categoriaSelecionada = 'Todos';

  categorias = [
    'Todos',
    'Limpeza',
    'Ferramentas',
    'Lubrificantes',
    'Peças',
    'EPIs'
  ];

  mostrarFormulario = false;

  materialEditando?: Material;

  constructor(
    private almoxarifadoService: AlmoxarifadoService
  ) {}

  ngOnInit(): void {
    this.carregarMateriais();
  }

  carregarMateriais(): void {
    this.materiais =
      this.almoxarifadoService.getAll();

    this.materiaisFiltrados =
      [...this.materiais];
  }

  pesquisar(): void {

    this.materiaisFiltrados =
      this.materiais.filter(material =>
        material.nome
          .toLowerCase()
          .includes(this.pesquisa.toLowerCase())
      );
  }

  filtrarCategoria(categoria: string): void {

    this.categoriaSelecionada = categoria;

    if (categoria === 'Todos') {
      this.materiaisFiltrados =
        [...this.materiais];
      return;
    }

    this.materiaisFiltrados =
      this.materiais.filter(
        item => item.categoria === categoria
      );
  }

  entrada(material: Material): void {

    const quantidade =
      Number(prompt('Quantidade de entrada'));

    if (!quantidade || quantidade <= 0) {
      return;
    }

    this.almoxarifadoService
      .entrada(material.id, quantidade);

    this.carregarMateriais();
  }

  saida(material: Material): void {

    const quantidade =
      Number(prompt('Quantidade de saída'));

    if (!quantidade || quantidade <= 0) {
      return;
    }

    this.almoxarifadoService
      .saida(material.id, quantidade);

    this.carregarMateriais();
  }

  excluir(material: Material): void {

    const confirmar =
      confirm(`Excluir ${material.nome}?`);

    if (!confirmar) {
      return;
    }

    this.almoxarifadoService
      .delete(material.id);

    this.carregarMateriais();
  }

  abrirNovoMaterial(): void {
    this.materialEditando = undefined;
    this.mostrarFormulario = true;
  }

  editarMaterial(material: Material): void {
    this.materialEditando = material;
    this.mostrarFormulario = true;
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
  }

  salvarMaterial(material: Material): void {

    const existe =
      this.materiais.some(m => m.id === material.id);

    if (existe) {
      this.almoxarifadoService.update(material);
    } else {
      this.almoxarifadoService.add(material);
    }

    this.carregarMateriais();
    this.fecharFormulario();
  }

  getCorCategoria(categoria: string): string {

    switch (categoria) {

      case 'Limpeza':
        return '#3498db';

      case 'Ferramentas':
        return '#e67e22';

      case 'Lubrificantes':
        return '#27ae60';

      case 'Peças':
        return '#c0392b';

      case 'EPIs':
        return '#f1c40f';

      default:
        return '#2c3e50';
    }
  }

    isVencendo(material: Material): boolean {
      if (!material.validade) return false;

      const hoje = new Date();

      const validade = new Date(material.validade);

      if (isNaN(validade.getTime())) return false;

      const dias = (validade.getTime() - hoje.getTime()) / 86400000;

      return dias <= 30;
    }
}