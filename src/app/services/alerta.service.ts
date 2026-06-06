import { Injectable } from '@angular/core';

import { Alerta } from '../models/alerta.model';
import { AlmoxarifadoService } from './almoxarifado.service';
import { ViaturaService } from './viatura.service';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor(
    private almoxarifadoService: AlmoxarifadoService,
    private viaturaService: ViaturaService
  ) {}

  getAlertas(): Alerta[] {
    const alertas: Alerta[] = [];

    this.adicionarAlertasValidade(alertas);
    this.adicionarAlertasEstoque(alertas);
    this.adicionarAlertasViaturas(alertas);

    return alertas;
  }

  private adicionarAlertasValidade(alertas: Alerta[]): void {
    const materiais = this.almoxarifadoService.getAll();
    const hoje = new Date();

    materiais.forEach(material => {
      const validade = new Date(material.validade);
      if (isNaN(validade.getTime())) {
        return;
      }

      const dias = Math.ceil((validade.getTime() - hoje.getTime()) / 86400000);
      if (dias > 30) {
        return;
      }

      const prioridade: Alerta['prioridade'] = dias <= 7 ? 'ALTA' : 'MEDIA';

      alertas.push({
        tipo: 'VALIDADE',
        titulo: `Validade próxima: ${material.nome}`,
        descricao: `${material.nome} vence em ${dias} dia(s)`,
        prioridade
      });
    });
  }

  private adicionarAlertasEstoque(alertas: Alerta[]): void {
    const materiais = this.almoxarifadoService.getAll();

    materiais.forEach(material => {
      if (material.quantidade > material.estoqueMinimo) {
        return;
      }

      const prioridade: Alerta['prioridade'] = material.quantidade <= 0 ? 'ALTA' : 'MEDIA';

      alertas.push({
        tipo: 'ESTOQUE',
        titulo: `Estoque baixo: ${material.nome}`,
        descricao: `Quantidade atual ${material.quantidade}, mínimo ${material.estoqueMinimo}`,
        prioridade
      });
    });
  }

  private adicionarAlertasViaturas(alertas: Alerta[]): void {
    const viaturas = this.viaturaService.getAll();

    viaturas.forEach(viatura => {
      if (viatura.status !== 'BAIXADA') {
        return;
      }

      alertas.push({
        tipo: 'VIATURA',
        titulo: `Viatura baixada: ${viatura.prefixo}`,
        descricao: `${viatura.prefixo} está baixada`,
        prioridade: 'ALTA'
      });
    });
  }
}
