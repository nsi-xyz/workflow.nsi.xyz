#!/usr/bin/env node
/**
 * Régénère `public/workflow.md` (le modèle téléchargeable depuis le site) à partir
 * de la source unique `template/workflow.md`.
 *
 * Pourquoi : le document existe en deux versions — celle remise en classe (avec
 * l'identifiant et le dépôt de l'élève) et la version publique du site. Les deux
 * doivent rester identiques au mot près. Une seule source (`template/workflow.md`)
 * et un remplacement mécanique garantissent qu'elles ne divergent jamais.
 *
 *   node scripts/sync-workflow.mjs          # écrit public/workflow.md
 *   node scripts/sync-workflow.mjs --check   # vérifie sans écrire (code 1 si écart)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const SOURCE = path.join(ROOT, 'template', 'workflow.md')
export const CIBLE = path.join(ROOT, 'public', 'workflow.md')

/** Valeurs d'exemple de la version publique (jamais de vraie donnée). */
export const EXEMPLE_ALIAS = 'eleve-00'
export const EXEMPLE_DEPOT = 'https://github.com/mon-organisation/projet-eleve-00'

/** Marqueur retiré de la version élève et remplacé par une note dans la version publique. */
export const MARQUEUR_NOTE = '<!-- NOTE-PUBLIQUE -->'

/**
 * Transforme le modèle (jetons `{{ALIAS}}` / `{{URL_DEPOT}}`) en version **élève** :
 * le marqueur de note publique est retiré, les jetons sont remplis.
 * @param {string} modele
 * @param {string} alias
 * @param {string} url
 * @returns {string}
 */
export function rendreEleve(modele, alias, url) {
  return modele
    .replace(`${MARQUEUR_NOTE}\n\n`, '')
    .replaceAll('{{ALIAS}}', alias)
    .replaceAll('{{URL_DEPOT}}', url)
}
const NOTE_PUBLIQUE = [
  '> **Version modèle** publiée sur le site. La version remise en classe porte, à la place',
  "> des valeurs d'exemple ci-dessous, ton identifiant de projet et l'adresse de ton dépôt privé.",
].join('\n')

/**
 * Transforme le modèle élève (jetons `{{ALIAS}}` / `{{URL_DEPOT}}`) en version publique.
 * @param {string} modele
 * @returns {string}
 */
export function renderPublic(modele) {
  return modele
    .replace(MARQUEUR_NOTE, NOTE_PUBLIQUE)
    .replaceAll('{{ALIAS}}', EXEMPLE_ALIAS)
    .replaceAll('{{URL_DEPOT}}', EXEMPLE_DEPOT)
}

/** Le script est-il lancé directement (et non importé par un test) ? */
const executeDirectement =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (executeDirectement) {
  const modele = fs.readFileSync(SOURCE, 'utf8')
  const attendu = renderPublic(modele)

  if (process.argv.includes('--check')) {
    const actuel = fs.existsSync(CIBLE) ? fs.readFileSync(CIBLE, 'utf8') : ''
    if (actuel !== attendu) {
      console.error("❌ public/workflow.md n'est pas à jour par rapport à template/workflow.md.")
      console.error('   Relance : node scripts/sync-workflow.mjs')
      process.exit(1)
    }
    console.log('✅ public/workflow.md est synchronisé avec template/workflow.md.')
  } else {
    fs.mkdirSync(path.dirname(CIBLE), { recursive: true })
    fs.writeFileSync(CIBLE, attendu, 'utf8')
    console.log('✅ public/workflow.md régénéré depuis template/workflow.md.')
  }
}
