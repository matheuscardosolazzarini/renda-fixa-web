import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RfDateOnlyPipe } from './rf-date-only.pipe';

@Component({
  selector: 'rf-date-only-host',
  imports: [RfDateOnlyPipe],
  template: `<span>{{ date | rfDateOnly }}</span>`,
})
class DateOnlyHostComponent {
  readonly date = '2026-11-09';
}

describe('RfDateOnlyPipe', () => {
  const pipe = new RfDateOnlyPipe();

  it('formata 2026-11-09 como 09/11/2026 (T-15)', () => {
    // Arrange
    const date = '2026-11-09';

    // Act
    const result = pipe.transform(date);

    // Assert
    expect(result).toBe('09/11/2026');
  });

  it('mantém o dia em 2026-01-01 (T-16)', () => {
    // Arrange
    const date = '2026-01-01';

    // Act
    const result = pipe.transform(date);

    // Assert
    expect(result).toBe('01/01/2026');
  });

  it('mantém o dia em 2026-12-31 (T-16)', () => {
    // Arrange
    const date = '2026-12-31';

    // Act
    const result = pipe.transform(date);

    // Assert
    expect(result).toBe('31/12/2026');
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

  it.each(['09/11/2026', '2026-11-09T00:00:00', '2026-1-9', 'abc', ''])(
    'devolve a própria string quando a data não está em aaaa-mm-dd: "%s" (T-18)',
    (input) => {
      // Arrange
      // (input vem do it.each)

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(input);
    },
  );

  it('funciona num template pelo nome rfDateOnly (T-15)', () => {
    // Arrange
    const fixture = TestBed.createComponent(DateOnlyHostComponent);

    // Act
    fixture.detectChanges();

    // Assert
    expect((fixture.nativeElement as HTMLElement).textContent).toBe('09/11/2026');
  });
});
