import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  it('renderiza o shell com o nome do app e a navegação principal', async () => {
    // Arrange
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    // Act
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    // Assert
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('header')?.textContent).toContain('Renda Fixa');
    expect(root.querySelector('nav[aria-label="Principal"]')).not.toBeNull();
    expect(root.querySelector('main')).not.toBeNull();
  });
});
