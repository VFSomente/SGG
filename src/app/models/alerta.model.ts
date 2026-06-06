export interface Alerta {
  tipo: 'VALIDADE' | 'ESTOQUE' | 'VIATURA' | 'TROCA_OLEO' | 'TROCA_PNEUS';

  titulo: string;

  descricao: string;

  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
}
