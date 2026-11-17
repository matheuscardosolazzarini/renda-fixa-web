import { ApiError, GENERIC_ERROR_MESSAGE, isApiEnvelope } from './api-error';

/**
 * Devolve o `data` de uma resposta 2xx. Corpo nulo ou vazio (204) devolve `null`, o mesmo que o interceptor entrega.
 * Corpo fora do envelope, ou envelope sem sucesso numa resposta 2xx, vira `ApiError` genérico com o status real.
 */
// O tipo esperado só aparece no retorno: é o chamador que o declara (assinatura fixada no P5 da spec).
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function unwrapEnvelope<T>(body: unknown, status: number): T {
  if (body === null || body === undefined || body === '') {
    return null as T;
  }
  if (!isApiEnvelope(body) || !body.success) {
    throw new ApiError(status, GENERIC_ERROR_MESSAGE);
  }
  return body.data as T;
}
