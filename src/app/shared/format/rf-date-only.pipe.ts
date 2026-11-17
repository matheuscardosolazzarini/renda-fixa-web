import { Pipe, PipeTransform } from '@angular/core';

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Converte `aaaa-mm-dd` em `dd/mm/aaaa` só por manipulação de texto, sem fuso (D-07). Texto fora do formato volta como
 * veio.
 */
@Pipe({ name: 'rfDateOnly' })
export class RfDateOnlyPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    const match = DATE_ONLY.exec(value);
    if (match === null) {
      return value;
    }
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }
}
