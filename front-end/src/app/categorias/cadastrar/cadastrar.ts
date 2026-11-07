import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaCriarDto } from '../../dtos/categoria/categoria-criar.dto';

@Component({
  selector: 'app-categoria-cadastrar',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.css',
})
export class CategoriaCadastrar {
  form: CategoriaCriarDto = { nome: '', descricao: '' };
  salvando = signal(false);
  erro = signal('');
  mensagem = signal('');

  constructor(private categoriaService: CategoriaService) {}

  cadastrar(): void {
    if (this.salvando()) return;
    this.erro.set('');
    this.mensagem.set('');
    const dados: CategoriaCriarDto = {
      nome: this.form.nome.trim(),
      descricao: this.form.descricao.trim(),
    };
    if (dados.nome.length < 2 || dados.nome.length > 60 || dados.descricao.length > 255) {
      this.erro.set('Informe um nome de 2 a 60 caracteres e uma descrição de até 255 caracteres.');
      return;
    }
    this.salvando.set(true);
    this.categoriaService.cadastrarCategoria(dados).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagem.set('Categoria cadastrada com sucesso!');
      },
      error: () => {
        this.salvando.set(false);
        this.erro.set('Não foi possível salvar. Confira a conexão e se já existe uma categoria com esse nome.');
      },
    });
  }
}
