#!/usr/bin/env node
/**
 * Génère les codes élèves, la planche à distribuer et remplit KV.
 *
 *   node scripts/codes-init.mjs                # 23 codes → local + distant
 *   node scripts/codes-init.mjs --nombre=24    # autre effectif
 *   node scripts/codes-init.mjs --local        # seulement le KV local (dev)
 *   node scripts/codes-init.mjs --force        # régénère même si codes.csv existe
 *
 * Ce qui est écrit sur le disque (jamais commité : voir .gitignore) :
 *   codes.csv              → la correspondance élève ↔ code ↔ empreinte (pour le prof)
 *   codes-a-distribuer.html → la planche imprimable à découper
 *
 * Ce qui part dans KV : uniquement `code:<sha256>` → {"label":"élève 01"}.
 * Aucun code en clair ne quitte la machine.
 */

import { execFileSync } from 'node:child_process';
import { createHash, randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSV = path.join(ROOT, 'codes.csv');
const PLANCHE = path.join(ROOT, 'codes-a-distribuer.html');
const TEMP = path.join(ROOT, '.codes-bulk.json');
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sans I, L, O, 0, 1

const args = process.argv.slice(2);
const nombre = Number((args.find((a) => a.startsWith('--nombre=')) ?? '--nombre=23').split('=')[1]);
const forcer = args.includes('--force');
const localSeulement = args.includes('--local');

if (!Number.isInteger(nombre) || nombre < 1 || nombre > 200) {
  console.error('Effectif invalide (1 à 200).');
  process.exit(2);
}
if (fs.existsSync(CSV) && !forcer) {
  console.error('❌ codes.csv existe déjà : il porte la correspondance élève ↔ code.');
  console.error('   Pour tout régénérer volontairement : --force');
  process.exit(1);
}

/** 12 caractères en trois groupes de quatre : ABCD-EFGH-JKMN */
function tirerCode() {
  let brut = '';
  for (let i = 0; i < 12; i += 1) brut += ALPHABET[randomInt(ALPHABET.length)];
  return `${brut.slice(0, 4)}-${brut.slice(4, 8)}-${brut.slice(8, 12)}`;
}

const empreinte = (code) =>
  createHash('sha256').update(code.replace(/[^A-Z0-9]/g, '').toUpperCase()).digest('hex');

const codes = [];
for (let index = 1; index <= nombre; index += 1) {
  const code = tirerCode();
  codes.push({ label: `élève ${String(index).padStart(2, '0')}`, code, empreinte: empreinte(code) });
}

fs.writeFileSync(
  CSV,
  ['label;code;empreinte_courte;empreinte', ...codes.map((c) => `${c.label};${c.code};${c.empreinte.slice(0, 10)};${c.empreinte}`)].join('\n') + '\n',
  { mode: 0o600 },
);

const cartes = codes
  .map(
    (c) => `      <article class="carte">
        <p class="label">${c.label}</p>
        <p class="code">${c.code}</p>
        <p class="empreinte">empreinte ${c.empreinte.slice(0, 10)}</p>
      </article>`,
  )
  .join('\n');

fs.writeFileSync(
  PLANCHE,
  `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Codes élèves — workflow.nsi.xyz</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; color: #111; }
  h1 { font-size: 1.3rem; }
  .note { color: #444; font-size: .9rem; margin-bottom: 1.5rem; }
  .grille { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .carte { border: 1px dashed #888; border-radius: 10px; padding: .8rem 1rem; break-inside: avoid; }
  .label { margin: 0; font-size: .8rem; text-transform: uppercase; letter-spacing: .12em; color: #666; }
  .code { margin: .3rem 0; font-family: ui-monospace, monospace; font-size: 1.35rem; font-weight: 700; letter-spacing: .06em; }
  .empreinte { margin: 0; font-size: .72rem; color: #777; }
  @media print { body { margin: .8rem; } }
</style>
</head>
<body>
  <h1>Codes d'accès — journal des prompts</h1>
  <p class="note">
    Un code par élève. À garder : il sert à déposer les prompts et à toi pour retrouver la
    correspondance (elle est aussi dans codes.csv, qui ne doit jamais être publié).
  </p>
  <div class="grille">
${cartes}
  </div>
</body>
</html>
`,
);

fs.writeFileSync(
  TEMP,
  JSON.stringify(codes.map((c) => ({ key: `code:${c.empreinte}`, value: JSON.stringify({ label: c.label }) }))),
  { mode: 0o600 },
);

function wrangler(args) {
  execFileSync('node', ['scripts/wrangler.mjs', 'kv', 'bulk', 'put', TEMP, '--binding=WORKFLOW', ...args], {
    cwd: ROOT,
    stdio: 'inherit',
  });
}

try {
  console.log(`\n→ ${nombre} codes générés (codes.csv, codes-a-distribuer.html)\n`);
  console.log('→ Envoi dans le KV local (développement)…');
  wrangler(['--local']);
  if (!localSeulement) {
    console.log('→ Envoi dans le KV distant (production)…');
    wrangler(['--remote']);
  }
} finally {
  fs.rmSync(TEMP, { force: true });
}

console.log('\n✅ Terminé. Les codes en clair ne sont QUE dans codes.csv et la planche imprimable.');
console.log('   Vérifie que Git les ignore : git check-ignore codes.csv\n');
