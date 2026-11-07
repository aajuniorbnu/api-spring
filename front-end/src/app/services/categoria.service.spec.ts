import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let http: HttpTestingController;
  const categoria = { id: 1, nome: 'Rede', descricao: null, ativa: true };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CategoriaService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('lista e consulta categorias pelo proxy', () => {
    service.listar().subscribe((dados) => expect(dados).toEqual([categoria]));
    const lista = http.expectOne('/api/categorias');
    expect(lista.request.method).toBe('GET');
    lista.flush([categoria]);
    service.obterPorId(1).subscribe((dados) => expect(dados).toEqual(categoria));
    const consulta = http.expectOne('/api/categorias/1');
    expect(consulta.request.method).toBe('GET');
    consulta.flush(categoria);
  });

  it('envia os contratos de cadastro e atualização', () => {
    const dados = { nome: 'Rede', descricao: '' };
    service.cadastrarCategoria(dados).subscribe();
    const cadastro = http.expectOne('/api/categorias');
    expect(cadastro.request.method).toBe('POST');
    expect(cadastro.request.body).toEqual(dados);
    cadastro.flush(categoria);
    service.atualizar(1, dados).subscribe();
    const atualizacao = http.expectOne('/api/categorias/1');
    expect(atualizacao.request.method).toBe('PUT');
    expect(atualizacao.request.body).toEqual(dados);
    atualizacao.flush(categoria);
  });

  it('recebe a categoria inativa após desativar', () => {
    service.apagar(1).subscribe((dados) => expect(dados.ativa).toBe(false));
    const requisicao = http.expectOne('/api/categorias/1');
    expect(requisicao.request.method).toBe('DELETE');
    requisicao.flush({ ...categoria, ativa: false });
  });
});
