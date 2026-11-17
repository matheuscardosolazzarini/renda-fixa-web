# Validação da W1 — Fundação

Verificação independente, feita pelo `verificador-de-fase`. Tudo abaixo vem de comando rodado ou arquivo lido nesta
verificação; nenhum número foi copiado do relatório da implementação.

## Resumo

| Item | Resultado |
|---|---|
| Data | 17/11/2026 |
| Commit base | `6d7bae4`. A árvore tinha alterações: o trabalho da fase está todo sem commit (`README.md` e `docs/ROADMAP.md` modificados; configuração, `src/`, `scripts/`, `openapi/`, `.github/`, `.husky/` e `docs/SPEC-W1-EXECUCAO.md` não rastreados) |
| Branch | `w1-fundacao` |
| Ambiente | Windows 11, Node 26.13.1, npm 11.20.0, Git Bash e PowerShell. API do Compose no ar em `http://localhost:8080` (só GET) |
| Veredito | **APROVADA COM PENDÊNCIA** (só o critério 1 depende do push e do PR) |

## Linha de base e medição final

| Medida | Antes da fase | Medido agora | Valor do orquestrador |
|---|---|---|---|
| Testes | 0 (não existia projeto) | **71** passando, 11 arquivos, 0 ignorados | 71 |
| Cobertura (instruções / ramos / funções / linhas) | n/a | 100% / 100% / 100% / 100% | 100% |
| Bundle inicial, gzip (`build:budget`) | sem bundle | **73.385 B** (limite 250.000 B) | 73.385 B |
| Chunks sob demanda | n/a | 5 | 5 |

Cobertura por pasta (`coverage-summary.json` gerado nesta verificação, soma de `covered/total`):

| Pasta | Instruções | Ramos | Funções | Linhas |
|---|---|---|---|---|
| `src/app/core/http` | 41/41 | 40/40 | 10/10 | 39/39 |
| `src/app/core/layout` | 23/23 | 10/10 | 1/1 | 11/11 |
| `src/app/shared/format` | 25/25 | 29/29 | 3/3 | 19/19 |
| `src/app/shared/ui` | 0/0 | 0/0 | 0/0 | 0/0 (só `.gitkeep`) |

O limite de 80% está em `angular.json` (`coverageThresholds`, para `src/app/core/**` e `src/app/shared/**`, com
`schema.ts`, `*.routes.ts`, `*.spec.ts` e `testing/` fora da conta).

Build de produção (`ng build`, saída completa lida): sem warning e sem erro. Inicial: `main-6HWMAY5T.js` 241,63 kB bruto
(65,35 kB estimado pelo Angular) e `styles-5INURTSO.css` vazio. Lazy: `titulos-routes` 920 B, `aportes-routes` 642 B,
`projecao-routes` 396 B, `indexadores-routes` 363 B, `carteira-routes` 361 B.

## Ordem do CI, rodada local depois de `npm ci`

`npm ci`: 481 pacotes adicionados, 0 vulnerabilidades, código de saída 0. Aviso do npm 11 (não é falha): quatro pacotes
com script de instalação sem `allowScripts` (`@parcel/watcher`, `esbuild`, `lmdb`, `msgpackr-extract`). O build e os
testes funcionam assim.

| Passo (ordem do `ci.yml`) | Comando | Saída | Resultado |
|---|---|---|---|
| Formatação | `npm run format:check` | `All matched files use Prettier code style!` | 0 |
| Lint | `npm run lint` | sem saída (`--max-warnings 0`) | 0 |
| Lint de estilos | `npm run lint:styles` | sem saída | 0 |
| Tipos | `npm run typecheck` | sem saída | 0 |
| Contrato | `npm run api:types:check` | `Tipos em dia: src/app/api/schema.ts corresponde ao snapshot ...` | 0 |
| Testes | `npm run test:coverage` | `Test Files 11 passed (11)`, `Tests 71 passed (71)`, cobertura 100% | 0 |
| Build | `npm run build` | sem warning | 0 |
| Orçamento | `npm run build:budget` | `Total 73.385 B`, `Orçamento do bundle inicial respeitado.` | 0 |

No fim da verificação os mesmos passos foram repetidos (lint, lint:styles, format:check, typecheck, api:types:check e
test:coverage) e todos saíram com 0, com 71 testes. A lista de `src/` e `scripts/` (47 arquivos, SHA-256) é idêntica à
do início (`diff` vazio).

## Critérios do ROADMAP

| # | Critério | Veredito |
|---|---|---|
| 1 | `lint`, `lint:styles`, `test` e `build` verdes no CI de um PR | **PENDENTE** (depende do push e do PR do Matheus) |
| 2 | Violar uma fronteira da D-03 quebra o lint | **APROVADO** |
| 3 | Tipos batem com o snapshot e o check falha se divergirem | **APROVADO** |
| 4 | Envelope: sucesso, 204, 400, 404, 500 e falha de rede, com testes | **APROVADO** |
| 5 | Pipes pt-BR sem `new Date()`, com testes | **APROVADO** |
| 6 | Bundle inicial abaixo de 250 KB comprimido | **APROVADO** |

### 1. CI de um PR — PENDENTE

Não há commit, push nem `gh`, então a execução no GitHub não pôde ser provada. O que foi provado:

- Os oito scripts rodam verdes localmente, na ordem do CI (seção acima).
- `.github/workflows/ci.yml` carregado com o pacote `yaml` 2.9.1 de `node_modules`: YAML válido. Gatilhos `push` e
  `pull_request` em `main` e `workflow_call`; `permissions: {contents: read}`; `concurrency` por workflow e ref, com
  `cancel-in-progress` só em PR; job único `ubuntu-latest`, `timeout-minutes: 20`.
- Os passos chamam exatamente: `npm ci`, `format:check`, `lint`, `lint:styles`, `typecheck`, `api:types:check`,
  `test:coverage`, `build`, `build:budget`. Cada `npm run X` existe em `package.json` (o script de conferência imprimiu
  `script existe` em todos). É a ordem pedida no P9.
- `persist-credentials: false` no checkout; `node-version-file: .nvmrc` (`26.13.1`) e `cache: npm` no setup-node.
- SHAs das actions conferidos no GitHub:

```
git ls-remote --tags https://github.com/actions/checkout.git "v7.0.1*"
3d3c42e5aac5ba805825da76410c181273ba90b1  refs/tags/v7.0.1      (ci.yml: 3d3c42e5...90b1 # v7.0.1)
git ls-remote --tags https://github.com/actions/setup-node.git "v7.1.0*"
949feb2413d6458794dcd2491c4babbbce0c15c1  refs/tags/v7.1.0      (ci.yml: 949feb24...15c1 # v7.1.0)
```

Para fechar: o Matheus abre o PR e confirma que o job `Build e testes` fica verde.

### 2. Fronteira quebra o lint — APROVADO

Arquivos temporários criados em `src/app/`, lintados e apagados. Saída real:

| Caso | Arquivo temporário | Saída do ESLint | Saída |
|---|---|---|---|
| `shared` importa `core` | `shared/format/tmp-verif-a.ts` | `There is no policy allowing dependencies from elements of type "shared" to elements of type "core"  boundaries/dependencies` | 1 |
| feature importa outra feature | `features/carteira/tmp-verif-b.ts` (de `titulos`) | `... from elements of type "feature" and captured values: name="carteira" to elements of type "feature" and captured values: name="titulos"  boundaries/dependencies` | 1 |
| feature importa `core` (permitido) | `features/carteira/tmp-verif-c.ts` | sem saída | 0 |
| feature importa `shared` (permitido) | `features/carteira/tmp-verif-g.ts` | sem saída | 0 |
| `core` importa feature | `core/http/tmp-verif-d.ts` | `There is no policy allowing dependencies from elements of type "core" to elements of type "feature" ...` | 1 |
| feature importa `app` (`app.config`) | `features/carteira/tmp-verif-e.ts` | `... to file of category "app"  boundaries/dependencies` | 1 |
| `shared` importa `api` | `shared/format/tmp-verif-f.ts` | `... from elements of type "shared" to elements of type "api"  boundaries/dependencies` | 1 |
| arquivo fora dos elementos | `src/app/rogue/tmp-verif-r.ts` | `File does not match any file pattern and does not belong to any known element  boundaries/no-unknown-files` | 1 |

Com os arquivos `a`, `b` e `r` presentes, `npm run lint` (o script inteiro) terminou com código 1 e `3 problems (3 errors,
0 warnings)`. Depois de apagar tudo, `npm run lint` voltou a 0, e o hash de `src/` e `scripts/` é idêntico ao do início
(`git status --short` não mostra nada novo; o `diff` dos 47 hashes é vazio). Isso também prova que o resolvedor de
imports `.ts` funciona (os imports relativos foram resolvidos; sem ele a regra passaria em silêncio).

### 3. Tipos e snapshot — APROVADO

- `npm run api:types:check` sai com 0 (`Tipos em dia ...`).
- Hash de `src/app/api/schema.ts` antes: `9f2d89372d79eceb5b5d30069c35095c0f39563f29be50977a9d8a8cc0db7e1a`.
- Alterada a linha 31 (`put?: never;` para `put?: string;`): hash `8df19063...d6fd`; `api:types:check` sai com **1**:
  `Os tipos estão desatualizados ou foram editados à mão.` e `Rode "npm run api:types" para regenerar ...`.
- `npm run api:types` regenera; hash depois: `9f2d89372d79eceb5b5d30069c35095c0f39563f29be50977a9d8a8cc0db7e1a`. Idêntico.
  `api:types:check` volta a 0.
- Snapshot contra a API no ar: `curl http://localhost:8080/swagger/v1/swagger.json` parseado e comparado com
  `openapi/renda-fixa-api.json` por `util.isDeepStrictEqual`: **`true`**. OpenAPI 3.0.1, 6 caminhos (`/api/Assets`,
  `/api/Assets/{id}`, `/api/Indexes/{indexType}`, `/api/Portfolio/summary`, `/api/Positions`,
  `/api/Positions/{id}/projection`), 20 schemas. `PortfolioSummaryResponse` tem `positions` e `referenceDate`. O snapshot
  usa LF (0 retornos de carro).

### 4. Envelope — APROVADO

Testes T-01 a T-09 e T-23 a T-29 existem em `src/app/core/http/*.spec.ts` e passam (71 de 71). Mapa e leitura:

| Teste | Onde | Confere |
|---|---|---|
| T-01, T-02 | `api-envelope.interceptor.spec.ts:41`, `:53` | `data` com 200 e 201 (`toEqual(asset)`) |
| T-03 | `api-envelope.interceptor.spec.ts:65` e `unwrap-envelope.spec.ts:17` | 204 sem corpo resolve com `null` |
| T-04, T-05 | `...interceptor.spec.ts:76`, `:90` | `ApiError` com status 400/404 e a mensagem real da API |
| T-06 | `...interceptor.spec.ts:104` | status 500, mensagem genérica, `not.toContain` o texto do corpo |
| T-07 | `...interceptor.spec.ts:121` | status 0 e mensagem de conexão (`error(new ProgressEvent('error'))`) |
| T-08 | `...interceptor.spec.ts:134` | 404 com HTML, mensagem genérica |
| T-09 | `...interceptor.spec.ts:149` | `/health` com `responseType: 'text'` devolve `Healthy` |
| T-23 | `...interceptor.spec.ts:160` e `unwrap-envelope.spec.ts:28` | 200 fora do envelope, genérica, status 200 |
| T-24 | `...interceptor.spec.ts:173` | 400 com envelope e `message: null`, genérica |
| T-25 | `...interceptor.spec.ts:191` | `it.each` 502, 503 e 504, mensagem de conexão com o status real |
| T-26 | `api-error.spec.ts:6` | `toBe(original)` |
| T-27, T-28 | `...interceptor.spec.ts:211`, `:225` | `value()` desembrulhado; `error()` é `ApiError` com a mensagem da API |
| T-29 | `require-fields.spec.ts:9`, `:20` | devolve o mesmo objeto; `ApiError` genérico quando falta campo (`AssetResponse`) |

Os corpos dos testes usam o envelope real (`{statusCode, success, message, data}`) montado em `testing/envelopes.ts`, e as
mensagens de 400 e 404 são textos reais da API. Nenhum teste tem `skip`, `only`, `todo` (busca em `src/`: vazia).

Mutações temporárias em `src/app/core/http/`, cada uma seguida de `ng test`, todas desfeitas (`cmp` com a cópia original
sem diferença):

| Mutação | Testes que falharam |
|---|---|
| M1 `api-error.ts:51`: 5xx repassa a mensagem do corpo | `entrega a mensagem genérica, sem o texto do corpo, quando a API responde 500` (1) |
| M2 `unwrap-envelope.ts`: remove o ramo do corpo vazio (204) | `devolve null quando o corpo é nulo ou vazio (204)` e `devolve vazio, sem erro, quando a API responde 204 sem corpo` (2) |
| M3 `api-envelope.interceptor.ts:13`: age em qualquer URL | `não mexe em resposta fora de /api/` (1) |
| M4 `api-error.ts:45`: remove o ramo 502/503/504 | os três casos do `it.each` (3) |
| M5 `api-envelope.interceptor.ts:19`: não desembrulha | 5 (`200`, `201`, `corpo fora do envelope`, `value()` do `httpResource`, `appConfig`) |
| M6 `api-error.ts:43`: sem resposta devolve a mensagem genérica | `entrega a mensagem de conexão, com status 0, ...` (1) |
| M7 `api-error.ts:48-49`: 4xx com envelope repassa `message` nula | `4xx chega com envelope sem message` (1) |

Observação: "o interceptor ignorar o 204" por si só não é pego pelo teste do interceptor, porque `null` atravessa de qualquer
forma. É um mutante equivalente. O que protege o comportamento do 204 é o ramo de corpo vazio em `unwrapEnvelope`, e esse
é pego pela M2 em dois testes.

### 5. Pipes pt-BR sem `new Date()` — APROVADO

- T-10 a T-18 existem em `src/app/shared/format/*.spec.ts` (nomes com o código do teste) e passam: moeda
  `1003.15`, `0`, `-1003.15`, `1040320.26`; percentual `12.5`, `48.43`, `0`; data `2026-11-09`, `2026-01-01`,
  `2026-12-31`; `null` e `undefined` nos três; texto fora de `aaaa-mm-dd` volta como veio (cinco entradas). Cada pipe também
  é testado num template.
- `grep -rn "new Date" src scripts`: vazio. `grep -rnE "\bDate\.|Date\(" src scripts`: vazio. Busca por `toLocale`,
  `DateTimeFormat`, `DatePipe`, `moment`, `dayjs`, `Temporal`: vazia. Em `schema.ts` aparece "Date" só em nomes de campo
  (`issueDate`, `maturityDate`), nenhum `new Date`.
- `grep -rl $'\xc2\xa0' src scripts`: vazio (sem U+00A0 cru; o `grep` foi validado com uma entrada que contém o
  caractere, que ele encontra). Os literais de moeda usam ` ` por extenso (5 ocorrências em `rf-currency.pipe.spec.ts`).
- Mutação M8 (`rf-percent.pipe.ts`, `style: 'percent'`): 3 testes falham com `Expected: "12,50%" / Received: "1.250,00%"` e
  `Expected "48,43%" / Received "4.843,00%"`. Desfeita.
- Mutação M9 (`rf-date-only.pipe.ts` com `new Date(value).toLocaleDateString('pt-BR')`): 4 testes falham. Desfeita.

### 6. Bundle inicial — APROVADO

`npm run build:budget`: `styles-5INURTSO.css 20 B`, `main-6HWMAY5T.js 73.365 B`, `Total 73.385 B`, limite 250.000 B,
saída 0. O `index.html` de `dist/renda-fixa-web/browser` referencia só esses dois arquivos (`<link rel="stylesheet">` e
`<script type="module">`; sem `modulepreload`). Conferência independente com `gzip -9 -n -c`: `main` 73.304 B, CSS 20 B,
total 73.324 B (o `gzip` do sistema e o `zlib` do Node diferem em dezenas de bytes; a diferença é de 0,08%). Ambos estão
a cerca de 30% do limite.

## Definição de pronto e regras do CLAUDE.md

| Regra | Evidência | Resultado |
|---|---|---|
| Build de produção sem warning | saída de `ng build` lida inteira | OK |
| Orçamento de tamanho | 73.385 B de 250.000 B; `angular.json` mantém os orçamentos do `ng new` (500 kB aviso, 1 MB erro, brutos) | OK |
| Lint, tipos e testes verdes | seção "Ordem do CI" | OK |
| Teste antes do código | não verificável depois do fato (nada foi commitado); os testes existem para todo código da fase e pegam as mutações acima | não verificável |
| Dependências só das tabelas, versões exatas | `package.json`: nenhum `^`/`~` nas dependências (o único `^` é `engines.node`, como a spec manda); `npm ls --depth=0` lista exatamente os pacotes das tabelas, nas versões exatas; `zone.js`, `@angular/forms`, `@angular/cdk`, material e primeng ausentes de `node_modules` | OK |
| `overrides` do `openapi-typescript` | `package.json`: `"typescript": "$typescript"`; a geração funciona | OK |
| Sem `any` | busca por `\bany\b` em `src/` fora do `schema.ts`: vazia; `no-explicit-any` em erro e o lint passa | OK |
| Sem supressão de lint, `@ts-ignore` etc. | uma única: `unwrap-envelope.ts:8` (`no-unnecessary-type-parameters`, com justificativa na linha de cima: a assinatura é a da spec) | OK |
| Nenhuma biblioteca visual | busca em `package.json` e `node_modules`: nada | OK |
| Sem estilo com valor solto | o único SCSS é `src/styles.scss`, só com comentário; nenhum `styles:`/`styleUrl`/`style=` em componentes; `lint:styles` passa | OK |
| `schema.ts` gerado, não editado | `api:types:check` e a regeneração com hash idêntico (critério 3) | OK |
| Identificadores em inglês, textos em português | classes e arquivos em inglês (`PortfolioPage`, `rf-asset-edit-page`, `unwrapEnvelope`); textos, títulos e mensagens em português; nomes de rota em português por decisão da D-09 | OK |
| Nenhum cálculo financeiro no front | pipes só formatam (`Intl` e regex); nada de multiplicar ou dividir | OK |
| Nenhum arquivo alterado em `../renda-fixa-api` | `git -C ../renda-fixa-api status --short`: vazio | OK |
| Estrutura da D-03 | `api/`, `core/{http,layout}`, `shared/{ui,format}`, `features/{carteira,titulos,aportes,projecao,indexadores}` | OK |
| Husky e lint-staged | `.husky/pre-commit` roda `npx lint-staged`; `core.hooksPath=.husky/_`; `npx lint-staged` sem arquivos em staging sai com 0. O gancho real só roda no primeiro commit | OK (como a spec pede) |
| README com "Desenvolvimento" | `git diff README.md`: seção acrescentada, resto intacto | OK |

## App no ar

`npm start -- --port 4300` (em segundo plano, saída em `ng serve` normal). Respostas por `curl`:

| Pedido | Resposta |
|---|---|
| `/`, `/carteira`, `/titulos`, `/titulos/novo`, `/titulos/<id>`, `/aportes`, `/aportes/novo`, `/posicoes/<id>`, `/indexadores` | 200, `text/html`, com `<rf-root>` |
| `/health` | 200, `text/plain`, corpo `Healthy` |
| `/api/Assets` e `/api/assets` | 200, corpo `{"statusCode":200,"success":true,"message":null,"data":[{"id":"24e7dc84-..."...` (envelope da API; o resultado é o mesmo que `http://localhost:8080/api/Assets`) |

Navegador: o Edge do sistema rodou em modo headless (`--headless=new --dump-dom`), sem instalar nada. Resultado:

- `/` terminou com `<h1>Carteira</h1>`, `<title>Carteira — Renda Fixa</title>`, `<html lang="pt-BR">` e o link Carteira com
  `aria-current="page"` (o redirecionamento para `/carteira` funcionou). A navegação "Principal" tem os quatro links.
- `/titulos/novo`: `<h1>Novo título</h1>`, link Títulos com `aria-current="page"` (correspondência por prefixo).
- `/indexadores`: `<h1>Indexadores</h1>`. `/posicoes/<id>`: `<h1>Projeção da posição</h1>` e o título "Projeção da posição — Renda Fixa".
- Não foi medida a URL final do redirecionamento no navegador (o `--dump-dom` não a mostra); fica a prova do `<h1>`, do
  `aria-current` e do teste T-20 (`redireciona a raiz para /carteira`, que lê `Router.url`).

`ng serve` encerrado: processo e filhos finalizados, nenhuma conexão em `LISTENING` na porta 4300 (`Get-NetTCPConnection`
devolve 0), `curl` na 4300 devolve 000. Nenhum processo do Edge com o perfil temporário ficou. A API em 8080 continua
respondendo `200` em `/health`.

## Achados

Nenhum bloqueante. Observações de baixa gravidade, para decisão do Matheus:

1. **`src/app/api/schema.ts:1`** não tem cabeçalho de "arquivo gerado, não edite" (o `openapi-typescript` 7.13 não o
   coloca e o `api-schema.mjs` não acrescenta). O `.prettierignore` e o `eslint.config.js` já o ignoram e o README avisa, mas
   quem abrir o arquivo não vê o aviso. A spec (D-05) não exige.
2. **`src/app/core/http/api-error.ts:10-12`**: o comentário diz que `status` 0 cobre "rede, falha local ou corpo inválido",
   mas `unwrapEnvelope` lança com o status HTTP real (200) para corpo inválido (T-23, conforme a spec). Só `requireFields` e
   o erro desconhecido usam 0. O comentário está um pouco além do comportamento.
3. **`src/app/shared/format/rf-date-only.pipe.ts:3`**: a expressão aceita qualquer `dddd-dd-dd`, então `2026-13-45` vira
   `45/13/2026`. Está de acordo com a spec ("string fora do formato aaaa-mm-dd volta como veio"), e a API só manda datas
   válidas. Registrado como limite conhecido.
4. **`build:budget` no caminho de falha**: o script imprimiu o total e saiu 0, mas o caminho que sai com 1 acima do limite
   não foi exercitado (exigiria alterar o script ou inflar o bundle). O código do `process.exitCode = 1` foi lido e está certo.
5. **`npm ci`** emite o aviso `install-scripts ... not yet covered by allowScripts` (npm 11.20) para quatro pacotes. Hoje
   não afeta. Vale decidir, junto da W6, se declara o `allowScripts` no projeto.
6. `npm ci` e `prepare: husky` gravam `core.hooksPath=.husky/_` no `.git/config` local (já estava assim antes). Nenhum
   efeito no repositório.

## Não foi possível verificar

- Execução do `ci.yml` no GitHub (critério 1): sem push, PR nem `gh`. `actionlint` não está instalado (e é da W6).
- O gancho de pré-commit em um commit real (a spec o deixa para o primeiro commit do Matheus).
- Que testes tenham sido escritos antes do código (a ordem não deixa rastro sem commits).
- O caminho de falha do `build:budget` (achado 4).

## Veredito final

**APROVADA COM PENDÊNCIA.** Os critérios 2 a 6 estão provados por comando e por mutação, a definição de pronto se aplica e
está atendida, o app responde em todas as rotas da D-09 e pelo proxy, e a API não foi tocada. Falta apenas o critério 1:
confirmar o job `Build e testes` verde no PR (`ci.yml` válido, scripts e SHAs conferidos), depois do commit e do push do
Matheus. Mensagem de commit sugerida pela spec: `W1: fundação do front`.
