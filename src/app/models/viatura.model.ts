export interface Viatura {
  id: string;
  prefixo: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  chassi: string;
  tipo: 'AMBULANCIA' | 'VAN' | 'ADMINISTRATIVO';
  status: 'ATIVA' | 'MANUTENCAO' | 'BAIXADA';
  tipoOleo: string;
  capacidadeTanque: number;
  odometroAtual: number;
  proximaTrocaOleo: number;
  proximaTrocaPneus: number;
  observacao?: string;
}