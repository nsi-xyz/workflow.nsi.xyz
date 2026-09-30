/**
 * Données de la section « Dépannage » : erreurs fréquentes, traduites en actions.
 * Chaque entrée suit la même logique : le message brut, ce qu'il dit vraiment,
 * la correction, puis comment l'éviter la prochaine fois.
 */

export interface Panne {
  id: string;
  famille: string;
  message: string;
  traduction: string;
  correction: string;
  prevention: string;
}

export const famillesPannes: string[] = [
  "Agent et modèle",
  "Git et GitHub",
  "Cloudflare Pages",
  "Projet et serveur",
];

export const pannes: Panne[] = [
  {
    id: "cle-refusee",
    famille: "Agent et modèle",
    message: "401 Unauthorized — Invalid API key",
    traduction: "La clé d'API est absente, mal collée, ou révoquée.",
    correction:
      "Refaire /connect en recollant la clé (elle commence par sk- et ne s'affiche qu'une fois). Vérifier qu'aucun espace ne s'est glissé au début ou à la fin.",
    prevention:
      "Coller la clé immédiatement après sa création, et la stocker dans le gestionnaire de mots de passe du compte, pas dans un fichier du projet.",
  },
  {
    id: "solde-epuise",
    famille: "Agent et modèle",
    message: "Insufficient Balance — 402",
    traduction: "Le crédit du compte est épuisé : le modèle ne répond plus.",
    correction:
      "Recharger le compte (quelques euros suffisent largement), puis vérifier la consommation des dernières sessions.",
    prevention:
      "Surveiller le coût d'une session de temps en temps, compacter les longues sessions, et préférer les heures creuses.",
  },
  {
    id: "mauvais-dossier",
    famille: "Agent et modèle",
    message: "L'agent ne trouve pas les fichiers du projet",
    traduction: "Le terminal n'est pas ouvert dans le dossier du projet.",
    correction:
      "Quitter OpenCode (ou ouvrir un nouveau terminal), se placer dans le bon dossier, relancer la commande.",
    prevention: "Vérifier le dossier AVANT la première demande : c'est le réflexe le plus rentable.",
  },
  {
    id: "agent-en-rond",
    famille: "Agent et modèle",
    message: "L'agent répète les mêmes corrections sans succès",
    traduction: "Le contexte est trop long ou la demande trop large : il tourne en rond.",
    correction:
      "Compacter la session (/compact), ou en démarrer une neuve (/new) avec une demande plus petite et un critère de réussite précis.",
    prevention:
      "Une intention par message, un test après chaque modification, et une session neuve par grande étape du projet.",
  },
  {
    id: "fichier-inconnu",
    famille: "Agent et modèle",
    message: "« Je ne vois pas de fichier de ce nom »",
    traduction: "L'agent n'a pas lu ce fichier : il ne connaît que ce qu'on lui montre.",
    correction: "Joindre le fichier dans le message avec @, ou demander à l'agent de le lire.",
    prevention: "Citer les chemins dans la demande : « la page src/pages/index.astro ».",
  },
  {
    id: "cout-explose",
    famille: "Agent et modèle",
    message: "La session a coûté beaucoup plus que prévu",
    traduction: "Le contexte relu à chaque tour a grossi, et la réflexion est facturée en sortie.",
    correction:
      "Compacter, repartir d'une session neuve, et réserver le mode réflexion aux problèmes difficiles.",
    prevention:
      "Suivre le coût en direct, ne pas laisser une session ouverte des heures, et poser des questions précises.",
  },
  {
    id: "not-a-repo",
    famille: "Git et GitHub",
    message: "fatal: not a git repository",
    traduction: "Le dossier courant n'est pas un dépôt Git — soit pas de git init, soit mauvais dossier.",
    correction: "Vérifier le dossier, puis lancer git init s'il n'a jamais été initialisé.",
    prevention: "Lancer git init en tout début de projet, et vérifier avec git status.",
  },
  {
    id: "auth-supprimee",
    famille: "Git et GitHub",
    message: "Support for password authentication was removed",
    traduction: "GitHub n'accepte plus le mot de passe du compte en ligne de commande.",
    correction:
      "Configurer une clé SSH (ssh-keygen puis ajout de la clé publique sur GitHub) ou utiliser gh auth login.",
    prevention: "Faire cette configuration une fois, au début du projet, et la noter dans le README.",
  },
  {
    id: "push-rejete",
    famille: "Git et GitHub",
    message: "Updates were rejected… non-fast-forward",
    traduction: "Les historiques ont divergé : le dépôt GitHub contient des commits que vous n'avez pas.",
    correction:
      "Récupérer d'abord (git pull --rebase), résoudre les conflits éventuels, puis pousser. Si l'historique distant est vide ou faux, le cas classique est un README créé en cochant une case à la création du dépôt.",
    prevention:
      "Créer le dépôt GitHub VIDE (aucune case cochée) quand le projet local existe déjà.",
  },
  {
    id: "pas-de-push",
    famille: "Git et GitHub",
    message: "« Mes fichiers n'apparaissent pas sur GitHub »",
    traduction: "Les commits existent en local mais n'ont pas été poussés, ou vers un autre dépôt.",
    correction: "git push, puis vérifier l'adresse du dépôt distant avec git remote -v.",
    prevention: "Terminer chaque séance par git push, et vérifier la page GitHub une fois par jour.",
  },
  {
    id: "env-committe",
    famille: "Git et GitHub",
    message: "« J'ai poussé mon fichier .env par erreur »",
    traduction: "Le secret est public et restera lisible dans l'historique.",
    correction:
      "Tourner la clé immédiatement (révoquer puis recréer), retirer le fichier du suivi, écrire le .gitignore, puis nettoyer l'historique si nécessaire.",
    prevention:
      "Écrire le .gitignore avant le premier commit, et vérifier avec git check-ignore .env.",
  },
  {
    id: "build-echoue",
    famille: "Cloudflare Pages",
    message: "Build failed / « Output directory dist not found »",
    traduction: "La compilation en ligne a échoué, ou le dossier de sortie déclaré n'existe pas.",
    correction:
      "Ouvrir le journal du build, remonter à la PREMIÈRE erreur, puis la reproduire en local avec npm run build. Vérifier la commande de build et le dossier de sortie (dist).",
    prevention:
      "Toujours lancer npm run build soi-même avant de pousser ; déclarer NODE_VERSION=22 pour coller à la machine locale.",
  },
  {
    id: "domaine-pending",
    famille: "Cloudflare Pages",
    message: "Le domaine personnalisé reste en « pending »",
    traduction: "Le domaine est rattaché mais l'enregistrement DNS n'existe pas encore.",
    correction:
      "Créer soi-même un enregistrement CNAME du domaine vers projet.pages.dev, en mode proxied. Le certificat HTTPS est ensuite émis automatiquement.",
    prevention:
      "Rattacher le domaine et créer le CNAME dans la même séance, puis vérifier le statut avant d'annoncer l'adresse.",
  },
  {
    id: "route-404",
    famille: "Cloudflare Pages",
    message: "404 Not Found sur une page qui existe en local",
    traduction: "La page n'a pas été générée, ou son adresse diffère (barre oblique finale, majuscules).",
    correction:
      "Comparer l'adresse locale et l'adresse publique caractère par caractère. Regénérer le build et vérifier la liste des pages produites.",
    prevention:
      "Utiliser des noms de fichiers en minuscules, sans espace ni accent, et tester les liens depuis la page d'accueil.",
  },
  {
    id: "port-occupe",
    famille: "Projet et serveur",
    message: "Port 4321 is in use, trying another one…",
    traduction: "Un autre projet tourne déjà sur le port par défaut : votre serveur change de port en silence.",
    correction:
      "Arrêter l'autre serveur, ou donner un port stable au projet (DEV_PORT dans .env) et rouvrir le terminal.",
    prevention:
      "Un port par projet, inscrit dans .env ; et vérifier l'adresse réelle avant de partager un lien de test.",
  },
  {
    id: "node-version",
    famille: "Projet et serveur",
    message: "npm test échoue selon le terminal / wrangler exige Node 22",
    traduction: "Le terminal n'utilise pas la même version de Node : les outils ne se comportent pas pareil.",
    correction:
      "Utiliser les lanceurs du projet (scripts/run-with-node22.mjs), ou activer Node 22 dans le shell courant.",
    prevention:
      "Laisser les scripts du projet choisir la version : npm test et npm run dev s'en occupent.",
  },
  {
    id: "asset-introuvable",
    famille: "Projet et serveur",
    message: "Une image ou un lien ne s'affiche pas en ligne (mais en local, si)",
    traduction: "Le chemin diffère par une majuscule, un accent ou un espace — invisible sur Windows, fatal sur le serveur.",
    correction:
      "Renommer le fichier en minuscules, sans accent ni espace, puis corriger le lien et repousser.",
    prevention:
      "Adopter une convention de noms dès le début : minuscules, tirets, pas d'accents dans les fichiers du site.",
  },
];
