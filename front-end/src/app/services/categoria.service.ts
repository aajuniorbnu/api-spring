import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaCriarDto } from '../dtos/categoria/categoria-criar.dto';
import { CategoriaAtualizarDto } from '../dtos/categoria/categoria-atualizar.dto';
import { CategoriaRespostaDto } from '../dtos/categoria/categoria-resposta.dto';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private baseUrl = '/api/categorias';

  constructor(private httpClient: HttpClient) {}

  cadastrarCategoria(categoria: CategoriaCriarDto): Observable<CategoriaRespostaDto> {
    return this.httpClient.post<CategoriaRespostaDto>(this.baseUrl, categoria);
  }

  listar(): Observable<CategoriaRespostaDto[]> {
    return this.httpClient.get<CategoriaRespostaDto[]>(this.baseUrl);
  }

  obterPorId(id: number): Observable<CategoriaRespostaDto> {
    return this.httpClient.get<CategoriaRespostaDto>(this.baseUrl + '/' + id);
  }

  atualizar(id: number, categoria: CategoriaAtualizarDto): Observable<CategoriaRespostaDto> {
    return this.httpClient.put<CategoriaRespostaDto>(this.baseUrl + '/' + id, categoria);
  }

  apagar(id: number): Observable<CategoriaRespostaDto> {
    return this.httpClient.delete<CategoriaRespostaDto>(this.baseUrl + '/' + id);
  }
}
