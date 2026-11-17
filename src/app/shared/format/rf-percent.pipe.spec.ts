import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RfPercentPipe } from './rf-percent.pipe';

@Component({
  selector: 'rf-percent-host',
  imports: [RfPercentPipe],
  template: `<span>{{ value | rfPercent }}</span>`,
})
class PercentHostComponent {
  readonly value = 12.5;
}

describe('RfPercentPipe', () => {
  const pipe = new RfPercentPipe();

  it('formata 12.5 como 12,50% (T-13)', () => {
    // Arrange
    const value = 12.5;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('12,50%');
  });

  it('formata 48.43 como 48,43% sem multiplicar por 100 (T-14)', () => {
    // Arrange
    const value = 48.43;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('48,43%');
  });

  it('formata zero como 0,00% (T-14)', () => {
    // Arrange
    const value = 0;

    // Act
    const result = pipe.transform(value);

    // Assert
    expect(result).toBe('0,00%');
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

  it('funciona num template pelo nome rfPercent (T-13)', () => {
    // Arrange
    const fixture = TestBed.createComponent(PercentHostComponent);

    // Act
    fixture.detectChanges();

    // Assert
    expect((fixture.nativeElement as HTMLElement).textContent).toBe('12,50%');
  });
});
