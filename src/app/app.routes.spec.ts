import { Title } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

const ID = '24e7dc84-5fd4-4f14-91de-7a2e4156cade';

/** Rotas da D-09: URL, `<h1>` da página e título da aba. */
const ROUTES: readonly { url: string; h1: string; title: string }[] = [
  { url: '/carteira', h1: 'Carteira', title: 'Carteira — Renda Fixa' },
  { url: '/titulos', h1: 'Títulos', title: 'Títulos — Renda Fixa' },
  { url: '/titulos/novo', h1: 'Novo título', title: 'Novo título — Renda Fixa' },
  { url: `/titulos/${ID}`, h1: 'Editar título', title: 'Editar título — Renda Fixa' },
  { url: '/aportes', h1: 'Aportes', title: 'Aportes — Renda Fixa' },
  { url: '/aportes/novo', h1: 'Novo aporte', title: 'Novo aporte — Renda Fixa' },
  { url: `/posicoes/${ID}`, h1: 'Projeção da posição', title: 'Projeção da posição — Renda Fixa' },
  { url: '/indexadores', h1: 'Indexadores', title: 'Indexadores — Renda Fixa' },
];

describe('rotas do app (D-09)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('redireciona a raiz para /carteira', async () => {
    // Arrange
    const harness = await RouterTestingHarness.create();

    // Act
    await harness.navigateByUrl('/');

    // Assert
    expect(TestBed.inject(Router).url).toBe('/carteira');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Carteira');
  });

  it.each(ROUTES)('carrega a página de $url com um único <h1> "$h1"', async ({ url, h1 }) => {
    // Arrange
    const harness = await RouterTestingHarness.create();

    // Act
    await harness.navigateByUrl(url);

    // Assert
    const headings = harness.routeNativeElement?.querySelectorAll('h1');
    expect(headings).toHaveLength(1);
    expect(headings?.[0].textContent).toBe(h1);
  });

  it.each(ROUTES)('define o título "$title" em $url', async ({ url, title }) => {
    // Arrange
    const harness = await RouterTestingHarness.create();

    // Act
    await harness.navigateByUrl(url);

    // Assert
    expect(TestBed.inject(Title).getTitle()).toBe(title);
  });
});
