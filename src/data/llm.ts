/**
 * Données de la section « L'IA et les modèles ».
 * Les prix vivent dans src/lib/cout.ts (source unique, testée) ; ici, le
 * contenu pédagogique : repères, fiches modèles, leviers d'économie.
 */

export interface Repere {
  titre: string;
  valeur: string;
  detail: string;
}

export const reperesTokens: Repere[] = [
  {
    titre: "Un token",
    valeur: "≈ 3 à 4 caractères",
    detail:
      "Le modèle ne voit pas des mots mais des morceaux de mots. « Bonjour » peut compter pour un seul token, « informatique » pour deux ou trois.",
  },
  {
    titre: "Une page de texte",
    valeur: "≈ 800 tokens",
    detail: "Un paragraphe dense de 20 lignes en français tourne autour de 150 à 250 tokens.",
  },
  {
    titre: "Un fichier de code",
    valeur: "≈ 12 tokens par ligne",
    detail:
      "Le code est plus dense que la prose : un fichier de 100 lignes pèse environ 1 200 tokens. Un projet de 20 fichiers se lit donc pour ~25 000 tokens.",
  },
  {
    titre: "Une session d'agent",
    valeur: "≈ 30 000 à 200 000 tokens",
    detail:
      "Le coût ne vient pas de votre question (courte) mais du contexte relu à chaque tour : fichiers, historique, réponses précédentes.",
  },
];

export interface FicheModele {
  id: "flash" | "pro";
  usage: string;
  points: string[];
}

export const fichesModeles: FicheModele[] = [
  {
    id: "flash",
    usage: "Le modèle à utiliser par défaut : rapide, très bon marché, mode « réflexion » intégré.",
    points: [
      "Contexte de 1 million de tokens, sortie jusqu'à 384 000 tokens",
      "Réfléchit ou répond directement (mode thinking par défaut)",
      "Accepte les images, les appels d'outils et le format JSON",
      "Rapport qualité-prix imbattable pour un projet d'élève",
    ],
  },
  {
    id: "pro",
    usage: "Le grand frère : à réserver aux tâches vraiment difficiles.",
    points: [
      "Même contexte de 1 million de tokens",
      "Environ 4 à 5 fois plus cher que Flash",
      "Pas d'analyse d'images",
      "Utile quand Flash tourne en rond sur un problème de logique",
    ],
  },
];

export interface Levier {
  titre: string;
  texte: string;
}

export const leviersEconomie: Levier[] = [
  {
    titre: "Travailler en heures creuses",
    texte:
      "Le tarif est divisé par deux : tout le week-end, les jours fériés chinois et, en semaine, en dehors de 01 h–04 h et 06 h–10 h UTC (soit 03 h–06 h et 08 h–12 h à l'heure de Paris en été).",
  },
  {
    titre: "Laisser le cache travailler",
    texte:
      "Le début du contexte déjà envoyé est facturé ~50 fois moins cher (cache touché). C'est automatique : moins vous recommencez de zéro, plus vous payez peu.",
  },
  {
    titre: "Nettoyer le contexte",
    texte:
      "Une session qui traîne relit sans arrêt les mêmes fichiers et les mêmes erreurs. Compacter (voir OpenCode) ou repartir d'une session neuve coûte souvent moins cher que continuer.",
  },
  {
    titre: "Réserver la « réflexion » aux cas difficiles",
    texte:
      "Le mode thinking produit des milliers de tokens de raisonnement, facturés en sortie. Pour renommer un fichier ou corriger une faute, il ne sert à rien.",
  },
  {
    titre: "Demander petit",
    texte:
      "Une demande précise = une réponse courte = moins de tokens. « Ajoute un titre » coûte moins que « refais toute la page », et se corrige mieux.",
  },
];

export interface Verification {
  mythe: string;
  verite: string;
}

export const verifications: Verification[] = [
  {
    mythe: "« Il se souvient de notre conversation d'hier. »",
    verite:
      "Non : un modèle est sans mémoire. L'agent lui renvoie le contexte à chaque tour. S'il n'envoie pas un fichier, le modèle ne le voit pas.",
  },
  {
    mythe: "« Il a dit que c'était corrigé, donc c'est corrigé. »",
    verite:
      "Il dit ce qui est plausible. Seul un test dans le navigateur prouve quelque chose. Le ton assuré n'est pas une preuve.",
  },
  {
    mythe: "« Avec 1 million de tokens de contexte, il sait tout. »",
    verite:
      "Une grande fenêtre n'est pas une grande attention : noyé dans trop de texte, le modèle rate l'essentiel. Un contexte propre vaut mieux qu'un contexte énorme.",
  },
  {
    mythe: "« Plus cher = meilleur. »",
    verite:
      "La différence entre Flash et Pro se voit sur les problèmes difficiles. Sur une page web classique, vous payez surtout des tokens de sortie : mieux vaut un bon prompt qu'un gros modèle.",
  },
];
