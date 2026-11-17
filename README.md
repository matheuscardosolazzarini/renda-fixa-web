# renda-fixa-web

## Desenvolvimento

Pré-requisito: Node 26. A versão exata está em `.nvmrc` (26.13.1).

```bash
npm ci
```

Para as telas com dados, suba a API (repositório `renda-fixa-api`, porta 8080, Swagger em `/swagger`):

```bash
cd ../renda-fixa-api
docker compose up -d
```

Depois, na pasta deste repositório:

```bash
npm start
```

`npm start` sobe o `ng serve` em `http://localhost:4200` e encaminha `/api` e `/health` para a API (`proxy.conf.json`).

Scripts:

- `npm run lint`: ESLint, com as fronteiras entre camadas, sem aviso.
- `npm run lint:styles`: Stylelint nos arquivos SCSS.
- `npm run format`: Prettier, reescreve os arquivos.
- `npm run format:check`: Prettier, só confere.
- `npm run typecheck`: verificação de tipos do app e dos testes.
- `npm test`: testes unitários com Vitest, sem modo de observação.
- `npm run test:coverage`: testes com cobertura; falha se `core` e `shared` ficarem abaixo de 80%.
- `npm run build`: build de produção.
- `npm run build:budget`: confere o orçamento de 250 KB comprimidos do bundle inicial (RNF-01). Precisa do build antes.
- `npm run api:snapshot`: baixa o contrato OpenAPI da API no ar para `openapi/renda-fixa-api.json`.
- `npm run api:types`: gera `src/app/api/schema.ts` a partir do snapshot.
- `npm run api:types:check`: falha se `schema.ts` não corresponder ao snapshot.

Para atualizar o contrato, com a API no ar, rode `npm run api:snapshot` e depois `npm run api:types`. Revise o diff de
`openapi/` e de `src/app/api/schema.ts` antes de commitar. Não edite `schema.ts` à mão.
