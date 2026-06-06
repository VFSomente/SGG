import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Viatura } from '../../models/viatura.model';
import { ViaturaService } from '../../services/viatura.service';
import { ViaturaCardComponent } from '../../components/viatura-card/viatura-card.component';
import { MissaoService } from '../../services/missao.service';
import { ManutencaoService } from '../../services/manutencao.service';
import { Missao } from '../../models/missao.model';
import { Manutencao } from '../../models/manutencao.model';

@Component({
  selector: 'app-viatura-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, ViaturaCardComponent],
  templateUrl: './viatura-detalhe.component.html',
  styleUrls: ['./viatura-detalhe.component.css']
})
export class ViaturaDetalhe implements OnInit {
  viatura?: Viatura;
  missoes: Missao[] = [];
  manutencoes: Manutencao[] = [];

  abaAtiva: 'FICHA' | 'MISSOES' | 'MANUTENCOES' = 'FICHA';

  constructor(
    private route: ActivatedRoute,
    private viaturaService: ViaturaService,
    private missaoService: MissaoService,
    private manutencaoService: ManutencaoService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const idQuery = this.route.snapshot.queryParamMap.get('id');
    const id = idParam ?? idQuery;
    if (!id) return;

    this.viatura = this.viaturaService.getById(id);
    this.missoes = this.missaoService.getByViaturaId(id);
    this.manutencoes = this.manutencaoService.getByViaturaId(id);
  }

  selecionarAba(aba: 'FICHA' | 'MISSOES' | 'MANUTENCOES'): void {
    this.abaAtiva = aba;
  }

  async adicionarMissao() {
    if (!this.viatura) return;

    const descricao = prompt('Descrição da missão:');
    if (!descricao) return;

    const kmSaidaStr = prompt('Km saída:');
    const kmChegadaStr = prompt('Km chegada:');
    const kmSaida = Number(kmSaidaStr || 0);
    const kmChegada = Number(kmChegadaStr || 0);

    const observacao = prompt('Observação:') || '';

    const nova: Missao = {
      id: Date.now().toString(36),
      viaturaId: this.viatura.id,
      data: new Date().toISOString().split('T')[0],
      horaSaida: '',
      horaChegada: '',
      kmSaida,
      kmChegada,
      missao: descricao,
      observacao
    };

    this.missaoService.add(nova);
    this.missoes = this.missaoService.getByViaturaId(this.viatura.id);
    // viatura odometro atualizado pelo service
    this.viatura = this.viaturaService.getById(this.viatura.id);
  }

  adicionarManutencao() {
    if (!this.viatura) return;
    const servico = prompt('Serviço:');
    const profissional = prompt('Profissional:');
    if (!servico) return;

    const nova: Manutencao = {
      id: Date.now().toString(36),
      viaturaId: this.viatura.id,
      data: new Date().toISOString().split('T')[0],
      servico,
      profissional: profissional || '',
      observacao: ''
    };

    this.manutencaoService.add(nova);
    this.manutencoes = this.manutencaoService.getByViaturaId(this.viatura.id);
  }
}

export const getPrerenderParams = async () => [];
