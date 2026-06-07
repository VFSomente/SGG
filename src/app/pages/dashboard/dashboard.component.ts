import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Alerta } from '../../models/alerta.model';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { AlertaService } from '../../services/alerta.service';
import { ViaturaService } from '../../services/viatura.service';
import { MovimentacaoService } from '../../services/movimentacao.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  totalMateriais = 0;

  totalViaturas = 0;

  itensVencendo = 0;

  viaturasBaixadas = 0;

  viaturasRecentes: any[] = [];

  movimentacoesRecentes: any[] = [];

  alertas: Alerta[] = [];

  constructor(
    private almoxarifadoService: AlmoxarifadoService,
    private viaturaService: ViaturaService,
    private alertaService: AlertaService,
    private movimentacaoService: MovimentacaoService
  ) {}

  ngOnInit(): void {
    this.carregarIndicadores();
    this.alertas = this.alertaService.getAlertas();
    this.viaturasRecentes = this.viaturaService.getAll().slice(0, 5);
    this.movimentacoesRecentes = this.movimentacaoService.getAll()
      .slice()
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 5);
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

  getViaturaPrefixo(id: string): string | undefined {
    return this.viaturaService.getById(id)?.prefixo;
  }

}
