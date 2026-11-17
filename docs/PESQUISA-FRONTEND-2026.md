# Pesquisa: front-end Angular em 2026 — projeto Renda Fixa

> Data da pesquisa: 16/11/2026
> Contexto: front-end Angular 22 para a API .NET 8 de renda fixa (resumo da carteira, cadastro de títulos e aportes, projeção com IR e IOF, gráficos de CDI e IPCA). Projeto de portfólio, com visual próprio.

## Resumo

A proposta original (Angular Aria + CDK + design system próprio com tokens em CSS) é o melhor caminho para o objetivo. Três ajustes:

1. Completar com o CDK o que o Aria não cobre: diálogo, tooltip, popover, toast e datepicker.
2. Documentar o design system no Storybook, para o recrutador conseguir ver.
3. Mostrar NgRx e RxJS em algum ponto, porque as vagas brasileiras ainda pedem os dois.

Legenda: trechos marcados com **(opinião)** são avaliação própria, não fato de fonte.

---

## 1. Arquitetura Angular em 2026

### O que mudou no Angular 22 (junho de 2026)

- Signal Forms estáveis.
- `resource`, `rxResource` e `httpResource` estáveis.
- Angular Aria saiu do developer preview e funciona com Signal Forms.
- OnPush virou o padrão; `ng update` adiciona `ChangeDetectionStrategy.Eager` nos componentes antigos.
- `strictTemplates`, `withFetch()` e hidratação incremental viraram padrão.
- Novo decorator `@Service()` e `injectAsync()`.
- Vitest é o padrão desde o v21; o v22 trouxe a migração `migrate-karma-to-vitest`.

Fontes: [Ninja Squad, 03/06/2026](https://blog.ninja-squad.com/2026/06/03/what-is-new-angular-22.0); [Ng-News 26/15, jun/2026](https://dev.to/playfulprogramming-angular/ng-news-2615-angular-22-23o0).

### O que os times estão fazendo

| Tema | Prática em 2026 | Fonte |
|---|---|---|
| Pastas | Por feature, não por tipo. Aliases `@core/*` e `@shared/*`. | [SharpQuest, 14/10/2026](https://www.sharpquest.com/blog/posts/2026/october/angular-best-practices-2026/) |
| Estado | Signals no componente para estado local. SignalStore para estado compartilhado de uma feature ("excelente padrão" para apps novos). NgRx Store clássico só em app grande orientado a eventos. | [ABP, 30/06/2026](https://abp.io/community/articles/angular-22-state-management-signals-signalstore-or-ngrx-yq8zg0nw) |
| Formulários | Signal Forms em código novo. Reactive Forms tipados em código existente. | [SharpQuest](https://www.sharpquest.com/blog/posts/2026/october/angular-best-practices-2026/) |
| API | `httpResource` para leitura. Mutações (POST, PUT) continuam com `HttpClient`. | [SharpQuest](https://www.sharpquest.com/blog/posts/2026/october/angular-best-practices-2026/) |
| Testes | Vitest para unidade. Playwright ou Cypress para os fluxos principais. | [SharpQuest](https://www.sharpquest.com/blog/posts/2026/october/angular-best-practices-2026/) |
| SSR | Só em páginas públicas que precisam de SEO. App atrás de login normalmente não precisa. | [SharpQuest](https://www.sharpquest.com/blog/posts/2026/october/angular-best-practices-2026/) |

### Geração de cliente a partir do OpenAPI

- **hey-api/openapi-ts (plugin Angular):** gera funções com `httpResource` usando `httpResources: true`. A documentação não diz se o recurso é beta ou estável. [Doc](https://web-51ka7jqe5-hey-api.vercel.app/openapi-ts/plugins/angular)
- **ng-openapi-gen:** opção madura, baseada em `HttpClient`. [README](https://cdn.jsdelivr.net/npm/@erengee/ng-openapi-gen@0.25.4/README.md)
- **ng-openapi + plugin http-resource:** ainda jovem, sem declaração de maturidade. [README](https://cdn.jsdelivr.net/npm/@ng-openapi/http-resource@0.1.2/README.md)

### Recomendação para o projeto

```
src/app/
  core/        interceptors, config, shell/layout
  api/         cliente gerado (não editar à mão)
  ui/          design system: tokens + componentes
  features/
    carteira/  resumo (SignalStore)
    titulos/   cadastro e lista
    aportes/
    projecao/  IR, IOF e gráficos
  shared/      pipes de moeda/percentual, utils de data
```

- **Estado:** um SignalStore só para a carteira (compartilhada por resumo, títulos e aportes). No resto, signals simples. Incluir RxJS onde for natural, como um interceptor de retry ou um filtro com debounce.
- **Formulários:** Signal Forms, usando os validadores novos do v22 (`minDate()`, `maxDate()`).
- **Cálculo de IR e IOF:** fica no back-end .NET; o front só exibe. **(opinião)** Evita duplicar regra de negócio.
- **Testes:** Vitest para store, pipes e componentes. Playwright para o fluxo cadastrar título → aportar → ver projeção. Verificação de acessibilidade com axe dentro do Playwright **(opinião)**.
- **Qualidade:** ESLint, Stylelint, Husky, commitlint e GitHub Actions (quase a lista da vaga do BTG, ver seção 5).
- **SSR:** não usar. Deploy estático.

---

## 2. Bibliotecas e caminhos para o visual

### Bibliotecas prontas

**Angular Material**
- Oficial. Cerca de 25 mil estrelas; entre 1,3 e 2,9 milhões de downloads por semana, conforme a fonte.
- Tema M3 configurado por tokens.
- Contra: poucos componentes (sem gráficos, sem grid avançado) e a cara de "Material" que o projeto quer evitar.
- Fontes: [npm-compare](https://npm-compare.com/@angular/material,ng-zorro-antd,ngx-bootstrap,primeng); [Colorlib, 01/10/2026](https://colorlib.com/wp/angular-components/).

**PrimeNG**
- Mais de 80 componentes, cerca de 900 mil downloads por semana, modo unstyled e integração com Tailwind.
- Análise da v21.1.9 em julho de 2026 encontrou:
  - 35 issues de acessibilidade abertas;
  - suporte a zoneless marcado como "Initial";
  - Table com 94 `@Input()` contra 13 `input()`;
  - licença proprietária nas versões LTS.
- Pode ter melhorado no v22 (não verificado).
- Fontes: [dev.to, 15/07/2026](https://dev.to/filip_luca_artificial_sense/the-most-complete-angular-ui-library-has-35-open-accessibility-bugs-a-fair-teardown-of-primeng-on-3c44); [Colorlib](https://colorlib.com/wp/angular-components/).

**Taiga UI v5**
- Prioriza signals, tema com variáveis CSS, exige Angular 19 ou superior.
- Comunidade menor: cerca de 35 mil downloads por semana.
- Fontes: [dev.to/angular](https://dev.to/angular/whats-new-in-taiga-ui-v5-a-modern-angular-ui-kit-7lm); [Colorlib](https://colorlib.com/wp/angular-components/).

**NG-ZORRO**
- Ant Design. Forte para admin denso, tem release para o v22.
- Estética Ant muito reconhecível.
- Fonte: [Colorlib](https://colorlib.com/wp/angular-components/).

### Headless e no estilo shadcn

**Spartan UI**
- 1.0 estável em junho de 2026.
- Duas camadas: comportamento ("brain") como pacote npm; estilo ("helm") copiado para o projeto, com Tailwind.
- 65 componentes, incluindo Chart e suporte a Signal Forms. Zoneless e SSR.
- Thoughtworks Radar (vol. 35, novembro de 2026): **Assess**, com problemas no CLI de upgrade dos componentes copiados.
- Fontes: [changelog](https://www.spartan.ng/documentation/changelog); [documentação](https://www.spartan.ng/documentation); [Thoughtworks](https://www.thoughtworks.com/radar/languages-and-frameworks/spartan-ui).

**Zard UI**
- Linha shadcn, 57 componentes, código todo copiado para o projeto. CLI ainda pré-1.0.
- Fonte: [shadcn/studio, 16/09/2026](https://shadcnstudio.com/blog/using-shadcn-with-angular/).

**ng-primitives**
- Headless, Apache 2.0. Ainda pré-1.0; o README documenta suporte só até o Angular 20. Risco no 22.
- Fonte: [README](https://scriptagc.wasmer.app/https_github_com/ng-primitives/ng-primitives).

**Angular Aria**
- Oficial, estável no v22.
- 13 padrões: Autocomplete, Listbox, Select, Multiselect, Combobox, Menu, Menubar, Toolbar, Accordion, Tabs, Tree e Grid.
- A própria doc indica o Aria para quem constrói um design system com identidade própria.
- **Não tem** Dialog, Tooltip, Popover nem Datepicker → usar o CDK (Dialog, Overlay, A11y/LiveAnnouncer).
- Para data: `<input type="date">` nativo estilizado **(opinião)**.
- Fonte: [angular.dev](https://next.angular.dev/guide/aria/overview).

### Tailwind CSS

- Setup com PostCSS, documentado no angular.dev. [Guia](https://v20.angular.dev/guide/tailwind)
- No v4 a configuração é em CSS (`@theme`), o que combina bem com tokens.
- Contra para este projeto: as vagas brasileiras analisadas pedem CSS3, SCSS, BEM e Stylelint, não Tailwind (seção 5).

### 21st.dev e equivalentes

- **21st.dev é só React** (Tailwind + Next). A página "angular" diz "Components for React & Next.js". [21st.dev](https://21st.dev/community/components/s/angular)
- Serve como referência visual; o componente tem que ser portado à mão.
- Blocos do shadcn também não entram direto em Angular. [shadcn/studio](https://shadcnstudio.com/blog/using-shadcn-with-angular/)
- Mais parecido em Angular: blocks do Spartan, Zard UI e [Radix NG](https://www.shadcn.io/template/category/angular).

### Templates prontos

- **Grátis para Angular 21:** TailAdmin Angular (Tailwind v4), CoreUI Angular, Angular Material Admin, Modernize, entre outros. [TailAdmin, 21/04/2026](https://tailadmin.com/blog/angular-dashboard-templates) — artigo do próprio fornecedor do TailAdmin.
- **Pagos:** Sakai e PrimeBlocks (PrimeNG), Fuse (ThemeForest). Estado atual não verificado nesta pesquisa.
- **Recomendação:** não usar template em projeto de vitrine. Recrutador reconhece.

### Comparativo

Acessibilidade e peso no bundle são avaliação própria **(opinião)**, a partir das fontes acima.

| Opção | Visual não genérico | Acessibilidade | Esforço | Angular 22 e signals | Manutenção | Bundle |
|---|---|---|---|---|---|---|
| Angular Material | Baixo | Alta | Baixo | Total (oficial) | Muito ativa (Google) | Médio |
| PrimeNG (com estilo) | Baixo | Média (35 issues em jul/26) | Baixo | Parcial em jul/26 | Ativa | Alto |
| PrimeNG unstyled + Tailwind | Médio | Média | Médio-alto | Parcial | Ativa | Alto |
| Taiga UI v5 | Médio | Boa | Baixo-médio | Boa (prioriza signals) | Ativa, comunidade menor | Médio-alto |
| NG-ZORRO | Baixo | Média | Baixo | Tem release para o v22 | Ativa | Alto |
| Spartan UI 1.0 | Médio (cara de shadcn) | Boa | Médio | Boa (zoneless, Signal Forms) | Ativa; Radar "Assess" | Baixo-médio |
| Zard UI | Médio | Não verificada | Médio | Não verificado | CLI pré-1.0 | Baixo |
| ng-primitives | Alto | Boa | Alto | Pré-1.0, doc até o v20 | Ativa | Baixo |
| **Aria + CDK + tokens próprios** | **Alto** | **Alta (WAI-ARIA oficial)** | **Alto** | **Total, integra Signal Forms** | **Muito ativa (Google)** | **Baixo** |
| Tailwind (só estilo) | Depende de você | Não se aplica | Reduz o esforço | Independente | Ativa | Baixo |

**(opinião)** O visual do shadcn virou o novo genérico de 2025 e 2026. O Spartan não resolve o problema de "parecer mais um".

---

## 3. Gráficos

Dados de um artigo da própria ApexCharts (fornecedor): [ApexCharts, 07/07/2026](https://apexcharts.com/blog/state-of-javascript-charting-2026). Peso do build completo, em gzip.

| Biblioteca | Licença | Renderização | Peso | Observação |
|---|---|---|---|---|
| ECharts | Apache 2.0 | Canvas ou SVG | 359 KB | Cai bastante com importação modular. Tema 100% customizável, eixo de tempo, zoom, linhas de referência, boxplot. |
| Chart.js | MIT | Canvas | 67 KB | O mais usado. Visual mais básico para finanças. |
| ApexCharts | Própria | SVG | 164 KB | Wrapper oficial para Angular. Grátis só para empresas abaixo de US$ 2 mi de receita. |
| D3 / SVG próprio | ISC | SVG | Só o que usar | Controle total, esforço maior. |
| uPlot | MIT | Canvas | ~45 KB minificado | Muito rápido para série temporal; exagero para poucos pontos e sem gráfico de distribuição pronto. [npm](https://npmjs.com/package/uplot) |

### Recomendação

- **ECharts com importação modular** para as séries temporais: carteira contra CDI e IPCA, e projeção com faixa.
  - Tema montado a partir dos tokens CSS, lendo os valores com `getComputedStyle`.
  - Encapsular o ECharts numa diretiva própria com `effect()` e `ResizeObserver` **(opinião)**. Compatibilidade do wrapper ngx-echarts com o v22 não foi confirmada.
- **Um gráfico em SVG próprio** para a distribuição por indexador (CDI, IPCA, prefixado), em donut ou barra empilhada. Mostra habilidade.
- Tabela alternativa ao lado de cada gráfico, por acessibilidade.

---

## 4. Referências visuais

- **Dribbble:**
  - [investment-dashboard](https://dribbble.com/tags/investment-dashboard)
  - [investment-tracker](https://dribbble.com/tags/investment-tracker)
  - [investment-platform](https://dribbble.com/tags/investment-platform)
  - [stock-dashboard](https://dribbble.com/tags/stock-dashboard)
- **Estudos de caso (Contra):**
  - [Investment Portfolio Platform UX Redesign](https://contra.com/p/qWEBmeZb-investment-portfolio-platform-ux-redesign)
  - [Investment dashboard da Mek Fin](https://contra.com/p/bFQW7ZmA-investment-dashboard-design-for-mek-fin-casestudy)
- **Tela de renda fixa pronta:** [Fortress / Fixed Income](https://fortress-shadcn.dashboardpack.com/fixed-income) — para ver organização da informação, não para copiar o visual (é shadcn).
- **Apps reais no Brasil:**
  - [Kinvo](https://apps.apple.com/BR/app/id1327335329) (comprado pelo BTG)
  - [Gorila](https://gorila.com.br/para-investidores)
  - Os dois são consolidadores que comparam rentabilidade com o CDI.

### Dicas de visual (opinião)

- Números com `font-variant-numeric: tabular-nums`.
- Uma única cor de destaque.
- Verde e vermelho só para variação.
- CDI sempre como linha de referência nos gráficos.
- Modo escuro trocando apenas os tokens semânticos.

---

## 5. O que as vagas Angular no Brasil pedem

Amostra pequena (5 vagas do Indeed, set–nov/2026, e 1 da Sólides). Não é estatística.

| Vaga | Data | Pede | Diferencial |
|---|---|---|---|
| [BTG Investimentos](https://to.indeed.com/aa4pc2ggnyv2) | 14/09/2026 | Angular 15–18, RxJS, NgRx Store/Effects, Signals, design system, SCSS + Stylelint + BEM, Jasmine/Karma, ESLint, Husky, commitlint, Storybook, Compodoc, microfrontends | Renda fixa, carteira |
| [Santander Investimentos](https://to.indeed.com/aak7vqnjqwkh) | 15/09/2026 | Standalone, signals, OnPush, SSR, Angular Material, design systems, Nx, TDD, segurança front-end | Renda fixa, uso de IA |
| [SysMap (sênior)](https://to.indeed.com/aa2vwpyzzs89) | 04/11/2026 | RxJS, NgRx, testes, acessibilidade, XSS/CSRF, CI/CD | Design system, setor bancário |
| [Cedro (júnior)](https://vagas.solides.com.br/vaga/834377/desenvolvedor-a-front-end-angular-junior-remoto) | sem data, encerrada | Angular, TypeScript, HTML/CSS, UX básico, design systems, ferramentas de IA | "Projetos pessoais no GitHub com Angular e componentes de design system" |
| [Compass UOL (pleno)](https://to.indeed.com/aafdxkbdzbwv) | 30/10/2026 | Angular, API First, HTML5, CSS3 | ASP.NET |

### Leitura

- O mercado está atrás do Angular 22: Angular 15–18 e Jasmine/Karma ainda aparecem.
- RxJS e NgRx continuam sendo pedidos.
- Design system aparece em quase todas.
- Renda fixa é diferencial explícito em duas vagas. O projeto acerta em cheio; só não esconder RxJS e NgRx.

---

## Recomendação final

### Arquitetura

- Angular 22 com standalone e zoneless, pastas por feature.
- Signals no geral e SignalStore na carteira.
- Signal Forms.
- Cliente gerado do OpenAPI com hey-api e `httpResource`. Se o hey-api não gerar direito, usar o ng-openapi-gen.
- Vitest, Playwright e axe.
- Sem SSR.
- ESLint, Stylelint, Husky, commitlint e GitHub Actions.

### Visual

- Tokens CSS em três níveis: primitivo → semântico → componente.
- CSS ou SCSS por componente, sem Tailwind.
- Angular Aria para Select, Tabs, Menu, Listbox e Grid.
- CDK para Dialog, Overlay e LiveAnnouncer.
- Input de data nativo.
- Storybook documentando os componentes.
- Limitar o design system a 12–15 componentes que o app realmente usa.

### Gráficos

- ECharts modular com tema derivado dos tokens.
- Um gráfico SVG próprio para a distribuição por indexador.

### Por quê

- É a combinação mais nova e oficial: Aria e Signal Forms estáveis, mantidos pelo Google.
- Garante um visual que não é Material nem shadcn.
- Mostra acessibilidade de verdade.
- Responde ao que as vagas pedem: design system, SCSS, Stylelint, NgRx, testes, Storybook e domínio financeiro.
- O risco é o tempo. Se apertar, cortar componentes resolve melhor do que trocar de biblioteca.

---

## Fontes

| Fonte | Data |
|---|---|
| [Ninja Squad — What's new in Angular 22.0](https://blog.ninja-squad.com/2026/06/03/what-is-new-angular-22.0) | 03/06/2026 |
| [Ng-News 26/15 — Angular 22](https://dev.to/playfulprogramming-angular/ng-news-2615-angular-22-23o0) | jun/2026 |
| [SharpQuest — Angular Best Practices for 2026](https://www.sharpquest.com/blog/posts/2026/october/angular-best-practices-2026/) | 14/10/2026 |
| [ABP — Angular 22 State Management](https://abp.io/community/articles/angular-22-state-management-signals-signalstore-or-ngrx-yq8zg0nw) | 30/06/2026 |
| [angular.dev — Angular Aria overview](https://next.angular.dev/guide/aria/overview) | doc atual |
| [angular.dev — Tailwind](https://v20.angular.dev/guide/tailwind) | doc v20 |
| [Thoughtworks Radar — spartan/ui](https://www.thoughtworks.com/radar/languages-and-frameworks/spartan-ui) | nov/2026 (vol. 35) |
| [Spartan — changelog](https://www.spartan.ng/documentation/changelog) | 1.0 em jun/2026 |
| [Spartan — documentação](https://www.spartan.ng/documentation) | doc atual |
| [shadcn/studio — Using shadcn with Angular](https://shadcnstudio.com/blog/using-shadcn-with-angular/) | 16/09/2026 |
| [ng-primitives — README](https://scriptagc.wasmer.app/https_github_com/ng-primitives/ng-primitives) | sem data |
| [Colorlib — Best Angular UI Component Libraries (2026)](https://colorlib.com/wp/angular-components/) | 01/10/2026 |
| [npm-compare — Material x NG-ZORRO x PrimeNG](https://npm-compare.com/@angular/material,ng-zorro-antd,ngx-bootstrap,primeng) | sem data |
| [dev.to — PrimeNG accessibility teardown](https://dev.to/filip_luca_artificial_sense/the-most-complete-angular-ui-library-has-35-open-accessibility-bugs-a-fair-teardown-of-primeng-on-3c44) | 15/07/2026 |
| [dev.to/angular — What's new in Taiga UI v5](https://dev.to/angular/whats-new-in-taiga-ui-v5-a-modern-angular-ui-kit-7lm) | abr (ano não exibido) |
| [21st.dev — página "angular"](https://21st.dev/community/components/s/angular) | consultado em 16/11/2026 |
| [shadcn.io — Angular templates](https://www.shadcn.io/template/category/angular) | consultado em 16/11/2026 |
| [TailAdmin — Angular dashboard templates](https://tailadmin.com/blog/angular-dashboard-templates) | 21/04/2026 (fornecedor) |
| [ApexCharts — State of JavaScript Charting 2026](https://apexcharts.com/blog/state-of-javascript-charting-2026) | 07/07/2026 (fornecedor) |
| [hey-api — plugin Angular](https://web-51ka7jqe5-hey-api.vercel.app/openapi-ts/plugins/angular) | doc atual |
| [ng-openapi-gen — README](https://cdn.jsdelivr.net/npm/@erengee/ng-openapi-gen@0.25.4/README.md) | sem data |
| [ng-openapi http-resource — README](https://cdn.jsdelivr.net/npm/@ng-openapi/http-resource@0.1.2/README.md) | sem data |
| [uPlot — npm](https://npmjs.com/package/uplot) | sem data |
| Vagas: [BTG](https://to.indeed.com/aa4pc2ggnyv2), [Santander](https://to.indeed.com/aak7vqnjqwkh), [SysMap](https://to.indeed.com/aa2vwpyzzs89), [Compass UOL](https://to.indeed.com/aafdxkbdzbwv), [Cedro](https://vagas.solides.com.br/vaga/834377/desenvolvedor-a-front-end-angular-junior-remoto) | set–nov/2026 |
| Referências: [Dribbble investment-dashboard](https://dribbble.com/tags/investment-dashboard), [Kinvo](https://apps.apple.com/BR/app/id1327335329), [Gorila](https://gorila.com.br/para-investidores), [Fortress Fixed Income](https://fortress-shadcn.dashboardpack.com/fixed-income) | consultado em 16/11/2026 |
