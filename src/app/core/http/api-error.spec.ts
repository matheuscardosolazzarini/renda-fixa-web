import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, toApiError } from './api-error';
import { errorEnvelope } from './testing/envelopes';

describe('toApiError', () => {
  it('devolve o mesmo ApiError que recebeu', () => {
    // Arrange
    const original = new ApiError(404, 'Título com id 24e7dc84-5fd4-4f14-91de-7a2e4156cade não encontrado.');

    // Act
    const result = toApiError(original);

    // Assert
    expect(result).toBe(original);
  });

  it('entrega a mensagem genérica para um erro desconhecido', () => {
    // Arrange
    const unknownError = new TypeError('falha qualquer');

    // Act
    const result = toApiError(unknownError);

    // Assert
    expect(result).toBeInstanceOf(ApiError);
    expect(result.message).toBe('Ocorreu um erro inesperado. Tente novamente mais tarde.');
  });

  it('mantém a mensagem da API sem alteração para um 4xx com envelope', () => {
    // Arrange
    const message = 'Título possui aportes e não pode ser removido.';
    const httpError = new HttpErrorResponse({ status: 400, error: errorEnvelope(400, message) });

    // Act
    const result = toApiError(httpError);

    // Assert
    expect(result).toMatchObject({ status: 400, message });
  });
});
