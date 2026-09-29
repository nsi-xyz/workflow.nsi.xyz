#!/usr/bin/env node
/**
 * Garde-fou « secrets » — dernier verrou avant que quoi que ce soit parte sur GitHub.
 *
 * Il vérifie, AVANT le commit :
 *   1. qu'aucun fichier de secrets n'est suivi par Git (.env, .dev.vars, codes.csv…) ;
 *   2. qu'aucun fichier stagé ne contient de motif de secret (jeton Cloudflare,
 *      clé privée, affectation de type API_KEY=…).
 *
 * Il n'affiche JAMAIS la valeur trouvée : uniquement le fichier, la ligne et le motif.
 * Exécuté par le hook de pré-commit, et utilisable seul :
 *   node scripts/check-secrets.mjs
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const FORBIDDEN_TRACKED = [/^\.env$/, /^\.env\./, /^\.dev\.vars$/, /^codes\.csv$/, /^codes-.*\.txt$/, /^\.secret\//];
const FORBIDDEN_NAMES = [/^\.env$/, /^\.env\.[^/]+$/, /^\.dev\.vars$/, /^codes\.csv$/, /^codes-.*\.txt$/];

/** Modèles commitables : ils ne contiennent AUCUNE valeur, uniquement des noms de clés. */
const TEMPLATES = [/^\.env\.example$/, /^\.env\.sample$/, /^\.env\.template$/];
const isTemplate = (file) => TEMPLATES.some((re) => re.test(file));

const PATTERNS = [
  { label: 'jeton Cloudflare (cfut_)', re: /cfut_[A-Za-z0-9_-]{16,}/ },
  { label: 'clé privée PEM', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    label: 'affectation de secret avec valeur',
    re: /^\s*(CLOUDFLARE_API_TOKEN|PROF_PASSWORD|SESSION_SECRET|JWT_SECRET|CLOUDFLARE_[A-Z_]+|API_KEY|SECRET|TOKEN)\s*=\s*\S{8,}/m,
  },
];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

const problems = [];

// 1. Fichiers de secrets suivis par Git ?
try {
  const tracked = git(['ls-files']).split('\n').filter(Boolean);
  for (const file of tracked) {
    if (isTemplate(file)) continue;
    if (FORBIDDEN_TRACKED.some((re) => re.test(file))) {
      problems.push(`fichier de secrets suivi par Git : ${file} (retirer du suivi, tourner la valeur)`);
    }
  }
} catch {
  console.warn('[secrets] hors dépôt Git : contrôle ignoré.');
}

// 2. Motifs de secrets dans les fichiers stagés ?
let staged = [];
try {
  staged = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR']).split('\n').filter(Boolean);
} catch {
  staged = [];
}

for (const file of staged) {
  if (!fs.existsSync(file)) continue;
  const stats = fs.statSync(file);
  if (!stats.isFile() || stats.size > 512 * 1024) continue;

  for (const name of FORBIDDEN_NAMES) {
    if (!isTemplate(file) && name.test(file)) problems.push(`fichier interdit dans le commit : ${file}`);
  }

  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('\u0000')) continue; // binaire

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    for (const { label, re } of PATTERNS) {
      if (re.test(line)) problems.push(`${file}:${index + 1} — ${label}`);
    }
  });
}

if (problems.length) {
  console.error('\n❌ [secrets] Commit bloqué : aucun secret ne doit partir sur GitHub.\n');
  for (const problem of problems) console.error(`  • ${problem}`);
  console.error('\n  → Voir workflow.md § 6 et § 9 (rotation puis purge si déjà poussé).\n');
  process.exit(1);
}

console.log(`✅ [secrets] Aucun fichier de secrets suivi, aucun motif de secret dans les ${staged.length} fichier(s) stagé(s).`);
