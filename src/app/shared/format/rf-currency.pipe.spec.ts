import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RfCurrencyPipe } from './rf-currency.pipe';

@Component({
  selector: 'rf-currency-host',
  imports: [RfCurrencyPipe],
  template: `<span>{{ value | rfCurrency }}</span>`,
})
class CurrencyHostComponent {
  readonly value = 1003.15;
}

describe('RfCurrencyPipe', () => {
  const pipe = new RfCurrencyPipe();

  it('formata 1003.15 como moeda brasileira (T-10)', () => {
    // Arrange
    const value = 1003.15;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('R$\u00a01.003,15');
  });

  it('formata zero com duas casas (T-11)', () => {
    // Arrange
    const value = 0;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('R$\u00a00,00');
  });

  it('formata o negativo com hífen comum antes do símbolo (T-11)', () => {
    // Arrange
    const value = -1003.15;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('-R$\u00a01.003,15');
  });

  it('formata valor com separador de milhar duplo (T-12)', () => {
    // Arrange
    const value = 1040320.26;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('R$\u00a01.040.320,26');
  });

  it('devolve vazio para null e undefined (T-17)', () => {
    // Arrange
    const nullValue = null;
    const undefinedValue = undefined;

    // Act
    const nullResult = pipe.transform(nullValue);
    const undefinedResult = pipe.transform(undefinedValue);

    // Assert
    expect(nullResult).toBe('');
    expect(undefinedResult).toBe('');
  });

  it('funciona num template pelo nome rfCurrency (T-10)', () => {
    // Arrange
    const fixture = TestBed.createComponent(CurrencyHostComponent);

    // Act
    fixture.detectChanges();

    // Assert
    expect((fixture.nativeElement as HTMLElement).textContent).toBe('R$\u00a01.003,15');
  });
});
