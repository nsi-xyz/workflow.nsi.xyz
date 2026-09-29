#!/usr/bin/env node
/**
 * Lance un outil Node du dépôt (tsx, tsc…) avec Node ≥ 22, quelle que soit la
 * version de l'interpréteur courant.
 *
 * Pourquoi : le `node` par défaut de la machine peut être v20, alors que les tests
 * utilisent `node:sqlite` (Node ≥ 22.5). Sans ce lanceur, `npm test` échoue selon
 * le shell — et le hook de pré-commit bloque alors **toutes** les modifications.
 *
 * Usage : node scripts/run-with-node22.mjs <outil> [arguments…]
 *   ex.  node scripts/run-with-node22.mjs tsx --test tests/quiz.test.mjs
 *        node scripts/run-with-node22.mjs tsc --noEmit
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { resolveNodeInterpreter } from './node22.mjs';

const require = createRequire(import.meta.url);

/**
 * Binaire dont le nom diffère du paquet : `tsc` est fourni par `typescript`.
 * (Les shims de `node_modules/.bin` ne sont pas utilisables : leur shebang
 * relancerait le Node par défaut, celui qu'on cherche justement à éviter.)
 */
const PACKAGE_ALIASES = { tsc: 'typescript' };

/** Chemin du script JS réel d'un binaire de `node_modules` (tsx, tsc…). */
function resolveBin(name) {
  const pkgName = PACKAGE_ALIASES[name] || name;
  const pkgPath = require.resolve(`${pkgName}/package.json`);
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const binField = pkg.bin;
  const rel =
    typeof binField === 'string' ? binField : binField?.[name] || binField?.[pkgName];
  if (!rel) throw new Error(`Binaire « ${name} » introuvable dans « ${pkgName} ».`);
  return resolve(dirname(pkgPath), rel);
}

const [tool, ...toolArgs] = process.argv.slice(2);
if (!tool) {
  console.error('Usage : node scripts/run-with-node22.mjs <outil> [arguments…]');
  process.exit(2);
}

const { command, prefixArgs } = resolveNodeInterpreter();
const result = spawnSync(command, [...prefixArgs, resolveBin(tool), ...toolArgs], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
