import { Routes } from '@angular/router';
import { CategoriaCadastrar } from './categorias/cadastrar/cadastrar';
import { CategoriaListar } from './categorias/listar/listar';

export const routes: Routes = [
  { path: 'categorias/cadastrar', component: CategoriaCadastrar },
  { path: 'categorias/listar', component: CategoriaListar},
];
