import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { ViaturaService } from '../../services/viatura.service';
import { MissaoService } from '../../services/missao.service';
import { ManutencaoService } from '../../services/manutencao.service';
import { MovimentacaoService } from '../../services/movimentacao.service';

interface SearchResult {
  categoria: string;
  titulo: string;
  subtitulo?: string;
  detalhe?: string;
  extra?: string;
}

@Component({
  selector: 'app-pesquisa-global',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pesquisa-global.component.html',
  styleUrls: ['./pesquisa-global.component.css']
})
export class PesquisaGlobalComponent {
  pesquisa = '';
  resultados: SearchResult[] = [];

  constructor(
    private almoxarifadoService: AlmoxarifadoService,
    private viaturaService: ViaturaService,
    private missaoService: MissaoService,
    private manutencaoService: ManutencaoService,
    private movimentacaoService: MovimentacaoService
  ) {}

  pesquisar(valor: string): void {
    this.pesquisa = valor.trim();

    if (!this.pesquisa) {
      this.resultados = [];
      return;
    }

    const termo = this.pesquisa.toLowerCase();

    this.resultados = [
      ...this.searchViaturas(termo),
      ...this.searchMateriais(termo),
      ...this.searchMissoes(termo),
      ...this.searchManutencoes(termo),
      ...this.searchMovimentacoes(termo)
    ].slice(0, 10);
  }

  private searchViaturas(termo: string): SearchResult[] {
    return this.viaturaService.getAll()
      .filter(v => [v.prefixo, v.placa, v.modelo, v.marca, v.tipo, v.status].some(field => field?.toLowerCase().includes(termo)))
      .map(v => ({
        categoria: 'Viatura',
        titulo: `${v.prefixo} • ${v.placa}`,
        subtitulo: `Status: ${v.status}`,
        detalhe: `${v.marca} ${v.modelo}`,
        extra: `Última manutenção: ${this.getUltimaManutencao(v.id)}`
      }));
  }

  private searchMateriais(termo: string): SearchResult[] {
    return this.almoxarifadoService.getAll()
      .filter(m => [m.nome, m.categoria, m.localizacao].some(field => field?.toLowerCase().includes(termo)))
      .map(m => ({
        categoria: 'Material',
        titulo: m.nome,
        subtitulo: `Quantidade: ${m.quantidade}`,
        detalhe: `Categoria: ${m.categoria}`,
        extra: `Local: ${m.localizacao}`
      }));
  }

  private searchMissoes(termo: string): SearchResult[] {
    return this.missaoService.getAll()
      .filter(m => [m.missao, m.observacao, m.viaturaId].some(field => field?.toLowerCase().includes(termo)))
      .map(m => ({
        categoria: 'Missão',
        titulo: m.missao,
        subtitulo: `Data: ${m.data}`,
        detalhe: `Viatura: ${this.getViaturaPrefixo(m.viaturaId) || m.viaturaId}`,
        extra: m.observacao
      }));
  }

  private searchManutencoes(termo: string): SearchResult[] {
    return this.manutencaoService.getAll()
      .filter(m => [m.servico, m.observacao, m.profissional, m.viaturaId].some(field => field?.toLowerCase().includes(termo)))
      .map(m => ({
        categoria: 'Manutenção',
        titulo: m.servico,
        subtitulo: `Profissional: ${m.profissional}`,
        detalhe: `Viatura: ${this.getViaturaPrefixo(m.viaturaId) || m.viaturaId}`,
        extra: `Data: ${m.data}`
      }));
  }

  private searchMovimentacoes(termo: string): SearchResult[] {
    return this.movimentacaoService.getAll()
      .filter(item => [item.materialNome, item.tipo, item.responsavel, item.observacao, item.viaturaId].some(field => field?.toLowerCase().includes(termo)))
      .map(item => ({
        categoria: 'Movimentação',
        titulo: `${item.tipo} • ${item.materialNome}`,
        subtitulo: `${item.quantidade} ${item.quantidade === 1 ? 'unidade' : 'unidades'}`,
        detalhe: `Responsável: ${item.responsavel}`,
        extra: item.viaturaId ? `Viatura: ${this.getViaturaPrefixo(item.viaturaId) || item.viaturaId}` : `Data: ${new Date(item.data).toLocaleDateString()}`
      }));
  }

  private getViaturaPrefixo(id: string): string | undefined {
    return this.viaturaService.getById(id)?.prefixo;
  }

  private getUltimaManutencao(viaturaId: string): string {
    const manutencoes = this.manutencaoService.getByViatura(viaturaId);
    if (!manutencoes.length) {
      return 'Não encontrada';
    }
    const ultima = manutencoes
      .slice()
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
    return ultima.data;
  }
}
