/**
 * Données de la page « Coûts et budget ».
 *
 * Synthèse d'un document de cours distribué en classe. Les tarifs sont
 * relevés au 30/09/2026, en dollars US, et évoluent vite : la page invite à
 * vérifier les pages officielles avant tout achat.
 */

export interface LigneOutil {
  outil: string;
  role: string;
}

/** Ce qui ne coûte rien pour le projet. */
export const gratuits: LigneOutil[] = [
  {
    outil: "GitHub",
    role: "Héberger le dépôt privé du projet. Gratuit pour un dépôt d'élève, sans limite gênante.",
  },
  {
    outil: "Cloudflare Pages",
    role: "Publier le site ou le jeu à une URL publique, avec HTTPS. Gratuit à cette échelle.",
  },
  {
    outil: "OpenCode (le logiciel)",
    role: "Le harnais d'agent : gratuit et open source. C'est l'outil, pas la fourniture de jetons.",
  },
  {
    outil: "Git et Markdown",
    role: "Les formats et outils du travail : libres, gratuits, installés avec le projet.",
  },
];

/** Ce qui n'est pas demandé, et qu'il ne faut donc pas payer. */
export const nonNecessaires: LigneOutil[] = [
  {
    outil: "Claude.ai, ChatGPT et autres assistants",
    role: "Le projet utilise OpenCode et un modèle choisi en classe. Aucun abonnement à un assistant en ligne n'est demandé.",
  },
  {
    outil: "Un compte payant GitHub",
    role: "Le plan gratuit suffit : le dépôt privé n'est pas une offre payante.",
  },
  {
    outil: "Un hébergement classique",
    role: "Cloudflare Pages remplace serveur, nom de domaine payant et certificat.",
  },
];

export interface Poste {
  titre: string;
  texte: string;
}

export const postes: Poste[] = [
  {
    titre: "Entrée",
    texte: "Ce que l'on envoie au modèle : la consigne, le contexte du projet, les fichiers lus.",
  },
  {
    titre: "Sortie",
    texte: "Ce que le modèle rédige. C'est le poste le plus cher, token pour token.",
  },
  {
    titre: "Cache",
    texte:
      "Le contexte déjà lu que le modèle relit à chaque tour. Il est facturé une fraction du prix d'entrée, souvent 10 à 50 fois moins cher.",
  },
];

export const ideeCle =
  "Dans un agent de code, 80 à 90 % des jetons sont des relectures de cache. C'est donc le tarif du cache, plus que le prix d'entrée, qui décide de la facture réelle.";

export interface LigneHoraire {
  jour: string;
  plage: string;
  tarif: string;
  creux: boolean;
}

export const heuresParis: LigneHoraire[] = [
  { jour: "Lundi → Vendredi", plage: "00:00 – 03:00", tarif: "−50 % (creuses)", creux: true },
  { jour: "Lundi → Vendredi", plage: "03:00 – 06:00", tarif: "plein tarif", creux: false },
  { jour: "Lundi → Vendredi", plage: "06:00 – 08:00", tarif: "−50 % (creuses)", creux: true },
  { jour: "Lundi → Vendredi", plage: "08:00 – 12:00", tarif: "plein tarif", creux: false },
  { jour: "Lundi → Vendredi", plage: "12:00 – 24:00", tarif: "−50 % (creuses)", creux: true },
  { jour: "Samedi & Dimanche", plage: "toute la journée", tarif: "−50 % (creuses)", creux: true },
];

export const heuresNote =
  "Heures exprimées à l'heure de Paris, en heure d'été (UTC+2). En heure d'hiver, retirez une heure : les heures pleines passent à 02:00–05:00 et 07:00–11:00. Pour un projet mené en classe ou en vacances, l'après-midi (12:00–24:00) est déjà à moitié prix.";

export interface Plan {
  nom: string;
  prix: string;
  ratio: string;
  deepseek: string;
  luna: string;
  cleApi: string;
  opencode: string;
  recommande?: boolean;
}

export const plans: Plan[] = [
  {
    nom: "OpenCode Go",
    prix: "10 $/mois",
    ratio: "×6",
    deepseek: "60 $",
    luna: "15 $",
    cleApi: "oui",
    opencode: "natif",
    recommande: true,
  },
  {
    nom: "CommandCode GOAT",
    prix: "10 $/mois",
    ratio: "×7",
    deepseek: "60 $",
    luna: "20 $",
    cleApi: "OpenAI / Anthropic",
    opencode: "provider externe",
  },
  {
    nom: "Open Design Go",
    prix: "10 $/mois (7 $/an)",
    ratio: "×6 à ×8,6",
    deepseek: "60 $",
    luna: "15 $",
    cleApi: "OpenAI / Anthropic",
    opencode: "oui",
  },
  {
    nom: "Chutes Plus",
    prix: "10 $/mois",
    ratio: "×5",
    deepseek: "partiel",
    luna: "—",
    cleApi: "oui",
    opencode: "oui",
  },
  {
    nom: "ClinePass",
    prix: "9,99 $/mois",
    ratio: "×2 à ×7",
    deepseek: "≈ 15–60 $",
    luna: "—",
    cleApi: "oui",
    opencode: "oui",
  },
  {
    nom: "Token Harbor — Office Pass",
    prix: "9,99 $/mois",
    ratio: "×3,5 à ×7",
    deepseek: "non publié",
    luna: "non publié",
    cleApi: "oui",
    opencode: "oui",
  },
];

export interface PlanUnDollar {
  nom: string;
  prix: string;
  donne: string;
  cleApi: string;
  opencode: string;
}

export const plansUnDollar: PlanUnDollar[] = [
  {
    nom: "CommandCode Go",
    prix: "1 $/mois",
    donne: "10 $ d'usage sur les modèles ouverts",
    cleApi: "non : pas d'accès API",
    opencode: "non : réservé à son harnais",
  },
  {
    nom: "Token Harbor — Agent Pass",
    prix: "0,99 $ puis 1,99 $/mois",
    donne: "10 $, jusqu'à 20 $ avec bonus",
    cleApi: "oui (OpenAI + Anthropic)",
    opencode: "oui, mais service très jeune",
  },
];

export interface Recommandation {
  titre: string;
  texte: string;
  points: string[];
}

export const recommandation: Recommandation = {
  titre: "OpenCode Go — 10 $/mois (environ 9 €)",
  texte:
    "C'est le plan recommandé après test : pour 10 $ par mois, il donne environ 60 $ de travail sur les modèles ouverts, directement intégré à OpenCode, avec une clé API utilisable aussi ailleurs.",
  points: [
    "Prix fixe : environ 9 € par mois, connu à l'avance.",
    "Amplification : environ ×6 (60 $ d'usage sur DeepSeek V4.1 Flash).",
    "Modèles : DeepSeek, GLM, Kimi, Qwen, MiniMax, MiMo, et GPT-6 Luna (plafonné).",
    "Intégration native dans OpenCode : aucune configuration compliquée.",
    "Fenêtres de consommation par tranches : étalez les gros travaux dans le temps.",
  ],
};

export interface Regle {
  titre: string;
  texte: string;
}

export const regles: Regle[] = [
  {
    titre: "Un abonnement à prix fixe plutôt que du paiement au jeton sans plafond",
    texte:
      "Le coût est plafonné et connu d'avance. On veut un montant fixe, pas une facture surprise en fin de mois.",
  },
  {
    titre: "Un compte et une clé par élève",
    texte:
      "Partager une même clé entre plusieurs personnes est interdit par les conditions d'utilisation et peut entraîner une suspension.",
  },
  {
    titre: "Aucune donnée personnelle dans un projet rendu",
    texte:
      "Certains services réutilisent les échanges pour entraîner leurs modèles. Le projet reste anonyme.",
  },
  {
    titre: "La clé ne va jamais dans le dépôt Git",
    texte:
      "Elle vit dans une variable d'environnement, ou dans les secrets de la plateforme. Jamais dans un fichier suivi.",
  },
];

export const budget = {
  titre: "Environ 10 € pour tout le projet",
  texte:
    "Un abonnement d'un mois à environ 9 € (ou 2 $ de crédit DeepSeek pour commencer) suffit pour mener le projet d'élève de bout en bout. À comparer à une fourniture scolaire : en français un livre, en sport une tenue, en SVT une blouse — ici, une enveloppe de jetons pour faire tourner l'IA.",
  avertissement:
    "Commencez petit : un crédit de 2 $ sur DeepSeek permet de tester sans risque. Les tarifs et les plafonds évoluent vite : vérifiez la page de facturation officielle avant tout achat.",
};

export interface Source {
  label: string;
  url: string;
}

export const sources: Source[] = [
  { label: "DeepSeek — tarifs et heures pleines/creuses", url: "https://api-docs.deepseek.com/quick_start/pricing" },
  { label: "OpenCode — offre Go et plafonds", url: "https://opencode.ai/docs/go" },
  { label: "Artificial Analysis — prix et benchmarks des modèles", url: "https://artificialanalysis.ai/" },
];

export const avertissementModele =
  "Le comparateur applique un profil d'usage d'agent : la part du cache détermine le reste, réparti en deux tiers d'entrée et un tiers de sortie. Ce n'est pas une facture exacte, mais un ordre de grandeur honnête pour choisir un modèle.";
