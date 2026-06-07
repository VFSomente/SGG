import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Material } from '../../models/material.model';

@Component({
  selector: 'app-material-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-card.component.html',
  styleUrls: ['./material-card.component.css'],
})
export class MaterialCardComponent {

  @Input()
  material!: Material;

  @Output()
  editar = new EventEmitter<Material>();

  @Output()
  excluir = new EventEmitter<string>();

  @Output()
  entrada = new EventEmitter<Material>();

  @Output()
  saida = new EventEmitter<Material>();

  editarMaterial(): void {
    this.editar.emit(this.material);
  }

  excluirMaterial(): void {
    this.excluir.emit(this.material.id);
  }

  entradaMaterial(): void {
    this.entrada.emit(this.material);
  }

  saidaMaterial(): void {
    this.saida.emit(this.material);
  }

  diasParaVencer(): number {
    if (!this.material?.validade) {
      return 0;
    }

    const hoje = new Date();
    const validade = new Date(this.material.validade);

    if (isNaN(validade.getTime())) {
      return 0;
    }

    return Math.max(
      0,
      Math.ceil((validade.getTime() - hoje.getTime()) / 86400000)
    );
  }

  estoqueBaixo(): boolean {
    return this.material.quantidade <= this.material.estoqueMinimo;
  }
}
