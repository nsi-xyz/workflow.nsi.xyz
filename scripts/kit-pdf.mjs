#!/usr/bin/env node
/**
 * Génère le kit PDF (recto-verso, A4) de chaque élève.
 *
 *   node scripts/kit-pdf.mjs                 # tous les élèves de .classe/index.csv
 *   node scripts/kit-pdf.mjs --only=Ilyas    # un seul
 *   node scripts/kit-pdf.mjs --html          # garde aussi le HTML intermédiaire
 *
 * Source : kit/kit.html (jetons {{ALIAS}} et {{URL_DEPOT}}).
 * Sortie : .classe/kits/<alias>.pdf — jamais commité (voir .gitignore).
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MODELE = path.join(ROOT, 'kit', 'kit.html')
const INDEX = path.join(ROOT, '.classe', 'index.csv')

const args = process.argv.slice(2)
const option = (nom, defaut) => {
  const trouve = args.find((a) => a.startsWith(`--${nom}=`))
  return trouve ? trouve.slice(nom.length + 3) : defaut
}
const ONLY = option('only', '')
const GARDER_HTML = args.includes('--html')
const OUT = path.resolve(ROOT, option('out', '.classe/kits'))

if (!fs.existsSync(MODELE)) {
  console.error('❌ kit/kit.html introuvable.')
  process.exit(1)
}
if (!fs.existsSync(INDEX)) {
  console.error("❌ .classe/index.csv introuvable. Lance d'abord : node scripts/classes-init.mjs")
  process.exit(1)
}

/** Navigateur pour imprimer en PDF (Chrome/Chromium headless). */
function trouverChrome() {
  for (const nom of ['google-chrome', 'chromium', 'chromium-browser', '/usr/bin/google-chrome']) {
    try {
      execFileSync(nom, ['--version'], { stdio: 'ignore' })
      return nom
    } catch {
      /* on essaie le suivant */
    }
  }
  return null
}
const CHROME = trouverChrome()
if (!CHROME) {
  console.error('❌ Aucun Chrome/Chromium trouvé pour imprimer les PDF.')
  console.error('   Installe google-chrome (ou chromium), ou utilise --html et imprime à la main.')
  process.exit(1)
}

const modele = fs.readFileSync(MODELE, 'utf8')
const lignes = fs.readFileSync(INDEX, 'utf8').trim().split('\n').slice(1)
const eleves = lignes
  .map((ligne) => ligne.split(';'))
  .map(([label, alias, url]) => ({ label, alias, url }))
  .filter(({ alias }) => alias && (!ONLY || alias === ONLY))

if (eleves.length === 0) {
  console.error(`❌ Aucun élève pour --only=${ONLY}.`)
  process.exit(1)
}

fs.mkdirSync(OUT, { recursive: true })

for (const { label, alias, url } of eleves) {
  const html = modele.replaceAll('{{ALIAS}}', alias).replaceAll('{{URL_DEPOT}}', url)
  const fichierHtml = path.join(OUT, `${alias}.html`)
  const fichierPdf = path.join(OUT, `${alias}.pdf`)
  fs.writeFileSync(fichierHtml, html)
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${fichierPdf}`,
      `file://${fichierHtml}`,
    ],
    { stdio: 'ignore' },
  )
  if (!GARDER_HTML) fs.rmSync(fichierHtml, { force: true })
  const taille = (fs.statSync(fichierPdf).size / 1024).toFixed(0)
  console.log(`• ${label} (${alias}) → ${path.relative(ROOT, fichierPdf)} (${taille} Ko)`)
}

console.log(`\n✅ ${eleves.length} kit(s) généré(s) dans ${path.relative(ROOT, OUT)}/.`)
