import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChamadoService } from '../../services/chamado.service';
import { ChamadoRequest } from '../../model/chamado.model';
import { forkJoin } from 'rxjs';
import { CategoriaService } from '../../services/categoria.service';
import { UsuarioService } from '../../services/usuario.service';
import { CategoriaRespostaDto } from '../../dtos/categoria/categoria-resposta.dto';
import { UsuarioResponse } from '../../model/usuario.model';
@Component({ selector: 'app-chamado-formulario', imports: [FormsModule, RouterLink], templateUrl: './formulario.html' })
export class ChamadoFormulario {
  form: ChamadoRequest = { titulo: '', descricao: '', prioridade: 'BAIXA', status: 'ABERTO', prazo: '', categoriaId: null, solicitanteId: null };
  id: number | null = null;
  erro = signal(''); salvando = signal(false); carregando = signal(false); indisponivel = signal(false);
  categorias = signal<CategoriaRespostaDto[]>([]); usuarios = signal<UsuarioResponse[]>([]);
  constructor(private service: ChamadoService, private route: ActivatedRoute, private router: Router, private categoriaService: CategoriaService, private usuarioService: UsuarioService) {}
  ngOnInit() {
    forkJoin({ categorias: this.categoriaService.listar(), usuarios: this.usuarioService.listar() }).subscribe({ next: dados => { this.categorias.set(dados.categorias); this.usuarios.set(dados.usuarios); }, error: () => { this.erro.set('Não foi possível carregar categorias e usuários. Recarregue a página.'); this.indisponivel.set(true); } });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id); this.carregando.set(true);
      this.service.obterPorId(this.id).subscribe({
        next: item => { this.form = { titulo: item.titulo, descricao: item.descricao, prioridade: item.prioridade, status: item.status, prazo: item.prazo, categoriaId: item.categoria.id, solicitanteId: item.solicitante.id }; this.carregando.set(false); },
        error: () => { this.erro.set('Não foi possível carregar o registro.'); this.carregando.set(false); this.indisponivel.set(true); }
      });
    }
  }
  salvar() {
    if (this.salvando() || this.carregando() || this.indisponivel()) return;
    this.salvando.set(true); this.erro.set('');
    const requisicao = this.id === null ? this.service.criar(this.form) : this.service.atualizar(this.id, this.form);
    requisicao.subscribe({ next: () => { this.router.navigate(['/chamados/listar']); }, error: () => { this.erro.set('Não foi possível salvar. Confira os campos e a conexão com o servidor.'); this.salvando.set(false); } });
  }
}
