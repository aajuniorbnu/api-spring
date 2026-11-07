import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaRespostaDto } from '../../dtos/categoria/categoria-resposta.dto';

@Component({
  selector: 'app-categoria-listar',
  imports: [RouterLink],
  templateUrl: './listar.html',
  styleUrl: './listar.css',
})
export class CategoriaListar {
  categorias = signal<CategoriaRespostaDto[]>([]);
  carregando = signal(false);
  desativando = signal<number | null>(null);
  erro = signal('');
  mensagem = signal('');

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.categoriaService.listar().subscribe({
      next: (dados) => {
        this.categorias.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as categorias. Tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  apagar(id: number): void {
    if (this.desativando() !== null || !confirm('Deseja desativar esta categoria?')) return;

    this.desativando.set(id);
    this.erro.set('');
    this.mensagem.set('');
    this.categoriaService.apagar(id).subscribe({
      next: (categoria) => {
        this.categorias.update((dados) => dados.map((item) => item.id === id ? categoria : item));
        this.desativando.set(null);
        this.mensagem.set('Categoria desativada com sucesso!');
      },
      error: () => {
        this.erro.set('Não foi possível desativar a categoria.');
        this.desativando.set(null);
      },
    });
  }
}
