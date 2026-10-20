#!/usr/bin/env node
/**
 * Prépare les dépôts des élèves à partir du modèle `template/`.
 *
 *   node scripts/classes-init.mjs                       # génère .classe/<alias>/…
 *   node scripts/classes-init.mjs --org=nsi-xyz-projets --prefix=projet-
 *
 * Ce qui est écrit sur le disque (jamais commité : voir .gitignore) :
 *   .classe/<alias>/      → les fichiers personnalisés de chaque élève
 *   .classe/index.csv     → la correspondance label / alias / dépôt (côté prof)
 *   .classe/planche.html  → la planche à remettre (identifiant + adresse du dépôt)
 *
 * L'identifiant est pseudonyme (le code de `codes.csv`) : aucune donnée
 * personnelle ne part dans le dépôt. La correspondance reste dans `.classe/`.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rendreEleve } from './sync-workflow.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATE = path.join(ROOT, 'template')
const CODES = path.join(ROOT, 'codes.csv')
const SORTIE = path.join(ROOT, '.classe')

const args = process.argv.slice(2)
const option = (nom, defaut) => {
  const trouve = args.find((a) => a.startsWith(`--${nom}=`))
  return trouve ? trouve.slice(nom.length + 3) : defaut
}
const ORG = option('org', 'nsi-xyz-projets')
const PREFIXE = option('prefix', 'projet-')

/** Le fichier de correspondance élève ↔ code, produit par `npm run codes:init`. */
if (!fs.existsSync(CODES)) {
  console.error('❌ codes.csv introuvable. Lance d\'abord : npm run codes:init')
  process.exit(1)
}

const lignes = fs.readFileSync(CODES, 'utf8').trim().split('\n')
const entetes = lignes.shift().split(';')
const colonneLabel = entetes.indexOf('label')
const colonneCode = entetes.indexOf('code')
if (colonneLabel < 0 || colonneCode < 0) {
  console.error('❌ codes.csv : colonnes « label » et « code » attendues.')
  process.exit(1)
}

const depuisCsv = lignes
  .map((ligne) => ligne.split(';'))
  .filter((champs) => champs[colonneCode])
  .map((champs) => ({ label: champs[colonneLabel], alias: champs[colonneCode] }))

/** Identifiants ajoutés à la main (hors codes.csv) : --extra=test,Ilyas */
const extra = option('extra', '')
  .split(',')
  .map((valeur) => valeur.trim())
  .filter(Boolean)
  .map((alias) => ({ label: alias, alias }))

const eleves = [...depuisCsv, ...extra.filter(({ alias }) => !depuisCsv.some((eleve) => eleve.alias === alias))]

/** Les 2 premiers caractères servent de slug dans les statistiques : unicité requise. */
const prefixes = new Map()
for (const { alias } of eleves) {
  const prefixe = alias.slice(0, 2)
  if (prefixes.has(prefixe)) {
    console.error(`❌ Préfixe « ${prefixe} » en double : ${prefixes.get(prefixe)} et ${alias}.`)
    console.error('   Régénère les codes (codes:init --force) ou renomme un identifiant.')
    process.exit(1)
  }
  prefixes.set(prefixe, alias)
}

/** Fichiers du modèle recopiés et personnalisés pour chaque élève. */
const FICHIERS = ['workflow.md', 'AGENTS.md', 'projet.json', '.gitignore']

fs.rmSync(SORTIE, { recursive: true, force: true })
fs.mkdirSync(SORTIE, { recursive: true })

const planche = []
for (const { label, alias } of eleves) {
  const url = `https://github.com/${ORG}/${PREFIXE}${alias}`
  const dossier = path.join(SORTIE, alias)
  fs.mkdirSync(dossier, { recursive: true })

  for (const fichier of FICHIERS) {
    const modele = fs.readFileSync(path.join(TEMPLATE, fichier), 'utf8')
    fs.writeFileSync(path.join(dossier, fichier), rendreEleve(modele, alias, url))
  }

  fs.mkdirSync(path.join(dossier, 'journal'), { recursive: true })
  fs.writeFileSync(path.join(dossier, 'journal', '.gitkeep'), '')

  planche.push(
    `      <article class="carte">
        <p class="label">${label}</p>
        <p class="code">${alias}</p>
        <p class="empreinte">dépôt : ${url}</p>
      </article>`,
  )
}

fs.writeFileSync(
  path.join(SORTIE, 'index.csv'),
  ['label;alias;url', ...eleves.map(({ label, alias }) => `${label};${alias};https://github.com/${ORG}/${PREFIXE}${alias}`)].join('\n') + '\n',
  { mode: 0o600 },
)

fs.writeFileSync(
  path.join(SORTIE, 'planche.html'),
  `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Dépôts élèves — ${ORG}</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; color: #111; }
  h1 { font-size: 1.3rem; }
  .note { color: #444; font-size: .9rem; margin-bottom: 1.5rem; }
  .grille { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .carte { border: 1px dashed #888; border-radius: 10px; padding: .8rem 1rem; break-inside: avoid; }
  .label { margin: 0; font-size: .8rem; text-transform: uppercase; letter-spacing: .12em; color: #666; }
  .code { margin: .3rem 0; font-family: ui-monospace, monospace; font-size: 1.2rem; font-weight: 700; }
  .empreinte { margin: 0; font-size: .7rem; color: #777; word-break: break-all; }
  @media print { body { margin: .8rem; } }
</style>
</head>
<body>
  <h1>Dépôts privés des élèves</h1>
  <p class="note">Un dépôt par élève, dans l'organisation ${ORG}. À garder : la
  correspondance entre un identifiant et un élève reste hors ligne.</p>
  <div class="grille">
${planche.join('\n')}
  </div>
</body>
</html>
`,
  { mode: 0o600 },
)

console.log(`\n✅ ${eleves.length} dépôts préparés dans .classe/ pour l'organisation « ${ORG} ».\n`)
console.log('   Étape suivante (création sur GitHub) : node scripts/repos-init.mjs')
console.log('   Vérifie que Git l\'ignore : git check-ignore .classe/index.csv\n')
