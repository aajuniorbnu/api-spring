import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaCadastrarRequest, CategoriaResponse } from '../model/categoria.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private baseUrl: string = 'http://localhost:8080';
constructor(private httpClient: HttpClient) {
}
cadastrarCategoria(categoria:CategoriaCadastrarRequest):Observable<void>  {
  const url= this.baseUrl + '/categorias';
  return this.httpClient.post<void>(url, categoria);
}
listar(): Observable<CategoriaResponse[]> {
  const url = this.baseUrl + '/categorias';
  return this.httpClient.get<CategoriaResponse[]>(url);
}
apagar(id: number): Observable<void> {
  const url = this.baseUrl + '/categorias/' + id;
  return this.httpClient.delete<void>(url);
}
}
