#!/usr/bin/env node
/**
 * Crée les dépôts privés des élèves sur GitHub et y pousse le contenu préparé
 * par `scripts/classes-init.mjs`.
 *
 *   node scripts/classes-init.mjs          # 1. génère .classe/<alias>/
 *   node scripts/repos-init.mjs            # 2. crée et pousse les dépôts
 *   node scripts/repos-init.mjs --dry-run  # 3. n'écrit rien, montre les commandes
 *
 * Prérequis : `gh` installé et authentifié (`gh auth login`), et l'organisation
 * déjà créée (la création d'une organisation n'est pas possible en ligne de commande).
 * Vérifie l'organisation : node scripts/repos-init.mjs --org=nsi-xyz-projets
 *
 * Idempotent : un dépôt déjà initialisé (localement ou sur GitHub) n'est jamais
 * recréé ; son contenu est simplement poussé. Relancer la commande est donc sûr.
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const INDEX = path.join(ROOT, '.classe', 'index.csv')

const args = process.argv.slice(2)
const option = (nom, defaut) => {
  const trouve = args.find((a) => a.startsWith(`--${nom}=`))
  return trouve ? trouve.slice(nom.length + 3) : defaut
}
const ORG = option('org', 'nsi-xyz-projets')
const SEC = args.includes('--dry-run')
const ONLY = option('only', '')
const DESCRIPTION = 'Projet NSI — dépôt élève (privé)'

if (!fs.existsSync(INDEX)) {
  console.error('❌ .classe/index.csv introuvable. Lance d\'abord : node scripts/classes-init.mjs')
  process.exit(1)
}

/** Exécute une commande, en l'affichant (sauf en simulation). */
function run(commande, commandeArgs, cwd) {
  console.log(`   $ ${commande} ${commandeArgs.join(' ')}`)
  if (SEC) return
  execFileSync(commande, commandeArgs, { cwd, stdio: 'inherit' })
}

function authOk() {
  try {
    execFileSync('gh', ['auth', 'status'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/** Le dépôt existe-t-il déjà sur GitHub ? (lecture seule) */
function repoExiste(complet) {
  try {
    execFileSync('gh', ['repo', 'view', complet, '--json', 'name'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/** Commande git silencieuse ; renvoie '' si elle échoue. */
function gitSilencieux(dossier, commandeArgs) {
  try {
    return execFileSync('git', ['-C', dossier, ...commandeArgs], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

if (!SEC && !authOk()) {
  console.error('❌ GitHub n\'est pas authentifié. Lance : gh auth login')
  process.exit(1)
}

const lignes = fs.readFileSync(INDEX, 'utf8').trim().split('\n').slice(1)
const eleves = lignes
  .map((ligne) => {
    const [label, alias] = ligne.split(';')
    return { label, alias }
  })
  .filter(({ alias }) => !ONLY || alias === ONLY)

if (eleves.length === 0) {
  console.error(`❌ Aucun élève ne correspond à --only=${ONLY} dans .classe/index.csv.`)
  process.exit(1)
}

console.log(`\n${SEC ? '🔎 Simulation' : '🚀 Création'} de ${eleves.length} dépôt(s) privé(s) dans « ${ORG} »…\n`)

for (const { label, alias } of eleves) {
  const nom = `projet-${alias}`
  const complet = `${ORG}/${nom}`
  const dossier = path.join(ROOT, '.classe', alias)
  console.log(`• ${label} → ${complet}`)

  if (SEC) {
    run('gh', ['repo', 'create', complet, '--private', '--description', DESCRIPTION], dossier)
    run('git', ['init', '-b', 'main'], dossier)
    run('git', ['config', 'user.name', alias], dossier)
    run('git', ['config', 'user.email', `${alias}@users.noreply.github.com`], dossier)
    run('git', ['add', '-A'], dossier)
    run('git', ['commit', '-m', 'Mise en place du projet'], dossier)
    run('git', ['remote', 'add', 'origin', `git@github.com:${complet}.git`], dossier)
    run('git', ['push', '-u', 'origin', 'main'], dossier)
    console.log('')
    continue
  }

  const dejaLocal = fs.existsSync(path.join(dossier, '.git'))
  if (!dejaLocal) {
    if (repoExiste(complet)) {
      console.log(`   (${complet} existe déjà sur GitHub — pas de création)`)
    } else {
      run('gh', ['repo', 'create', complet, '--private', '--description', DESCRIPTION], dossier)
    }
    run('git', ['init', '-b', 'main'], dossier)
    run('git', ['config', 'user.name', alias], dossier)
    run('git', ['config', 'user.email', `${alias}@users.noreply.github.com`], dossier)
  } else {
    console.log('   (dépôt local déjà initialisé — mise à jour)')
  }

  run('git', ['add', '-A'], dossier)
  if (gitSilencieux(dossier, ['diff', '--cached', '--name-only'])) {
    run('git', ['commit', '-m', 'Mise en place du projet'], dossier)
  }
  if (!gitSilencieux(dossier, ['remote'])) {
    run('git', ['remote', 'add', 'origin', `git@github.com:${complet}.git`], dossier)
  }
  run('git', ['push', '-u', 'origin', 'main'], dossier)
  console.log('')
}

console.log(
  SEC
    ? '🔎 Simulation terminée — rien n\'a été créé ni poussé.'
    : `✅ ${eleves.length} dépôt(s) privé(s) prêt(s). Étape suivante : ajouter les élèves comme membres de l'organisation, puis le pilote.`,
)
