/**
 * Résolution de l'interpréteur Node à utiliser (≥ 22).
 *
 * Pourquoi : la machine héberge plusieurs versions de Node et le `node` par défaut
 * peut être plus ancien (v20). Or le dépôt exige Node ≥ 22 — les tests utilisent
 * `node:sqlite` (indisponible avant 22.5) et Wrangler 4 l'exige aussi. Sans cela,
 * `npm test` échoue **et bloque le hook de pré-commit**, quel que soit le shell.
 *
 * Ordre de recherche : version courante → nvm/fnm installés localement → `npx node@22`.
 */

import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MIN_MAJOR = 22;

/** Version majeure de l'interpréteur courant. */
export function currentNodeMajor() {
  return Number(process.versions.node.split('.')[0]);
}

/** Node ≥ 22 déjà installé localement (nvm, fnm), sinon `null`. */
export function findLocalNode22() {
  const home = process.env.HOME || '';
  const dirs = [
    resolve(home, '.nvm/versions/node'),
    resolve(home, '.local/share/fnm/node-versions'),
    resolve(home, '.fnm/node-versions'),
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    const versions = readdirSync(dir)
      .filter((name) => /^v?22\./.test(name))
      .sort()
      .reverse();
    for (const version of versions) {
      for (const candidate of [
        resolve(dir, version, 'bin/node'),
        resolve(dir, version, 'installation/bin/node'),
      ]) {
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

/**
 * Interpréteur à utiliser pour lancer un outil Node.
 * @returns `{ command, prefixArgs }` — `npx node@22` en dernier recours.
 */
export function resolveNodeInterpreter() {
  if (currentNodeMajor() >= MIN_MAJOR) {
    return { command: process.execPath, prefixArgs: [] };
  }
  const local = findLocalNode22();
  if (local) return { command: local, prefixArgs: [] };
  console.warn(
    `[node] Node ${process.versions.node} trop ancien (>= ${MIN_MAJOR} requis) : relance via node@22…`
  );
  return { command: 'npx', prefixArgs: ['-y', '-p', 'node@22', 'node'] };
}
