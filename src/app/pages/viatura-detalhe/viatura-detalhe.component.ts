import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Viatura } from '../../models/viatura.model';
import { ViaturaService } from '../../services/viatura.service';
import { ViaturaCardComponent } from '../../components/viatura-card/viatura-card.component';
import { ManutencaoFormComponent } from '../../components/manutencao-form/manutencao-form.component';
import { MissaoService } from '../../services/missao.service';
import { ManutencaoService } from '../../services/manutencao.service';
import { Missao } from '../../models/missao.model';
import { Manutencao } from '../../models/manutencao.model';

@Component({
  selector: 'app-viatura-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, ViaturaCardComponent, ManutencaoFormComponent],
  templateUrl: './viatura-detalhe.component.html',
  styleUrls: ['./viatura-detalhe.component.css']
})
export class ViaturaDetalhe implements OnInit {
  viatura?: Viatura;
  missoes: Missao[] = [];
  manutencoes: Manutencao[] = [];

  abaAtiva: 'FICHA' | 'MISSOES' | 'MANUTENCOES' = 'FICHA';

  mostrarFormularioManutencao = false;
  manutencaoEditando?: Manutencao;

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

  abrirFormularioManutencao(manutencao?: Manutencao): void {
    this.manutencaoEditando = manutencao;
    this.mostrarFormularioManutencao = true;
  }

  fecharFormularioManutencao(): void {
    this.mostrarFormularioManutencao = false;
    this.manutencaoEditando = undefined;
  }

  salvarManutencao(manutencao: Manutencao): void {
    if (this.manutencaoEditando) {
      this.manutencaoService.update(manutencao);
    } else {
      this.manutencaoService.add(manutencao);
    }

    if (this.viatura) {
      this.manutencoes = this.manutencaoService.getByViaturaId(this.viatura.id);
    }

    this.fecharFormularioManutencao();
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

  getKmParaTrocaOleo(): number {
    if (!this.viatura) return 0;
    return this.viatura.proximaTrocaOleo - this.viatura.odometroAtual;
  }

  getKmParaTrocaPneus(): number {
    if (!this.viatura) return 0;
    return this.viatura.proximaTrocaPneus - this.viatura.odometroAtual;
  }
}

export const getPrerenderParams = async () => [];
