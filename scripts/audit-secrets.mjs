/**
 * Audit « fuite de secrets » : les valeurs sensibles locales (jetons, clés, mots
 * de passe) ont-elles été commitées ou poussées dans l'un des dépôts voisins ?
 *
 * À lancer depuis un projet : `node scripts/audit-secrets.mjs`
 * Le dossier parent est analysé par défaut (tous les sites frères) ; on peut le
 * donner en argument.
 *
 * Ne sort jamais une valeur : uniquement des empreintes SHA-256 tronquées, les
 * dépôts, fichiers suivis et nombres de commits concernés.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = resolve(process.argv[2] ?? `${process.cwd()}/..`)
const KEY_RE = /(TOKEN|SECRET|PASS|PASSWORD|API_KEY|APP_KEY|JWT|CREDENTIAL)/i
const VALUE_MIN = 16
const PATTERNS = ['cfut_'] // préfixe des jetons Cloudflare de ce compte
const fp = (v) => createHash('sha256').update(v).digest('hex').slice(0, 10)

const secrets = new Map() // valeur -> nom de clé
function collectEnvFile(file) {
  if (!existsSync(file) || !statSync(file).isFile()) return
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m || !KEY_RE.test(m[1])) continue
    let value = m[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    )
      value = value.slice(1, -1)
    if (value.length >= VALUE_MIN && !/^(changeme|placeholder|xxx|\.\.\.)/i.test(value)) {
      secrets.set(value, m[1])
    }
  }
}

const envFiles = []
for (const entry of readdirSync(BASE)) {
  const dir = `${BASE}/${entry}`
  if (!statSync(dir).isDirectory()) continue
  for (const rel of ['.env', '.dev.vars', 'back/.env', 'app/.env', 'server/.env']) {
    const file = `${dir}/${rel}`
    if (existsSync(file) && statSync(file).isFile() && !rel.endsWith('.example'))
      envFiles.push(file)
  }
}
for (const f of envFiles) collectEnvFile(f)

console.log(`Racine analysée            : ${BASE}`)
console.log(`Fichiers de secrets locaux : ${envFiles.length}`)
console.log(`Valeurs sensibles uniques  : ${secrets.size}`)
console.log()

function git(repo, args) {
  try {
    return execFileSync('git', ['-C', repo, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

let alerts = 0
for (const name of readdirSync(BASE).filter((n) => existsSync(`${BASE}/${n}/.git`)).sort()) {
  const repo = `${BASE}/${name}`
  const findings = []
  for (const pattern of PATTERNS) {
    const g = git(repo, ['grep', '-l', '-F', '-e', pattern])
    if (g) findings.push(`motif « ${pattern} » dans : ${g.split('\n').join(', ')}`)
  }
  for (const [value, key] of secrets) {
    const g = git(repo, ['grep', '-l', '-F', '-e', value])
    const h = git(repo, ['log', '--all', '--oneline', '-S', value])
    if (g) findings.push(`valeur de ${key} [${fp(value)}] dans : ${g.split('\n').join(', ')}`)
    if (h)
      findings.push(
        `valeur de ${key} [${fp(value)}] dans l'historique : ${h.split('\n').length} commit(s)`,
      )
  }
  if (findings.length) {
    alerts += 1
    console.log(`❌ ${name}`)
    for (const f of findings) console.log(`     ${f}`)
  } else {
    console.log(`✅ ${name}`)
  }
}

console.log()
console.log(
  alerts
    ? `⚠️ ${alerts} dépôt(s) contiennent des secrets — rotation puis purge d'historique (workflow.md § 9).`
    : 'Aucun secret local dans les fichiers suivis ou l’historique Git.',
)
process.exit(alerts ? 1 : 0)
