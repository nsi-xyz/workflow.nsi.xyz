/**
 * Données de la section « Git et GitHub ».
 * Le vocabulaire est volontairement imagé : c'est la partie qui débloque tout
 * le reste pour un débutant.
 */

export interface Mot {
  terme: string;
  image: string;
  definition: string;
}

export const vocabulaire: Mot[] = [
  {
    terme: "Dépôt (repository)",
    image: "L'album photo du projet",
    definition:
      "Le dossier surveillé par Git, avec tout son historique. Localement, c'est le dossier du projet plus un dossier caché .git.",
  },
  {
    terme: "Commit",
    image: "Une photo de l'état du projet",
    definition:
      "Un point de retour daté, avec un message et un auteur. On peut revenir à n'importe quelle photo, comparer deux photos, comprendre ce qui a changé.",
  },
  {
    terme: "GitHub",
    image: "Le cloud de l'album",
    definition:
      "Un site qui héberge des dépôts Git. Le projet peut y être privé (personne d'autre ne le voit) ou public.",
  },
  {
    terme: "Push",
    image: "Envoyer les nouvelles photos",
    definition:
      "Transférer ses commits locaux vers GitHub. Tant qu'on n'a pas poussé, le travail n'existe que sur sa machine.",
  },
  {
    terme: "Pull",
    image: "Récupérer les photos des autres",
    definition:
      "Faire venir sur sa machine les commits publiés sur GitHub. Utile quand on travaille à plusieurs ou sur deux postes.",
  },
  {
    terme: "Clone",
    image: "Télécharger tout l'album",
    definition:
      "Copier un dépôt existant (avec son historique) depuis GitHub. C'est ainsi qu'un professeur peut relire le projet d'un élève.",
  },
  {
    terme: "Branche",
    image: "Une pellicule parallèle",
    definition:
      "Une ligne de développement indépendante. Un projet d'élève vit très bien sur une seule branche : main.",
  },
  {
    terme: "Origine (origin)",
    image: "L'adresse de l'album en ligne",
    definition:
      "Le nom donné au dépôt distant auquel on pousse. Par convention : origin. On le relie une fois avec git remote add.",
  },
];

export interface CommandeGit {
  commande: string;
  effet: string;
  quand: string;
}

export const commandesGit: CommandeGit[] = [
  {
    commande: "git init",
    effet: "Créer le dépôt dans le dossier courant (une seule fois, au début).",
    quand: "Avant la première ligne de code — pour que /undo fonctionne.",
  },
  {
    commande: "git status",
    effet: "Afficher l'état : fichiers modifiés, préparés, non suivis.",
    quand: "Tout le temps. C'est la commande qu'on tape quand on est perdu.",
  },
  {
    commande: "git diff",
    effet: "Montrer exactement ce qui a changé depuis le dernier commit.",
    quand: "Avant de committer, pour relire ce qu'on envoie.",
  },
  {
    commande: "git add <fichier>",
    effet: "Préparer un fichier (ou un dossier) pour le prochain commit.",
    quand: "Après avoir vérifié son contenu. git add -A prépare tout.",
  },
  {
    commande: 'git commit -m "message"',
    effet: "Enregistrer un point de retour avec un message qui explique le changement.",
    quand: "Dès qu'une étape fonctionne — pas à la fin du projet.",
  },
  {
    commande: "git log --oneline",
    effet: "Relire l'historique : une ligne par commit.",
    quand: "Pour retrouver un état ou comprendre d'où l'on vient.",
  },
  {
    commande: "git restore <fichier>",
    effet: "Annuler les modifications en cours d'un fichier (retour au dernier commit).",
    quand: "Quand une intuition ne mène nulle part.",
  },
  {
    commande: "git remote add origin <url>",
    effet: "Relier le dépôt local à son homologue GitHub (une seule fois).",
    quand: "Juste après la création du dépôt GitHub.",
  },
  {
    commande: "git push",
    effet: "Envoyer les commits locaux sur GitHub.",
    quand: "À la fin d'une séance de travail, et avant d'aller dormir.",
  },
  {
    commande: "git pull",
    effet: "Récupérer les commits présents sur GitHub mais pas chez vous.",
    quand: "En début de séance, quand on a travaillé ailleurs.",
  },
  {
    commande: "git clone <url>",
    effet: "Copier un dépôt GitHub complet (historique compris) sur la machine.",
    quand: "Pour relire le projet, ou changer d'ordinateur.",
  },
];

export interface MessageCommit {
  mauvais: string;
  bon: string;
  pourquoi: string;
}

export const messagesCommit: MessageCommit[] = [
  {
    mauvais: "maj",
    bon: "Ajoute la section « horaires » avec un tableau à deux colonnes",
    pourquoi: "Dans six mois, « maj » ne dira rien à personne — pas même à vous.",
  },
  {
    mauvais: "test",
    bon: "Corrige le débordement du titre sur téléphone",
    pourquoi: "Un message décrit le changement, pas l'humeur du moment.",
  },
  {
    mauvais: "ça marche pas mais j'ai essayé des trucs",
    bon: "Restaure l'état qui fonctionnait avant la modification du thème",
    pourquoi: "Même un retour en arrière est une décision qu'il faut savoir relire.",
  },
  {
    mauvais: "modifs de la journée",
    bon: "Initialise le projet Astro, le .gitignore et le README",
    pourquoi: "Un commit = une idée. La formule : verbe à l'impératif + objet + raison si utile.",
  },
];

export interface Interdit {
  element: string;
  raison: string;
}

export const interdits: Interdit[] = [
  { element: ".env et tout fichier de clés", raison: "Un secret dans un dépôt est un secret perdu (voir Sécurité)." },
  { element: "Les codes d'accès des élèves", raison: "Même anonymes, ils ouvrent l'accès au dépôt de prompts." },
  { element: "Les données personnelles", raison: "Noms, téléphones, adresses, photos : jamais dans un dépôt ni dans un prompt." },
  { element: "node_modules/ et dist/", raison: "Reconstructibles depuis le projet : ils alourdissent le dépôt pour rien." },
  { element: "Les fichiers énormes (vidéos, images non optimisées)", raison: "Git garde tout : un dépôt lourd reste lourd, pour toujours." },
];

export interface CycleEtape {
  titre: string;
  texte: string;
}

export const cycleDeTravail: CycleEtape[] = [
  {
    titre: "Modifier",
    texte: "On demande une petite évolution à l'agent (une intention, pas trois).",
  },
  {
    titre: "Tester",
    texte: "On regarde le résultat dans le navigateur. Si c'est cassé : /undo ou correction ciblée.",
  },
  {
    titre: "Relire",
    texte: "git status puis git diff : quels fichiers ont changé, et est-ce bien ce qu'on voulait ?",
  },
  {
    titre: "Committer",
    texte: 'git add puis git commit -m "verbe + objet" : un point de retour bien nommé.',
  },
  {
    titre: "Pousser",
    texte: "git push : le travail quitte la machine et devient récupérable.",
  },
];

export interface PiegeGit {
  titre: string;
  texte: string;
}

export const piegesGit: PiegeGit[] = [
  {
    titre: "Committer avant d'avoir écrit le .gitignore",
    texte:
      "Le .env part dans le premier commit : il est désormais dans l'historique. La clé doit être tournée (procédure en cas de fuite).",
  },
  {
    titre: "git add -A sans regarder git status",
    texte:
      "On envoie aussi les fichiers de brouillon, les captures, parfois une sauvegarde de .env. Regardez toujours la liste avant de valider.",
  },
  {
    titre: "Travailler hors du dépôt",
    texte:
      "« Mes commits ne partent pas » : le plus souvent, le terminal n'est pas dans le bon dossier. git status affiche alors une erreur de dépôt — c'est le signal.",
  },
  {
    titre: "Croire que Git sauvegarde tout seul",
    texte:
      "Git enregistre seulement ce qu'on lui demande : un fichier modifié et jamais committé n'existe pas dans l'historique.",
  },
  {
    titre: "Pousser un dépôt privé… puis le rendre public par erreur",
    texte:
      "La publication d'un dépôt est un clic : relisez la checklist avant chaque changement de visibilité.",
  },
  {
    titre: "Push refusé pour authentification",
    texte:
      "GitHub n'accepte plus le mot de passe du compte en ligne de commande : il faut une clé SSH ou un jeton à portée limitée. Ce n'est pas une panne.",
  },
];
