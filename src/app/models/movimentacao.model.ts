export interface Movimentacao {
  id: string;
  materialId: string;
  materialNome: string;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  data: string;
  responsavel: string;
  observacao?: string;
  viaturaId?: string;
}
