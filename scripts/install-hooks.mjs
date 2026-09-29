#!/usr/bin/env node
/**
 * Installe les hooks git du dépôt (appelé automatiquement par `npm install`
 * via le script `prepare`). Aucune action manuelle n'est nécessaire.
 *
 * Les hooks vivent dans `.githooks/`, versionné avec le code : ils suivent donc
 * les mises à jour du dépôt, contrairement à `.git/hooks/`.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

if (!fs.existsSync(path.join(ROOT, '.git'))) {
  console.log('ℹ️  Pas de dépôt git ici — hooks ignorés.');
  process.exit(0);
}

try {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: ROOT, stdio: 'pipe' });
  for (const hook of fs.readdirSync(path.join(ROOT, '.githooks'))) {
    fs.chmodSync(path.join(ROOT, '.githooks', hook), 0o755);
  }
  console.log('✅ Hooks git installés (.githooks) : secrets, inventaire, budgets, tests, types.');
} catch (error) {
  console.warn('⚠️  Installation des hooks impossible :', error.message);
  process.exit(0); // ne jamais faire échouer une installation pour ça
}
