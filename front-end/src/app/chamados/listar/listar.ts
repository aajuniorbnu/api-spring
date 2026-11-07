import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChamadoService } from '../../services/chamado.service';
import { ChamadoResponse } from '../../model/chamado.model';
@Component({ selector: 'app-chamado-listar', imports: [RouterLink], templateUrl: './listar.html' })
export class ChamadoListar {
  itens = signal<ChamadoResponse[]>([]);
  carregando = signal(false);
  ocupado = signal(false);
  erro = signal('');
  constructor(private service: ChamadoService) {}
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
