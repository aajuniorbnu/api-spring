import { Routes } from '@angular/router';
import { CategoriaCadastrar } from './categorias/cadastrar/cadastrar';
import { CategoriaListar } from './categorias/listar/listar';
import { CategoriaEditar } from './categorias/editar/editar';

import { UsuarioListar } from './usuarios/listar/listar';
import { UsuarioFormulario } from './usuarios/formulario/formulario';
import { ChamadoListar } from './chamados/listar/listar';
import { ChamadoFormulario } from './chamados/formulario/formulario';
import { TicketListar } from './tickets/listar/listar';
import { TicketCadastrar } from './tickets/cadastrar/cadastrar';

export const routes: Routes = [
  { path: '', redirectTo: 'categorias/listar', pathMatch: 'full' },
  { path: 'categorias', redirectTo: 'categorias/listar', pathMatch: 'full' },
  { path: 'categorias/cadastrar', component: CategoriaCadastrar },
  { path: 'categorias/listar', component: CategoriaListar },
  { path: 'categorias/editar/:id', component: CategoriaEditar },
  { path: 'usuarios', redirectTo: 'usuarios/listar', pathMatch: 'full' },
  { path: 'usuarios/listar', component: UsuarioListar },
  { path: 'usuarios/cadastrar', component: UsuarioFormulario },
  { path: 'usuarios/editar/:id', component: UsuarioFormulario },
  { path: 'chamados', redirectTo: 'chamados/listar', pathMatch: 'full' },
  { path: 'chamados/listar', component: ChamadoListar },
  { path: 'chamados/cadastrar', component: ChamadoFormulario },
  { path: 'chamados/editar/:id', component: ChamadoFormulario },
  { path: 'tickets', redirectTo: 'tickets/listar', pathMatch: 'full' },
  { path: 'tickets/listar', component: TicketListar },
  { path: 'tickets/cadastrar', component: TicketCadastrar },
  { path: '**', redirectTo: 'categorias/listar' },
];
