import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TicketRequest, TicketResponse, Prioridade } from '../model/ticket.model';
@Injectable({ providedIn: 'root' })
export class TicketService {
  private url = '/api/tickets';
  constructor(private http: HttpClient) {}
  listar() { return this.http.get<TicketResponse[]>(this.url); }
  criar(dado: TicketRequest) { return this.http.post<TicketResponse>(this.url, dado); }
  associar(id: number, usuarioId: number) { return this.http.post<TicketResponse>(`${this.url}/${id}/associar`, { usuarioId }); }
  cancelar(id: number, motivoCancelamento: string) { return this.http.post<TicketResponse>(`${this.url}/${id}/cancelar`, { motivoCancelamento }); }
  resolver(id: number, descricaoSolucao: string) { return this.http.post<TicketResponse>(`${this.url}/${id}/resolver`, { descricaoSolucao }); }
  definirPrioridade(id: number, prioridade: Prioridade) { return this.http.post<TicketResponse>(`${this.url}/${id}/definir-prioridade`, { prioridade }); }
}
