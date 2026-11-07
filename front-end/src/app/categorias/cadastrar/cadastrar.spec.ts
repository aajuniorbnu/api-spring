import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriaCadastrar } from './cadastrar';

describe('CategoriaCadastrar', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CategoriaCadastrar], providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('impede nome vazio ou composto apenas de espaços', async () => {
    const fixture = TestBed.createComponent(CategoriaCadastrar);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);
    fixture.componentInstance.form.nome = '   ';
    fixture.componentInstance.cadastrar();
    http.expectNone('/api/categorias');
    expect(fixture.componentInstance.erro()).toBeTruthy();
  });

  it('evita envio duplicado e permite tentar novamente após falha', () => {
    const component = TestBed.createComponent(CategoriaCadastrar).componentInstance;
    component.form = { nome: ' Rede ', descricao: '' };
    component.cadastrar();
    component.cadastrar();
    const req = http.expectOne('/api/categorias');
    expect(req.request.body).toEqual({ nome: 'Rede', descricao: '' });
    req.flush({}, { status: 500, statusText: 'Erro' });
    expect(component.salvando()).toBe(false);
    expect(component.erro()).toBeTruthy();
    component.cadastrar();
    http.expectOne('/api/categorias').flush({ id: 1, nome: 'Rede', descricao: '', ativa: true });
    expect(component.mensagem()).toContain('sucesso');
  });
});
