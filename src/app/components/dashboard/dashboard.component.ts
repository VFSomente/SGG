import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { ViaturaService } from '../../services/viatura.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalMateriais = 0;

  totalViaturas = 0;

  itensVencendo = 0;

  viaturasBaixadas = 0;

  constructor(
    private almoxarifadoService: AlmoxarifadoService,
    private viaturaService: ViaturaService
  ) {}

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  carregarIndicadores(): void {

    const materiais =
      this.almoxarifadoService.getAll();

    const viaturas =
      this.viaturaService.getAll();

    this.totalMateriais =
      materiais.length;

    this.totalViaturas =
      viaturas.length;

    this.itensVencendo =
      materiais.filter(material => {

        const hoje = new Date();

        const validade =
          new Date(material.validade);

        const dias =
          (validade.getTime() - hoje.getTime())
          / 86400000;

        return dias <= 30;

      }).length;

    this.viaturasBaixadas =
      viaturas.filter(
        v => v.status === 'BAIXADA'
      ).length;
  }

}