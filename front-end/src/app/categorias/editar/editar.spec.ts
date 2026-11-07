import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriaEditar } from './editar';

describe('CategoriaEditar', () => {
  let http: HttpTestingController;
  function configurar(id: string): void {
    TestBed.configureTestingModule({ imports: [CategoriaEditar], providers: [
      provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
    ] });
    http = TestBed.inject(HttpTestingController);
  }
  afterEach(() => http.verify());

  it('carrega descrição nula e envia os campos editados', async () => {
    configurar('3');
    const fixture = TestBed.createComponent(CategoriaEditar);
    fixture.detectChanges();
    http.expectOne('/api/categorias/3').flush({ id: 3, nome: 'Rede', descricao: null, ativa: true });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input').value).toBe('Rede');
    expect(fixture.componentInstance.form.descricao).toBe('');
    fixture.componentInstance.form.nome = 'Internet';
    fixture.componentInstance.atualizar();
    const req = http.expectOne('/api/categorias/3');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ nome: 'Internet', descricao: '' });
    req.flush({ id: 3, nome: 'Internet', descricao: '', ativa: true });
  });

  it('não consulta a API quando o ID é inválido', async () => {
    configurar('abc');
    const fixture = TestBed.createComponent(CategoriaEditar);
    await fixture.whenStable();
    http.expectNone((req) => req.url.startsWith('/api/categorias'));
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('ID da categoria é inválido');
  });
});
