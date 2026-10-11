# Pilote — valider le flux GitHub sur un seul dépôt

> **But** : vérifier de bout en bout, avec **un seul élève témoin**, que le journal
> `journal/*.json`, le commit par échange et le push fonctionnent — avant de créer les
> 23 dépôts pour la classe. Fichier privé, non publié sur le site.

## Prérequis

- `gh` installé et authentifié : `gh auth status`.
- L'organisation GitHub créée (la création d'une organisation ne se fait pas en ligne
  de commande) : `nsi-xyz-projets` par défaut, ou `--org=…`.
- Node ≥ 22.

## Étapes

1. **Identifiants et fichiers personnalisés** (hors ligne) :
   ```bash
   npm run codes:init        # si codes.csv n'existe pas encore
   npm run classes:init      # remplit .classe/<alias>/ + .classe/index.csv
   ```
2. **Choisir l'élève témoin** : l'alias d'une ligne de `.classe/index.csv`
   (ex. `TM5P-GYZU-T55P`).
3. **Simuler, puis créer UN dépôt** :
   ```bash
   npm run repos:init -- --only=TM5P-GYZU-T55P --dry-run   # montre les commandes
   npm run repos:init -- --only=TM5P-GYZU-T55P             # crée et pousse
   ```
4. **Ajouter le compte témoin** comme membre de l'organisation (ou tester avec ton
   propre compte) pour pouvoir pousser.
5. **Ouvrir OpenCode dans le dépôt** :
   ```bash
   cd .classe/TM5P-GYZU-T55P && opencode
   ```
   Donner un prompt simple (« crée une page d'accueil minimale »), puis vérifier :
   - l'agent a lu/complété `AGENTS.md` ;
   - un fichier `journal/001-….json` est apparu ;
   - un commit a été créé **et poussé** (`git log --oneline`, `git status`).
6. **Vérifier automatiquement** :
   ```bash
   npm run verif:journal -- .classe/TM5P-GYZU-T55P
   ```
   Le rapport doit finir par « ✅ conforme » (schéma respecté, séquences continues,
   un commit par échange).
7. **Contrôler sur GitHub** : le dépôt est **privé**, tu le vois (tu es propriétaire de
   l'organisation), et l'historique compte un commit par échange.

## Critères de réussite

- [ ] Le dépôt privé existe et tu y as accès sans invitation.
- [ ] Chaque échange a produit un `journal/<NNN>-….json` valide.
- [ ] Chaque échange a produit un commit, poussé sur GitHub.
- [ ] `npm run verif:journal -- .classe/<alias>` affiche « ✅ conforme ».

## Si ça coince

| Symptôme | Cause probable | Correctif |
|---|---|---|
| `gh: not logged in` | `gh auth login` non fait | lancer `gh auth login` |
| `push` refusé | authentification Git absente | `gh auth login` (HTTPS) ou clé SSH |
| Pas de fichier `journal/` | l'agent n'a pas suivi `AGENTS.md` | renforcer la consigne de journal dans `AGENTS.md` |
| Commits ≠ échanges | l'agent regroupe les commits | rappeler « un commit par échange » dans `AGENTS.md` |
| Schéma invalide | l'agent a inventé des clés | durcir l'exemple de schéma dans `workflow.md` |
