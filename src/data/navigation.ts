/**
 * Carte du site — une seule source de vérité pour la navigation,
 * le sommaire latéral et les pages « squelette ».
 *
 * Le contenu rédactionnel (M2) remplacera les pages une à une ; tant qu'une
 * page n'a pas son fichier .astro dédié, elle est générée depuis ces données.
 */

export interface NavItem {
  /** Route sans slash initial (peut être imbriquée, ex. « prompts/depot »). */
  slug: string;
  title: string;
  kicker: string;
  lead: string;
  /** Plan de la section, affiché tant que la rédaction n'est pas terminée. */
  planned: string[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const groups: Array<Omit<NavGroup, "items"> & { items: Array<Omit<NavItem, "slug"> & { slug: string }> }> = [
  {
    id: "decouvrir",
    label: "Découvrir",
    items: [
      {
        slug: "workflow",
        title: "Le workflow",
        kicker: "Vue d'ensemble",
        lead: "Un workflow, c'est la chaîne d'étapes qui transforme une idée en site en ligne. Voici celle du projet NSI : du premier prompt à l'URL publique.",
        planned: [
          "La boucle décrire → générer → tester → corriger → livrer",
          "Ce que fait l'IA, ce que fait l'humain",
          "Les cinq étapes appliquées à un exemple complet",
        ],
      },
      {
        slug: "llm",
        title: "L'IA et les modèles",
        kicker: "Comprendre",
        lead: "Un modèle de langage ne « sait » rien : il prédit du texte. Comprendre ce détail change tout dans la façon de lui parler — et de le surveiller.",
        planned: [
          "Tokens, contexte et fenêtre de contexte",
          "Effort et qualité : où placer le curseur",
          "Coûts, heures creuses et calculateur",
        ],
      },
      {
        slug: "prompt",
        title: "Piloter l'agent",
        kicker: "Savoir-faire",
        lead: "Un bon prompt n'est pas une question, c'est une commande : objectif, contexte, contraintes, critère de réussite.",
        planned: [
          "Anatomie d'un prompt qui marche",
          "Itérer : relancer, préciser, corriger",
          "Anti-patterns et pièges fréquents",
          "Constructeur de prompt",
        ],
      },
    ],
  },
  {
    id: "outils",
    label: "Les outils",
    items: [
      {
        slug: "opencode",
        title: "OpenCode",
        kicker: "L'espace de travail",
        lead: "OpenCode est le logiciel dans lequel l'agent travaille : une session, un dossier de projet, des fichiers, des commandes.",
        planned: [
          "Session, dossier de travail et fichiers",
          "Commandes / et mode plan vs mode build",
          "Suivre le coût, /compact, quand relancer",
          "Première session pas à pas",
        ],
      },
      {
        slug: "git-github",
        title: "Git et GitHub",
        kicker: "Garder une trace",
        lead: "Git enregistre l'histoire du projet, GitHub l'héberge. Un dépôt privé protège votre travail — à condition de ne jamais y déposer de secret.",
        planned: [
          "Dépôt, commit, push : le vocabulaire",
          "Créer un dépôt privé",
          ".gitignore et secrets",
          "Relire l'historique, revenir en arrière",
        ],
      },
      {
        slug: "cloudflare",
        title: "Cloudflare Pages",
        kicker: "Publier",
        lead: "Cloudflare Pages transforme un dépôt en site public. C'est l'étape qui met votre travail sous les yeux du monde.",
        planned: [
          "Comment un site arrive en ligne",
          "Déployer depuis un dépôt",
          "URL de test et URL publique",
          "Lire un échec de déploiement",
        ],
      },
    ],
  },
  {
    id: "pratique",
    label: "Mettre en pratique",
    items: [
      {
        slug: "prompts",
        title: "La promptothèque",
        kicker: "Banque de prompts",
        lead: "Des prompts prêts à copier, classés par intention : créer, corriger, vérifier, déployer. Chacun est expliqué, aucun n'est magique.",
        planned: [
          "Prompts de démarrage",
          "Prompts de correction et de débogage",
          "Prompts de vérification et de relecture",
          "Comment adapter un prompt modèle",
        ],
      },
      {
        slug: "prompts/depot",
        title: "Déposer un prompt",
        kicker: "Votre journal",
        lead: "Chaque prompt envoyé à l'agent se dépose ici avec votre code anonyme : c'est la trace de votre travail et la preuve que vous avez piloté.",
        planned: [
          "Pourquoi journaliser ses prompts",
          "Déposer : code, mission, prompt",
          "Ce que deviennent vos prompts",
        ],
      },
      {
        slug: "missions",
        title: "Missions guidées",
        kicker: "Pas à pas",
        lead: "Des parcours ordonnés pour prendre en main chaque outil, avec des check-lists pour vérifier soi-même qu'on a compris.",
        planned: [
          "Mission 1 — premier contact avec l'agent",
          "Mission 2 — dépôt et publication",
          "Mission 3 — le projet final",
        ],
      },
      {
        slug: "quiz",
        title: "Quiz",
        kicker: "Vérifier",
        lead: "Des questions courtes pour s'assurer que rien n'est flou — avec une explication pour chaque réponse.",
        planned: [
          "Quiz outils : agent, dépôt, déploiement",
          "Quiz sécurité : secrets et permissions",
          "Quiz prompts : choisir la bonne formulation",
        ],
      },
      {
        slug: "depannage",
        title: "Dépannage",
        kicker: "Messages d'erreur",
        lead: "Les erreurs les plus fréquentes, traduites en français, avec la marche à suivre pour s'en sortir seul.",
        planned: [
          "Erreurs de l'agent et du modèle",
          "Erreurs Git et GitHub",
          "Erreurs Cloudflare",
          "Quand demander de l'aide",
        ],
      },
      {
        slug: "glossaire",
        title: "Glossaire",
        kicker: "Référence",
        lead: "Tous les mots du workflow, définis simplement, avec un exemple quand c'est utile.",
        planned: [
          "IA, agent, prompt, contexte",
          "Dépôt, commit, push, branche",
          "Build, déploiement, environnement, secret",
        ],
      },
    ],
  },
  {
    id: "securite",
    label: "Sécurité",
    items: [
      {
        slug: "securite",
        title: "Sécurité",
        kicker: "À ne pas rater",
        lead: "Une clé exposée, un dépôt privé partagé, un prompt qui exécute n'importe quoi : les accidents arrivent vite. Voici comment les éviter et quoi faire quand c'est trop tard.",
        planned: [
          "Secrets, .env et historique Git",
          "« Privé » ne veut pas dire « secret »",
          "L'agent exécute ce qu'on lui demande",
          "Que faire en cas de fuite",
          "Jeu : trouvez la fuite",
        ],
      },
    ],
  },
  {
    id: "projet",
    label: "Le projet",
    items: [
      {
        slug: "projet",
        title: "Le projet final",
        kicker: "Objectif",
        lead: "Le sujet sera révélé le lundi de la dernière semaine avant les vacances de la Toussaint, à 8 h 42. D'ici là, tout ce qu'il faut maîtriser est sur ce site.",
        planned: [
          "Le sujet (verrouillé jusqu'à la révélation)",
          "Le rendu attendu",
          "Les règles du jeu",
          "Les critères d'évaluation",
        ],
      },
      {
        slug: "prof",
        title: "Espace prof",
        kicker: "Réservé",
        lead: "Lecture des prompts déposés par la classe, filtres et export. Accès protégé par mot de passe.",
        planned: [
          "Connexion",
          "Liste et filtres des dépôts",
          "Export CSV",
        ],
      },
    ],
  },
];

export const navGroups: NavGroup[] = groups;
export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);

/** Liens affichés dans l'en-tête (le reste vit dans le menu et le sommaire). */
export const primaryNav = [
  { href: "/workflow", label: "Workflow" },
  { href: "/opencode", label: "OpenCode" },
  { href: "/prompts", label: "Promptothèque" },
  { href: "/securite", label: "Sécurité" },
  { href: "/projet", label: "Projet" },
];

/** Les cinq étapes du workflow, fil conducteur du site. */
export const workflowSteps = [
  {
    title: "Espace de travail",
    text: "Ouvrir OpenCode, choisir un dossier, lancer une session : l'agent travaille dans un dossier, pas « dans le cloud ».",
    href: "/opencode",
  },
  {
    title: "Piloter l'IA",
    text: "Décrire ce qu'on veut, itérer, relire. Le prompt est une commande : objectif, contexte, contraintes.",
    href: "/prompt",
  },
  {
    title: "Garder une trace",
    text: "Enregistrer chaque version avec Git, héberger le tout dans un dépôt GitHub privé.",
    href: "/git-github",
  },
  {
    title: "Publier",
    text: "Déployer le projet sur Cloudflare Pages et obtenir une URL publique à partager.",
    href: "/cloudflare",
  },
  {
    title: "Journaliser",
    text: "Déposer les prompts utilisés sur ce site : c'est la preuve du travail et la mémoire du projet.",
    href: "/prompts/depot",
  },
];

export function pathOf(item: NavItem): string {
  return `/${item.slug}`;
}
