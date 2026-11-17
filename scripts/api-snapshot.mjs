// Baixa o snapshot do OpenAPI da API (Compose, porta 8080) para openapi/renda-fixa-api.json.
// Uso manual, quando a API mudar: npm run api:snapshot. Exige a API no ar.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const url = 'http://localhost:8080/swagger/v1/swagger.json';
const outputPath = fileURLToPath(new URL('../openapi/renda-fixa-api.json', import.meta.url));

const response = await fetch(url).catch((error) => {
  throw new Error(`Não foi possível baixar ${url}. A API está no ar? (${error.message})`, { cause: error });
});
if (!response.ok) {
  throw new Error(`A API respondeu ${response.status} em ${url}. O Swagger só existe em Development.`);
}

const body = JSON.parse(await response.text());
await writeFile(outputPath, `${JSON.stringify(body, null, 2)}\n`, { encoding: 'utf8' });
console.log(`Snapshot gravado em ${outputPath}`);
