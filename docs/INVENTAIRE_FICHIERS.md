# Inventaire des fichiers — workflow.nsi.xyz

> Fichier **généré** par `node scripts/generate-inventory.mjs` — ne pas éditer à la main.
> Dernière génération : 2026-10-20

## Synthèse

- **135 fichiers** suivis (hors `node_modules`, `dist`, `.git`, lockfiles).
- **16 049 lignes** au total.

## Volumétrie par répertoire

| Répertoire | Fichiers | Lignes |
|---|---:|---:|
| `src/pages/` | 19 | 3 830 |
| `src/data/` | 17 | 3 330 |
| `src/styles/` | 22 | 2 859 |
| `scripts/` | 27 | 2 123 |
| `tests/` | 18 | 1 108 |
| `src/components/` | 11 | 854 |
| `src/client/` | 3 | 715 |
| `./` | 6 | 324 |
| `src/lib/` | 3 | 280 |
| `template/` | 3 | 216 |
| `public/` | 1 | 161 |
| `src/layouts/` | 2 | 133 |
| `docs/` | 2 | 110 |
| `src/` | 1 | 6 |

## Fichiers les plus volumineux (> 400 lignes)

_Aucun fichier au-dessus de 400 lignes._

## Inventaire complet

| Fichier | Lignes | Rôle |
|---|---:|---|
| `astro.config.mjs` | 14 | Racine / config |
| `docs/pilote.md` | 63 | Documentation |
| `docs/workflow-classe.template.md` | 47 | Documentation |
| `env.d.ts` | 2 | Racine / config |
| `package.json` | 50 | Racine / config |
| `PLAN.md` | 155 | Racine / config |
| `public/workflow.md` | 161 | Racine / config |
| `README.md` | 87 | Racine / config |
| `scripts/any-baseline.json` | 4 | Script outillage |
| `scripts/audit-secrets.mjs` | 108 | Script outillage |
| `scripts/check-debt.mjs` | 117 | Script outillage |
| `scripts/check-nocheck.mjs` | 68 | Script outillage |
| `scripts/check-secrets.mjs` | 98 | Script outillage |
| `scripts/check-size.mjs` | 148 | Script outillage |
| `scripts/check-whitespace.mjs` | 80 | Script outillage |
| `scripts/classes-init.mjs` | 134 | Script outillage |
| `scripts/codes-init.mjs` | 54 | Script outillage |
| `scripts/contrat-sync.mjs` | 97 | Script outillage |
| `scripts/dev-url.mjs` | 142 | Script outillage |
| `scripts/dev.mjs` | 96 | Script outillage |
| `scripts/env.mjs` | 38 | Script outillage |
| `scripts/generate-inventory.mjs` | 153 | Script outillage |
| `scripts/increment-version.js` | 33 | Script outillage |
| `scripts/install-hooks.mjs` | 31 | Script outillage |
| `scripts/kit-pdf.mjs` | 95 | Script outillage |
| `scripts/nocheck-baseline.json` | 5 | Script outillage |
| `scripts/node22.mjs` | 63 | Script outillage |
| `scripts/repos-init.mjs` | 148 | Script outillage |
| `scripts/run-with-node22.mjs` | 55 | Script outillage |
| `scripts/silent-catch-baseline.json` | 2 | Script outillage |
| `scripts/size-baseline.json` | 13 | Script outillage |
| `scripts/smoke-test.mjs` | 63 | Script outillage |
| `scripts/sync-workflow.mjs` | 83 | Script outillage |
| `scripts/verif-journal.mjs` | 137 | Script outillage |
| `scripts/wrangler.mjs` | 58 | Script outillage |
| `src/client/auth.ts` | 162 | Racine / config |
| `src/client/monProjet.ts` | 394 | Racine / config |
| `src/client/quiz.ts` | 159 | Racine / config |
| `src/components/AgentPeutToutFaire.astro` | 21 | Composant UI |
| `src/components/AuthWidget.astro` | 26 | Composant UI |
| `src/components/Callout.astro` | 14 | Composant UI |
| `src/components/CompteARebours.astro` | 85 | Composant UI |
| `src/components/CostCalculator.astro` | 133 | Composant UI |
| `src/components/Footer.astro` | 43 | Composant UI |
| `src/components/Header.astro` | 54 | Composant UI |
| `src/components/PromptBuilder.astro` | 160 | Composant UI |
| `src/components/Promptotheque.astro` | 127 | Composant UI |
| `src/components/SpotTheLeak.astro` | 138 | Composant UI |
| `src/components/ThemeToggle.astro` | 53 | Composant UI |
| `src/data/cloudflare.ts` | 174 | Donnée éditoriale |
| `src/data/couts.ts` | 256 | Donnée éditoriale |
| `src/data/depannage.ts` | 201 | Donnée éditoriale |
| `src/data/git.ts` | 235 | Donnée éditoriale |
| `src/data/glossaire.ts` | 270 | Donnée éditoriale |
| `src/data/jeu.ts` | 120 | Donnée éditoriale |
| `src/data/llm.ts` | 118 | Donnée éditoriale |
| `src/data/markdown.ts` | 107 | Donnée éditoriale |
| `src/data/missions.ts` | 80 | Donnée éditoriale |
| `src/data/navigation.ts` | 293 | Donnée éditoriale |
| `src/data/opencode.ts` | 192 | Donnée éditoriale |
| `src/data/projet.ts` | 106 | Donnée éditoriale |
| `src/data/prompt.ts` | 207 | Donnée éditoriale |
| `src/data/promptotheque.ts` | 348 | Donnée éditoriale |
| `src/data/quiz.ts` | 321 | Donnée éditoriale |
| `src/data/securite.ts` | 88 | Donnée éditoriale |
| `src/data/workflow.ts` | 214 | Donnée éditoriale |
| `src/layouts/BaseLayout.astro` | 66 | Gabarit de page |
| `src/layouts/DocLayout.astro` | 67 | Gabarit de page |
| `src/lib/cout.ts` | 189 | Racine / config |
| `src/lib/fr.ts` | 11 | Racine / config |
| `src/lib/prompt.ts` | 80 | Racine / config |
| `src/pages/[...slug].astro` | 45 | Page (route) |
| `src/pages/cloudflare.astro` | 318 | Page (route) |
| `src/pages/couts.astro` | 278 | Page (route) |
| `src/pages/depannage.astro` | 191 | Page (route) |
| `src/pages/git-github.astro` | 305 | Page (route) |
| `src/pages/glossaire.astro` | 217 | Page (route) |
| `src/pages/index.astro` | 158 | Page (route) |
| `src/pages/jeu.astro` | 132 | Page (route) |
| `src/pages/llm.astro` | 210 | Page (route) |
| `src/pages/markdown.astro` | 196 | Page (route) |
| `src/pages/missions.astro` | 156 | Page (route) |
| `src/pages/mon-projet.astro` | 77 | Page (route) |
| `src/pages/opencode.astro` | 395 | Page (route) |
| `src/pages/projet.astro` | 132 | Page (route) |
| `src/pages/prompt.astro` | 200 | Page (route) |
| `src/pages/prompts.astro` | 116 | Page (route) |
| `src/pages/quiz.astro` | 124 | Page (route) |
| `src/pages/securite.astro` | 322 | Page (route) |
| `src/pages/workflow.astro` | 258 | Page (route) |
| `src/styles/base.css` | 288 | Feuille de style |
| `src/styles/chrome.css` | 388 | Feuille de style |
| `src/styles/couts.css` | 88 | Feuille de style |
| `src/styles/depannage.css` | 54 | Feuille de style |
| `src/styles/espace.css` | 156 | Feuille de style |
| `src/styles/git.css` | 54 | Feuille de style |
| `src/styles/global.css` | 28 | Feuille de style |
| `src/styles/glossaire.css` | 54 | Feuille de style |
| `src/styles/home.css` | 137 | Feuille de style |
| `src/styles/layout.css` | 231 | Feuille de style |
| `src/styles/missions.css` | 108 | Feuille de style |
| `src/styles/opencode.css` | 119 | Feuille de style |
| `src/styles/primitives.css` | 197 | Feuille de style |
| `src/styles/projet.css` | 145 | Feuille de style |
| `src/styles/prompt.css` | 146 | Feuille de style |
| `src/styles/promptotheque.css` | 99 | Feuille de style |
| `src/styles/quiz.css` | 72 | Feuille de style |
| `src/styles/rhythm.css` | 28 | Feuille de style |
| `src/styles/securite.css` | 154 | Feuille de style |
| `src/styles/tokens.css` | 107 | Feuille de style |
| `src/styles/utilities.css` | 43 | Feuille de style |
| `src/styles/workflow.css` | 163 | Feuille de style |
| `src/version.json` | 6 | Racine / config |
| `template/AGENTS.md` | 47 | Modèle de dépôt élève |
| `template/projet.json` | 9 | Modèle de dépôt élève |
| `template/workflow.md` | 160 | Modèle de dépôt élève |
| `tests/cloudflare.test.mjs` | 59 | Test |
| `tests/content.test.mjs` | 51 | Test |
| `tests/couts.test.mjs` | 99 | Test |
| `tests/depannage.test.mjs` | 52 | Test |
| `tests/fr.test.mjs` | 19 | Test |
| `tests/git.test.mjs` | 60 | Test |
| `tests/glossaire.test.mjs` | 41 | Test |
| `tests/jeu.test.mjs` | 44 | Test |
| `tests/llm.test.mjs` | 129 | Test |
| `tests/markdown.test.mjs` | 51 | Test |
| `tests/missions.test.mjs` | 65 | Test |
| `tests/opencode.test.mjs` | 59 | Test |
| `tests/projet.test.mjs` | 59 | Test |
| `tests/prompt.test.mjs` | 95 | Test |
| `tests/promptotheque.test.mjs` | 61 | Test |
| `tests/quiz.test.mjs` | 56 | Test |
| `tests/securite.test.mjs` | 48 | Test |
| `tests/workflow.test.mjs` | 60 | Test |
| `tsconfig.json` | 16 | Racine / config |
