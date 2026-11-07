import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioResponse } from '../../model/usuario.model';
@Component({ selector: 'app-usuario-listar', imports: [RouterLink], templateUrl: './listar.html' })
export class UsuarioListar {
  itens = signal<UsuarioResponse[]>([]);
  carregando = signal(false);
  ocupado = signal(false);
  erro = signal('');
  constructor(private service: UsuarioService) {}
  ngOnInit() { this.carregar(); }
  carregar() {
    this.carregando.set(true); this.erro.set('');
    this.service.listar().subscribe({
      next: itens => { this.itens.set(itens); this.carregando.set(false); },
      error: () => { this.erro.set('Não foi possível carregar. Verifique se o servidor está ligado e tente novamente.'); this.carregando.set(false); }
    });
  }
  desativar(id: number) {
    if (this.ocupado() || !confirm('Deseja desativar este registro?')) return;
    this.ocupado.set(true); this.erro.set('');
    this.service.apagar(id).subscribe({
      next: item => { this.itens.update(itens => itens.map(atual => atual.id === id ? item : atual)); this.ocupado.set(false); },
      error: () => { this.erro.set('Não foi possível desativar o registro.'); this.ocupado.set(false); }
    });
  }
}
