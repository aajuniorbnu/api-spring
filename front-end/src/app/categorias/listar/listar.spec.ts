import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { CategoriaListar } from './listar';

describe('CategoriaListar', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CategoriaListar], providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
    ] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); vi.restoreAllMocks(); });

  it('mantém o registro na lista e desabilita a desativação após sucesso', async () => {
    const fixture = TestBed.createComponent(CategoriaListar);
    fixture.detectChanges();
    const categoria = { id: 1, nome: 'Rede', descricao: null, ativa: true };
    http.expectOne('/api/categorias').flush([categoria]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.componentInstance.apagar(1);
    http.expectOne('/api/categorias/1').flush({ ...categoria, ativa: false });
    await fixture.whenStable();
    expect(fixture.componentInstance.categorias()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Inativa');
    expect(fixture.nativeElement.querySelector('.btn-perigo').disabled).toBe(true);
  });

  it('mostra falha de carregamento sem anunciar uma lista vazia', async () => {
    const fixture = TestBed.createComponent(CategoriaListar);
    fixture.detectChanges();
    http.expectOne('/api/categorias').flush({}, { status: 500, statusText: 'Erro' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Nenhuma categoria cadastrada');
  });
});
