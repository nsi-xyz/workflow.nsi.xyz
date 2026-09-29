#!/usr/bin/env node
/**
 * Lance le serveur de dev sur un port STABLE, propre à ce projet.
 *
 * Pourquoi ce script existe : Astro réclame 4321 par défaut, et si le port est
 * déjà pris par un AUTRE projet, il **bascule silencieusement** sur 4322, 4323…
 * Le lien du tableau de fin de réponse (« Serveur de test local ») pointerait
 * alors vers le mauvais site, sans que personne ne s'en aperçoive.
 *
 * Ici :
 *   1. le port vient de `DEV_PORT` (`.env`), sinon 4321 ;
 *   2. s'il est occupé, on **refuse de démarrer** en disant qui l'occupe — au lieu
 *      de dériver en silence ;
 *   3. on écoute sur `0.0.0.0` pour être joignable en réseau local ET par VPN.
 *
 * Usage : npm run dev        (ou DEV_PORT=4322 npm run dev)
 */

import { execSync, spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import './env.mjs';
import { resolveNodeInterpreter } from './node22.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const port = Number(process.env.DEV_PORT) || 4321;
const projectName = root.split('/').filter(Boolean).pop();

/**
 * Binaire réel d'Astro : `node_modules/astro/astro.js` (Astro ≤ 5) ou
 * `node_modules/astro/bin/astro.mjs` (Astro 7+). Le chemin est résolu depuis
 * le paquet installé, jamais deviné.
 */
function findAstroBin() {
  const legacy = resolve(root, 'node_modules/astro/astro.js');
  if (existsSync(legacy)) return legacy;
  const pkgPath = require.resolve('astro/package.json', { paths: [root] });
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const rel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.astro;
  if (!rel) throw new Error('Binaire Astro introuvable. Lancez `npm install`.');
  return resolve(dirname(pkgPath), rel);
}

/** Le port est-il déjà écouté ? (test par connexion, sans dépendre de `ss`) */
function isPortBusy(candidate) {
  return new Promise((done) => {
    const probe = createServer();
    probe.once('error', () => done(true));
    probe.once('listening', () => probe.close(() => done(false)));
    probe.listen(candidate, '0.0.0.0');
  });
}

/** Qui occupe le port ? (nom du projet, si on peut le déduire) */
function portOwner(candidate) {
  try {
    const line = execSync('ss -ltnp 2>/dev/null || true')
      .toString()
      .split('\n')
      .find((row) => new RegExp(`[:.]${candidate}\\s`).test(row));
    const pid = line?.match(/pid=(\d+)/)?.[1];
    if (!pid) return null;
    const cmd = readFileSync(`/proc/${pid}/cmdline`, 'utf8').replace(/\0/g, ' ');
    return (cmd.match(/\/Informatique\/([^/ ]+)/) || [])[1] || `processus ${pid}`;
  } catch {
    return null;
  }
}

if (await isPortBusy(port)) {
  const owner = portOwner(port);
  console.error(`\n❌ Le port ${port} est déjà utilisé${owner ? ` par « ${owner} »` : ''}.`);
  console.error('   Astro basculerait sinon sur un autre port EN SILENCE, et le lien');
  console.error('   « Serveur de test » du compte rendu pointerait vers le mauvais projet.\n');
  console.error('   Deux solutions :');
  console.error(`     • libérer le port ${port} (arrêter l'autre serveur) ;`);
  console.error(`     • donner un port propre à « ${projectName} » : DEV_PORT=${port + 1} npm run dev`);
  console.error(`       (puis l'inscrire dans .env pour qu'il soit stable : DEV_PORT=${port + 1})\n`);
  process.exit(1);
}

const astroBin = findAstroBin();
const { command, prefixArgs } = resolveNodeInterpreter();
console.log(`🚀 ${projectName} → http://0.0.0.0:${port} (réseau local + VPN)\n`);

const child = spawn(
  command,
  [...prefixArgs, astroBin, 'dev', '--host', '0.0.0.0', '--port', String(port)],
  { stdio: 'inherit', cwd: root }
);
child.on('exit', (code) => process.exit(code ?? 0));
