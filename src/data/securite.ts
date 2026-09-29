/**
 * Données du jeu « trouvez la fuite » (section Sécurité).
 *
 * Chaque situation est un extrait de fichier plausible. L'élève décide s'il
 * s'agit d'une fuite de secret ou non, puis lit l'explication.
 * Les tests garantissent que les données restent cohérentes (au moins un vrai
 * secret, au moins un faux positif, une explication pour chaque item).
 */

export interface LeakSituation {
  id: string;
  file: string;
  code: string;
  /** true = ce contenu est une fuite à ne jamais publier. */
  isLeak: boolean;
  why: string;
}

export const leakSituations: LeakSituation[] = [
  {
    id: "env-commit",
    file: ".env",
    code: "DEEPSEEK_API_KEY=sk-9f2c…\nCLOUDFLARE_API_TOKEN=cfut_4b1e…",
    isLeak: true,
    why: "Un fichier .env poussé sur GitHub donne la clé à tout le monde : les robots qui scannent GitHub en trouvent en quelques minutes. Ce fichier ne doit jamais être suivi par Git, et la clé doit être tournée dès qu'elle a été exposée.",
  },
  {
    id: "gitignore-ok",
    file: ".gitignore",
    code: ".env\n.env.*\n!.env.example\n.dev.vars",
    isLeak: false,
    why: "C'est la protection : le fichier .env est ignoré par Git. Le motif !.env.example autorise seulement le modèle, qui ne contient aucune valeur. La règle s'écrit AVANT le premier commit.",
  },
  {
    id: "readme-curl",
    file: "README.md",
    code: 'curl https://api.deepseek.com -H "Authorization: Bearer sk-9f2c…"',
    isLeak: true,
    why: "Exemple copié-collé d'une vraie commande avec la vraie clé : le README est public, la clé l'est aussi. Dans une documentation, on écrit <votre-clé> à la place, jamais une valeur réelle.",
  },
  {
    id: "config-ts",
    file: "src/config.ts",
    code: 'export const CLOUDFLARE_TOKEN = "cfut_4b1e…";\nexport const API_URL = "https://api.exemple.fr";',
    isLeak: true,
    why: "Un secret codé en dur dans un fichier source est dans le dépôt, donc dans l'historique, même si on le retire ensuite. Les secrets vivent dans .env (local) ou dans les variables d'environnement de la plateforme (déployé).",
  },
  {
    id: "html-link",
    file: "src/pages/index.astro",
    code: '<a href="https://mon-projet.pages.dev">Voir mon site</a>',
    isLeak: false,
    why: "Une URL publique n'est pas un secret : au contraire, elle est faite pour être partagée. Attention simplement à ne pas partager une URL de test qui afficherait des données internes.",
  },
  {
    id: "notes-perso",
    file: "notes.txt",
    code: "Groupe 3 : Lina, 06 12 34 56 78, née le 12/03/2010 — compte rendu à rendre",
    isLeak: true,
    why: "Des données personnelles (nom, téléphone, date de naissance) n'ont rien à faire dans un dépôt, même privé, et encore moins dans un prompt envoyé à une IA. C'est la base du RGPD : on collecte le minimum, et jamais dans un outil non maîtrisé.",
  },
  {
    id: "package-json",
    file: "package.json",
    code: '{ "dependencies": { "astro": "^7.3.5", "tailwindcss": "^4.3.3" } }',
    isLeak: false,
    why: "Les noms et versions des dépendances sont publics par nature : ils décrivent les outils utilisés, pas des accès. C'est même une information utile pour reproduire le projet.",
  },
];

export const scoreMessages: Array<{ min: number; max: number; text: string }> = [
  {
    min: 0,
    max: 4,
    text: "Relisez les règles d'or et refaites le jeu : les fuites de secrets sont la première cause de dégâts dans un projet.",
  },
  {
    min: 5,
    max: 6,
    text: "Presque : relisez les explications des items manqués, puis vérifiez votre propre dépôt avec `git check-ignore .env`.",
  },
  {
    min: 7,
    max: 7,
    text: "Parfait. Avant chaque commit, relisez la checklist « avant de publier » : ce sont vos réflexes de professionnel.",
  },
];
