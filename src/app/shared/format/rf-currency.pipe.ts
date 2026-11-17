import { Pipe, PipeTransform } from '@angular/core';

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formata um valor em reais (`1003.15` vira `R$ 1.003,15`). Só formata, nunca calcula (D-07). */
@Pipe({ name: 'rfCurrency' })
export class RfCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    return currencyFormat.format(value);
  }
}
