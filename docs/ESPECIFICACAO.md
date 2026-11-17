# Especificação — renda-fixa-web

Status: **aprovada pelo Matheus em 16/11/2026**

## Problema

A renda-fixa-api já consolida títulos de várias corretoras e calcula a posição líquida de IR e IOF, mas só é usável
pelo Swagger. O front dá a essa API uma interface: o investidor vê a carteira, cadastra títulos e aportes, entende a
projeção de cada posição e acompanha CDI e IPCA.

As decisões técnicas estão em `ARQUITETURA.md` (D-xx). Esta especificação descreve o que o front faz.

## Escopo

### Dentro

- Resumo da carteira numa data de referência
- Cadastro, edição e exclusão de títulos
- Registro e lista de aportes
- Projeção detalhada de uma posição
- Cotações de CDI e IPCA num período

### Fora

- Autenticação e multiusuário (a API não tem)
- Resgate, edição e exclusão de aporte (a API não tem)
- Qualquer cálculo financeiro no front (D-07)
- Importação manual de cotações (o job da API faz sozinho)
- Mobile nativo. O layout é responsivo, do celular ao desktop.

## Telas

### Carteira — `/carteira`

Fonte: `GET /api/portfolio/summary?referenceDate=` (uma chamada só, desde a mudança de contrato de 16/11/2026).

- Data usada no cálculo (`referenceDate` da raiz), sempre exibida: "posição em 09/11/2026".
- Totais: investido, bruto, rendimento bruto, IR, IOF e líquido, e quantidade de posições.
- Distribuição por tipo de título (`byAssetType`): quantidade, investido, líquido e percentual. Os percentuais vêm
  arredondados um a um e podem não somar 100.
- Lista de posições (`positions`): para cada item, o título (`asset`: nome, emissor, tipo, indexador e taxa) e a
  projeção (`projection`: aportado, data do aporte, bruto, IR, IOF e líquido). Cada posição leva à projeção dela.
- Aviso de valor estimado quando algum item tiver `projection.isEstimated` verdadeiro: os totais incluem estimativa de
  IPCA. É um teste de sim ou não sobre os itens, não um cálculo (UI-01).
- Posição vencida: quando a `referenceDate` passa do `asset.maturityDate`, o item mostra o rótulo "vencido" e os valores
  do vencimento (comparação de datas ISO, D-07).
- Seletor de data de referência (D-09).
- Carteira vazia (`positions` vazio): convite para cadastrar o primeiro título.

### Títulos — `/titulos`, `/titulos/novo`, `/titulos/:id`

Fonte: `GET/POST /api/assets`, `GET/PUT/DELETE /api/assets/{id}`.

- Lista com nome, emissor, tipo, indexador, taxa, emissão e vencimento.
- Cadastro: nome, emissor, tipo (CDB, LCI, LCA, Tesouro Direto), indexador (pré-fixado, CDI, IPCA+), taxa, emissão e
  vencimento.
- Edição: nome, emissor, taxa, emissão e vencimento. Tipo e indexador não mudam depois do cadastro (`UpdateAssetRequest`).
- Exclusão com confirmação. A API recusa título com aportes; a mensagem dela aparece ao usuário.
- O rótulo da taxa muda com o indexador: "% a.a." no pré-fixado, "% do CDI" no CDI e "IPCA + % a.a." no IPCA+.

### Aportes — `/aportes`, `/aportes/novo`

Fonte: `GET/POST /api/positions`, `GET /api/assets`.

- Lista com título, valor e data, do mais recente para o mais antigo.
- Registro: título (busca por nome), valor e data do aporte. A partir da tela de um título, o título já vem escolhido.

### Projeção — `/posicoes/:id`

Fonte: `GET /api/positions/{id}/projection?referenceDate=` e `GET /api/assets/{id}` para os dados do título.

- Data usada no cálculo (`referenceDate`) e data do aporte (`applicationDate`).
- Valor investido, bruto, rendimento bruto, IOF (alíquota e valor), IR (alíquota e valor) e líquido.
- Dias corridos e dias úteis.
- Quando `isEstimated` for verdadeiro: aviso de que o IPCA do último mês ainda não saiu e o valor usa estimativa.
- A composição do valor (investido, mais rendimento, menos IOF, menos IR, igual a líquido) aparece de forma visual, sempre
  com os valores que a API devolveu.
- Ao abrir a projeção a partir da carteira, o front passa a `projection.referenceDate` do item. Sem data, a projeção de
  uma posição com aporte posterior à data padrão responde 400, enquanto o resumo a mostra na data do aporte
  (comportamento da API, `docs/SPEC-CONTRATO-FRONT.md` D-8).

### Indexadores — `/indexadores`

Fonte: `GET /api/indexes/{indexType}?from=&to=`.

- Escolha entre CDI e IPCA e do período (atalhos de 30 dias, 12 meses e personalizado).
- Gráfico da série e tabela equivalente (D-11).

## Jornadas

As três jornadas são a base dos testes de ponta a ponta (D-13). Cada uma roda contra a stack real do Compose.

**J-01 — Do zero à carteira.** Com a carteira vazia, o usuário abre `/carteira`, vê o convite para cadastrar, cadastra
um CDB pré-fixado, registra um aporte nele e volta à carteira, que mostra a posição com os valores calculados pela API e
a data usada.

**J-02 — Entender uma posição.** A partir da carteira, o usuário abre uma posição, vê a composição do valor (investido,
rendimento, IOF, IR e líquido), muda a data de referência e vê os valores mudarem. A URL guarda a data, e recarregar a
página mostra a mesma visão.

**J-03 — Acompanhar os indexadores.** O usuário abre `/indexadores`, escolhe CDI e o período de 30 dias, vê o gráfico
e a tabela equivalente, troca para IPCA e para 12 meses.

## Critérios de aceite por tela

Cada critério vira pelo menos um teste. Formato: dado, quando, então.

### Carteira

- **CA-01.** Dado o resumo com posições, quando a tela carrega, então mostra os seis totais, a distribuição por tipo,
  uma linha por item de `positions` e a frase "posição em dd/mm/aaaa" com a `referenceDate` da raiz.
- **CA-02.** Dado o resumo com `positions` vazio, então mostra o convite para cadastrar o primeiro título e nenhum total.
- **CA-03.** Dado algum item com `projection.isEstimated` verdadeiro, então a tela mostra o aviso de valor estimado.
- **CA-04.** Dado um item cuja `referenceDate` passa do `asset.maturityDate`, então o item mostra o rótulo "vencido".
- **CA-05.** Dado o usuário escolhendo outra data, então a URL ganha `?data=aaaa-mm-dd` e o resumo é pedido com
  essa `referenceDate`.
- **CA-06.** Dado um 400 da API, então a tela mostra a mensagem da API no lugar do conteúdo e um botão para tentar de
  novo (UI-04, UI-05).

### Títulos

- **CA-07.** Dado o formulário de cadastro válido, quando o usuário salva, então a API recebe o título, a tela confirma e
  a lista mostra o título novo.
- **CA-08.** Dado vencimento anterior à emissão ou taxa menor ou igual a zero, então o formulário aponta o campo antes de
  chamar a API.
- **CA-09.** Dado um 400 da API no cadastro ou na edição, então a mensagem dela aparece no formulário.
- **CA-10.** Dado o formulário de edição, então tipo e indexador aparecem e não podem ser alterados.
- **CA-11.** Dado o usuário excluindo um título com aportes, quando confirma, então a mensagem da API ("Título possui
  aportes e não pode ser removido.") aparece e o título continua na lista.
- **CA-12.** Dado o indexador escolhido, então o rótulo da taxa muda: "% a.a.", "% do CDI" ou "IPCA + % a.a.".

### Aportes

- **CA-13.** Dado a lista de aportes, então cada linha mostra o nome do título (cruzando com `/api/assets`), o valor e a
  data, do mais recente para o mais antigo.
- **CA-14.** Dado o registro aberto a partir de um título, então o título já vem escolhido.

### Projeção

- **CA-15.** Dado a projeção carregada, então a tela mostra os valores da API, a `referenceDate` e a `applicationDate`,
  sem nenhum valor calculado no front (UI-01).
- **CA-16.** Dado `isEstimated` verdadeiro, então a tela mostra o aviso de IPCA estimado.
- **CA-17.** Dado a projeção aberta a partir da carteira, então a requisição usa a `projection.referenceDate` do item.

### Indexadores

- **CA-18.** Dado o tipo e o período escolhidos, então o gráfico e a tabela mostram as mesmas cotações, com datas em
  `dd/mm/aaaa` e valores em pt-BR.
- **CA-19.** Dado um período sem cotações, então a tela mostra o estado vazio, sem gráfico quebrado.

### Em todas as telas

- **CA-20.** A tela é navegável só pelo teclado, com foco visível, e o `axe` não aponta violação (D-11).
- **CA-21.** Valores monetários, percentuais e datas seguem a formatação pt-BR da D-07.

## Requisitos não funcionais

| Código | Requisito |
|---|---|
| RNF-01 | Bundle inicial abaixo de 250 KB comprimido (orçamento do build, D-14). Cada feature carregada sob demanda. |
| RNF-02 | Navegadores: as duas últimas versões do Chrome, do Edge e do Firefox. |
| RNF-03 | Layout funcional de 360 px a 1440 px de largura, sem rolagem horizontal. |
| RNF-04 | Acessibilidade WCAG 2.2 AA (D-11). |
| RNF-05 | Com a API local, a carteira aparece em menos de 2 segundos numa carteira de até 50 posições. |

## Regras de interface

| Código | Regra |
|---|---|
| UI-01 | Valores financeiros e percentuais vêm prontos da API e são só formatados (D-07). |
| UI-02 | Datas `DateOnly` ficam string e são exibidas como `dd/MM/aaaa`, sem conversão de fuso (D-07). |
| UI-03 | Enums aparecem traduzidos: `Cdb` "CDB", `Lci` "LCI", `Lca` "LCA", `TreasuryBond` "Tesouro Direto"; `PreFixed` "Pré-fixado", `Cdi` "CDI", `Ipca` "IPCA+". |
| UI-04 | Toda leitura tem estado de carregamento, de vazio e de erro. O erro mostra a mensagem da API (D-06) e permite tentar de novo. |
| UI-05 | Sem cotação para a data pedida, a API responde 400 com a primeira data sem cotação. A tela mostra a mensagem e sugere outra data. |
| UI-06 | Ações que apagam dados pedem confirmação. |
| UI-07 | Depois de criar ou editar, a tela confirma a ação e a lista afetada é recarregada (D-04). |
| UI-08 | A data de referência escolhida vale para carteira e projeção e fica na URL (D-09). |

## Contrato consumido

Snapshot em `openapi/renda-fixa-api.json` (D-05). Pontos que importam ao front:

- Envelope `ApiResponse<T>`: `statusCode`, `success`, `message`, `data` (D-06).
- Enums serializados como texto (`JsonStringEnumConverter`).
- `DateOnly` no formato `yyyy-MM-dd`.
- Decimais chegam como número JSON. O front não faz conta com eles (UI-01).
- `GET /health` responde texto `Healthy`, fora do envelope.

## Lacunas da API

Decididas em 16/11/2026. Mudanças na API seguem o fluxo da própria API (spec, testes, PR), nunca a partir deste
repositório (D-01).

| # | Lacuna | Decisão |
|---|---|---|
| L-01 | O resumo da carteira não trazia os valores por posição | **Resolvida na API** (PR #18): o resumo devolve `positions`, cada item com `projection` e `asset`. Totais e itens saem do mesmo cálculo, então a soma dos itens fecha com os totais |
| L-02 | Posição (`GET /api/positions`) não traz dados do título | **Aceita.** Na carteira não importa mais (o item do resumo já traz o título). Na lista de aportes, o front cruza `/api/positions` com `/api/assets` |
| L-03 | Projeção e resumo não diziam a data usada quando ela é omitida | **Resolvida na API** (PR #18): `referenceDate` na projeção, na raiz do resumo (inclusive com a carteira vazia) e em cada item; `applicationDate` na projeção |
| L-04 | O Swagger só existe em `Development` | **Aceita** (D-05): o snapshot é baixado da API do Compose, que roda em `Development` |

Observações da API que o front trata:

- Se uma única posição não puder ser calculada (data depois da última cotação de CDI ou fora do calendário), o resumo
  inteiro responde 400. A tela mostra a mensagem e sugere outra data (UI-05).
- O OpenAPI marca todos os campos como opcionais. Os tipos gerados podem vir com `?`; o desembrulho do envelope (D-06)
  confere os campos obrigatórios em vez de espalhar `!` pelo código.
