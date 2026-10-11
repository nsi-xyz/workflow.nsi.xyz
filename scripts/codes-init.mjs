#!/usr/bin/env node
/**
 * Génère les identifiants pseudonymes des élèves.
 *
 *   node scripts/codes-init.mjs                # 23 identifiants → codes.csv
 *   node scripts/codes-init.mjs --nombre=24    # autre effectif
 *   node scripts/codes-init.mjs --force        # régénère même si codes.csv existe
 *
 * `codes.csv` porte la correspondance label ↔ identifiant. Il n'est JAMAIS commité
 * (voir .gitignore) : c'est le seul fichier qui relie un pseudo à un élève.
 * `scripts/classes-init.mjs` s'en sert pour préparer les dépôts.
 */

import { randomInt } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CSV = path.join(ROOT, 'codes.csv')
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // sans I, L, O, 0, 1

const args = process.argv.slice(2)
const nombre = Number((args.find((a) => a.startsWith('--nombre=')) ?? '--nombre=23').split('=')[1])
const forcer = args.includes('--force')

if (!Number.isInteger(nombre) || nombre < 1 || nombre > 200) {
  console.error('Effectif invalide (1 à 200).')
  process.exit(2)
}
if (fs.existsSync(CSV) && !forcer) {
  console.error('❌ codes.csv existe déjà : il porte la correspondance élève ↔ identifiant.')
  console.error('   Pour tout régénérer volontairement : --force')
  process.exit(1)
}

/** 12 caractères en trois groupes de quatre : ABCD-EFGH-JKMN */
function tirerCode() {
  let brut = ''
  for (let i = 0; i < 12; i += 1) brut += ALPHABET[randomInt(ALPHABET.length)]
  return `${brut.slice(0, 4)}-${brut.slice(4, 8)}-${brut.slice(8, 12)}`
}

const lignes = ['label;code']
for (let index = 1; index <= nombre; index += 1) {
  lignes.push(`élève ${String(index).padStart(2, '0')};${tirerCode()}`)
}

fs.writeFileSync(CSV, `${lignes.join('\n')}\n`, { mode: 0o600 })

console.log(`\n✅ ${nombre} identifiants pseudonymes écrits dans codes.csv (chmod 600).`)
console.log('   Étape suivante : node scripts/classes-init.mjs')
console.log("   Vérifie que Git l'ignore : git check-ignore codes.csv\n")
