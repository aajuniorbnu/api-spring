import { CategoriaResponse } from './categoria.model';
import { UsuarioResponse } from './usuario.model';

export type PrioridadeChamado =
  | 'BAIXA'
  | 'MEDIA'
  | 'ALTA'
  | 'URGENTE';

export type StatusChamado =
  | 'ABERTO'
  | 'EM_ANDAMENTO'
  | 'RESOLVIDO'
  | 'FECHADO';

export interface ChamadoRequest {
  titulo: string;
  descricao: string;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  prazo: string;
  categoriaId: number | null;
  solicitanteId: number | null;
}

export interface ChamadoResponse {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  prazo: string;
  categoria: CategoriaResponse;
  solicitante: UsuarioResponse;
  ativo: boolean;
}