export type Papel = 'SOLICITANTE' | 'ATENDENTE';

export interface UsuarioRequest {
  nome: string;
  email: string;
  papel: Papel;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
}