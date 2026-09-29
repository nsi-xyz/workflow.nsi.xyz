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
npm test             # tests unitaires
npm run typecheck    # contrôle de types
npm run build        # site statique dans dist/
npm run deploy       # build + publication Cloudflare Pages
node scripts/audit-secrets.mjs   # aucun secret dans les dépôts voisins
```

## Sécurité

`.env` est ignoré par Git et en `chmod 600`. Aucune donnée personnelle
d'élève n'est stockée : les dépôts de prompts utilisent des codes anonymes.
