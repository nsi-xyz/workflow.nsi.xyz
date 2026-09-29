#!/usr/bin/env node
/**
 * Cliquet des suppressions de types : aucun NOUVEAU
 * `@ts-nocheck`, `@ts-ignore`, `@ts-expect-error` ni `eslint-disable` sans justification.
 *
 * La baseline (scripts/nocheck-baseline.json) ne peut que diminuer. Pour déclarer
 * une suppression volontaire, l'ajouter au fichier avec un commentaire d'explication
 * dans le code, puis relancer `node scripts/check-nocheck.mjs` avant commit.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASELINE_PATH = path.join(ROOT, 'scripts', 'nocheck-baseline.json');
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', '.astro', '.wrangler', 'coverage']);
const PATTERN = /@ts-nocheck|@ts-ignore|@ts-expect-error|eslint-disable/g;

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

const counts = {};
let total = 0;
for (const file of walk(path.join(ROOT, 'src')).concat(walk(path.join(ROOT, 'functions')))) {
  const matches = fs.readFileSync(path.join(ROOT, file), 'utf8').match(PATTERN);
  if (matches?.length) {
    counts[file] = matches.length;
    total += matches.length;
  }
}

if (!fs.existsSync(BASELINE_PATH)) {
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ count: total, files: counts }, null, 2) + '\n', 'utf8');
  console.log(`📝 [nocheck] baseline initialisée (${total} occurrence(s)).`);
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
const problems = [];

for (const [file, count] of Object.entries(counts)) {
  const was = baseline.files[file] ?? 0;
  if (count > was) problems.push(`${file} — ${was} → ${count} suppression(s) de types`);
}

fs.writeFileSync(
  BASELINE_PATH,
  JSON.stringify({ count: Math.min(total, baseline.count), files: counts }, null, 2) + '\n',
  'utf8',
);

if (problems.length) {
  console.error('\n❌ [nocheck] Suppression de types ajoutée sans déclaration :\n');
  for (const problem of problems) console.error(`  • ${problem}`);
  console.error('\n  → Corriger le typage, ou justifier par un commentaire et mettre à jour la baseline.\n');
  process.exit(1);
}

console.log(`✅ [nocheck] Aucune suppression de types nouvelle (${total} déclarée(s)).`);
