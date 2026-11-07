import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { UsuarioService } from '../../services/usuario.service';
import { TicketResponse, Prioridade } from '../../model/ticket.model';
import { UsuarioResponse } from '../../model/usuario.model';
type Acao = 'associar' | 'prioridade' | 'resolver' | 'cancelar';
@Component({ selector: 'app-ticket-listar', imports: [FormsModule, RouterLink], templateUrl: './listar.html' })
export class TicketListar {
  itens = signal<TicketResponse[]>([]); atendentes = signal<UsuarioResponse[]>([]);
  carregando = signal(false); ocupado = signal(false); erro = signal(''); mensagem = signal('');
  selecionado = signal<TicketResponse | null>(null); acao: Acao = 'associar';
  usuarioId: number | null = null; prioridade: Prioridade = 'MEDIA'; texto = '';
  constructor(private service: TicketService, private usuarios: UsuarioService) {}
  ngOnInit() { this.carregar(); }
  carregar() {
    this.carregando.set(true); this.erro.set('');
    forkJoin({ tickets: this.service.listar(), usuarios: this.usuarios.listar() }).subscribe({
      next: dados => { this.itens.set(dados.tickets); this.atendentes.set(dados.usuarios.filter(u => u.papel === 'ATENDENTE')); this.carregando.set(false); },
      error: () => { this.erro.set('Não foi possível carregar tickets e atendentes. Verifique se o servidor está ligado.'); this.carregando.set(false); }
    });
  }
  abrir(item: TicketResponse, acao: Acao) {
    this.selecionado.set(item); this.acao = acao; this.usuarioId = null;
    this.texto = ''; this.prioridade = item.prioridade ?? 'MEDIA'; this.erro.set(''); this.mensagem.set('');
  }
  executar() {
    const item = this.selecionado();
    if (!item || this.ocupado()) return;
    let requisicao: Observable<TicketResponse>;
    switch (this.acao) {
      case 'associar': if (!this.usuarioId) return; requisicao = this.service.associar(item.id, this.usuarioId); break;
      case 'prioridade': requisicao = this.service.definirPrioridade(item.id, this.prioridade); break;
      case 'resolver': if (this.texto.trim().length < 10 || this.texto.length > 5000) return; requisicao = this.service.resolver(item.id, this.texto.trim()); break;
      case 'cancelar': if (this.texto.trim().length < 10 || this.texto.length > 5000) return; requisicao = this.service.cancelar(item.id, this.texto.trim()); break;
    }
    this.ocupado.set(true); this.erro.set('');
    requisicao.subscribe({
      next: atualizado => { this.itens.update(itens => itens.map(i => i.id === atualizado.id ? atualizado : i)); this.ocupado.set(false); this.selecionado.set(null); this.mensagem.set('Ticket atualizado com sucesso.'); },
      error: () => { this.erro.set('Não foi possível atualizar. Confira os campos e o status atual do ticket.'); this.ocupado.set(false); }
    });
  }
}
