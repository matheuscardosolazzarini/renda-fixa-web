// Confere o orçamento do bundle inicial (RNF-01): gzip dos arquivos carregados antes da primeira tela.
// Uso: npm run build:budget (depois de npm run build). Limite fixo de 250 000 bytes.
// Só confere o que o build já gerou; não roda o build. Lazy chunks ficam de fora.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(root, 'dist', 'renda-fixa-web', 'browser');
const indexPath = join(outputDir, 'index.html');
const MAX_BYTES = 250_000;

// Caminhos (relativos à pasta de saída) referenciados pelo index.html como carregamento inicial.
function initialFilesFromHtml(html) {
  const paths = [];
  const tags = html.match(/<(script|link)\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const attributes = Object.fromEntries(
      [...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [m[1].toLowerCase(), m[2] ?? m[3]]),
    );
    const isScript = /^<script\b/i.test(tag) && attributes.src;
    const isStyle =
      /^<link\b/i.test(tag) && attributes.href && /\bstylesheet\b|\bmodulepreload\b/i.test(attributes.rel ?? '');
    if (isScript) {
      paths.push(attributes.src);
    } else if (isStyle) {
      paths.push(attributes.href);
    }
  }
  return paths;
}

// Imports estáticos (não os dinâmicos `import()`) entre arquivos JS iniciais: também carregam antes da tela.
function staticImports(content) {
  const found = [];
  for (const m of content.matchAll(/\b(?:from|import)\s*["'](\.{1,2}\/[^"']+)["']/g)) {
    found.push(m[1]);
  }
  return found;
}

function collectInitialFiles(indexHtml) {
  const html = readFileSync(indexHtml, 'utf8');
  const result = new Map();
  const pending = initialFilesFromHtml(html).map((path) => path.replace(/^\/+/, '').split(/[?#]/)[0]);

  while (pending.length > 0) {
    const relative = normalize(pending.shift());
    if (result.has(relative)) {
      continue;
    }
    const absolute = join(outputDir, relative);
    if (!existsSync(absolute)) {
      throw new Error(
        `Arquivo inicial referenciado no index.html não existe: ${relative}. Rode npm run build de novo.`,
      );
    }
    const content = readFileSync(absolute);
    result.set(relative, content);
    if (relative.endsWith('.js') || relative.endsWith('.mjs')) {
      for (const dependency of staticImports(content.toString('utf8'))) {
        pending.push(normalize(join(dirname(relative), dependency)));
      }
    }
  }
  return result;
}

function formatBytes(n) {
  return `${n.toLocaleString('pt-BR')} B`;
}

try {
  if (!existsSync(indexPath)) {
    throw new Error(`Não encontrei ${indexPath}. Rode npm run build antes de npm run build:budget.`);
  }
  const files = collectInitialFiles(indexPath);

  let total = 0;
  console.log('Bundle inicial (gzip), como o index.html carrega:');
  for (const [name, content] of files) {
    const gzip = gzipSync(content, { level: 9 }).length;
    total += gzip;
    console.log(`  ${name.padEnd(28)} ${formatBytes(gzip).padStart(14)}`);
  }
  console.log(`  ${'Total'.padEnd(28)} ${formatBytes(total).padStart(14)}`);
  console.log(`Limite (RNF-01): ${formatBytes(MAX_BYTES)}.`);

  if (total > MAX_BYTES) {
    console.error(
      `O bundle inicial passou do limite: ${formatBytes(total)} > ${formatBytes(MAX_BYTES)} (gzip). ` +
        'A RNF-01 pede menos de 250 KB comprimidos. Reduza o código carregado antes da primeira tela ou mova para lazy.',
    );
    process.exitCode = 1;
  } else {
    console.log('Orçamento do bundle inicial respeitado.');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
