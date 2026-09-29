#!/usr/bin/env node
/**
 * Lance Wrangler avec les bonnes conditions, sans jamais dépendre d'un login OAuth.
 *
 *  1. **Charge `.env`** (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) : un jeton
 *     d'API lié au compte fonctionne sans navigateur et n'est jamais écrasé par les
 *     `wrangler login` des sites frères (qui partagent le même fichier de config).
 *  2. **Garantit Node ≥ 22** : Wrangler 4 l'exige, et la machine en a plusieurs
 *     versions (le `node` par défaut peut être plus ancien, ce qui casse les tests
 *     `node:sqlite`).
 *
 * Usage : node scripts/wrangler.mjs <commande wrangler…>
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import './env.mjs';
import { resolveNodeInterpreter } from './node22.mjs';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function findWranglerBin() {
  const direct = resolve(root, 'node_modules/wrangler/bin/wrangler.js');
  if (existsSync(direct)) return direct;
  try {
    const pkgPath = require.resolve('wrangler/package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const rel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.wrangler;
    if (rel) return resolve(dirname(pkgPath), rel);
  } catch {
    /* ignore */
  }
  throw new Error('Wrangler introuvable. Lancez `npm install`.');
}

const wranglerBin = findWranglerBin();
const args = process.argv.slice(2);

if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.warn(
    '[wrangler] Aucun CLOUDFLARE_API_TOKEN : wrangler retombera sur le jeton OAuth\n' +
      '           partagé (~/.config/.wrangler/config/default.toml), qui exige un navigateur\n' +
      '           et peut appartenir à un autre site. Copiez .env.example vers .env.'
  );
}

const run = (command, commandArgs) =>
  spawnSync(command, commandArgs, { stdio: 'inherit', shell: process.platform === 'win32' });

const { command, prefixArgs } = resolveNodeInterpreter();
const result = run(command, [...prefixArgs, wranglerBin, ...args]);

process.exit(result.status ?? 1);
