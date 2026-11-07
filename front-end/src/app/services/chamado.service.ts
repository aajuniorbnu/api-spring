import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChamadoRequest, ChamadoResponse } from '../model/chamado.model';
@Injectable({ providedIn: 'root' })
export class ChamadoService {
  private url = '/api/chamados';
  constructor(private http: HttpClient) {}
  listar() { return this.http.get<ChamadoResponse[]>(this.url); }
  obterPorId(id: number) { return this.http.get<ChamadoResponse>(`${this.url}/${id}`); }
  criar(dado: ChamadoRequest) { return this.http.post<ChamadoResponse>(this.url, dado); }
  atualizar(id: number, dado: ChamadoRequest) { return this.http.put<ChamadoResponse>(`${this.url}/${id}`, dado); }
  apagar(id: number) { return this.http.delete<ChamadoResponse>(`${this.url}/${id}`); }
}
