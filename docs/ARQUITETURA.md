# Arquitetura — renda-fixa-web

Status: **aprovada pelo Matheus em 16/11/2026** (revisada com a pesquisa `docs/PESQUISA-FRONTEND-2026.md`)

Front-end em Angular da [renda-fixa-api](https://github.com/matheuscardosolazzarini/renda-fixa-api). Este documento fixa
as decisões de arquitetura antes das fases. Cada decisão tem um número (D-xx) para ser citada nas specs. Mudar uma decisão
exige registrar a nova data e o motivo aqui.

## Visão geral

```
navegador ──> Nginx (imagem do front) ──┬── /            arquivos estáticos do Angular
                                        └── /api, /health  proxy reverso para a API
                                                                   │
                                                          renda-fixa-api ──> PostgreSQL
```

O navegador só conhece uma origem. O Nginx do front entrega o app e repassa `/api` para a API. No desenvolvimento, o
`ng serve` faz o mesmo papel com o arquivo de proxy.

## Decisões

### D-01 — Repositório separado

`renda-fixa-web` tem CI, imagem, ROADMAP e specs próprios. A API é consumida só pelo contrato HTTP. As duas pastas ficam
lado a lado em `renda-fixa/` e abrem juntas pelo `renda-fixa.code-workspace`. O Claude Code do front lê a API
(`../renda-fixa-api`) para conferir o contrato, mas **nunca a altera**: mudança na API passa pelo fluxo da API.

### D-02 — Angular 22, standalone, zoneless e OnPush

- Angular 22 (versão atual; o próximo major sai em 2027).
- Componentes standalone, zoneless (padrão desde a v21) e `ChangeDetectionStrategy.OnPush` (padrão desde a v22).
- TypeScript em modo estrito e `strictTemplates` (padrão desde a v22).
- APIs de função: `input()`, `output()`, `model()`, `computed()`, `inject()`. Control flow `@if`, `@for`, `@switch`.
- Node na versão LTS suportada pelo Angular 22, fixada em `.nvmrc` e em `engines` no `package.json`.

### D-03 — Estrutura por feature, com fronteiras verificadas

```
src/app/
  api/          tipos gerados do contrato (D-05). Não editar à mão.
  core/         configuração, HTTP (envelope e erros), layout (shell, navegação) e o store da carteira (D-04)
  shared/
    ui/         design system: componentes visuais próprios (D-10)
    format/     pipes de moeda, percentual, data e dias
  features/
    carteira/   resumo da carteira
    titulos/    cadastro de títulos
    aportes/    registro e lista de aportes
    projecao/   projeção de uma posição
    indexadores/ cotações de CDI e IPCA
```

Dentro de cada feature: `pages/` (componentes de rota), `components/` (componentes da feature) e `data/` (serviços e
modelos da feature). O store da carteira fica no `core` porque várias features o usam, e uma feature não importa outra.

Regras de dependência, verificadas pelo ESLint (`eslint-plugin-boundaries`), como o NetArchTest faz na API:

| Camada | Pode importar |
|---|---|
| `features/x` | `core`, `shared`, `api`, e só a própria feature |
| `core` | `shared`, `api` |
| `shared` | nada de `core`, `features` nem `api` |
| `api` | nada |

### D-04 — Estado: SignalStore na carteira, signals no resto

- **Carteira:** um `signalStore` do NgRx (`@ngrx/signals`) concentra o que várias telas compartilham: data de referência
  (D-09) e o resumo, que já traz as posições com projeção e título (L-01). Carteira, aportes e projeção leem dele; títulos e aportes pedem a ele para recarregar
  depois de gravar. Decisão de 16/11/2026: mostra NgRx moderno, que as vagas pedem, no único ponto em que há estado
  compartilhado de verdade.
- **Resto:** `httpResource()` (estável desde a v22) nos serviços das features e signals no componente para estado local.
- **Escrita:** `HttpClient`, nos métodos do store ou do serviço da feature.
- **RxJS** onde ele é a ferramenta natural: retry com espera no interceptor de rede e `debounceTime` na busca de títulos.
- NgRx Store clássico (actions, reducers, effects) fica de fora: o app não é orientado a eventos.

### D-05 — Contrato: tipos gerados de um snapshot do OpenAPI

- A API só expõe o Swagger em `Development`. O snapshot fica versionado em `openapi/renda-fixa-api.json`, baixado de
  `http://localhost:8080/swagger/v1/swagger.json` com a API do Compose rodando.
- Tipos gerados com `openapi-typescript` em `src/app/api/schema.ts` (`npm run api:types`). Só tipos: os serviços são
  nossos (D-04), o que evita código gerado grande e acoplado.
- O CI regenera os tipos a partir do snapshot e falha se o resultado diferir do arquivo versionado.
- Atualizar o snapshot é passo explícito quando a API muda. O teste de ponta a ponta contra a imagem `latest` da API
  (D-13) pega divergência entre o snapshot e a API publicada.

### D-06 — Envelope `ApiResponse` e erros

A API responde sempre `{ statusCode, success, message, data }`.

- Uma função do `core` desembrulha `data` nas respostas de sucesso; nenhum componente lê o envelope.
- A exclusão de título responde 204 sem corpo: é sucesso sem `data`, e o desembrulho precisa aceitar isso.
- Erros viram um tipo `ApiError` com `status` e `message`. A `message` da API já vem em português e é mostrada ao usuário.
- Sem resposta (rede, timeout): mensagem própria em português. 500: mensagem genérica, sem detalhe técnico.
- Erro 400 de formulário aparece junto do formulário; erro de leitura aparece no lugar do conteúdo, com opção de tentar de
  novo.

### D-07 — O front não calcula dinheiro e não converte datas com fuso

- Todo valor financeiro (bruto, IR, IOF, líquido, percentuais) vem pronto da API. O front só formata. Nenhuma soma,
  arredondamento ou rateio no front.
- Formatação com `Intl` em pt-BR: moeda `R$ 1.003,15`, percentual `12,50%`, data `09/11/2026`. `LOCALE_ID` = `pt-BR`.
- Datas da API são `DateOnly` (`"2026-11-09"`) e ficam **string** no front. Nunca passam por `new Date()`, que interpreta
  no fuso UTC e pode mostrar o dia anterior. É o mesmo bug que a API corrigiu no R-01 da F7. Comparação e ordenação de
  datas usam a própria string ISO.
- "Hoje", quando o front precisar, vem de uma função do `core` que usa o fuso `America/Sao_Paulo`.

### D-08 — Formulários com Signal Forms

- Signal Forms (estáveis desde a v22).
- Validações no front espelham as regras da API só para dar retorno imediato (campo obrigatório, taxa positiva, vencimento
  depois da emissão). A API continua sendo a fonte da verdade: o 400 dela aparece no formulário.

### D-09 — Rotas em português, com lazy load e data na URL

| Rota | Tela |
|---|---|
| `/carteira` | resumo da carteira (rota inicial) |
| `/titulos`, `/titulos/novo`, `/titulos/:id` | lista, cadastro e edição de títulos |
| `/aportes`, `/aportes/novo` | lista e registro de aportes |
| `/posicoes/:id` | projeção de uma posição |
| `/indexadores` | cotações de CDI e IPCA |

- Cada feature é carregada sob demanda.
- A data de referência fica na query string (`?data=2026-11-09`). Sem ela, a API usa a data padrão dela. Assim um link
  abre exatamente a mesma visão.

### D-10 — Visual próprio, sem biblioteca de componentes visuais

- Nada de Angular Material, PrimeNG, Spartan ou similar: o visual é nosso. A pesquisa mostrou que o estilo shadcn virou o
  novo genérico, por isso também fica de fora.
- Comportamento e acessibilidade vêm de bibliotecas sem visual:
  - **Angular Aria** (disponível para produção desde a v22): select, combobox, listbox, menu, tabs e grid;
  - **Angular CDK**: dialog, overlay (popover e tooltip), `LiveAnnouncer` (avisos e toast) e foco.
- Datas com `<input type="date">` nativo, estilizado. Sem datepicker de biblioteca.
- **Tokens em três níveis**, todos em CSS custom properties: primitivos (paleta, escala de espaçamento), semânticos (fundo,
  texto, borda, destaque, positivo, negativo) e de componente. O modo escuro troca só os semânticos.
- **SCSS com BEM e Stylelint** nos componentes (decisão de 16/11/2026, pedida nas vagas da área). O SCSS serve para
  organização e mixins; os valores vêm sempre dos tokens, nunca de cor ou medida solta.
- O design system começa com 8 componentes, os que a W3 usa, e cresce sob demanda até no máximo uns 15, em `shared/ui`.
- Regras de visual: números com `font-variant-numeric: tabular-nums`, uma única cor de destaque, verde e vermelho só para
  variação.
- Os tokens saem das referências visuais escolhidas pelo Matheus e ficam documentados em `docs/DESIGN.md` (a escrever).
- **Storybook** documenta cada componente do design system, navegável sem rodar o app.
- **Gráficos:**
  - séries temporais (CDI, IPCA, evolução) com **Apache ECharts** importado de forma modular, encapsulado numa diretiva
    própria com `effect()` e `ResizeObserver`, com tema lido dos tokens. O CDI aparece como linha de referência;
  - distribuição por tipo de título em **SVG próprio** (donut ou barra empilhada);
  - todo gráfico tem tabela equivalente (D-11).

### D-11 — Acessibilidade

Meta WCAG 2.2 AA. Navegação completa por teclado, foco visível, contraste conferido nos tokens e `axe` rodando nos testes
de ponta a ponta (D-13). Todo gráfico tem tabela equivalente.

### D-12 — Idioma

Só pt-BR, sem biblioteca de i18n. Textos da interface em português. Identificadores no código em inglês, como na API.

### D-13 — Testes

- **Unitários com Vitest** (padrão do Angular desde a v21): serviços, pipes, funções do `core` e componentes do design
  system e das features. HTTP testado com `provideHttpClientTesting`. Nomes dos testes em português, no padrão
  Arrange/Act/Assert, como na API.
- **Ponta a ponta com Playwright** contra a stack real do Compose: PostgreSQL, a imagem `latest` da API no GHCR e a imagem
  do front. Inclui `axe` em cada tela.
- Cobertura mínima de 80% em `core`, `shared` e nos serviços das features.

### D-14 — Qualidade no CI e na máquina

- **CI:** ESLint (`angular-eslint` e fronteiras da D-03), Stylelint, Prettier, verificação de tipos, conferência do
  snapshot do contrato (D-05), testes, build de produção com o orçamento da RNF-01, build do Storybook e testes de ponta a
  ponta.
- **Na máquina:** Husky com lint-staged roda lint e formatação nos arquivos alterados antes de cada commit.
- Mensagens de commit seguem o padrão já usado na API (`W1: descrição`), sem commitlint.

### D-15 — Mesma origem, sem CORS

O navegador fala só com o Nginx do front, que repassa `/api` e `/health` para a API. No desenvolvimento, o proxy do
`ng serve` aponta para a API do Compose (`localhost:8080`). Como tudo é mesma origem, a API não precisa liberar CORS e a
URL da API não entra no build: a mesma imagem serve qualquer ambiente, mudando só o destino do proxy por variável de
ambiente no contêiner.

### D-16 — Entrega igual à da API

- CI em todo PR para a `main`, protegida por ruleset como na API.
- Release em cada merge: imagem Nginx no GHCR com a tag do SHA, smoke test com a stack completa no runner e `latest` só
  depois do smoke, só na `main`.
- As mesmas práticas da F8 da API: actions fixadas por SHA, `persist-credentials: false`, permissões mínimas, `zizmor`
  limpo, Dependabot com npm e actions agrupados e sem major automático do Angular.
- Um `docker-compose.yml` no front sobe PostgreSQL, API (`ghcr.io/.../renda-fixa-api:latest`) e front.

### D-17 — Processo

Spec-Driven Development, como na API: `docs/ESPECIFICACAO.md`, `docs/ROADMAP.md`, uma spec de execução por fase,
agentes do Claude Code adaptados ao Angular e o comando `/executar-fase`. Commits e pushes são do Matheus.

## Alternativas descartadas

| Alternativa | Por que ficou de fora |
|---|---|
| Angular Material, PrimeNG, NG-ZORRO | Visual reconhecível como "mais um app" com a biblioteca. O objetivo é um visual próprio (D-10). |
| Spartan UI e outras no estilo shadcn | O estilo shadcn virou o novo genérico de 2025 e 2026, e o Spartan ainda está em "Assess" no Thoughtworks Radar. |
| Tailwind | Bom para estilo rápido, mas as vagas da área pedem SCSS, BEM e Stylelint, e os tokens já cumprem o papel (D-10). |
| NgRx Store clássico (actions, reducers, effects) | Código repetitivo sem retorno: o app não é orientado a eventos. O SignalStore mostra NgRx moderno onde há estado compartilhado (D-04). |
| Nx monorepo | Ferramenta para muitos apps e bibliotecas. Aqui é um app só, e juntar a API .NET no Nx complicaria o CI (D-01). |
| Microfrontends (Module Federation) | Resolvem a independência de vários times. Com um time e um domínio, o custo de integração não se paga. |
| SSR | O app não precisa de SEO nem de carregamento indexável. Entrega estática pelo Nginx basta. |
| Cliente gerado completo (hey-api, ng-openapi-gen) | Geraria chamadas que devolvem o envelope inteiro. Só os tipos bastam, e os serviços desembrulham o envelope num lugar só (D-05, D-06). |

## Pendências antes das fases

- [x] Matheus aprova este documento e a `ESPECIFICACAO.md` (16/11/2026)
- [ ] Referências visuais escolhidas e `docs/DESIGN.md` escrito (tokens)
- [x] Decisão sobre as lacunas do contrato da API (`ESPECIFICACAO.md`, seção "Lacunas da API")
- [x] Fases definidas no `ROADMAP.md`
