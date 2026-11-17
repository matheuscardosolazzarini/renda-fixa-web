// Gera src/app/api/schema.ts a partir do snapshot. Uso: npm run api:types
import { writeFile } from 'node:fs/promises';
import { generateSchema, schemaPath } from './api-schema.mjs';

const content = await generateSchema();
await writeFile(schemaPath, content, { encoding: 'utf8' });
console.log(`Tipos gerados em ${schemaPath}`);
