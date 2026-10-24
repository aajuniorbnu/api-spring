export interface CategoriaCadastrarRequest {
    nome: string;
    descricao: string;
}
export interface CategoriaResponse {
    id: number;
    nome: string;
    descricao: string;
    ativa: boolean;


}