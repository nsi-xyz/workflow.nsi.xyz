# Complément « classe » — personnaliser le dépôt élève

> **Fichier privé, non publié sur le site.** Il décrit comment produire la version de
> `workflow.md` remise à chaque élève, qui porte son identifiant pseudonyme et
> l'adresse de son dépôt privé.

## Principe

Le document remis aux élèves est le modèle `template/workflow.md`, avec **deux jetons**
remplacés :

| Jeton | Remplacé par | Exemple |
|---|---|---|
| `{{ALIAS}}` | l'identifiant pseudonyme de l'élève | `TM5P-GYZU-T55P` |
| `{{URL_DEPOT}}` | l'adresse du dépôt privé de l'élève | `https://github.com/nsi-xyz-projets/projet-TM5P-GYZU-T55P` |

Le même remplacement s'applique à `template/AGENTS.md` et `template/projet.json`.

- L'identifiant vient de `codes.csv` (généré par `npm run codes:init`), colonne `code`.
- **Aucune donnée personnelle** ne figure dans le dépôt : l'alias est pseudonyme, et la
  correspondance élève ↔ alias reste dans `codes.csv`, côté enseignant.

## Organisation GitHub

Les dépôts privés vivent dans une **organisation dédiée** (ex. `nsi-xyz-projets`) dont
le professeur est propriétaire : il a ainsi accès à tous les dépôts sans invitation.

1. Créer l'organisation et y ajouter les élèves comme membres (une seule fois).
2. Créer un dépôt **modèle** (privé) avec le contenu de `template/`.
3. Créer **un dépôt privé par élève** — `projet-<alias>` — à partir du modèle, et y
   déposer les fichiers personnalisés (`workflow.md`, `AGENTS.md`, `projet.json`).

## Mise en place côté élève

L'élève n'a rien à décider :

1. Il ouvre le dossier de son dépôt (déjà cloné, ou cloné à la première séance).
2. Il lance OpenCode : l'agent lit `workflow.md` et `AGENTS.md` et applique la méthode.
3. Au premier `push`, si l'authentification manque, l'agent guide vers `gh auth login`.

## Distribuer `workflow.md` en classe

- Remettre à chaque élève **la même version personnalisée** que celle de son dépôt
  (ou lui indiquer qu'elle est déjà dans son dépôt).
- Ne jamais publier les valeurs réelles (`{{ALIAS}}`, `{{URL_DEPOT}}`) sur le site :
  la version publique est `public/workflow.md`, régénérée par `npm run workflow:sync`.
