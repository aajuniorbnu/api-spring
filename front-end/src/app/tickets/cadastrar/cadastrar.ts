import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { UsuarioService } from '../../services/usuario.service';
import { TicketRequest } from '../../model/ticket.model';
import { UsuarioResponse } from '../../model/usuario.model';
@Component({ selector: 'app-ticket-cadastrar', imports: [FormsModule, RouterLink], templateUrl: './cadastrar.html' })
export class TicketCadastrar {
  form: TicketRequest = { titulo: '', descricao: '', setor: 'TI', solicitante_id: null };
  usuarios = signal<UsuarioResponse[]>([]);
  erro = signal(''); salvando = signal(false); carregando = signal(true); indisponivel = signal(false);
  constructor(private service: TicketService, private usuarioService: UsuarioService, private router: Router) {}
  ngOnInit() {
    this.usuarioService.listar().subscribe({ next: itens => { this.usuarios.set(itens.filter(i => i.papel === 'SOLICITANTE')); this.carregando.set(false); }, error: () => { this.erro.set('Não foi possível carregar solicitantes. Recarregue a página.'); this.carregando.set(false); this.indisponivel.set(true); } });
  }
  salvar() {
    if (this.salvando() || this.carregando() || this.indisponivel()) return;
    this.salvando.set(true); this.erro.set('');
    this.service.criar(this.form).subscribe({ next: () => { this.router.navigate(['/tickets/listar']); }, error: () => { this.erro.set('Não foi possível cadastrar o ticket. Confira os campos e a conexão.'); this.salvando.set(false); } });
  }
}
