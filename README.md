# workflow.nsi.xyz

Le site qui apprend à **piloter une IA** (OpenCode + DeepSeek) pour construire,
versionner sur GitHub et déployer un site avec Cloudflare Pages.

Public : élèves de terminale NSI — et tout visiteur curieux. Le site est
**générique** : il ne dépend d'aucune date de cours, il décrit le workflow, les
outils, les pièges de sécurité et les bons prompts.

## Le workflow enseigné

1. **Espace de travail** — OpenCode, une session, des fichiers.
2. **Piloter l'IA** — prompts, itérations, modes plan/build, coûts.
3. **Garder une trace** — Git, dépôt GitHub privé.
4. **Publier** — Cloudflare Pages, URL publique.
5. **Journaliser** — déposer ses prompts sur ce site pour montrer son travail.

## Technique

- **Astro statique** + **Pages Functions** (`functions/`) + **KV** : un seul
  projet Cloudflare Pages, nommé `workflow-nsi-xyz`.
- Domaine : `https://workflow.nsi.xyz` (CNAME vers `workflow-nsi-xyz.pages.dev`).
- Node ≥ 22, port de dev stable `4323` (`npm run dev`, `npm run dev:url`).
- Le kit de démarrage (scripts, jeton Cloudflare, règles) est décrit dans
  `workflow.md`, à la racine du dossier parent.

## Commandes

```bash
npm run dev          # serveur de test (0.0.0.0:4323, local + VPN)
npm run dev:url      # URL réelle du serveur en cours
npm run dev:api      # site + API (Pages Functions) sur http://localhost:4324
npm test             # tests unitaires
npm run typecheck    # contrôle de types
npm run build        # site statique dans dist/
npm run deploy       # build + publication Cloudflare Pages
npm run codes:init   # génère les codes élèves, la planche à imprimer et remplit KV
node scripts/audit-secrets.mjs   # aucun secret dans les dépôts voisins
```

## API et journal des prompts

- `POST /api/prompts` — dépôt d'un prompt par un élève (code à 12 caractères vérifié dans KV).
- `GET /api/stats` — compteurs publics (dépôts reçus, codes distribués).
- `POST /api/prof/login` · `POST /api/prof/logout` — session prof (cookie signé, 8 h).
- `GET /api/prof/prompts?offset=&limit=` — liste paginée (50 dépôts maximum par appel,
  à cause de la limite de sous-requêtes d'une invocation).
- L'export CSV est construit **dans le navigateur** (src/lib/journal.ts → `versCsv`), en
  enchaînant les pages : aucun dépassement de quota côté serveur.

### Codes élèves

```bash
npm run codes:init        # 23 codes par défaut → KV local + KV distant
npm run codes:init -- --nombre=24 --local
```

Crée `codes.csv` (correspondance élève ↔ code ↔ empreinte) et
`codes-a-distribuer.html` (planche imprimable). **Ces deux fichiers ne sont jamais
commités** : `.gitignore` les protège et le hook de pré-commit vérifie qu'aucun code
n'est suivi par Git. Seules les empreintes SHA-256 partent dans KV.

## Sécurité

`.env` est ignoré par Git et en `chmod 600`, `.dev.vars` aussi. Aucune donnée
personnelle d'élève n'est stockée : les dépôts sont associés à l'empreinte d'un code,
et la correspondance ne vit que dans `codes.csv`, côté enseignant.
