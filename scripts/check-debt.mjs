#!/usr/bin/env node
/**
 * Garde-fou « dette » — règles d'hygiène sans contrôle automatique ailleurs :
 *   1. `alert()` / `confirm()` / `prompt()` natifs interdits (workflow.md § 6) ;
 *   2. pluriel paresseux « (s) » dans les chaînes ;
 *   3. nouveau `catch` muet — cliquet par fichier ;
 *   4. hausse du compteur `any` / `as any` — cliquet global.
 *
 * Les cliquets vivent dans scripts/silent-catch-baseline.json et
 * scripts/any-baseline.json : ils ne peuvent que diminuer.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SILENT_BASELINE = path.join(ROOT, 'scripts', 'silent-catch-baseline.json');
const ANY_BASELINE = path.join(ROOT, 'scripts', 'any-baseline.json');
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', '.astro', '.wrangler', 'coverage']);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(ts|astro|mjs)$/.test(entry.name)) acc.push(path.relative(ROOT, full));
  }
  return acc;
}

const DIALOG = /(^|[^A-Za-z0-9_$])(window\.)?(alert|confirm|prompt)\s*\(/;
const PLURAL = /[a-zà-ÿ]\(s\)(?=[\s,;:.!?)<`'"»]|$)/i;
const EMPTY_CATCH = /catch\s*(?:\(\s*\w*\s*\))?\s*\{\s*\}|\.catch\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*\)/g;
const ANY = /:\s*any\b|as any\b|<any>|any\[\]/g;

const isComment = (line) => {
  const trimmed = line.trim();
  return trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*');
};

const violations = [];
const files = walk(path.join(ROOT, 'src')).concat(walk(path.join(ROOT, 'functions')));
let anyCount = 0;
const silentCounts = new Map();

for (const file of files) {
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');

  lines.forEach((line, index) => {
    if (isComment(line)) return;
    if (DIALOG.test(line)) {
      violations.push(`${file}:${index + 1} — dialogue natif interdit (utiliser un composant de l'interface)`);
    }
    if (PLURAL.test(line)) {
      violations.push(`${file}:${index + 1} — pluriel « (s) » interdit (écrire la forme exacte ou un utilitaire)`);
    }
  });

  const source = lines.join('\n');
  const silent = (source.match(EMPTY_CATCH) || []).length;
  if (silent) silentCounts.set(file, silent);
  anyCount += (source.match(ANY) || []).length;
}

// 3. Cliquet des catch muets (par fichier).
const silentBaseline = fs.existsSync(SILENT_BASELINE)
  ? JSON.parse(fs.readFileSync(SILENT_BASELINE, 'utf8'))
  : null;
if (silentBaseline === null) {
  fs.writeFileSync(
    SILENT_BASELINE,
    JSON.stringify(Object.fromEntries([...silentCounts.entries()].sort()), null, 2) + '\n',
    'utf8',
  );
  console.log(`📝 [Dette] baseline des catch muets initialisée (${silentCounts.size} fichier(s)).`);
} else {
  const next = {};
  for (const [file, count] of silentCounts) {
    const was = silentBaseline[file];
    if (was === undefined) {
      violations.push(`${file} — nouveau catch muet (${count}) ; journaliser l'erreur ou la justifier`);
    } else if (count > was) {
      violations.push(`${file} — catch muet ajouté (${was} → ${count})`);
    }
    next[file] = was === undefined ? count : Math.min(count, was);
  }
  fs.writeFileSync(
    SILENT_BASELINE,
    JSON.stringify(Object.fromEntries(Object.entries(next).sort()), null, 2) + '\n',
    'utf8',
  );
}

// 4. Cliquet global des `any`.
const anyBaseline = fs.existsSync(ANY_BASELINE) ? JSON.parse(fs.readFileSync(ANY_BASELINE, 'utf8')) : null;
if (anyBaseline === null) {
  fs.writeFileSync(ANY_BASELINE, JSON.stringify({ count: anyCount }, null, 2) + '\n', 'utf8');
  console.log(`📝 [Dette] baseline « any » initialisée à ${anyCount}.`);
} else if (anyCount > anyBaseline.count) {
  violations.push(`« any » en hausse : ${anyBaseline.count} → ${anyCount} (typer plutôt qu'élargir)`);
} else if (anyCount < anyBaseline.count) {
  fs.writeFileSync(ANY_BASELINE, JSON.stringify({ count: anyCount }, null, 2) + '\n', 'utf8');
  console.log(`🧹 [Dette] compteur « any » resserré : ${anyBaseline.count} → ${anyCount}.`);
}

if (violations.length) {
  console.error("\n❌ [Dette] Règles d'hygiène non respectées :\n");
  for (const violation of violations) console.error(`  • ${violation}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✅ [Dette] Aucun dialogue natif, aucun « (s) », catch muets et « any » sous cliquet (any = ${anyCount}).`,
);
