# Roadmap — renda-fixa-web

## Objetivo

Interface em Angular para a renda-fixa-api, com o mesmo padrão de qualidade da API: decisões registradas, spec por fase,
testes antes do código, verificação independente e entrega contínua. Arquitetura em `ARQUITETURA.md`, escopo em
`ESPECIFICACAO.md`.

## Etapa 0 — Normalização (antes das fases)

- [x] Pesquisa do front-end Angular em 2026 (`PESQUISA-FRONTEND-2026.md`) incorporada à arquitetura
- [x] `ARQUITETURA.md` aprovada pelo Matheus (16/11/2026)
- [x] `ESPECIFICACAO.md` aprovada pelo Matheus (16/11/2026)
- [ ] Referências visuais escolhidas e `DESIGN.md` escrito, com os tokens
- [x] Lacunas L-01 a L-04 decididas: L-01 e L-03 resolvidas na API (PR #18), L-02 e L-04 aceitas
- [x] `.claude/` do front: agentes (`implementador`, `revisor-arquitetura`, `revisor-ux`, `verificador-de-fase`,
  `qa-exploratorio`), skill `testes-angular` e comando `/executar-fase` adaptados ao Angular
- [x] Fases abaixo definidas, com passos e critérios de conclusão

## Fases

Cada fase tem uma spec de execução (`docs/SPEC-Wx-EXECUCAO.md`) escrita e revisada pelo `/executar-fase` antes do
código. Os passos abaixo são o escopo; os critérios são o que a verificação precisa provar.

### W1 — Fundação

Passos: projeto Angular 22 com a estrutura da D-03; ESLint com fronteiras, Stylelint, Prettier, Husky com lint-staged;
Vitest; proxy do `ng serve` para a API do Compose (D-15); snapshot do OpenAPI e tipos gerados (D-05); envelope e erros
no `core` (D-06); `LOCALE_ID` pt-BR e pipes de formatação (D-07); shell de navegação com as rotas da D-09 (telas vazias);
CI no PR.

- [ ] `npm run lint`, `lint:styles`, `test` e `build` verdes no CI de um PR
- [ ] Violar uma fronteira da D-03 de propósito quebra o lint (testar uma vez e desfazer)
- [ ] Os tipos gerados batem com o snapshot e o CI falha se divergirem
- [ ] O desembrulho do envelope cobre sucesso, 204 sem corpo, 400, 404, 500 e falha de rede, com testes
- [ ] Os pipes formatam moeda, percentual e data `DateOnly` em pt-BR sem `new Date()`, com testes
- [ ] Bundle inicial abaixo de 250 KB comprimido (RNF-01)

### W2 — Design system

Passos: `DESIGN.md` vira tokens em três níveis; 8 componentes iniciais em `shared/ui` com Aria e CDK; Storybook;
modo claro e escuro.

- [ ] Nenhuma cor, medida ou fonte solta no SCSS (Stylelint)
- [ ] Os 8 componentes no Storybook, cada um com estados e uso por teclado
- [ ] Contraste dos tokens semânticos dentro do WCAG 2.2 AA, nos dois modos

### W3 — Carteira e projeção

Passos: SignalStore da carteira (D-04); telas `/carteira` e `/posicoes/:id`; data de referência na URL.

- [ ] CA-01 a CA-06 e CA-15 a CA-17 cobertos por testes
- [ ] J-02 no Playwright, com `axe` sem violação
- [ ] RNF-05 medido com a API local

### W4 — Títulos e aportes

Passos: telas de títulos e aportes com Signal Forms; exclusão com confirmação; erros da API nos formulários.

- [ ] CA-07 a CA-14 cobertos por testes
- [ ] J-01 no Playwright, com `axe` sem violação

### W5 — Indexadores e gráficos

Passos: tela `/indexadores`; ECharts modular com tema dos tokens; distribuição em SVG próprio na carteira; tabelas
equivalentes.

- [ ] CA-18 e CA-19 cobertos por testes
- [ ] J-03 no Playwright, com `axe` sem violação
- [ ] Bundle inicial continua dentro do RNF-01 (ECharts só na rota de indexadores)

### W6 — Entrega

Passos: imagem Nginx com proxy para a API; `docker-compose.yml` com PostgreSQL, API e front; release no GHCR com smoke
e `latest` só depois dele (D-16); README com o projeto.

- [ ] Um merge na `main` publica a imagem com a tag do SHA e move `latest` só depois do smoke
- [ ] `docker compose up` sobe a stack completa e as três jornadas passam contra ela
- [ ] `actionlint` e `zizmor` limpos, actions por SHA, Dependabot configurado

## Plano de corte

O escopo é grande para uma pessoa só. Se o tempo apertar, corta-se nesta ordem, sem trocar de arquitetura:

1. Modo escuro (os tokens semânticos continuam prontos para ele)
2. Gráfico de distribuição em SVG próprio (a tabela de distribuição fica)
3. Componentes do design system além dos 8 iniciais
4. Atalhos de período nos indexadores (fica só o período personalizado)

Nunca se corta: testes antes do código, as jornadas J-01 a J-03 no Playwright, acessibilidade (CA-20) e a regra de não
calcular dinheiro no front.

## Definição de pronto (vale para toda tarefa)

1. Teste escrito antes do código, falhando pelo motivo certo
2. Build de produção sem warning e dentro do orçamento de tamanho
3. Lint, verificação de tipos e testes verdes
4. Nenhum cálculo financeiro no front (D-07)
5. Tela navegável por teclado e sem violação do `axe`
6. Documentação atualizada quando a fase muda uma decisão
