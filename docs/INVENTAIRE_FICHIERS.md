# Inventaire des fichiers — workflow.nsi.xyz

> Fichier **généré** par `node scripts/generate-inventory.mjs` — ne pas éditer à la main.
> Dernière génération : 2026-09-30

## Synthèse

- **101 fichiers** suivis (hors `node_modules`, `dist`, `.git`, lockfiles).
- **13 317 lignes** au total.

## Volumétrie par répertoire

| Répertoire | Fichiers | Lignes |
|---|---:|---:|
| `src/pages/` | 16 | 3 131 |
| `src/data/` | 14 | 2 818 |
| `src/styles/` | 4 | 2 484 |
| `scripts/` | 20 | 1 420 |
| `tests/` | 16 | 1 013 |
| `src/components/` | 9 | 841 |
| `src/lib/` | 4 | 371 |
| `src/client/` | 2 | 318 |
| `./` | 6 | 280 |
| `src/pages/prompts/` | 1 | 228 |
| `src/layouts/` | 2 | 130 |
| `functions/api/prof/` | 3 | 114 |
| `functions/_lib/` | 1 | 88 |
| `functions/api/` | 2 | 75 |
| `src/` | 1 | 6 |

## Fichiers les plus volumineux (> 400 lignes)

| Fichier | Lignes | Frontmatter | Script inline | Template | Rôle |
|---|---:|---:|---:|---:|---|
| `src/styles/components.css` | 2082 | — | — | 2082 | Feuille de style |

## Inventaire complet

| Fichier | Lignes | Rôle |
|---|---:|---|
| `astro.config.mjs` | 15 | Racine / config |
| `env.d.ts` | 6 | Racine / config |
| `functions/_lib/http.ts` | 88 | Pages Function (API) |
| `functions/api/prof/login.ts` | 36 | Pages Function (API) |
| `functions/api/prof/logout.ts` | 12 | Pages Function (API) |
| `functions/api/prof/prompts.ts` | 66 | Pages Function (API) |
| `functions/api/prompts.ts` | 43 | Pages Function (API) |
| `functions/api/stats.ts` | 32 | Pages Function (API) |
| `package.json` | 44 | Racine / config |
| `PLAN.md` | 131 | Racine / config |
| `README.md` | 68 | Racine / config |
| `scripts/any-baseline.json` | 4 | Script outillage |
| `scripts/audit-secrets.mjs` | 102 | Script outillage |
| `scripts/check-debt.mjs` | 117 | Script outillage |
| `scripts/check-nocheck.mjs` | 68 | Script outillage |
| `scripts/check-secrets.mjs` | 98 | Script outillage |
| `scripts/check-size.mjs` | 148 | Script outillage |
| `scripts/check-whitespace.mjs` | 80 | Script outillage |
| `scripts/codes-init.mjs` | 137 | Script outillage |
| `scripts/dev-url.mjs` | 120 | Script outillage |
| `scripts/dev.mjs` | 96 | Script outillage |
| `scripts/env.mjs` | 38 | Script outillage |
| `scripts/generate-inventory.mjs` | 152 | Script outillage |
| `scripts/increment-version.js` | 33 | Script outillage |
| `scripts/install-hooks.mjs` | 31 | Script outillage |
| `scripts/nocheck-baseline.json` | 5 | Script outillage |
| `scripts/node22.mjs` | 63 | Script outillage |
| `scripts/run-with-node22.mjs` | 55 | Script outillage |
| `scripts/silent-catch-baseline.json` | 2 | Script outillage |
| `scripts/size-baseline.json` | 13 | Script outillage |
| `scripts/wrangler.mjs` | 58 | Script outillage |
| `src/client/prof.ts` | 159 | Racine / config |
| `src/client/quiz.ts` | 159 | Racine / config |
| `src/components/Callout.astro` | 14 | Composant UI |
| `src/components/CompteARebours.astro` | 85 | Composant UI |
| `src/components/CostCalculator.astro` | 169 | Composant UI |
| `src/components/Footer.astro` | 43 | Composant UI |
| `src/components/Header.astro` | 52 | Composant UI |
| `src/components/PromptBuilder.astro` | 160 | Composant UI |
| `src/components/Promptotheque.astro` | 127 | Composant UI |
| `src/components/SpotTheLeak.astro` | 138 | Composant UI |
| `src/components/ThemeToggle.astro` | 53 | Composant UI |
| `src/data/cloudflare.ts` | 174 | Donnée éditoriale |
| `src/data/depannage.ts` | 187 | Donnée éditoriale |
| `src/data/git.ts` | 235 | Donnée éditoriale |
| `src/data/glossaire.ts` | 270 | Donnée éditoriale |
| `src/data/llm.ts` | 128 | Donnée éditoriale |
| `src/data/missions.ts` | 80 | Donnée éditoriale |
| `src/data/navigation.ts` | 281 | Donnée éditoriale |
| `src/data/opencode.ts` | 192 | Donnée éditoriale |
| `src/data/projet.ts` | 95 | Donnée éditoriale |
| `src/data/prompt.ts` | 207 | Donnée éditoriale |
| `src/data/promptotheque.ts` | 348 | Donnée éditoriale |
| `src/data/quiz.ts` | 321 | Donnée éditoriale |
| `src/data/securite.ts` | 88 | Donnée éditoriale |
| `src/data/workflow.ts` | 212 | Donnée éditoriale |
| `src/layouts/BaseLayout.astro` | 63 | Gabarit de page |
| `src/layouts/DocLayout.astro` | 67 | Gabarit de page |
| `src/lib/cout.ts` | 120 | Racine / config |
| `src/lib/fr.ts` | 11 | Racine / config |
| `src/lib/journal.ts` | 160 | Racine / config |
| `src/lib/prompt.ts` | 80 | Racine / config |
| `src/pages/[...slug].astro` | 45 | Page (route) |
| `src/pages/cloudflare.astro` | 316 | Page (route) |
| `src/pages/depannage.astro` | 191 | Page (route) |
| `src/pages/git-github.astro` | 303 | Page (route) |
| `src/pages/glossaire.astro` | 217 | Page (route) |
| `src/pages/index.astro` | 138 | Page (route) |
| `src/pages/llm.astro` | 265 | Page (route) |
| `src/pages/missions.astro` | 156 | Page (route) |
| `src/pages/opencode.astro` | 337 | Page (route) |
| `src/pages/prof.astro` | 68 | Page (route) |
| `src/pages/projet.astro` | 119 | Page (route) |
| `src/pages/prompt.astro` | 198 | Page (route) |
| `src/pages/prompts.astro` | 121 | Page (route) |
| `src/pages/prompts/depot.astro` | 228 | Page (route) |
| `src/pages/quiz.astro` | 124 | Page (route) |
| `src/pages/securite.astro` | 322 | Page (route) |
| `src/pages/workflow.astro` | 211 | Page (route) |
| `src/styles/base.css` | 287 | Feuille de style |
| `src/styles/components.css` | 2082 | Feuille de style |
| `src/styles/global.css` | 8 | Feuille de style |
| `src/styles/tokens.css` | 107 | Feuille de style |
| `src/version.json` | 6 | Racine / config |
| `tests/cloudflare.test.mjs` | 59 | Test |
| `tests/content.test.mjs` | 51 | Test |
| `tests/depannage.test.mjs` | 52 | Test |
| `tests/fr.test.mjs` | 19 | Test |
| `tests/git.test.mjs` | 60 | Test |
| `tests/glossaire.test.mjs` | 41 | Test |
| `tests/journal.test.mjs` | 90 | Test |
| `tests/llm.test.mjs` | 129 | Test |
| `tests/missions.test.mjs` | 65 | Test |
| `tests/opencode.test.mjs` | 59 | Test |
| `tests/projet.test.mjs` | 59 | Test |
| `tests/prompt.test.mjs` | 95 | Test |
| `tests/promptotheque.test.mjs` | 61 | Test |
| `tests/quiz.test.mjs` | 56 | Test |
| `tests/securite.test.mjs` | 48 | Test |
| `tests/workflow.test.mjs` | 69 | Test |
| `tsconfig.json` | 16 | Racine / config |
