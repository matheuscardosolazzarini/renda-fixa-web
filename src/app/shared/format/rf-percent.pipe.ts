import { Pipe, PipeTransform } from '@angular/core';

const percentFormat = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Formata um percentual que a API já manda em pontos (`12.5` vira `12,50%`). Não usa `style: 'percent'`, que
 * multiplicaria por 100: o front não calcula (D-07).
 */
@Pipe({ name: 'rfPercent' })
export class RfPercentPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    return `${percentFormat.format(value)}%`;
  }
}
