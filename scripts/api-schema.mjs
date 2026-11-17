// Geração dos tipos do contrato a partir do snapshot do OpenAPI (D-05).
// Usado por api-types.mjs (grava) e api-types-check.mjs (compara). Sem rede.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';

export const snapshotPath = fileURLToPath(new URL('../openapi/renda-fixa-api.json', import.meta.url));
export const schemaPath = fileURLToPath(new URL('../src/app/api/schema.ts', import.meta.url));

// Gera o texto de schema.ts a partir do snapshot, sempre com LF.
export async function generateSchema() {
  const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
  const ast = await openapiTS(snapshot);
  return astToString(ast).replace(/\r\n/g, '\n');
}
