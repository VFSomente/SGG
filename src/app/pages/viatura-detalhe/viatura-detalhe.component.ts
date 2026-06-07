import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Viatura } from '../../models/viatura.model';
import { ViaturaService } from '../../services/viatura.service';
import { ViaturaCardComponent } from '../../components/viatura-card/viatura-card.component';
import { ManutencaoFormComponent } from '../../components/manutencao-form/manutencao-form.component';
import { MissaoFormComponent } from '../../components/missao-form/missao-form.component';
import { MissaoService } from '../../services/missao.service';
import { ManutencaoService } from '../../services/manutencao.service';
import { Missao } from '../../models/missao.model';
import { Manutencao } from '../../models/manutencao.model';

@Component({
  selector: 'app-viatura-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, ViaturaCardComponent, ManutencaoFormComponent, MissaoFormComponent],
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

  mostrarFormularioMissao = false;
  missaoEditando?: Missao;

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

  abrirFormularioMissao(missao?: Missao): void {
    this.missaoEditando = missao;
    this.mostrarFormularioMissao = true;
  }

  fecharFormularioMissao(): void {
    this.mostrarFormularioMissao = false;
    this.missaoEditando = undefined;
  }

  salvarMissao(missao: Missao): void {
    if (this.missaoEditando) {
      this.missaoService.update(missao);
    } else {
      this.missaoService.add(missao);
    }

    if (this.viatura) {
      this.missoes = this.missaoService.getByViaturaId(this.viatura.id);
      this.viatura = this.viaturaService.getById(this.viatura.id);
    }

    this.fecharFormularioMissao();
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
