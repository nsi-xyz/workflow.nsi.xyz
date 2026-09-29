#!/usr/bin/env node
/**
 * Génère docs/INVENTAIRE_FICHIERS.md : carte du code (fichiers, lignes, rôles).
 *
 * Objectif : donner à une IA (ou à un humain) une vue exhaustive et à jour du
 * dépôt sans explorer le système de fichiers.
 *
 * Usage :
 *   node scripts/generate-inventory.mjs           # écrit docs/INVENTAIRE_FICHIERS.md
 *   node scripts/generate-inventory.mjs --stdout  # affiche sur la sortie standard
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'docs', 'INVENTAIRE_FICHIERS.md');

const EXCLUDED_DIRS = new Set([
  'node_modules', '.git', 'dist', '.astro', '.cache', '.wrangler', '.secret', 'coverage',
]);
const INCLUDED_EXT = /\.(astro|ts|mjs|js|css|sql|json|md|sh|yml|yaml)$/;
const NOISE = [/^package-lock\.json$/, /^docs\/INVENTAIRE_FICHIERS\.md$/];

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);
    if (entry.isDirectory()) walk(full, acc);
    else if (INCLUDED_EXT.test(entry.name)) acc.push(rel);
  }
  return acc;
}

/** Lignes totales, et répartition frontmatter / script inline / template des .astro. */
function analyze(file) {
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
  const total = lines.length;
  if (!file.endsWith('.astro')) return { total, front: 0, script: 0, tpl: total };

  let front = 0;
  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        front = i + 1;
        break;
      }
    }
  }

  let script = 0;
  let inScript = false;
  for (let i = front; i < lines.length; i++) {
    const line = lines[i];
    if (!inScript) {
      const open = line.match(/<script\b([^>]*)>/);
      if (!open) continue;
      if (/application\/json/.test(open[1] || '')) continue;
      if (/<script\b[^>]*><\/script>/.test(line)) continue;
      inScript = true;
      continue;
    }
    if (/<\/script>/.test(line)) {
      inScript = false;
      continue;
    }
    script++;
  }
  return { total, front, script, tpl: total - front - script };
}

/** Rôle déduit du chemin — sert de table des matières au lecteur IA. */
function role(file) {
  if (file.startsWith('functions/')) return 'Pages Function (API)';
  if (file.startsWith('src/pages/')) return 'Page (route)';
  if (file.startsWith('src/layouts/')) return 'Gabarit de page';
  if (file.startsWith('src/components/')) return 'Composant UI';
  if (file.startsWith('src/data/')) return 'Donnée éditoriale';
  if (file.startsWith('src/styles/')) return 'Feuille de style';
  if (file.startsWith('tests/')) return 'Test';
  if (file.startsWith('scripts/')) return 'Script outillage';
  if (file.startsWith('docs/')) return 'Documentation';
  return 'Racine / config';
}

const files = walk(ROOT).sort();
const rows = files.map((file) => ({ file, ...analyze(file), role: role(file) }));
const counted = rows.filter((row) => !NOISE.some((re) => re.test(row.file)));

const sum = (arr, key) => arr.reduce((n, row) => n + row[key], 0);

const byDir = new Map();
for (const row of counted) {
  const dir = path.dirname(row.file);
  const current = byDir.get(dir) || { files: 0, lines: 0 };
  current.files += 1;
  current.lines += row.total;
  byDir.set(dir, current);
}

const md = [];
md.push('# Inventaire des fichiers — workflow.nsi.xyz');
md.push('');
md.push('> Fichier **généré** par `node scripts/generate-inventory.mjs` — ne pas éditer à la main.');
md.push(`> Dernière génération : ${new Date().toISOString().slice(0, 10)}`);
md.push('');
md.push('## Synthèse');
md.push('');
md.push(`- **${counted.length} fichiers** suivis (hors \`node_modules\`, \`dist\`, \`.git\`, lockfiles).`);
md.push(`- **${sum(counted, 'total').toLocaleString('fr-FR')} lignes** au total.`);
md.push('');
md.push('## Volumétrie par répertoire');
md.push('');
md.push('| Répertoire | Fichiers | Lignes |');
md.push('|---|---:|---:|');
for (const [dir, value] of [...byDir.entries()].sort((a, b) => b[1].lines - a[1].lines)) {
  md.push(`| \`${dir}/\` | ${value.files} | ${value.lines.toLocaleString('fr-FR')} |`);
}
md.push('');
const heavy = counted.filter((row) => row.total > 400).sort((a, b) => b.total - a.total);
md.push('## Fichiers les plus volumineux (> 400 lignes)');
md.push('');
if (!heavy.length) {
  md.push('_Aucun fichier au-dessus de 400 lignes._');
} else {
  md.push('| Fichier | Lignes | Frontmatter | Script inline | Template | Rôle |');
  md.push('|---|---:|---:|---:|---:|---|');
  for (const row of heavy) {
    md.push(
      `| \`${row.file}\` | ${row.total} | ${row.front || '—'} | ${row.script || '—'} | ${row.tpl || '—'} | ${row.role} |`,
    );
  }
}
md.push('');
md.push('## Inventaire complet');
md.push('');
md.push('| Fichier | Lignes | Rôle |');
md.push('|---|---:|---|');
for (const row of counted.sort((a, b) => a.file.localeCompare(b.file))) {
  md.push(`| \`${row.file}\` | ${row.total} | ${row.role} |`);
}
md.push('');

if (process.argv.includes('--stdout')) {
  process.stdout.write(md.join('\n'));
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, md.join('\n'), 'utf8');
  console.log(`✅ ${path.relative(ROOT, OUT)} — ${counted.length} fichiers, ${sum(counted, 'total')} lignes.`);
}
