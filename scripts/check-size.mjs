#!/usr/bin/env node
/**
 * Garde-fou anti-monolithe.
 *
 * Principe du « cliquet » :
 *   - un fichier sous le budget passe ;
 *   - un fichier du patrimoine (baseline) peut rester gros, mais ne peut plus GROSSIR ;
 *   - dès qu'il maigrit, sa limite est abaissée automatiquement ;
 *   - un NOUVEAU fichier qui dépasse le budget est refusé.
 *
 * Pour autoriser volontairement un dépassement :
 *   node scripts/check-size.mjs --update-baseline
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASELINE_PATH = path.join(ROOT, 'scripts', 'size-baseline.json');
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', '.astro', '.wrangler', 'coverage']);

/** Budget en lignes par catégorie de fichier. */
const BUDGETS = {
  page: 500,
  composant: 400,
  layout: 400,
  style: 450,
  data: 600,
  'route-api': 400,
  'script-inline': 150,
};

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(astro|ts)$/.test(entry.name)) acc.push(path.relative(ROOT, full));
  }
  return acc;
}

function category(file) {
  if (file.startsWith('functions/')) return 'route-api';
  if (file.startsWith('src/pages/')) return 'page';
  if (file.startsWith('src/components/')) return 'composant';
  if (file.startsWith('src/layouts/')) return 'layout';
  if (file.startsWith('src/styles/')) return 'style';
  if (file.startsWith('src/data/')) return 'data';
  return null;
}

/** Lignes de JavaScript à l'intérieur des <script> d'un composant .astro. */
function inlineScriptLines(file) {
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
  let total = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/^[ \t]*<script[^>]*>[ \t]*$/.test(lines[i])) continue;
    if (/application\/json/.test(lines[i])) continue;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^[ \t]*<\/script>[ \t]*$/.test(lines[j])) {
        total += j - i - 1;
        i = j;
        break;
      }
    }
  }
  return total;
}

const updateBaseline = process.argv.includes('--update-baseline');
const baseline = fs.existsSync(BASELINE_PATH)
  ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'))
  : { budgets: BUDGETS, files: {} };

const violations = [];
const ratcheted = [];
// Repartir d'un objet vide purge les entrées obsolètes : sans cela, un fichier
// repassé sous le budget garderait son ancienne limite et pourrait regrossir.
const nextFiles = {};

for (const file of walk(path.join(ROOT, 'src')).concat(walk(path.join(ROOT, 'functions')))) {
  const cat = category(file);
  const budget = cat ? BUDGETS[cat] : null;
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n').length;

  if (budget && lines > budget) {
    const known = baseline.files[file];
    if (updateBaseline) {
      nextFiles[file] = lines;
    } else if (known === undefined) {
      violations.push({ file, lines, budget, kind: 'nouveau', cat });
    } else if (lines > known) {
      violations.push({ file, lines, budget, kind: 'agrandi', was: known, cat });
      nextFiles[file] = known;
    } else {
      nextFiles[file] = lines;
      if (lines < known) ratcheted.push({ file, from: known, to: lines });
    }
  }

  if (file.endsWith('.astro')) {
    const script = inlineScriptLines(file);
    if (script > BUDGETS['script-inline']) {
      const key = `${file}#script`;
      const known = baseline.files[key];
      if (updateBaseline) {
        nextFiles[key] = script;
      } else if (known === undefined) {
        violations.push({ file, lines: script, budget: BUDGETS['script-inline'], kind: 'script', cat: 'script-inline' });
      } else if (script > known) {
        violations.push({ file, lines: script, budget: BUDGETS['script-inline'], kind: 'script-agrandi', was: known, cat: 'script-inline' });
        nextFiles[key] = known;
      } else {
        nextFiles[key] = script;
        if (script < known) ratcheted.push({ file: `${file}#script`, from: known, to: script });
      }
    }
  }
}

fs.writeFileSync(BASELINE_PATH, JSON.stringify({ budgets: BUDGETS, files: nextFiles }, null, 2) + '\n', 'utf8');

if (violations.length) {
  console.error('\n❌ Budget de taille dépassé — le dépôt ne doit pas redevenir un monolithe.\n');
  for (const v of violations) {
    if (v.kind === 'nouveau') {
      console.error(`  • NOUVEAU  ${v.file}`);
      console.error(`    ${v.lines} lignes > budget ${v.budget} (${v.cat}). Découpez-le en modules.`);
    } else if (v.kind === 'agrandi') {
      console.error(`  • AGRANDI  ${v.file}`);
      console.error(`    ${v.was} → ${v.lines} lignes (budget ${v.budget}). Extraire du code plutôt qu'ajouter.`);
    } else {
      console.error(`  • SCRIPT INLINE  ${v.file}`);
      console.error(`    ${v.lines} lignes de JS inline > budget ${v.budget}${v.was ? ` (était ${v.was})` : ''}. Extraire le script.`);
    }
  }
  console.error('\n  → Pour autoriser volontairement : node scripts/check-size.mjs --update-baseline\n');
  process.exit(1);
}

if (ratcheted.length) {
  console.log(`🧹 Budget resserré sur ${ratcheted.length} fichier(s) allégé(s) :`);
  for (const r of ratcheted) console.log(`   ${r.file} : ${r.from} → ${r.to} lignes`);
}
console.log(`✅ Budgets de taille respectés (${Object.keys(nextFiles).length} fichier(s) surveillé(s)).`);
