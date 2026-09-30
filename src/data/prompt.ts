/**
 * Données de la section « Piloter l'agent ».
 */

import type { ChampsPrompt } from "../lib/prompt";

export interface PartieAnatomie {
  label: string;
  exemple: string;
  pourquoi: string;
}

export const anatomie: PartieAnatomie[] = [
  {
    label: "Objectif",
    exemple: "Ajoute une section « horaires » sous la présentation de la page d'accueil.",
    pourquoi:
      "Une seule intention, formulée comme une commande. Deux objectifs dans un message, c'est deux fois plus de chances de tout casser.",
  },
  {
    label: "Contexte",
    exemple:
      "Projet Astro. La page concernée est src/pages/index.astro ; les styles sont dans src/styles. Les autres sections sont déjà en place.",
    pourquoi:
      "L'agent ne connaît que ce qu'il a lu. Nommer les fichiers évite les allers-retours et les modifications au mauvais endroit.",
  },
  {
    label: "Contraintes",
    exemple:
      "Ne modifie que src/pages/index.astro. Réutilise les classes existantes, n'ajoute aucune dépendance.",
    pourquoi:
      "Les contraintes protègent le reste du projet. Un agent obéissant fera exactement ce qu'on ne lui a pas interdit.",
  },
  {
    label: "Critère de réussite",
    exemple:
      "La section s'affiche sous la présentation, avec un tableau à deux colonnes ; le reste de la page est identique.",
    pourquoi:
      "Sans critère vérifiable, personne ne peut dire si c'est fini. Avec, on teste, et on sait.",
  },
];

export interface AntiPattern {
  mauvais: string;
  probleme: string;
  correction: string;
}

export const antiPatterns: AntiPattern[] = [
  {
    mauvais: "Fais-moi un site.",
    probleme: "Aucun objet, aucun contexte, aucun critère : l'agent va inventer à votre place.",
    correction:
      "« Crée une page d'accueil avec un titre, un paragraphe et un bouton. Le titre parle de X. Je veux une seule colonne, lisible sur téléphone. »",
  },
  {
    mauvais: "Ça ne marche pas.",
    probleme: "Le message ne dit ni ce qui était attendu, ni ce qui se passe, ni où.",
    correction:
      "« J'attendais le menu à droite ; il s'affiche à gauche et passe sous le titre sur téléphone. Voici le message d'erreur complet : […] »",
  },
  {
    mauvais: "Ajoute un menu, change les couleurs et refais le texte de la page.",
    probleme: "Trois intentions dans un message : si le résultat déçoit, impossible de savoir laquelle a échoué.",
    correction: "Un message par intention. Le menu d'abord, on teste, puis les couleurs, puis le texte.",
  },
  {
    mauvais: "Répare tout.",
    probleme: "Aucun périmètre : l'agent peut réécrire des fichiers qui fonctionnaient.",
    correction:
      "« Le build échoue avec cette erreur : […]. Corrige uniquement la cause de cette erreur, sans refactoriser le reste. »",
  },
  {
    mauvais: "Choisis un beau design et un sujet sympa.",
    probleme: "Ce sont des décisions humaines. L'agent n'a ni goût, ni responsabilité, ni connaissance de votre public.",
    correction:
      "Vous choisissez le sujet et les grandes lignes ; l'agent propose des variantes, vous tranchez.",
  },
  {
    mauvais: "Voici ma clé d'API pour tester : sk-…",
    probleme: "Le secret part dans un service tiers et reste dans l'historique de la conversation.",
    correction: "On ne colle jamais de secret dans un prompt. La clé vit dans .env (voir la section Sécurité).",
  },
  {
    mauvais: "Non, refais pareil.",
    probleme: "Relancer la même demande donne souvent la même réponse : ce n'est pas une loterie, c'est un texte prédit.",
    correction:
      "Reformulez, ajoutez un exemple, réduisez le périmètre, ou changez de mode (plan) — mais changez quelque chose.",
  },
];

export interface PhrasePilotage {
  situation: string;
  phrase: string;
}

export const phrasesPilotage: PhrasePilotage[] = [
  {
    situation: "Comprendre avant d'agir",
    phrase: "Explique-moi ta démarche et les risques avant de modifier le moindre fichier.",
  },
  {
    situation: "Limiter le périmètre",
    phrase: "Ne touche qu'à ce fichier. Si tu penses devoir en modifier un autre, demande-moi d'abord.",
  },
  {
    situation: "Vérifier ce qui a changé",
    phrase: "Montre-moi la liste des fichiers modifiés et résume chaque changement en une phrase.",
  },
  {
    situation: "Revenir en arrière",
    phrase: "Cette modification a cassé […]. Indique-moi comment revenir au dernier état qui fonctionnait.",
  },
  {
    situation: "Faire expliquer le code",
    phrase: "Explique-moi ce fichier ligne par ligne, comme à un débutant, sans rien modifier.",
  },
  {
    situation: "Contester une réponse",
    phrase: "Es-tu sûr que cette fonction existe dans cette version ? Cite la source ou vérifie dans le projet.",
  },
  {
    situation: "Demander des alternatives",
    phrase: "Propose trois approches différentes avec leurs avantages et inconvénients, puis attends mon choix.",
  },
  {
    situation: "Terminer proprement",
    phrase: "Le résultat est bon. Résume ce qu'on a fait, ce qu'il reste à faire, et propose un message de commit.",
  },
];

export interface EtapeEscalade {
  titre: string;
  texte: string;
}

export const escalade: EtapeEscalade[] = [
  {
    titre: "Vérifier le contexte",
    texte: "L'agent a-t-il lu le bon fichier ? Sinon, joignez-le avec @ et reformulez.",
  },
  {
    titre: "Donner un exemple",
    texte: "Un exemple vaut mieux qu'une description : montrez une section qui fonctionne comme modèle.",
  },
  {
    titre: "Réduire le périmètre",
    texte: "Découpez la demande en deux. Ce qui est trop gros échoue presque toujours.",
  },
  {
    titre: "Passer en mode plan",
    texte: "Demandez le plan, corrigez-le, puis basculez en build pour exécuter ce plan-là.",
  },
  {
    titre: "Repartir propre",
    texte: "Nouvelle session (/new) ou contexte compacté : une conversation trop longue brouille tout.",
  },
  {
    titre: "Changer d'outil ou de modèle",
    texte: "Si le blocage persiste, un autre modèle ou une recherche dans la documentation débloque souvent.",
  },
];

export interface PresetPrompt {
  label: string;
  champs: ChampsPrompt;
}

export const presets: PresetPrompt[] = [
  {
    label: "Créer une section",
    champs: {
      objectif: "Ajoute une section « horaires » sous la présentation de la page d'accueil.",
      contexte:
        "Projet Astro. La page concernée est src/pages/index.astro ; les styles sont dans src/styles.",
      contraintes:
        "Ne modifie que src/pages/index.astro. Réutilise les classes existantes, n'ajoute aucune dépendance.",
      critere:
        "La section s'affiche sous la présentation, avec un tableau à deux colonnes ; le reste de la page est identique.",
      format: "plan",
    },
  },
  {
    label: "Corriger un bug",
    champs: {
      objectif: "Corrige l'erreur qui empêche le site de démarrer.",
      contexte:
        "Le site fonctionnait avant la dernière modification. Voici le message d'erreur complet : [collez-le ici].",
      contraintes:
        "Corrige la cause de cette erreur uniquement, sans refactoriser le reste ni changer le design.",
      critere: "Le serveur démarre et la page d'accueil s'affiche comme avant.",
      format: "plan",
    },
  },
  {
    label: "Reprendre le travail d'hier",
    champs: {
      objectif: "Fais le point sur l'état du projet et propose la suite.",
      contexte:
        "Voici les fichiers du projet : [liste]. Le dernier commit date d'hier ; je ne sais plus où j'en étais.",
      contraintes: "Ne modifie rien pour l'instant : je veux d'abord comprendre.",
      critere: "Je sais ce qui fonctionne, ce qui reste à faire, et par quoi commencer.",
      format: "plan",
    },
  },
];
