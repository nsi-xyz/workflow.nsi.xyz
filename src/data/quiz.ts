/**
 * Quiz — questions courtes, avec explication systématique.
 * Trois réponses possibles par question, une seule correcte : on vérifie la
 * compréhension, pas la rapidité.
 */

export interface QuestionQuiz {
  id: string;
  theme: string;
  question: string;
  options: string[];
  /** Index de la bonne réponse dans `options`. */
  bonne: number;
  explication: string;
}

export const themesQuiz: string[] = [
  "Agent et IA",
  "Git et GitHub",
  "Sécurité",
  "Publication",
];

export const questions: QuestionQuiz[] = [
  {
    id: "llm-role",
    theme: "Agent et IA",
    question: "Que fait réellement un modèle de langage quand il répond ?",
    options: [
      "Il cherche la réponse dans une base de données vérifiée",
      "Il prédit la suite de texte la plus plausible",
      "Il recopie les réponses d'autres utilisateurs",
    ],
    bonne: 1,
    explication:
      "Il calcule des probabilités sur du texte. D'où deux conséquences : il peut se tromper avec assurance, et il ne connaît que le contexte qu'on lui envoie.",
  },
  {
    id: "mode-plan",
    theme: "Agent et IA",
    question: "À quoi sert le mode plan d'OpenCode ?",
    options: [
      "À faire réfléchir le modèle plus longtemps",
      "À proposer une démarche sans modifier aucun fichier",
      "À publier le site en brouillon",
    ],
    bonne: 1,
    explication:
      "En mode plan, l'agent lit et propose, mais n'écrit rien. C'est le garde-fou avant une demande qui touche plusieurs fichiers.",
  },
  {
    id: "cout-source",
    theme: "Agent et IA",
    question: "Qu'est-ce qui fait grimper le coût d'une session ?",
    options: [
      "Le nombre de questions posées",
      "Le contexte relu à chaque tour",
      "La couleur du thème dans le terminal",
    ],
    bonne: 1,
    explication:
      "Chaque tour relit les fichiers et l'historique. Une longue session peut coûter bien plus qu'une question difficile posée une fois.",
  },
  {
    id: "token-def",
    theme: "Agent et IA",
    question: "Un token, c'est…",
    options: ["Un morceau de mot", "Un mot entier", "Une lettre"],
    bonne: 0,
    explication:
      "En français, un token correspond à environ trois ou quatre caractères. C'est l'unité de mesure du modèle, et celle de la facture.",
  },
  {
    id: "compact-def",
    theme: "Agent et IA",
    question: "Que fait la commande /compact ?",
    options: [
      "Elle supprime les fichiers inutiles du projet",
      "Elle résume la conversation pour libérer du contexte",
      "Elle change de modèle",
    ],
    bonne: 1,
    explication:
      "Elle condense l'échange en gardant le fil. Utile quand la session s'alourdit : on continue au lieu de tout recommencer.",
  },
  {
    id: "hallucination",
    theme: "Agent et IA",
    question: "Qu'appelle-t-on une « hallucination » d'IA ?",
    options: [
      "Une panne du réseau",
      "Une réponse fausse mais formulée avec assurance",
      "Un bug de l'éditeur de code",
    ],
    bonne: 1,
    explication:
      "Le modèle invente ce qui est plausible : une fonction qui n'existe pas, une bibliothèque imaginaire. Seul un test prouve que ça fonctionne.",
  },
  {
    id: "arobase",
    theme: "Agent et IA",
    question: "Pourquoi joindre un fichier avec @ dans un message ?",
    options: [
      "Pour que l'agent le lise et le prenne en compte",
      "Pour le sauvegarder sur GitHub",
      "Pour le publier sur le site",
    ],
    bonne: 0,
    explication:
      "L'agent ne connaît que ce qu'il a lu. Le @ ajoute le contenu du fichier au contexte : c'est la façon la plus sûre d'être compris.",
  },
  {
    id: "commit-def",
    theme: "Git et GitHub",
    question: "Un commit, c'est…",
    options: [
      "Une sauvegarde automatique de tout le disque",
      "Une photo de l'état du projet, avec un message",
      "Un dossier envoyé à GitHub",
    ],
    bonne: 1,
    explication:
      "C'est un point de retour daté. Git n'enregistre que ce qu'on lui demande : sans commit, pas de retour en arrière.",
  },
  {
    id: "gitignore-role",
    theme: "Git et GitHub",
    question: "À quoi sert le fichier .gitignore ?",
    options: [
      "À empêcher Git de suivre certains fichiers",
      "À supprimer définitivement des fichiers",
      "À compresser le dépôt pour l'alléger",
    ],
    bonne: 0,
    explication:
      "Il liste ce qui ne doit jamais être enregistré : .env, node_modules/, dist/… Et il s'écrit avant le premier commit, pas après.",
  },
  {
    id: "ou-vit-git",
    theme: "Git et GitHub",
    question: "Où vit le dépôt Git de votre projet ?",
    options: [
      "Uniquement sur GitHub",
      "Sur votre machine ; GitHub en héberge une copie",
      "Dans le navigateur, sous forme de cookie",
    ],
    bonne: 1,
    explication:
      "Git fonctionne sans réseau. GitHub ajoute la sauvegarde, le partage et l'intégration avec Cloudflare Pages.",
  },
  {
    id: "push-def",
    theme: "Git et GitHub",
    question: "Que fait la commande git push ?",
    options: [
      "Elle envoie vos commits locaux vers GitHub",
      "Elle télécharge les commits des autres",
      "Elle installe les dépendances du projet",
    ],
    bonne: 0,
    explication:
      "Tant qu'on n'a pas poussé, le travail n'existe que sur la machine. C'est le geste de fin de séance, celui qui met le projet à l'abri.",
  },
  {
    id: "prive-secret",
    theme: "Git et GitHub",
    question: "Un dépôt « privé » est…",
    options: [
      "Chiffré de bout en bout",
      "Fermé au public, mais pas un coffre-fort",
      "Invisible même pour vous",
    ],
    bonne: 1,
    explication:
      "Il peut devenir public en un clic, un collaborateur peut en copier le contenu, et une capture d'écran contourne tout. Les secrets ne vont dans aucun dépôt.",
  },
  {
    id: "retirer-env",
    theme: "Git et GitHub",
    question: "Vous retirez un fichier .env dans un nouveau commit : que se passe-t-il ?",
    options: [
      "Il disparaît de l'historique",
      "Il reste lisible dans les anciens commits",
      "GitHub prévient automatiquement tous les visiteurs",
    ],
    bonne: 1,
    explication:
      "L'historique conserve tout. C'est pour cela qu'on tourne la clé d'abord, et qu'on purge l'historique ensuite si nécessaire.",
  },
  {
    id: "fuite-premiere-action",
    theme: "Sécurité",
    question: "Une clé d'API a été poussée sur GitHub. Quelle est la première action ?",
    options: [
      "Supprimer le commit",
      "Tourner (révoquer) la clé",
      "Rendre le dépôt privé",
    ],
    bonne: 1,
    explication:
      "La clé est publique dès la seconde où elle a été poussée : des robots la trouvent en quelques minutes. On la révoque, puis on nettoie.",
  },
  {
    id: "donnee-personnelle",
    theme: "Sécurité",
    question: "Laquelle de ces informations est une donnée personnelle ?",
    options: [
      "L'adresse du site publié",
      "Le numéro de téléphone d'un camarade",
      "Le nom du projet",
    ],
    bonne: 1,
    explication:
      "Nom, téléphone, adresse, photo, date de naissance, notes : tout cela est protégé par le RGPD et n'a rien à faire dans un dépôt ni dans un prompt.",
  },
  {
    id: "env-chmod",
    theme: "Sécurité",
    question: "Comment doit vivre le fichier .env sur votre machine ?",
    options: [
      "Ignoré par Git et lisible par vous seul",
      "Poussé sur GitHub pour la sauvegarde",
      "Placé dans le dossier public du site",
    ],
    bonne: 0,
    explication:
      "Ignoré par Git, protégé en permissions (chmod 600), et jamais copié dans un dossier publié. Le modèle .env.example, lui, peut être commité : il ne contient aucune valeur.",
  },
  {
    id: "prompt-secret",
    theme: "Sécurité",
    question: "Que peut-on écrire dans un prompt envoyé à l'agent ?",
    options: [
      "Une clé d'API, si c'est pour l'aider à se connecter",
      "Uniquement ce qu'on accepterait de voir publié",
      "Le mot de passe du site, en le mettant entre guillemets",
    ],
    bonne: 1,
    explication:
      "Un prompt peut être conservé et analysé par le service. Il n'est pas un espace privé : aucun secret, aucune donnée personnelle.",
  },
  {
    id: "prof-mot-de-passe",
    theme: "Sécurité",
    question: "Où doit être rangé le mot de passe de l'espace prof ?",
    options: [
      "Dans un fichier du dépôt, pour ne pas l'oublier",
      "Dans les variables secrètes de la plateforme, et dans un fichier local non publié",
      "Dans le README, en tout petit",
    ],
    bonne: 1,
    explication:
      "Un secret de déploiement vit dans les réglages de l'hébergeur (et dans .dev.vars pour le développement local). Le dépôt n'en contient jamais.",
  },
  {
    id: "build-def",
    theme: "Publication",
    question: "À quoi sert le build (npm run build) ?",
    options: [
      "À publier le site sur Internet",
      "À transformer les sources en fichiers prêts à être servis",
      "À installer Node sur le serveur",
    ],
    bonne: 1,
    explication:
      "Le build compile : sources Astro et styles deviennent du HTML et du CSS, rangés dans dist/. La publication, elle, met ce résultat en ligne.",
  },
  {
    id: "cname-pending",
    theme: "Publication",
    question: "Pourquoi un domaine personnalisé reste-t-il en « pending » sur Cloudflare Pages ?",
    options: [
      "Parce que le certificat met vingt-quatre heures",
      "Parce que l'enregistrement DNS (CNAME) n'a pas été créé",
      "Parce qu'il faut payer une option",
    ],
    bonne: 1,
    explication:
      "Rattacher le domaine ne suffit pas : Cloudflare ne crée pas le CNAME tout seul. On l'ajoute en mode proxied, et le certificat est émis ensuite.",
  },
  {
    id: "statique-limite",
    theme: "Publication",
    question: "Que ne peut pas faire un site statique tout seul ?",
    options: [
      "Afficher des images",
      "Enregistrer des données envoyées par un visiteur",
      "Être accessible sur téléphone",
    ],
    bonne: 1,
    explication:
      "Un site statique sert des fichiers préparés : pas de base de données, pas de calcul serveur. Pour enregistrer un formulaire, il faut des Pages Functions.",
  },
  {
    id: "avant-deployer",
    theme: "Publication",
    question: "Que fait-on avant de publier une nouvelle version ?",
    options: [
      "Lancer le build en local et vérifier le rendu",
      "Publier, puis corriger les erreurs en ligne",
      "Changer de navigateur pour être sûr",
    ],
    bonne: 0,
    explication:
      "Un projet qui ne compile pas chez vous ne compilera pas dans le nuage. On vérifie localement, puis on publie.",
  },
  {
    id: "url-partage",
    theme: "Publication",
    question: "Quelle adresse partage-t-on avec la classe ?",
    options: [
      "L'URL de prévisualisation de la branche en cours",
      "L'URL de production du site",
      "L'adresse IP de la machine de développement",
    ],
    bonne: 1,
    explication:
      "L'URL de prévisualisation correspond à un état temporaire. On partage l'adresse de production, vérifiée depuis un autre appareil.",
  },
];
