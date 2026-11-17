import { components } from '../../../api/schema';
import { ApiEnvelope } from '../api-error';

type AssetResponse = components['schemas']['AssetResponse'];

/** Envelope de sucesso no formato real da API: `{ statusCode, success, message, data }`. */
export function successEnvelope(data: unknown, statusCode = 200): ApiEnvelope {
  return { statusCode, success: true, message: null, data };
}

/** Envelope de erro no formato real da API (`data` nulo). */
export function errorEnvelope(statusCode: number, message: string): ApiEnvelope {
  return { statusCode, success: false, message, data: null };
}

/** Título do exemplo real da API (GET /api/Assets). */
export function exampleAsset(): AssetResponse {
  return {
    id: '24e7dc84-5fd4-4f14-91de-7a2e4156cade',
    name: 'QA-01 CDB XYZ 100% CDI',
    issuer: 'Banco XYZ',
    assetType: 'Cdb',
    indexType: 'Cdi',
    rate: 100,
    issueDate: '2026-06-01',
    maturityDate: '2027-06-01',
  };
}
