import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Shell } from './shell';

@Component({ selector: 'rf-fake-page', template: '<h1>Página falsa</h1>' })
class FakePage {}

describe('Shell', () => {
  function links(root: HTMLElement): HTMLAnchorElement[] {
    const navigation = root.querySelector('nav[aria-label="Principal"]');
    return Array.from(navigation?.querySelectorAll('a') ?? []);
  }

  function currentLinks(root: HTMLElement): string[] {
    return links(root)
      .filter((link) => link.getAttribute('aria-current') === 'page')
      .map((link) => link.textContent.trim());
  }

  function provideFakeRoutes(): void {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: Shell,
            children: [
              { path: 'carteira', component: FakePage },
              { path: 'titulos', component: FakePage },
            ],
          },
        ]),
      ],
    });
  }

  it('mostra a navegação "Principal" com os quatro links, cada um com o destino certo', async () => {
    // Arrange
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    // Act
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();

    // Assert
    const found = links(fixture.nativeElement as HTMLElement).map((link) => [
      link.textContent.trim(),
      link.getAttribute('href'),
    ]);
    expect(found).toEqual([
      ['Carteira', '/carteira'],
      ['Títulos', '/titulos'],
      ['Aportes', '/aportes'],
      ['Indexadores', '/indexadores'],
    ]);
  });

  it('organiza a tela em cabeçalho com o nome do app, navegação e conteúdo principal', async () => {
    // Arrange
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    // Act
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();

    // Assert
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('header')?.textContent).toContain('Renda Fixa');
    expect(root.querySelectorAll('h1')).toHaveLength(0);
    expect(root.querySelectorAll('main')).toHaveLength(1);
  });

  it('marca com aria-current="page" só o link da rota ativa', async () => {
    // Arrange
    provideFakeRoutes();

    // Act
    const harness = await RouterTestingHarness.create('/titulos');

    // Assert
    expect(currentLinks(harness.routeNativeElement as HTMLElement)).toEqual(['Títulos']);
  });

  it('move o aria-current para o link da nova rota quando o usuário navega', async () => {
    // Arrange
    provideFakeRoutes();
    const harness = await RouterTestingHarness.create('/carteira');

    // Act
    await harness.navigateByUrl('/titulos');

    // Assert
    expect(currentLinks(harness.routeNativeElement as HTMLElement)).toEqual(['Títulos']);
  });
});
