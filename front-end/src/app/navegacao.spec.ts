import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { routes } from './app.routes';

describe('Navegação Helpdesk', () => {
  it('abre as quatro áreas e seus cadastros sem cair no redirecionamento de categorias', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()] });
    const harness = await RouterTestingHarness.create();
    const http = TestBed.inject(HttpTestingController);
    for (const [rota, titulo] of [
      ['/categorias/listar', 'Categorias'], ['/usuarios/listar', 'Usuários'],
      ['/chamados/listar', 'Chamados'], ['/tickets/listar', 'Tickets'],
      ['/usuarios/cadastrar', 'Cadastrar usuário'], ['/chamados/cadastrar', 'Cadastrar chamado'],
      ['/tickets/cadastrar', 'Cadastrar ticket']
    ]) {
      await harness.navigateByUrl(rota);
      for (const request of http.match(() => true)) request.flush([]);
      harness.detectChanges();
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(titulo);
    }
    http.verify();
  });
});
