import { UsuarioResponse } from './usuario.model';
export type Setor = 'TI' | 'RH' | 'FINANCEIRO' | 'ADMINSTRACAO' | 'MANUTENCAO';
export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA';
export interface TicketRequest { titulo: string; descricao: string; setor: Setor; solicitante_id: number | null; }
export interface TicketResponse {
  id: number; titulo: string; descricao: string; numeroProtocolo: string;
  setor: Setor; status: 'ABERTO' | 'EM_ANALISE' | 'RESOLVIDO' | 'CANCELADO';
  prioridade: Prioridade | null; solicitante: UsuarioResponse | null; atendente: UsuarioResponse | null;
  descricaoSolucao: string | null; motivoCancelamento: string | null;
  dataCriacao: string; dataAtualizacao: string | null;
}
