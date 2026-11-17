import { HttpErrorResponse } from '@angular/common/http';
import { components } from '../../api/schema';

export type ApiEnvelope = components['schemas']['ObjectApiResponse'];

export const CONNECTION_ERROR_MESSAGE = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.';
export const GENERIC_ERROR_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

/**
 * Erro de chamada à API. `status` 0 significa sem status HTTP (rede, falha local ou corpo inválido): quem trata o erro
 * usa a `message`, que já é texto para o usuário, e não decide pelo status.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** O corpo é um envelope `{ statusCode, success, message, data }` da API? */
export function isApiEnvelope(body: unknown): body is ApiEnvelope {
  return typeof body === 'object' && body !== null && typeof (body as ApiEnvelope).success === 'boolean';
}

const PROXY_UNAVAILABLE_STATUSES: readonly number[] = [502, 503, 504];

/** Converte qualquer erro da chamada num `ApiError`, sem repassar texto técnico ao usuário. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (!(error instanceof HttpErrorResponse)) {
    return new ApiError(0, GENERIC_ERROR_MESSAGE);
  }

  const { status } = error;
  const envelope = isApiEnvelope(error.error) ? error.error : undefined;

  if (status === 0) {
    return new ApiError(0, CONNECTION_ERROR_MESSAGE);
  }
  if (envelope === undefined && PROXY_UNAVAILABLE_STATUSES.includes(status)) {
    return new ApiError(status, CONNECTION_ERROR_MESSAGE);
  }
  if (status >= 400 && status < 500 && typeof envelope?.message === 'string' && envelope.message !== '') {
    return new ApiError(status, envelope.message);
  }
  return new ApiError(status, GENERIC_ERROR_MESSAGE);
}
