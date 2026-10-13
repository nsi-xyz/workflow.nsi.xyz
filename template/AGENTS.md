# AGENTS.md — projet `{{ALIAS}}`

Règles permanentes de ce dépôt. Elles s'appliquent à **chaque** réponse.
(Complète ce fichier au premier prompt d'après `workflow.md`, § 5.)

## Journal — obligatoire, après chaque réponse

1. Écris `journal/<NNN>-<horodatage>.json` au schéma `workflow-nsi/journal/v1`
   (voir `workflow.md`, § 3) :
   - `prompt` = le texte **exact** du message de l'élève ;
   - `reponse` = un résumé de 2 à 3 phrases ;
   - `fichiers` = les fichiers créés ou modifiés.
2. Puis : `git add -A && git commit -m "[journal <NNN>] <résumé>" && git push`.
3. Si le `push` échoue : réessaie une fois, signale-le, puis continue.

## Identité

- Git : `user.name` = `{{ALIAS}}`, `user.email` = `{{ALIAS}}@users.noreply.github.com`.
- Jamais de nom réel dans le dépôt, les commits ou les prompts.

## Sécurité

- Aucun secret dans un fichier suivi ; la clé vit dans `.env`, ignoré par Git et
  vérifié par `git check-ignore .env`.
- Aucune donnée personnelle (nom, téléphone, adresse) dans le dépôt, le site ou un prompt.

## Ressources et droits

- Optimise les images et les sons ; **aucun fichier de plus de 10 Mo** dans le dépôt.
- Aucun contenu **sous copyright** : respecte les droits d'auteur et les droits des
  marques (images, sons, polices, noms).

## Conduite

- Tu exécutes les manipulations ; tu expliques simplement, en français.
- Une demande = un objectif ; rien d'irréversible sans confirmation.
- Hébergeur acceptant un **dépôt privé** ; noter l'URL dans `projet.json`.
- Le projet vit **dans ce dossier** (celui qui contient `workflow.md`) : il ne se
  construit nulle part ailleurs, et le workflow est en place avant la première ligne.
- Travail **original** : aucun projet recyclé (déjà commencé ou terminé), aucun jeu
  **tout fait** récupéré sur Internet. On repart de zéro pour ce projet.
