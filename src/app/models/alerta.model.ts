export interface Alerta {
  tipo: 'VALIDADE' | 'ESTOQUE' | 'VIATURA';

  titulo: string;

  descricao: string;

  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
}
