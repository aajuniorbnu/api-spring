import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaAtualizarDto } from '../../dtos/categoria/categoria-atualizar.dto';

@Component({
  selector: 'app-categoria-editar',
  imports: [FormsModule, RouterLink],
  templateUrl: './editar.html',
  styleUrl: './editar.css',
})
export class CategoriaEditar {
  form: CategoriaAtualizarDto = { nome: '', descricao: '' };
  salvando = signal(false);
  erro = signal('');
  mensagem = signal('');

  constructor(private categoriaService: CategoriaService, private route: ActivatedRoute) {}

  id = 0;
  carregada = signal(false);

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(this.id) || this.id <= 0) {
      this.erro.set('O ID da categoria é inválido.');
      return;
    }
    this.categoriaService.obterPorId(this.id).subscribe({
      next: (categoria) => {
        this.form = { nome: categoria.nome, descricao: categoria.descricao ?? '' };
        this.carregada.set(true);
      },
      error: () => this.erro.set('Não foi possível carregar a categoria. Volte à lista e tente novamente.'),
    });
  }

  atualizar(): void {
    if (this.salvando() || !this.carregada()) return;
    this.erro.set('');
    this.mensagem.set('');
    const dados: CategoriaAtualizarDto = {
      nome: this.form.nome.trim(),
      descricao: this.form.descricao.trim(),
    };
    if (dados.nome.length < 2 || dados.nome.length > 60 || dados.descricao.length > 255) {
      this.erro.set('Informe um nome de 2 a 60 caracteres e uma descrição de até 255 caracteres.');
      return;
    }
    this.salvando.set(true);
    this.categoriaService.atualizar(this.id, dados).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagem.set('Categoria atualizada com sucesso!');
      },
      error: () => {
        this.salvando.set(false);
        this.erro.set('Não foi possível salvar. Confira a conexão e se já existe uma categoria com esse nome.');
      },
    });
  }
}
