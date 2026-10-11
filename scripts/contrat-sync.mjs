#!/usr/bin/env node
/**
 * Met à jour le contrat (`workflow.md`, `AGENTS.md`) dans les dépôts élèves déjà créés,
 * puis committe et pousse — sans toucher au code, au `projet.json` ni au journal.
 *
 *   node scripts/contrat-sync.mjs                 # tous les dépôts de .classe/
 *   node scripts/contrat-sync.mjs --only=Ilyas    # un seul
 *   node scripts/contrat-sync.mjs --dry-run       # montre sans rien pousser
 *
 * Utile quand `template/workflow.md` ou `template/AGENTS.md` évolue après la création
 * des dépôts (par exemple l'ajout des règles « ressources » et « droits »).
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rendreEleve } from './sync-workflow.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATE = path.join(ROOT, 'template')
const INDEX = path.join(ROOT, '.classe', 'index.csv')
const FICHIERS = ['workflow.md', 'AGENTS.md']

const args = process.argv.slice(2)
const option = (nom, defaut) => {
  const trouve = args.find((a) => a.startsWith(`--${nom}=`))
  return trouve ? trouve.slice(nom.length + 3) : defaut
}
const ORG = option('org', 'nsi-xyz-projets')
const PREFIXE = option('prefix', 'projet-')
const ONLY = option('only', '')
const SEC = args.includes('--dry-run')

if (!fs.existsSync(INDEX)) {
  console.error("❌ .classe/index.csv introuvable. Lance d'abord : node scripts/classes-init.mjs")
  process.exit(1)
}

function git(dossier, commandeArgs, silencieux = false) {
  return execFileSync('git', ['-C', dossier, ...commandeArgs], {
    encoding: 'utf8',
    stdio: silencieux ? ['ignore', 'pipe', 'ignore'] : 'inherit',
  }).trim()
}

const lignes = fs.readFileSync(INDEX, 'utf8').trim().split('\n').slice(1)
const eleves = lignes
  .map((ligne) => ligne.split(';'))
  .map(([label, alias]) => ({ label, alias }))
  .filter(({ alias }) => alias && (!ONLY || alias === ONLY))

let misAJour = 0
let echecs = 0
for (const { label, alias } of eleves) {
  const dossier = path.join(ROOT, '.classe', alias)
  if (!fs.existsSync(path.join(dossier, '.git'))) {
    console.log(`• ${label} (${alias}) : pas encore de dépôt local — ignoré.`)
    continue
  }

  const url = `https://github.com/${ORG}/${PREFIXE}${alias}`
  for (const fichier of FICHIERS) {
    const modele = fs.readFileSync(path.join(TEMPLATE, fichier), 'utf8')
    fs.writeFileSync(path.join(dossier, fichier), rendreEleve(modele, alias, url))
  }

  if (SEC) {
    console.log(`• ${label} (${alias}) : contrat à rafraîchir (simulation).`)
    misAJour += 1
    continue
  }

  try {
    git(dossier, ['add', ...FICHIERS], true)
    const enAttente = git(dossier, ['diff', '--cached', '--name-only'], true)
    if (!enAttente) {
      console.log(`• ${label} (${alias}) : déjà à jour.`)
      continue
    }
    git(dossier, ['commit', '-m', 'Contrat : ressources et droits'])
    git(dossier, ['push'])
    console.log(`• ${label} (${alias}) : mis à jour et poussé.`)
    misAJour += 1
  } catch (erreur) {
    console.error(`• ${label} (${alias}) : ÉCHEC — ${erreur.message}`)
    echecs += 1
  }
}

console.log(
  SEC
    ? `\n🔎 Simulation : ${misAJour} dépôt(s) à rafraîchir.`
    : `\n${echecs ? '❌' : '✅'} ${misAJour} dépôt(s) mis à jour${echecs ? `, ${echecs} échec(s)` : ''}.`,
)
process.exit(echecs ? 1 : 0)
