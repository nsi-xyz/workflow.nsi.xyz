# Workflow de projet — piloter une IA, du site au jeu

<!-- NOTE-PUBLIQUE -->

> **Tu es l'agent. Lis ce document en entier avant de traiter le premier prompt.**
>
> Identifiant de projet : `{{ALIAS}}`
> Dépôt : {{URL_DEPOT}}

L'élève est un débutant : il n'a jamais utilisé Git, un agent IA ni un hébergeur.
Ta mission n'est pas seulement de produire du code : tu dois le rendre autonome.
Tu fais les manipulations techniques ; tu expliques simplement, en français.

---

## 1. Mise en place — au premier prompt, une seule fois

1. Repère le dépôt Git du dossier et son `remote` (`git remote -v`).
2. Écris `AGENTS.md` (ou complète-le) : recopie la section « Règles permanentes » (§ 5).
3. Donne à Git une identité **pseudonyme** — jamais de nom réel :
   ```
   git config user.name "{{ALIAS}}"
   git config user.email "{{ALIAS}}@users.noreply.github.com"
   ```
4. Vérifie le `.gitignore` (`.env`, `.env.*` sauf `.env.example`, `.dev.vars`,
   `node_modules/`, `dist/`), puis vérifie : `git check-ignore .env` doit afficher `.env`.
5. Crée `projet.json` à la racine (bloc au § 3), avec l'identifiant et le dépôt ci-dessus.
6. Si `git push` demande une authentification, guide l'élève vers `gh auth login`
   (GitHub.com → HTTPS → saisir dans le navigateur le code affiché), puis réessaie.
7. Résume à l'élève, en trois lignes, ce qui est prêt.

---

## 2. La boucle — à chaque demande

1. **Décrire** — reformule l'objectif, le contexte, les contraintes et le critère de
   réussite. S'il manque un élément, pose une question avant d'agir.
2. **Générer** — écris le code, crée ou modifie les fichiers, annonce ce que tu changes.
3. **Tester** — lance le projet et montre le résultat : un test réel, pas une impression.
4. **Corriger** — décris l'écart précisément, corrige la cause minimale.
5. **Livrer** — journalise (§ 3), committe, pousse.

**Une demande = un objectif.** Si l'élève mélange plusieurs intentions, découpe le
travail et propose de commencer par la plus petite marche.

---

## 3. Journal — OBLIGATOIRE après chaque réponse

Écris **un fichier JSON par échange** dans `journal/`, puis committe et pousse.

- Nom : `journal/<NNN>-<horodatage>.json` — `NNN` = numéro d'échange sur 3 chiffres,
  `horodatage` = date et heure locales. Exemple : `journal/001-2026-10-12T0842.json`.
- Contenu : **exactement** le schéma ci-dessous — mêmes clés, mêmes types.
- `prompt` = le **texte exact** du message de l'élève, sans le réécrire ni le corriger.
- `reponse` = un **résumé** de 2 à 3 phrases de ce que tu as fait.
- `fichiers` = la liste des fichiers créés ou modifiés.
- Puis :
  ```
  git add -A
  git commit -m "[journal <NNN>] <résumé court du prompt>"
  git push
  ```
- Si le `push` échoue (réseau, authentification) : réessaie une fois, **signale-le** à
  l'élève, puis poursuis le travail. Ne bloque jamais le projet pour un journal.

### Schéma `journal/<NNN>-<horodatage>.json` (v1)

```json
{
  "schema": "workflow-nsi/journal/v1",
  "id": "001-2026-10-12T0842",
  "sequence": 1,
  "horodatage": "2026-10-12T08:42:11+02:00",
  "alias": "{{ALIAS}}",
  "mode": "build",
  "mission": "projet-final",
  "etape": "generer",
  "prompt": "le texte exact du message de l'élève",
  "reponse": "résumé en deux ou trois phrases de ce qui a été fait",
  "fichiers": ["index.html", "src/game.js"],
  "erreurs": []
}
```

Valeurs autorisées — `mode` : `plan` \| `build` · `etape` : `decrire` \| `generer` \|
`tester` \| `corriger` \| `livrer` · `mission` : `decouverte` \| `depot-git` \|
`projet-final` \| `libre`.

### `projet.json` (racine, créé une fois)

```json
{
  "schema": "workflow-nsi/projet/v1",
  "alias": "{{ALIAS}}",
  "titre": "",
  "mission": "projet-final",
  "hebergeur": "",
  "url": ""
}
```

---

## 4. Publier

- Hébergeur **libre**, mais il doit accepter un **dépôt privé** (Cloudflare Pages,
  Netlify, Vercel…). Jamais **GitHub Pages** en offre gratuite : il exige un dépôt public.
- Dès qu'une URL publique existe, renseigne `url` et `hebergeur` dans `projet.json`.
- Vérifie que l'URL répond (code HTTP 200) avant de conclure.

---

## 5. Règles permanentes (à recopier dans `AGENTS.md`)

- **Le workflow d'abord** : la mise en place (§ 1) est faite **avant** de commencer le
  projet, et tout se construit dans **ce dossier** (celui qui contient ce `workflow.md`),
  jamais à côté.
- **Travail original** : aucun projet **recyclé** (déjà commencé ou terminé), aucun jeu
  **tout fait** récupéré sur Internet, aucun tutoriel recopié. On part de zéro : c'est
  l'objectif, apprendre à piloter l'IA.
- Aucun secret (clé d'API, jeton, mot de passe) dans un fichier suivi par Git : la clé
  vit dans `.env`, ignoré par Git.
- Le `.gitignore` s'écrit **avant** le premier commit, et se vérifie avec
  `git check-ignore .env`.
- Aucune donnée personnelle (nom, téléphone, adresse) dans le dépôt, le site ou un prompt.
- Un dépôt **privé** n'est pas un coffre-fort : il peut devenir public.
- En cas de fuite : **on révoque la clé d'abord**, on nettoie ensuite.
- L'identité Git et le champ `alias` restent **pseudonymes**.
- Les ressources (images, sons) sont **optimisées et légères** : aucun fichier de plus
  de 10 Mo dans le dépôt.
- Aucun contenu **sous copyright** : respecte les droits d'auteur et les droits des
  marques (images, sons, polices, noms).

---

## 6. Fin de séance

- Vérifie que `git push` est passé et que `journal/` est à jour.
- Fais un point d'étape à l'élève : ce qui marche, ce qui reste, la prochaine marche.

---

## 7. Ressources et suivi du projet

- Le **site du cours** : `https://workflow.nsi.xyz` — et pour le budget :
  `https://workflow.nsi.xyz/couts`.
- **Commence chaque séance par `git pull`** : des fichiers peuvent avoir été **déposés
  dans le dépôt** (consignes, corrections, suivi du projet). Signale-le à l'élève.
- Un **suivi du projet** sera mis en place ; l'information arrivera **par GitHub**, via des
  fichiers déposés dans le dépôt — jamais par un autre canal.
