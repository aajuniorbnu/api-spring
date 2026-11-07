import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioRequest } from '../../model/usuario.model';

@Component({ selector: 'app-usuario-formulario', imports: [FormsModule, RouterLink], templateUrl: './formulario.html' })
export class UsuarioFormulario {
  form: UsuarioRequest = { nome: '', email: '', papel: 'SOLICITANTE' };
  id: number | null = null;
  erro = signal(''); salvando = signal(false); carregando = signal(false); indisponivel = signal(false);
  
  constructor(private service: UsuarioService, private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id); this.carregando.set(true);
      this.service.obterPorId(this.id).subscribe({
        next: item => { this.form = { nome: item.nome, email: item.email, papel: item.papel }; this.carregando.set(false); },
        error: () => { this.erro.set('Não foi possível carregar o registro.'); this.carregando.set(false); this.indisponivel.set(true); }
      });
    }
  }
  salvar() {
    if (this.salvando() || this.carregando() || this.indisponivel()) return;
    this.salvando.set(true); this.erro.set('');
    const requisicao = this.id === null ? this.service.criar(this.form) : this.service.atualizar(this.id, this.form);
    requisicao.subscribe({ next: () => { this.router.navigate(['/usuarios/listar']); }, error: () => { this.erro.set('Não foi possível salvar. Confira os campos e a conexão com o servidor.'); this.salvando.set(false); } });
  }
}
