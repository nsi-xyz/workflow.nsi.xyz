/**
 * Données de la page « Projet final ».
 *
 * `revealAt` est la seule date du site : le lundi de la dernière semaine avant
 * les vacances de la Toussaint, à 8 h 42 (heure locale de Paris).
 * Format ISO sans fuseau : interprété dans le fuseau du visiteur, ce qui
 * correspond au fuseau de la classe pour l'usage prévu.
 */

export const revealAt = "2026-10-12T08:42:00";

export const teaser = [
  "Le sujet n'est pas encore dévoilé. Il le sera exactement à l'heure indiquée, sur cette page.",
  "D'ici là, tout ce qu'il faut maîtriser est déjà en ligne : le workflow, OpenCode, le journal des prompts, Git, Cloudflare et la sécurité.",
  "Arriver préparé ne veut pas dire connaître le sujet : cela veut dire savoir piloter l'agent, publier un site et protéger ses secrets.",
];

export interface SectionProjet {
  titre: string;
  contenu: string;
}

/** À personnaliser par l'enseignant : le contenu révélé le jour J. */
export const briefProjet: SectionProjet[] = [
  {
    titre: "L'objectif",
    contenu:
      "[À compléter par l'enseignant : ce que les élèves doivent réaliser — par exemple une landing page sur un sujet choisi, présentant le sujet, des images et un appel à l'action.]",
  },
  {
    titre: "Le rendu attendu",
    contenu:
      "[À compléter : l'URL publique du site, le dépôt GitHub privé, le journal des prompts déposé sur ce site.]",
  },
  {
    titre: "Les règles du jeu",
    contenu:
      "[À compléter : travail individuel ou en binôme, sujet libre ou imposé, contraintes techniques (sans base de données, sans compte utilisateur), délai.]",
  },
  {
    titre: "Les critères d'évaluation",
    contenu:
      "[À compléter : qualité du rendu, autonomie, pertinence des prompts, respect des règles de sécurité, capacité à expliquer le travail.]",
  },
];

export const reglesInchangees: string[] = [
  "Aucun secret dans le dépôt : la clé reste dans .env, ignoré par Git.",
  "Aucune donnée personnelle d'autrui dans le site, le dépôt ou un prompt.",
  "Le dépôt est privé, le site est public : on vérifie avant de publier.",
  "Les prompts utilisés sont déposés sur ce site : c'est la trace du travail.",
  "Le projet doit être explicable : on ne valide jamais ce qu'on ne comprend pas.",
];

export interface EtapePret {
  titre: string;
  texte: string;
  lien: string;
}

export const pretPourLeJourJ: EtapePret[] = [
  {
    titre: "Ouvrir un projet et le tenir",
    texte: "Savoir créer un dossier, lancer OpenCode, vérifier dans quel dossier on travaille.",
    lien: "/opencode",
  },
  {
    titre: "Demander précisément",
    texte: "Écrire un prompt avec objectif, contexte, contraintes et critère de réussite.",
    lien: "/prompt",
  },
  {
    titre: "Garder une trace",
    texte: "Créer un dépôt privé, committer une étape qui fonctionne, pousser en fin de séance.",
    lien: "/git-github",
  },
  {
    titre: "Publier",
    texte: "Obtenir une URL publique et vérifier qu'elle répond depuis un autre appareil.",
    lien: "/cloudflare",
  },
  {
    titre: "Se protéger",
    texte: "Vérifier qu'aucun secret ne part, et savoir quoi faire si c'est arrivé.",
    lien: "/securite",
  },
  {
    titre: "Journaliser",
    texte: "Déposer les prompts qui racontent le projet, du premier cadrage à la publication.",
    lien: "/prompts/depot",
  },
];

export const messageRevele = "Le sujet est dévoilé. Bonne construction !";
