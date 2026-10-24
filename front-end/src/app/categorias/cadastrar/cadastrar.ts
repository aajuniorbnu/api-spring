import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaCadastrarRequest } from '../../model/categoria.model';

@Component({
  selector: 'app-cadastrar',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.css',
})
export class CategoriaCadastrar {
  constructor(private categoriaService: CategoriaService) {}
  form: CategoriaCadastrarRequest = {
    nome: '',
    descricao: '',
  };

  cadastrar() {
    this.categoriaService.cadastrarCategoria(this.form).subscribe({
      next: () => {
        alert('Categoria cadastrada com sucesso!');
      
      }
     })
  }
}

