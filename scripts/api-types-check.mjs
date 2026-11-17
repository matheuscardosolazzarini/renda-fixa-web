// Gera os tipos de novo (em memória) e compara com src/app/api/schema.ts. Uso: npm run api:types:check
// Falha (exit 1) se o arquivo versionado diferir do que o snapshot gera. Comparação de conteúdo, sem git.
import { readFile } from 'node:fs/promises';
import { generateSchema, schemaPath } from './api-schema.mjs';

const expected = await generateSchema();
const current = (await readFile(schemaPath, 'utf8')).replace(/\r\n/g, '\n');

if (current === expected) {
  console.log('Tipos em dia: src/app/api/schema.ts corresponde ao snapshot openapi/renda-fixa-api.json.');
} else {
  console.error('Os tipos estão desatualizados ou foram editados à mão.');
  console.error('src/app/api/schema.ts não corresponde ao que o snapshot openapi/renda-fixa-api.json gera.');
  console.error('Rode "npm run api:types" para regenerar e revise o diff antes de commitar.');
  process.exitCode = 1;
}
