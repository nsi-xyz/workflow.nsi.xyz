# workflow.nsi.xyz

Le site qui apprend à **piloter une IA** (OpenCode + DeepSeek) pour construire,
versionner sur GitHub et déployer un site avec Cloudflare Pages — puis pour
créer un **jeu vidéo de A à Z**, avec le même workflow.

**En production : [https://workflow.nsi.xyz](https://workflow.nsi.xyz)**
Projet Cloudflare Pages `workflow-nsi-xyz` (site statique, sans API).

Public : élèves de terminale NSI — et tout visiteur curieux. Le site est
**générique** : il ne dépend d'aucune date de cours, il décrit le workflow, les
outils, les pièges de sécurité et les bons prompts.

## Le workflow enseigné

1. **Espace de travail** — OpenCode, une session, des fichiers.
2. **Piloter l'IA** — prompts, itérations, modes plan/build, coûts.
3. **Garder une trace** — Git, dépôt GitHub privé.
4. **Publier** — Cloudflare Pages, URL publique.
5. **Journaliser** — l'agent consigne chaque échange (prompt exact + résumé + fichiers)
   dans un fichier JSON du dépôt, committé et poussé : c'est la trace du travail.

Le site explique aussi la différence entre un site et un jeu (`/jeu`), le format
Markdown (`/markdown`), les coûts et le budget (`/couts`, avec un comparateur de
modèles), et fournit le document modèle `public/workflow.md`. Ce document est généré
depuis la source unique `template/workflow.md` (`npm run workflow:sync`) ; la
personnalisation par élève est décrite dans `docs/workflow-classe.template.md`.

## Technique

- **Astro statique** : Astro pré-rend tout dans `dist/`, Cloudflare Pages le publie.
  Pas d'API, pas de stockage, pas de collecte : le site ne contient que des pages.
- Domaine : `https://workflow.nsi.xyz` (CNAME vers `workflow-nsi-xyz.pages.dev`).
- Node ≥ 22, port de dev stable `4323` (`npm run dev`, `npm run dev:url`).
- Le kit de démarrage (scripts, jeton Cloudflare, règles) vit dans le dossier
  `workflow/` de la machine de cours ; son mode d'emploi est `workflow.md`.

## Commandes

```bash
npm run dev          # serveur de test (0.0.0.0:4323, local + VPN)
npm run dev:url      # URL réelle du serveur en cours
npm test             # tests unitaires
npm run typecheck    # contrôle de types
npm run build        # site statique dans dist/
npm run deploy       # build + publication Cloudflare Pages
npm run workflow:sync   # régénère public/workflow.md depuis template/workflow.md
npm run codes:init      # génère les identifiants pseudonymes (codes.csv)
npm run classes:init    # prépare .classe/<alias>/ (fichiers personnalisés + planche)
npm run repos:init      # crée les dépôts privés des élèves sur GitHub
node scripts/audit-secrets.mjs   # aucun secret dans les dépôts voisins
```

## Journal des prompts (dans le dépôt)

Le site n'héberge plus les prompts : la trace vit dans le **dépôt GitHub de chaque
élève**. À chaque réponse, l'agent écrit un fichier `journal/<NNN>-<horodatage>.json`
(prompt exact, résumé, fichiers modifiés), puis committe et pousse. Le contrat remis
à l'élève est `template/workflow.md` ; le schéma est figé (`workflow-nsi/journal/v1`).

## Dépôts élèves

- **Organisation GitHub dédiée** (ex. `nsi-xyz-projets`) dont le professeur est
  propriétaire : il voit tous les dépôts sans invitation.
- `npm run codes:init` génère `codes.csv` — la correspondance élève ↔ identifiant
  pseudonyme, jamais commitée.
- `npm run classes:init` prépare `.classe/<alias>/` (fichiers personnalisés + planche
  à remettre + `index.csv`).
- `npm run repos:init` crée les dépôts privés `projet-<alias>` et y pousse le contenu
  (mode `--dry-run` pour simuler).

## Sécurité

`.env` est ignoré par Git et en `chmod 600`, `.dev.vars` aussi. Aucune donnée
personnelle d'élève n'est stockée : les dépôts portent un identifiant pseudonyme, et
la correspondance ne vit que dans `codes.csv`, côté enseignant.

## Production

```bash
npm run test:smoke -- https://workflow.nsi.xyz   # 17 pages vérifiées après déploiement
npm run deploy                                    # build + publication pages.dev
```

- **Domaine** : `workflow.nsi.xyz` rattaché au projet Pages + CNAME proxied vers
  `workflow-nsi-xyz.pages.dev` (sans ce CNAME, le domaine reste en `pending`).
