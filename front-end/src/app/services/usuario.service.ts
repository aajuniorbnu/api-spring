import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioRequest, UsuarioResponse } from '../model/usuario.model';
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = '/api/usuarios';
  constructor(private http: HttpClient) {}
  listar() { return this.http.get<UsuarioResponse[]>(this.url); }
  obterPorId(id: number) { return this.http.get<UsuarioResponse>(`${this.url}/${id}`); }
  criar(dado: UsuarioRequest) { return this.http.post<UsuarioResponse>(this.url, dado); }
  atualizar(id: number, dado: UsuarioRequest) { return this.http.put<UsuarioResponse>(`${this.url}/${id}`, dado); }
  apagar(id: number) { return this.http.delete<UsuarioResponse>(`${this.url}/${id}`); }
}
