# Spec de execução — W1 Fundação

Status: aprovada

Aprovada pelo Matheus em 16/11/2026, depois da revisão do `revisor-arquitetura`, com as decisões registradas em
"Decisões do Matheus na aprovação".

## Contexto

O repositório só tem documentação e a pasta `.claude/`. A W1 cria o projeto Angular 22 e tudo o que as fases seguintes
pressupõem: estrutura de pastas com fronteiras verificadas, ferramentas de qualidade, testes, contrato tipado, envelope
e erros da API, formatação pt-BR, shell com as rotas e o CI. Nenhuma tela com conteúdo sai desta fase.

Fontes: `ROADMAP.md` (W1), `ARQUITETURA.md` (D-01 a D-17) e `ESPECIFICACAO.md`.

Estado conferido em 16/11/2026:

- Branch `w1-fundacao`, igual à `origin/main`, árvore limpa.
- API do Compose no ar: `GET /health` 200, Swagger em `/swagger/v1/swagger.json` (OpenAPI 3.0.1) já com o contrato do
  PR #18 (`PortfolioPositionResponse`, `referenceDate`).
- Linha de base: não há projeto, então 0 testes e sem bundle.
- Node local **26.13.1** (LTS atual, instalado pelo Matheus em 16/11/2026 no lugar do 22.11.0, que não servia).

## Node

Node **26** (decisão do Matheus na aprovação). O campo `engines.node` de cada dependência autorizada foi conferido no
registro npm contra o 26: Angular 22.2 (`^22.22.3 || ^24.15.0 || >=26.0.0`), Stylelint 18, `stylelint-config-standard-scss`
18 e jsdom 31 (`^22.22.2 || ^24.15.0 || >=26.0.0`), Vitest 5 (`^22.12.0 || ^24.0.0 || >=26.0.0`), ESLint 10 (`>=24`),
lint-staged 17 (`>=22.22.1`); as demais não restringem ou pedem só um mínimo antigo. Todas aceitam. O P1 começa
conferindo `node --version` e para se não for 26.x.

## Fora de escopo

- Tokens, componentes de `shared/ui`, Storybook e qualquer estilo visual (W2). O shell da W1 é HTML semântico sem
  estilo próprio: não existem tokens ainda, e o CLAUDE.md proíbe cor ou medida solta.
- `@ngrx/signals` e o store da carteira (W3); Angular CDK e Angular Aria (W2); ECharts (W5); Playwright e `axe` (W3).
- Pipe de dias (D-03 cita; o critério da W1 fala em moeda, percentual e data). Entra na W3, com a projeção.
- Função "hoje" no fuso de São Paulo (D-07: "quando o front precisar"). Nenhuma tela da W1 precisa.
- Retry com espera no interceptor de rede (D-04) e tratamento de rota desconhecida: W3, por decisão do Matheus.
- A lista de campos obrigatórios de cada DTO. A W1 entrega o mecanismo (`requireFields`, P5) e o prova com um DTO;
  cada feature declara os campos dos DTOs dela na fase que os consome.
- Dockerfile, Nginx, Compose do front, release, Dependabot, `actionlint` e `zizmor` (W6).
- Qualquer alteração em `../renda-fixa-api` (D-01).

## Decisões citadas

D-01 (API só leitura), D-02 (Angular 22, standalone, zoneless, OnPush, estrito, Node fixado), D-03 (estrutura e
fronteiras), D-05 (snapshot e tipos gerados), D-06 (envelope e erros), D-07 (formatação, `DateOnly` como string),
D-09 (rotas, lazy load), D-10 (SCSS com BEM e Stylelint), D-11 (acessibilidade do shell), D-12 (pt-BR), D-13 (Vitest,
cobertura), D-14 (CI e Husky), D-15 (proxy, mesma origem), D-16 (actions por SHA, permissões mínimas), D-17 (processo).

## Dependências npm autorizadas

Versões exatas (sem `^` nem `~`), conferidas no registro npm em 16/11/2026. `package-lock.json` versionado.

Produção:

| Pacote | Versão | Motivo |
|---|---|---|
| `@angular/core`, `common`, `compiler`, `platform-browser`, `router` | 22.2.6 | o framework (D-02) |
| `rxjs` | 7.8.2 | exigido pelo Angular |
| `tslib` | 2.9.1 | exigido pelo Angular |

Sem `zone.js` (zoneless, D-02). Sem `@angular/forms` (só na W4, D-08).

Desenvolvimento:

| Pacote | Versão | Motivo |
|---|---|---|
| `@angular/cli`, `@angular/build` | 22.2.7 | CLI, build e executor de testes |
| `@angular/compiler-cli` | 22.2.6 | compilador |
| `typescript` | 6.0.3 | o Angular 22.2 exige `>=6.0 <6.1` (a 7.x não serve) |
| `vitest` | 5.1.0 | testes unitários (D-13) |
| `jsdom` | 31.0.1 | DOM dos testes |
| `@vitest/coverage-v8` | 5.1.0 | cobertura de 80% em `core` e `shared` (D-13) |
| `eslint` | 10.15.0 | lint (D-14) |
| `angular-eslint` | 22.7.0 | regras do Angular e dos templates |
| `typescript-eslint` | 8.73.0 | regras de TypeScript, inclusive `no-explicit-any` |
| `eslint-plugin-boundaries` | 7.4.4 | fronteiras da D-03 |
| `eslint-config-prettier` | 10.1.8 | desliga no ESLint o que o Prettier formata |
| `prettier` | 3.10.1 | formatação (D-14) |
| `stylelint` | 18.0.0 | lint de SCSS (D-10) |
| `stylelint-config-standard-scss` | 18.0.0 | regras base de SCSS |
| `husky` | 9.1.7 | gancho de pre-commit (D-14) |
| `lint-staged` | 17.6.1 | lint só nos arquivos alterados (D-14) |
| `openapi-typescript` | 7.13.0 | tipos a partir do snapshot (D-05) |

Notas:

- **BEM sem plugin.** O `stylelint-selector-bem-pattern` 5.0.0 só aceita Stylelint 17. O BEM é verificado pela regra
  nativa `selector-class-pattern` com a expressão `bloco__elemento--modificador`. Uma dependência a menos.
- **`openapi-typescript` e TypeScript 6.** O pacote declara `typescript ^5.x` como peer. O `package.json` leva um
  `overrides` para ele usar o TypeScript do projeto. O P4 prova que a geração funciona; se não funcionar, o passo para
  e reporta (não se troca de gerador nem se instala um segundo TypeScript sem decisão do Matheus).
- Pacotes que o `ng new` trouxer e que não estão nas tabelas são removidos no P1.

## Implementação

Regras para todos os passos: testes antes do código quando o passo tem código testável; sem `git add` nem commit; nada
fora do que o passo lista; ao final de cada passo, `npm run lint`, `npm run lint:styles`, `npm test` e `npm run build`
verdes (a partir do passo em que cada script existe).

### P1 — Projeto Angular 22 e estrutura (mecânico)

- Conferir o Node (ver "Node"). Parar se não servir.
- Gerar o projeto com o `@angular/cli` 22.2.7 na raiz do repositório, **sem sobrescrever** `README.md`, `CLAUDE.md`,
  `docs/` nem `.claude/` (gerar numa pasta temporária e copiar, se o `ng new` não aceitar a pasta existente). Opções:
  nome `renda-fixa-web`, standalone, zoneless, SCSS, sem SSR, sem `zone.js`, Vitest como executor de testes, prefixo
  de seletor `rf`.
- `tsconfig`: `strict` e `strictTemplates` ligados (D-02).
- `.nvmrc` com `26.13.1`; `engines.node` `^26.13.0` no `package.json`.
- `.gitattributes` com `* text=auto eol=lf` e `.editorconfig` (LF, UTF-8, 2 espaços). Sem isso o arquivo gerado no
  Windows difere do gerado no CI (criterio dos tipos, P4).
- Pastas da D-03 em `src/app/`: `api/`, `core/`, `shared/ui/`, `shared/format/`, `features/{carteira,titulos,aportes,
  projecao,indexadores}/`. Pastas ainda vazias ganham `.gitkeep`.
- `angular.json`: `index.html` com `lang="pt-BR"` e título "Renda Fixa". Os orçamentos do `ng new` ficam como vêm
  (medem tamanho sem compressão); o limite da RNF-01, comprimido, é conferido pelo script do P8.
- Scripts: `start`, `build`, `test` (sem watch: precisa terminar sozinho no CI). Remover o conteúdo de exemplo do `ng new` (o `AppComponent` fica só com o que o
  P7 vai substituir; um teste mínimo de que o app sobe).

Pronto quando: `npm ci`, `npm test` e `npm run build` passam; versões exatas no `package.json`.

### P2 — ESLint com fronteiras, Stylelint e Prettier (mecânico)

- `eslint.config.js` (flat): `typescript-eslint` estrito com tipos, `angular-eslint` (TS e templates, incluindo as
  regras de acessibilidade de template), `eslint-config-prettier` por último. Regras em erro:
  `@typescript-eslint/no-explicit-any`, `@angular-eslint/prefer-standalone`, seletor com prefixo `rf`. A regra
  `@angular-eslint/prefer-on-push-component-change-detection` só entra se ainda existir no `angular-eslint` 22.7 e
  não exigir `changeDetection` redundante (OnPush já é o padrão da v22, D-02); o implementador reporta o que achou.
- `eslint-plugin-boundaries`, padrão "proibido", com o resolvedor de imports configurado para `.ts` (sem ele os
  imports relativos não resolvem e a regra passa em silêncio). Elementos e permissões:

  | Elemento | Arquivos | Pode importar |
  |---|---|---|
  | `app` (raiz de composição) | `src/main.ts`, `src/app/app*.ts` | `app`, `core` e só os arquivos `*.routes.ts` das features |
  | `feature` (captura o nome) | `src/app/features/<nome>/**` | `core`, `shared`, `api` e a mesma feature |
  | `core` | `src/app/core/**` | `core`, `shared`, `api` |
  | `shared` | `src/app/shared/**` | `shared` |
  | `api` | `src/app/api/**` | nada |

  Ninguém importa `app`. `boundaries/no-unknown` e `boundaries/no-unknown-files` ligados para `src/app/**`, para que
  arquivo fora dos elementos não escape da verificação.
- `src/app/api/schema.ts` fica fora do ESLint e do Prettier (gerado).
- `.stylelintrc.json`: `stylelint-config-standard-scss` e `selector-class-pattern` com BEM. A proibição de cor,
  medida e fonte soltas é critério da W2 e entra lá, junto com os tokens.
- `.prettierrc.json` (largura 120, aspas simples) e `.prettierignore` com `docs/`, `.claude/`, `CLAUDE.md`,
  `README.md`, `openapi/`, `package-lock.json`, `src/app/api/schema.ts`, `dist/` e `coverage/`. O Prettier não
  reescreve os documentos aprovados nem o snapshot.
- Scripts: `lint` (ESLint com `--max-warnings 0`), `lint:styles` (Stylelint em `src/**/*.scss`, com
  `--allow-empty-input`), `format` e `format:check` (Prettier), `typecheck` (`tsc --noEmit` nos tsconfig do app e dos
  testes).

Pronto quando: os quatro scripts passam no projeto do P1 e o implementador mostra, com violações temporárias
desfeitas em seguida, que `shared` importando `core` e uma feature importando outra quebram o `npm run lint`, e que
um import permitido (feature importando `core`) passa. O `verificador-de-fase` repete a prova no fim da fase.

### P3 — Husky e lint-staged (mecânico)

- Script `prepare: husky`; `.husky/pre-commit` roda `npx lint-staged`.
- `lint-staged` no `package.json`: `*.{ts,html}` com `eslint --fix --max-warnings 0 --no-warn-ignored` (sem a última
  opção, um commit com o `schema.ts` regenerado seria reprovado pelo aviso de arquivo ignorado) e
  `prettier --write --ignore-unknown`; `*.scss` com `stylelint --fix` e `prettier --write`; `*.{json,yml,yaml}` com
  `prettier --write --ignore-unknown`. Markdown fica fora.
- Sem commitlint (D-14).

Pronto quando: `npx lint-staged` roda sem erro com a área de staging vazia e o gancho existe. O teste real do gancho
acontece no primeiro commit do Matheus.

### P4 — Proxy, snapshot do OpenAPI e tipos gerados (mecânico)

- `proxy.conf.json`: `/api` e `/health` para `http://localhost:8080`, ligado ao `serve` no `angular.json` (D-15).
  Nenhuma URL da API em código ou em `environment`.
- `openapi/renda-fixa-api.json`: baixado de `http://localhost:8080/swagger/v1/swagger.json` com a API do Compose no
  ar, gravado formatado e com LF. Script `api:snapshot` documenta o comando (uso manual, quando a API mudar).
- `overrides` do `openapi-typescript` (ver dependências).
- `npm run api:types`: gera `src/app/api/schema.ts` a partir do snapshot. Sem rede: lê só o arquivo.
- `npm run api:types:check`: gera de novo e falha se o resultado diferir do arquivo versionado (comparação de
  conteúdo; não depender de `git diff`, para funcionar com arquivo ainda não commitado).

Pronto quando: `schema.ts` contém os seis caminhos e os DTOs do contrato atual (`PortfolioSummaryResponse` com
`positions` e `referenceDate`); `api:types:check` passa; alterar uma linha do `schema.ts` à mão faz o check falhar
(testar e desfazer).

### P5 — Envelope e erros no `core` (D-06)

Em `src/app/core/http/`. Testes primeiro.

- `ApiError`: classe com `status: number` e `message: string` (estende `Error`). `status` 0 significa sem resposta.
- `unwrapEnvelope<T>(body: unknown, status: number): T`: devolve `data` quando o corpo é um envelope com `success`
  verdadeiro. Corpo nulo ou vazio (204) devolve `null` (era `undefined`; alinhado na revisão ao que o `HttpClient`
  de fato entrega). Corpo que não é envelope, ou envelope com `success` falso
  numa resposta 2xx, lança `ApiError` com a mensagem genérica e o status HTTP real da resposta.
- `toApiError(error: unknown): ApiError`:
  - já é um `ApiError`: devolve o mesmo objeto (o erro lançado pelo desembrulho não é embrulhado de novo);
  - sem resposta (`status` 0): "Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.";
  - 502, 503 ou 504 sem envelope: a mesma mensagem de conexão, com o status real. Pela D-15 o navegador fala sempre
    com o proxy; com a API fora do ar, o que chega é um 502 ou 504 do proxy, não status 0 (decisão 5 da aprovação);
  - demais 5xx: "Ocorreu um erro inesperado. Tente novamente mais tarde.", sem repassar o corpo;
  - 4xx com envelope: a `message` da API, sem alteração;
  - 4xx sem envelope ou sem `message`, e qualquer erro desconhecido: a mensagem genérica.
- `requireFields<T>(value: unknown, fields: readonly (keyof T)[]): T`: confere que os campos listados existem e não
  são `undefined`; se faltar algum, lança `ApiError` com a mensagem genérica. É o ponto em que a "conferência dos
  campos obrigatórios" da ESPECIFICACAO acontece: as features passam essa função no `parse` do `httpResource` (e num
  `map` na escrita), em vez de espalhar `!`. A W1 entrega e testa o mecanismo; as listas de campos vêm com as features.
- `apiEnvelopeInterceptor` (interceptor funcional): só para URLs que começam com `/api/`. Na resposta de sucesso,
  troca o corpo por `unwrapEnvelope(corpo)`; no erro, relança `toApiError(erro)`. Requisição fora de `/api/` (por
  exemplo `/health`, texto puro) passa intacta. Assim nenhum serviço ou componente vê o envelope, e `httpResource` e
  `HttpClient` recebem a mesma coisa.
- Registrado em `app.config.ts` com `provideHttpClient(withInterceptors([...]))`. Sem `withFetch()`: o Angular 22.2 o
  marca como depreciado, porque o fetch já é o backend padrão (corrigido na implementação do P5, em 16/11/2026).

O tipo do envelope vem de `components['schemas']['ObjectApiResponse']` do `schema.ts` (o contrato não tem envelope
genérico, só um por DTO); nenhum tipo do contrato é redeclarado à mão. Respostas de exemplo dos testes montadas por
funções em `core/http/testing/`.

### P6 — `LOCALE_ID` e pipes de formatação (D-07)

Em `src/app/shared/format/`. Testes primeiro. Pipes puros, standalone, com `Intl` e locale `pt-BR` fixo (o app só tem
pt-BR, D-12).

- `rfCurrency`: número para moeda BRL. `1003.15` vira `R$ 1.003,15`. O `Intl` separa `R$` do número com espaço
  não separável (U+00A0); os testes escrevem o escape `\u00a0` no literal, nunca o caractere invisível. Negativo:
  hífen comum antes do símbolo, `-R$ 1.003,15` (formato fixado aqui, não copiado da saída).
- `rfPercent`: a API manda percentuais já em pontos (`22.5`, `48.43`). `12.5` vira `12,50%`. Formata com `Intl`
  decimal de duas casas e acrescenta `%`. **Não** usar `style: 'percent'`, que multiplica por 100; **não** dividir
  nem multiplicar (D-07).
- `rfDateOnly`: `'2026-11-09'` vira `'09/11/2026'` por manipulação de string, validada por expressão regular. Nunca
  `new Date()`.
- Nos três: `null` e `undefined` viram string vazia. No `rfDateOnly`, string fora do formato `aaaa-mm-dd` volta como
  veio (não esconde o dado nem inventa data).
- `app.config.ts`: `registerLocaleData` do pt e `LOCALE_ID` `pt-BR`.

### P7 — Shell e rotas (D-09)

Testes primeiro.

- `core/layout/shell`: componente com `<header>` (nome do app), `<nav aria-label="Principal">` com os links Carteira,
  Títulos, Aportes e Indexadores (`routerLink`, `routerLinkActive` com `ariaCurrentWhenActive="page"`), e `<main>` com
  o `<router-outlet>`. Sem estilo próprio (W2).
- Rotas da D-09, cada feature carregada sob demanda por um arquivo de rotas próprio (`loadChildren`):
  `/carteira`; `/titulos`, `/titulos/novo`, `/titulos/:id`; `/aportes`, `/aportes/novo`; `/posicoes/:id` (feature
  `projecao`); `/indexadores`. A raiz redireciona para `/carteira`.
- Cada rota aponta para um componente de página vazio em `features/<feature>/pages/`, com um `<h1>` com o nome da
  tela e mais nada. Cada rota tem `title` em português ("Carteira — Renda Fixa").
- Nenhuma chamada HTTP, nenhum serviço, nenhum `data/` nesta fase.

### P9 — CI no PR (mecânico)

`.github/workflows/ci.yml`, no molde do CI da API:

- Gatilhos: `pull_request` e `push` para `main`, e `workflow_call`. `permissions: contents: read`. `concurrency` por
  ref, cancelando execução anterior do mesmo PR.
- `actions/checkout` e `actions/setup-node` fixadas por SHA com a versão no comentário (SHA obtido do GitHub com `git ls-remote --tags`, não
  de memória; a máquina não tem o `gh`); `persist-credentials: false`; Node lido do `.nvmrc`; cache do npm.
- Passos, nesta ordem: `npm ci`, `format:check`, `lint`, `lint:styles`, `typecheck`, `api:types:check`,
  `test:coverage`, `build`, `build:budget` (P8).
- Storybook e ponta a ponta entram no CI nas fases que os criam (W2 e W3).

### P8 — Orçamento do bundle e cobertura (mecânico; vem antes do P9, que usa os scripts)

- `scripts/check-bundle.mjs` (só `node:fs` e `node:zlib`): lê o `index.html` do build de produção, soma o tamanho
  gzip dos arquivos iniciais que ele referencia (scripts, `modulepreload` e CSS) e falha acima de 250 000 bytes
  (RNF-01). Imprime o total. Script `build:budget`.
- Cobertura: limite de 80% (linhas, funções, ramos e instruções) para `src/app/core/**` e `src/app/shared/**`, com
  `schema.ts` e arquivos de rota fora da conta. Script `test:coverage`.
- `README.md`: acrescentar a seção "Desenvolvimento" (Node, `npm ci`, subir a API, `npm start`, scripts e como
  regenerar o `schema.ts`). Não reescrever o resto. Motivo: a fase cria esses comandos e o pré-requisito de Node, e
  sem a seção ninguém além do autor consegue rodar o projeto (D-17); o README completo continua sendo da W6.

## Testes

A W1 não fecha nenhum CA de tela. O CA-21 (formatação pt-BR) começa aqui, pelos pipes. Cada critério do ROADMAP tem
sua evidência:

| Critério do ROADMAP | Evidência |
|---|---|
| lint, lint:styles, test e build verdes no CI de um PR | execução do `ci.yml` no PR da fase (depende do push do Matheus) |
| Violar fronteira quebra o lint | verificador: `shared` importando `core` e feature importando outra feature, saída do lint registrada, violação desfeita |
| Tipos batem com o snapshot e o CI falha se divergirem | `api:types:check` no CI; verificador altera `schema.ts`, registra a falha e desfaz |
| Envelope: sucesso, 204, 400, 404, 500 e falha de rede | testes T-01 a T-09 e T-23 a T-29 |
| Pipes pt-BR sem `new Date()` | testes T-10 a T-18; busca por `new Date` em `src/` sem resultado |
| Bundle inicial abaixo de 250 KB comprimido | `build:budget` no CI, com o total impresso |

Testes do P5 (`HttpTestingController`, envelope real da API nos corpos):

- T-01 devolve o `data` quando a API responde 200 com envelope de sucesso
- T-02 devolve o `data` quando a API responde 201
- T-03 devolve vazio, sem erro, quando a API responde 204 sem corpo
- T-04 entrega um `ApiError` com status 400 e a mensagem da API quando a API responde 400
- T-05 entrega um `ApiError` com status 404 e a mensagem da API quando a API responde 404
- T-06 entrega a mensagem genérica, sem o texto do corpo, quando a API responde 500
- T-07 entrega a mensagem de conexão, com status 0, quando não há resposta
- T-08 entrega a mensagem genérica quando um 4xx chega sem envelope (por exemplo, HTML do proxy)
- T-09 não mexe em resposta fora de `/api/` (`/health` devolve o texto `Healthy`)
- T-23 entrega a mensagem genérica, com o status 200, quando a API responde 200 com um corpo fora do envelope
- T-24 entrega a mensagem genérica quando um 4xx chega com envelope sem `message`
- T-25 entrega a mensagem de conexão, com o status real, quando o proxy responde 502 ou 504 sem envelope
- T-26 `toApiError` devolve o mesmo `ApiError` que recebeu
- T-27 o `value()` de um `httpResource` chega desembrulhado
- T-28 o `error()` de um `httpResource` é um `ApiError` com a mensagem da API quando ela responde 400
- T-29 `requireFields` devolve o valor quando os campos existem e lança `ApiError` genérico quando falta um
  (com um DTO do `schema.ts`, por exemplo `AssetResponse`)

Mensagens esperadas de 400 e 404 nos testes: textos reais da API, por exemplo "Título possui aportes e não pode ser
removido." (ESPECIFICACAO, CA-11).

Testes do P6:

- T-10 formata `1003.15` como `'R$\u00a01.003,15'`
- T-11 formata `0` como `'R$\u00a00,00'` e `-1003.15` como `'-R$\u00a01.003,15'`
- T-12 formata `1040320.26` como `'R$\u00a01.040.320,26'`
- T-13 formata `12.5` como `12,50%`
- T-14 formata `48.43` como `48,43%` e `0` como `0,00%`, sem multiplicar por 100
- T-15 formata `'2026-11-09'` como `09/11/2026`
- T-16 mantém o dia em `'2026-01-01'` e `'2026-12-31'` (as datas em que o fuso erraria)
- T-17 devolve vazio para `null` e `undefined` nos três pipes
- T-18 devolve a própria string quando a data não está em `aaaa-mm-dd`

Testes do P7:

- T-19 o shell mostra a navegação "Principal" com os quatro links, cada um com o destino certo
- T-20 a raiz redireciona para `/carteira`
- T-21 cada rota da D-09 carrega a página da feature e mostra o `<h1>` dela (uma verificação por rota, com
  `RouterTestingHarness`)
- T-22 o link da rota ativa recebe `aria-current="page"`
- T-30 cada rota da D-09 tem o `title` em português
- T-31 o `appConfig` fornece `LOCALE_ID` `pt-BR` e registra o interceptor do envelope (uma requisição a `/api/` feita
  com os provedores do `appConfig` chega desembrulhada)

## Revisão e QA nesta fase

- `revisor-arquitetura` na spec e na implementação. `revisor-ux` não entra (o comando o prevê da W2 em diante, e o
  shell não tem visual).
- QA exploratório não se aplica: as telas estão vazias. O `verificador-de-fase` confere no navegador ou por `curl`
  que o `ng serve` responde nas rotas e que `/health` e `/api/assets` passam pelo proxy.

## Critérios

Os seis critérios da W1 no `ROADMAP.md`, mais a definição de pronto. O primeiro critério só fecha depois que o
Matheus fizer o commit, o push e abrir o PR: o orquestrador não faz commit.

## Decisões do Matheus na aprovação (16/11/2026)

1. **Node 26** (LTS atual), não 24, depois de conferido o `engines` de cada dependência (seção "Node").
2. **Retry de rede (D-04)** entra na W3. Registrado no ROADMAP.
3. **Rota desconhecida** (`**`) fica para a W3. Registrado no ROADMAP. Na W1 não há tratamento.
4. **Campos opcionais nos tipos gerados:** fica como a ESPECIFICACAO diz, tipos com `?` e conferência pelo
   `requireFields`. A opção `--properties-required-by-default` não é usada.
5. **502, 503 e 504 do proxy sem envelope** são falha de conexão (mensagem de conexão, status real), como no P5.

## Relatório

Ao fim: arquivos criados, contagem de testes (0 antes), tamanho do bundle inicial comprimido, cobertura de `core` e
`shared`, resultado de cada critério com a evidência (`docs/VALIDACAO-W1.md`) e a mensagem de commit sugerida
(`W1: fundação do front`).

Pendências que o relatório precisa levar para as fases seguintes, para não ficarem órfãs:

- Pipe de dias e função "hoje": dependências da W3 que o ROADMAP da W3 não lista (retry e rota desconhecida já
  foram registrados lá).
- `rfPercent` tem duas casas fixas. O CDI diário da W5 (`0.055131` % ao dia) viraria `0,06%`; a W5 decide a precisão.
