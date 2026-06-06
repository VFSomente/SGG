export interface Manutencao {
  id: string;
  viaturaId: string;
  data: string;
  servico: string;
  profissional: string;
  observacao: string;
  pecasUtilizadas: string[];
  custo?: number;
}