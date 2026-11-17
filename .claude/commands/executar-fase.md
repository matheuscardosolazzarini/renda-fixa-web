---
description: Conduz uma fase do front (W1 a W6) do início ao fim, com spec revisada, testes antes do código, revisões e verificação independente.
argument-hint: W1
---

# Executar a fase $ARGUMENTS

Você é o orquestrador. Você não implementa: delega aos agentes de `.claude/agents/`, confere o que voltou e decide se a
fase avança. Siga as etapas na ordem. Uma etapa com `PARE` só continua depois da resposta do Matheus.

## Quem faz o quê

| Agente | Modelo | Papel | Quando |
|---|---|---|---|
| `revisor-arquitetura` | Opus | decisões D-xx, fronteiras, dependências, escopo, testes | toda fase: na spec e depois da implementação |
| `revisor-ux` | Opus | tela, design system, acessibilidade, apresentação dos valores | fases com tela ou componente (W2 em diante): na spec e depois da implementação |
| `implementador` | Sonnet (Haiku em passo mecânico) | testes primeiro, depois código, um passo por vez | cada passo e cada correção |
| `verificador-de-fase` | Sonnet | lint, testes, cobertura, build, Storybook, ponta a ponta, critério a critério | fim da fase |
| `qa-exploratorio` | Sonnet | uso do app no navegador como caixa-preta | fases com tela, depois da verificação |

Passo mecânico é aquele sem decisão de desenho: configuração de ferramenta, rota que só carrega componente, tradução de
enum. Nesses, chame o `implementador` com Haiku.

A API fica em `../renda-fixa-api`. Os agentes leem a API para conferir o contrato e nunca a alteram (D-01).

## Etapa 0 — Pré-condições (se alguma falhar, PARE e explique)

1. `$ARGUMENTS` é uma fase de `docs/ROADMAP.md`, e a etapa 0 do ROADMAP está marcada. A única exceção é o
   `DESIGN.md`: a W1 pode começar sem ele; da W2 em diante ele precisa existir.
2. A fase anterior está com todos os critérios marcados.
3. A árvore está atualizada com o remoto (`git fetch`, `git status -sb`) e sem alterações fora de `docs/` e `.claude/`.
4. Linha de base (a partir da W1): lint, testes e build verdes. Anote a contagem de testes e o tamanho do bundle.
5. A API do Compose sobe (`docker compose up -d` em `../renda-fixa-api`) e `GET /health` responde 200, quando a fase
   usar a API.

## Etapa 1 — Spec de execução

Se `docs/SPEC-$ARGUMENTS-EXECUCAO.md` já existir com `Status: aprovada`, confirme com o Matheus e vá para a etapa 4.

Senão, escreva-a com: Contexto, Fora de escopo, Decisões citadas (D-xx), Dependências npm autorizadas (com versão e
motivo), Implementação em passos P1..Pn, Testes (cada CA-xx da fase ligado a um teste), Critérios e Relatório. A fonte
é a ARQUITETURA, a ESPECIFICACAO e o ROADMAP. Nada de requisito que não esteja neles.

## Etapa 2 — Revisão da spec

`revisor-arquitetura` sempre; `revisor-ux` em fase com tela ou componente. Incorpore os achados `bloqueante` e
`importante`; liste os que não incorporar, com o motivo.

**PARE.** Mostre ao Matheus o resumo da spec, as dependências novas e os achados não incorporados. Só continue com a
aprovação dele.

## Etapa 3 — Implementação

Para cada passo P1..Pn: `implementador` com o passo; confira o relatório (lint, stylelint, testes e build verdes,
contagem não caiu, bundle dentro do orçamento). Se o mesmo passo falhar duas vezes, PARE e reporte.

## Etapa 4 — Revisões em paralelo

`revisor-arquitetura` e, em fase com tela, `revisor-ux`. Achados `bloqueante` e `importante` voltam ao `implementador`.
No máximo duas rodadas; se ainda houver bloqueante, PARE e reporte.

## Etapa 5 — Verificação independente

`verificador-de-fase`, com a linha de base. `REPROVADA`: volte à etapa 4 (uma rodada) e verifique de novo. Reprovada
outra vez: PARE.

## Etapa 6 — QA exploratório (fases com tela)

O `qa-exploratorio` escreve o roteiro em `docs/QA-$ARGUMENTS-ROTEIRO.md`. **PARE** para o Matheus aprovar o roteiro.
Depois ele executa e registra em `docs/QA-$ARGUMENTS.md`. Bugs de severidade alta ou média voltam à etapa 4, com o
teste antes da correção. Riscos e bugs baixos: cada um corrigido ou aceito com o motivo no ROADMAP.

## Etapa 7 — Fechamento

1. Marque no ROADMAP os critérios que a `VALIDACAO-$ARGUMENTS.md` aprovou. Nenhum critério sem evidência.
2. Atualize ARQUITETURA ou ESPECIFICACAO se a fase mudou alguma decisão (com data e motivo).
3. **PARE.** Entregue: o que foi feito, testes e bundle antes e depois, o veredito da validação, os achados do QA e a
   mensagem de commit sugerida no formato `$ARGUMENTS: <descrição>`. Não faça `git add` nem `git commit`.
