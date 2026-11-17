---
name: testes-angular
description: Convenções de testes do renda-fixa-web (Vitest e Playwright). Use ao escrever ou revisar qualquer teste do front.
---

# Testes no renda-fixa-web

## Unitários (Vitest)

- Um arquivo `*.spec.ts` ao lado do arquivo testado.
- `describe` com o nome da unidade; `it` com o comportamento em português: `it('mostra a mensagem da API quando o
  resumo responde 400', ...)`.
- Arrange, Act e Assert separados por linha em branco, com os comentários `// Arrange`, `// Act`, `// Assert`.
- HTTP com `provideHttpClient()` e `provideHttpClientTesting()`; `HttpTestingController` para responder e para
  conferir que não sobrou requisição (`verify()`).
- Respostas de exemplo com o formato real da API, envelope incluído, montadas por funções em `testing/` da feature.
  Valores tirados da ESPECIFICACAO ou dos exemplos da API, nunca da saída do código.
- Dublês de serviço escritos à mão. `vi.fn()` só para conferir que um callback ou `output()` foi chamado.
- Componentes: `TestBed` com o componente standalone; interação pelo DOM (texto, papel acessível), não por métodos
  internos.
- Datas sempre como string ISO. Nada de `new Date()` em teste de regra de data (D-07).

## Ponta a ponta (Playwright)

- Um arquivo por jornada (J-01 a J-03) e por tela, em `e2e/`.
- Contra a stack real do Compose, nunca contra API simulada.
- `@axe-core/playwright` em cada tela visitada; violação reprova.
- Dados criados com prefixo `E2E-` e únicos por execução.
- Seletores por papel e nome acessível (`getByRole`, `getByLabel`), não por classe CSS.
