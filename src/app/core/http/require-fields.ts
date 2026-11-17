import { ApiError, GENERIC_ERROR_MESSAGE } from './api-error';

/**
 * Confere que o valor é um objeto com todos os campos listados presentes (não `undefined`).
 * Falta de campo vira `ApiError` genérico. Cada feature declara os campos dos DTOs que consome.
 */
export function requireFields<T>(value: unknown, fields: readonly (keyof T)[]): T {
  if (typeof value !== 'object' || value === null) {
    throw new ApiError(0, GENERIC_ERROR_MESSAGE);
  }
  const record = value as Record<PropertyKey, unknown>;
  if (fields.some((field) => record[field] === undefined)) {
    throw new ApiError(0, GENERIC_ERROR_MESSAGE);
  }
  return value as T;
}
