#!/usr/bin/env node
/**
 * Charge un fichier `.env` (et `.env.local`, `.dev.vars`) sans dépendance externe.
 * Importé pour effet de bord en tête des scripts Node.
 *
 * Pourquoi : `wrangler login` écrit un jeton OAuth **unique par machine** dans
 * `~/.config/.wrangler/config/default.toml`. Chaque connexion (autre site frère,
 * autre session) l'écrase, et il exige un navigateur local — impossible en accès
 * distant. Un `CLOUDFLARE_API_TOKEN` dans `.env` (jamais commité) est lié au
 * **compte** et non au site : il n'est jamais écrasé et ne demande aucun navigateur.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

for (const name of ['.env', '.env.local', '.dev.vars']) {
  const file = resolve(root, name);
  if (!existsSync(file)) continue;

  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || line.trimStart().startsWith('#')) continue;
    const key = match[1];
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Les variables déjà présentes dans l'environnement ont la priorité.
    if (!(key in process.env)) process.env[key] = value;
  }
}
