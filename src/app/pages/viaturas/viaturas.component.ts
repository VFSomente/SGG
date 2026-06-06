import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Viatura } from '../../models/viatura.model';
import { ViaturaService } from '../../services/viatura.service';
import { ViaturaFormComponent } from '../../components/viatura-form/viatura-form.component';
import { ViaturaCardComponent } from '../../components/viatura-card/viatura-card.component';

@Component({
  selector: 'app-viaturas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ViaturaFormComponent, ViaturaCardComponent],
  templateUrl: './viaturas.component.html',
  styleUrls: ['./viaturas.component.css'],
})
export class Viaturas implements OnInit {

  viaturas: Viatura[] = [];
  viaturasFiltradas: Viatura[] = [];

  pesquisa = '';

  mostrarFormulario = false;

  viaturaEditando?: Viatura;

  constructor(
    private viaturaService: ViaturaService
  ) {}

  ngOnInit(): void {
    this.carregarViaturas();
  }

  private carregarViaturas(): void {
    this.viaturas = this.viaturaService.getAll();

    this.viaturasFiltradas = [...this.viaturas];
  }


  pesquisar(): void {
    const termo = this.pesquisa.toLowerCase();

    this.viaturasFiltradas = this.viaturas.filter(v =>
      v.prefixo.toLowerCase().includes(termo) ||
      v.placa.toLowerCase().includes(termo) ||
      v.modelo.toLowerCase().includes(termo)
    );
  }

  abrirCadastro(): void {
    this.viaturaEditando = undefined;
    this.mostrarFormulario = true;
  }

  abrirFormulario(viatura?: Viatura): void {
    this.viaturaEditando = viatura;
    this.mostrarFormulario = true;
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
    this.viaturaEditando = undefined;
  }

  editarViatura(viatura: Viatura): void {
    this.abrirFormulario(viatura);
  }

  removerViatura(id: string): void {
    this.viaturaService.delete(id);
    this.carregarViaturas();
  }

  salvarViatura(viatura: Viatura): void {
    const existe = this.viaturas.some(v => v.id === viatura.id);

    if (existe) {
      this.viaturaService.update(viatura);
    } else {
      this.viaturaService.add(viatura);
    }

    this.carregarViaturas();

    this.mostrarFormulario = false;
  }
}
