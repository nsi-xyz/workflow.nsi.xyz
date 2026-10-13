# PLAN — workflow.nsi.xyz

> Site vitrine + manuel + salle d'entraînement du **workflow NSI** : piloter une IA
> pour construire, versionner et déployer un site.
> Public : élèves de terminale NSI (23) **et** tout visiteur curieux.
> Statut : plan validé à valider — aucun code écrit tant que ce document n'est pas accepté.

> **Mise à jour (11/10/2026) — le dépôt central a été retiré.** Les prompts ne sont plus
> déposés sur ce site : l'agent les consigne dans le dépôt GitHub de chaque élève
> (`journal/*.json`, voir `template/workflow.md`). L'API, le KV, les codes anonymes et
> l'espace prof décrits ci-dessous n'existent plus ; ce document reste l'historique du projet.
>
> **Mise à jour (13/10/2026) — brief du projet rédigé.** Les quatre blocs du sujet
> (objectif, rendu, règles, critères) sont désormais réels (`src/data/projet.ts`). Le
> garde-fou de taille couvre les CSS, la variable `REVEAL_AT` a été retirée (la date
> est une constante éditoriale) et l'audit de secrets ne se signale plus lui-même.

## 0. Décisions actées

| Sujet | Décision |
|---|---|
| Dépôt des prompts | Astro statique + **Pages Functions** (`/api`) + **KV** — le tout dans un seul projet Pages |
| Identité | **23 codes individuels** distribués par le prof, aucune donnée personnelle stockée |
| Prompts élèves | **Privés**, servent de preuve de travail ; ils ne sont jamais publiés. La promptothèque publique est **rédigée par nous** |
| Espace prof | **Page protégée par mot de passe** : lire les dépôts, filtrer, exporter CSV |
| Projet final | **Page verrouillée avec compte à rebours** jusqu'à `REVEAL_AT` (configurable) |
| Contenu | Générique et décontextualisé (aucune date de début octobre), mention du **projet NSI des vacances de Toussaint**, utile à tout visiteur |
| Pédagogie | Quiz, check-lists, constructeur de prompt, mini-jeu sécurité, calculateur de coût |
| Rédaction | Je rédige tout en français niveau terminale, le prof valide |
| Thème | **Bascule sombre/clair** mémorisée, glassmorphisme |
| Hébergement | Cloudflare Pages `workflow-nsi-xyz` → domaine `workflow.nsi.xyz` (CNAME proxied) |
| Dev | `DEV_PORT=4323` (4321, 4322, 4398 occupés), Node 22.23.2, Astro + Tailwind |

## 1. Principe directeur

Le site **est la démonstration du workflow qu'il enseigne** : construit avec OpenCode,
versionné sur GitHub, déployé sur Cloudflare Pages. Chaque section répond à une
question d'élève débutant : *c'est quoi, à quoi ça sert, comment je fais, quels pièges,
à moi de jouer*.

## 2. Arborescence du site

> **État réel (2026)** : le site publié compte **17 pages** statiques, listées par
> `npm run test:smoke`. Les entrées `/prof` et `/prompts/depot` du tableau ci-dessous
> ont été **retirées** avec l'API, le KV et l'espace prof (voir la note en tête de
> document) ; `/jeu`, `/markdown`, `/llm` et `/couts` ont, elles, été ajoutées.

| Route | Rôle | Contenu clé |
|---|---|---|
| `/` | Accueil | Le workflow en 5 étapes (schéma animé), parcours conseillé, bascule de thème, état « bientôt révélé » |
| `/workflow` | Vue d'ensemble | Pourquoi un workflow, la boucle décrire → générer → tester → corriger → livrer |
| `/jeu` | Du site au jeu | Différences site/jeu, invariants, spécificités d'un jeu vidéo, adaptations du workflow — sans révéler le sujet |
| `/markdown` | Écrire pour l'IA | Qu'est-ce qu'un Markdown, pourquoi ce format, syntaxe, AGENTS.md/README, `workflow.md` téléchargeable |
| `/llm` | IA & DeepSeek | Modèle, tokens, fenêtre de contexte, effort/qualité, renvoi vers la page des coûts |
| `/couts` | Coûts et budget | Gratuit/payant, trois postes de facturation, **comparateur multi-modèles**, heures creuses DeepSeek, plans d'abonnement, budget ~10 € |
| `/opencode` | L'agent | Interface, session/espace de travail, fichiers, commandes `/`, plan vs build, `/compact`, suivi du coût, installation, premier pas |
| `/git-github` | Garder une trace | Git, GitHub, dépôt **privé**, commit, push, README, `.gitignore`, `git check-ignore`, clone |
| `/prompt` | Piloter l'agent | Anatomie d'un prompt, itérer, bons/mauvais exemples, anti-patterns, **constructeur de prompt** |
| `/cloudflare` | Publier | Pages, build, URL publique, domaine, statuts de déploiement, lecture des erreurs |
| `/securite` | Sécurité | Clés API, `.env`, secrets et historique Git, injection de prompt, permissions, « privé ≠ secret », RGPD, **jeu « trouve la fuite »** |
| `/prompts` | Promptothèque | Prompts prêts à copier par tâche (créer, corriger, déployer, vérifier…) |
| `/prompts/depot` | Dépôt élève | Code individuel + mission + prompt ; dépôt **automatique par l'agent** (le formulaire reste un secours) ; rappel RGPD — **route retirée** |
| `/missions` | Parcours | Missions guidées génériques avec check-lists locales (découverte → dépôt → déploiement) |
| `/projet` | Projet final | **Verrouillé** : compte à rebours jusqu'à `REVEAL_AT`, puis brief configurable |
| `/quiz` | Validation | Quiz par thème, score local, corrigés pédagogiques |
| `/depannage` | Aide | Erreurs décodées (`401`, port occupé, `fetch failed`, `No access…`), FAQ |
| `/glossaire` | Référence | Cartes retournables, langage clair |
| `/prof` | Admin | Mot de passe, liste des dépôts, filtres mission/code/date, export CSV — **route retirée** |

## 3. Architecture technique

```
workflow.nsi.xyz/
├── astro.config.mjs          # sortie statique
├── src/                      # pages, composants, styles, données de contenu
├── functions/api/            # Pages Functions (API, incluse dans le projet Pages)
│   ├── prompts.ts            # POST dépôt (code requis)
│   ├── prof/login.ts         # POST mot de passe → cookie signé
│   ├── prof/prompts.ts       # GET liste (cookie requis)
│   └── prof/export.ts        # GET CSV
├── db/ ou data/              # contenu éditorial versionné
└── tests/                    # tests unitaires + smoke
```

- **Pages Functions** : incluses dans le déploiement Pages, aucune ressource Worker séparée.
- **KV** : un namespace `WORKFLOW` — clés `code:<sha256>` (les 23 codes, hachés) et
  `prompt:<horodatage>-<aléa>` (JSON `{code, mission, prompt, mode, ts}`).
- **API** : validation du code, longueur bornée, anti-spam (délai mini par code),
  réponses JSON, aucun HTML accepté, aucune lecture publique des dépôts.
- **Prof** : mot de passe en variable d'environnement Pages, cookie `HttpOnly`
  `SameSite=Strict` signé, expiration courte, limitation des tentatives.
- **Aucun tracker, aucune police externe, aucun CDN** (RGPD + robustesse).

## 4. Design — glassmorphisme impératif

- **Contrainte forte** : le site doit avoir une identité *glassmorphisme* assumée
  (verre dépoli, halos, profondeur), différente des sites frères. Ce n'est pas
  une option de style, c'est la signature visuelle du projet.
- Glassmorphisme **accessible** : fonds profonds + halos, surfaces translucides,
  contraste AA garanti, focus visibles.
- `prefers-reduced-motion` respecté ; pas de `backdrop-filter` coûteux sur mobile
  (fallback opaque).
- Mobile-first : lecture confortable sur téléphone, les manipulations terminal
  sont illustrées par des captures/encadrés copiables.
- Composants : parcours animé, onglets, accordéons, cartes retournables, quiz,
  champs « copier », simulateurs.
- Thème sombre par défaut, clair en option, choix mémorisé (`localStorage`).

## 5. Contenu à rédiger (par moi, validé par le prof)

1. **Scripts de démarrage** pas à pas (installation, première session, premier prompt).
2. **Prompts modèles** par intention, testés, avec explication de chaque phrase.
3. **Tableau des tarifs** DeepSeek et heures creuses → **à revérifier en ligne**
   au moment de la rédaction (prix susceptibles d'avoir changé).
4. **Catalogue d'erreurs** courantes et leur correction.
5. **Textes de sécurité** : scénarios réels (clé poussée sur GitHub, dépôt privé
   partagé, prompt qui exécute une commande destructrice), que faire dans l'urgence.
6. **Brief du projet final** : fourni par le prof ; en attendant, page verrouillée
   avec texte d'ambiance.
7. **Page « Coûts et budget »** : ce qui est gratuit (GitHub, Cloudflare Pages,
   OpenCode), ce qui est payant (les tokens du modèle), budget d'une dizaine
   d'euros, présenté comme une fourniture scolaire. Intègre le document de cours
   remis en classe : comparateur multi-modèles (sans la version Pro), heures
   creuses DeepSeek, plans d'abonnement, règles d'usage.

## 6. Jalons

| Jalon | Contenu | État |
|---|---|---|
| M1 Fondations | Astro 7 + Tailwind 4, design system glassmorphisme, navigation, thèmes, garde-fous Git | ✅ 29/09/2026 |
| M2 Contenu cœur | Sécurité · Workflow · IA & modèles · OpenCode · Git/GitHub · Cloudflare · Piloter l'agent · Promptothèque · Dépôt des prompts · Dépannage · Glossaire · Quiz | ✅ 13 / 15 sections rédigées |
| M3 Interactif | Calculateur de coût, constructeur de prompt, jeu « trouve la fuite », filtres, quiz, mode révision | ✅ intégré aux sections |
| M4 API & prof | KV, codes élèves, API de dépôt, espace prof, export CSV | ✅ 30/09/2026 |
| M5 Missions & projet | Missions guidées (progression locale), compte à rebours, page verrouillée, brief à personnaliser | ✅ 30/09/2026 |
| M6 Finition | Secrets de production, déploiement, domaine, smoke test (17 pages) | ✅ 30/09/2026 |

Chaque jalon : `npm run typecheck` (0 erreur), `npm test` (100 %), `npm run build`.

## 7. Ce qu'il me faut avant d'exécuter

- ✅ **`REVEAL_AT`** : date fournie. Constante éditoriale `revealAt` dans
  `src/data/projet.ts` (lundi 12/10/2026 à 8 h 42 ; reprise des cours le 02/11/2026).
  Pas de variable d'environnement : le bundle est statique et les tests importent le module.
- **Génération des 23 codes** : je produis `codes.csv` (ignoré de Git) + une
  planche imprimable à distribuer ; le prof garde la correspondance hors ligne.
- **Dépôt du site** : privé (recommandé) ou public comme exemple pour les élèves ?
- ✅ **Hook pré-commit** : fourni — `.githooks/pre-commit`, installé par `npm install`
  (`scripts/install-hooks.mjs`).

## 8. Hors périmètre (pour l'instant)

- Comptes élèves avec mot de passe, publication automatique des prompts élèves.
- Statistiques de progression de la classe (possible plus tard).
- Version anglaise.
