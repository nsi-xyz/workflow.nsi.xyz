#!/usr/bin/env node
/**
 * Vérifie le journal d'un dépôt élève.
 *
 *   node scripts/verif-journal.mjs .classe/TM5P-GYZU-T55P
 *   node scripts/verif-journal.mjs chemin/vers/un/depot --json
 *
 * Contrôle :
 *   - `projet.json` présent et conforme (`workflow-nsi/projet/v1`) ;
 *   - chaque `journal/*.json` conforme au schéma `workflow-nsi/journal/v1` ;
 *   - les numéros de séquence se suivent sans trou ;
 *   - un commit Git par échange (indice : nombre de commits ≥ nombre d'échanges).
 *
 * `--json` produit un résumé exploitable (base du futur tableau de bord).
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const MODES = ['plan', 'build']
const ETAPES = ['decrire', 'generer', 'tester', 'corriger', 'livrer']
const MISSIONS = ['decouverte', 'depot-git', 'projet-final', 'libre']
const CLES_REQUISES = ['schema', 'id', 'sequence', 'horodatage', 'alias', 'mode', 'mission', 'etape', 'prompt', 'reponse', 'fichiers']

/** Valide une entrée de journal ; renvoie la liste des erreurs lisibles. */
export function validerEntree(entree, nomFichier = 'entrée') {
  const erreurs = []
  if (entree === null || typeof entree !== 'object' || Array.isArray(entree)) {
    return [`${nomFichier} : ce n'est pas un objet JSON.`]
  }
  for (const cle of CLES_REQUISES) {
    if (!(cle in entree)) erreurs.push(`${nomFichier} : clé manquante « ${cle} ».`)
  }
  if (entree.schema !== 'workflow-nsi/journal/v1') erreurs.push(`${nomFichier} : schéma inattendu « ${entree.schema} ».`)
  if (!Number.isInteger(entree.sequence) || entree.sequence < 1) erreurs.push(`${nomFichier} : « sequence » doit être un entier ≥ 1.`)
  if (typeof entree.horodatage !== 'string' || Number.isNaN(Date.parse(entree.horodatage))) erreurs.push(`${nomFichier} : « horodatage » n'est pas une date valide.`)
  if (typeof entree.prompt !== 'string' || entree.prompt.trim().length === 0) erreurs.push(`${nomFichier} : « prompt » est vide.`)
  if (typeof entree.reponse !== 'string') erreurs.push(`${nomFichier} : « reponse » doit être du texte.`)
  if (!Array.isArray(entree.fichiers) || entree.fichiers.some((f) => typeof f !== 'string')) erreurs.push(`${nomFichier} : « fichiers » doit être une liste de noms.`)
  if (entree.mode !== undefined && !MODES.includes(entree.mode)) erreurs.push(`${nomFichier} : « mode » hors liste (${MODES.join(', ')}).`)
  if (!MISSIONS.includes(entree.mission)) erreurs.push(`${nomFichier} : « mission » hors liste (${MISSIONS.join(', ')}).`)
  if (!ETAPES.includes(entree.etape)) erreurs.push(`${nomFichier} : « etape » hors liste (${ETAPES.join(', ')}).`)
  return erreurs
}

function git(racine, args) {
  try {
    return execFileSync('git', ['-C', racine, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

function verifier(racine) {
  const rapport = { depot: racine, alias: null, url: null, echanges: 0, commits: 0, sequences: [], erreurs: [] }

  const fichierProjet = path.join(racine, 'projet.json')
  if (!fs.existsSync(fichierProjet)) {
    rapport.erreurs.push('projet.json absent.')
  } else {
    try {
      const projet = JSON.parse(fs.readFileSync(fichierProjet, 'utf8'))
      rapport.alias = projet.alias ?? null
      rapport.url = projet.url ?? null
      if (projet.schema !== 'workflow-nsi/projet/v1') rapport.erreurs.push('projet.json : schéma inattendu.')
      if (!rapport.alias) rapport.erreurs.push('projet.json : « alias » manquant.')
    } catch (erreur) {
      rapport.erreurs.push(`projet.json illisible : ${erreur.message}`)
    }
  }

  const dossierJournal = path.join(racine, 'journal')
  const fichiers = fs.existsSync(dossierJournal)
    ? fs.readdirSync(dossierJournal).filter((nom) => nom.endsWith('.json')).sort()
    : []

  for (const nom of fichiers) {
    try {
      const entree = JSON.parse(fs.readFileSync(path.join(dossierJournal, nom), 'utf8'))
      rapport.erreurs.push(...validerEntree(entree, nom))
      if (Number.isInteger(entree.sequence)) rapport.sequences.push(entree.sequence)
      rapport.echanges += 1
    } catch (erreur) {
      rapport.erreurs.push(`${nom} illisible : ${erreur.message}`)
    }
  }

  rapport.commits = git(racine, ['log', '--oneline']).split('\n').filter(Boolean).length

  const triees = [...rapport.sequences].sort((a, b) => a - b)
  for (let i = 0; i < triees.length; i += 1) {
    if (triees[i] !== i + 1) {
      rapport.erreurs.push(`séquence manquante : attendu ${i + 1}, trouvé ${triees[i]}.`)
      break
    }
  }
  if (rapport.commits < rapport.echanges) {
    rapport.erreurs.push(`moins de commits (${rapport.commits}) que d'échanges (${rapport.echanges}) : un commit par échange est attendu.`)
  }
  return rapport
}

export function rapportTexte(rapport) {
  const lignes = [
    `Dépôt      : ${rapport.depot}`,
    `Identifiant : ${rapport.alias ?? '—'}`,
    `URL publiée : ${rapport.url || '— (pas encore déployé)'}`,
    `Échanges    : ${rapport.echanges}`,
    `Commits     : ${rapport.commits}`,
  ]
  if (rapport.erreurs.length === 0) {
    lignes.push('Verdict     : ✅ conforme')
  } else {
    lignes.push(`Verdict     : ❌ ${rapport.erreurs.length} problème(s)`)
    for (const erreur of rapport.erreurs) lignes.push(`  • ${erreur}`)
  }
  return lignes.join('\n')
}

const estExecute = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (estExecute) {
  const cible = process.argv[2]
  if (!cible || cible.startsWith('--')) {
    console.error('Usage : node scripts/verif-journal.mjs <chemin-dépôt> [--json]')
    process.exit(2)
  }
  const rapport = verifier(path.resolve(cible))
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(rapport, null, 2))
  } else {
    console.log(`\n${rapportTexte(rapport)}\n`)
  }
  process.exit(rapport.erreurs.length ? 1 : 0)
}
