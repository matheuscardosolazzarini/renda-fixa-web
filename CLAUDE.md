# renda-fixa-web

Front-end em Angular 22 da renda-fixa-api. Leia antes de qualquer tarefa:

- `docs/ARQUITETURA.md`: decisões D-01 a D-17. Elas prevalecem sobre qualquer suposição.
- `docs/ESPECIFICACAO.md`: telas, regras de interface (UI-xx) e lacunas da API.
- `docs/ROADMAP.md`: fase atual e critérios.

## A API

- Fica em `../renda-fixa-api` (mesmo workspace). Leia para conferir o contrato: DTOs em
  `src/FixedIncome.Application/DTOs`, controllers em `src/FixedIncome.Api/Controllers`, regras em `docs/ESPECIFICACAO.md`.
- **Nunca altere a API a partir deste repositório** (D-01). Se o front precisar de mudança no contrato, registre como
  lacuna na `ESPECIFICACAO.md` e pare.
- Para rodar a API localmente: `docker compose up -d` em `../renda-fixa-api` (porta 8080, Swagger em `/swagger`).

## Convenções

- Standalone, zoneless, OnPush, signals. `input()`, `output()`, `computed()`, `inject()`. Control flow `@if`, `@for`.
- Sem `any`. Tipos do contrato só de `src/app/api/schema.ts`, gerado (não editar à mão).
- Nenhum cálculo financeiro no front. Datas `DateOnly` ficam string, nunca `new Date()` (D-07).
- Componentes visuais só do nosso design system em `shared/ui`. Nada de Angular Material, PrimeNG ou similar (D-10).
- Estilo em SCSS com BEM, valores sempre dos tokens (nunca cor ou medida solta). Stylelint precisa passar (D-10).
- Estado compartilhado só no SignalStore da carteira, em `core` (D-04). No resto, signals e `httpResource`.
- Respeite as fronteiras entre `features`, `core`, `shared` e `api` (D-03).
- Textos da interface em português; identificadores em inglês.
- Testes: Vitest, nomes em português, Arrange/Act/Assert. Teste antes do código.

## Fluxo

- Não faça `git add`, `git commit` nem `git push`. Commits são do Matheus.
- Não adicione dependência npm sem que a spec da fase a autorize.
