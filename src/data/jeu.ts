/**
 * Données de la page « Du site au jeu vidéo ».
 *
 * Le test réalisé en classe consiste à publier un site. Le projet des vacances
 * consiste à créer un jeu vidéo de A à Z. Cette page explique ce qui change,
 * ce qui ne change pas, et comment le workflow s'adapte aux spécificités d'un
 * jeu — sans divulguer les règles du projet final, révélées le jour J.
 */

export interface Difference {
  aspect: string;
  site: string;
  jeu: string;
}

export const differences: Difference[] = [
  {
    aspect: "Ce que le visiteur fait",
    site: "Il lit, il clique, il parcourt des pages.",
    jeu: "Il agit : il appuie sur des touches, il gagne, il perd, il recommence.",
  },
  {
    aspect: "Le cœur du travail",
    site: "Du contenu et de la mise en page.",
    jeu: "Une boucle : des entrées, un état qui évolue, un affichage qui suit.",
  },
  {
    aspect: "Ce qu'on surveille",
    site: "Le rendu sur téléphone et la lisibilité.",
    jeu: "La fluidité, la difficulté et l'équilibre des règles.",
  },
  {
    aspect: "Les erreurs typiques",
    site: "Un lien mort, une image manquante, un texte qui déborde.",
    jeu: "Un personnage qui traverse un mur, une partie impossible à finir, une image par seconde qui s'effondre.",
  },
  {
    aspect: "Le test final",
    site: "Ouvrir l'URL et vérifier que tout s'affiche.",
    jeu: "Lancer une partie, jouer vraiment, reperdre et rejouer.",
  },
];

export const invariants: string[] = [
  "Le même espace de travail : OpenCode et un dossier de projet.",
  "La même boucle : décrire, générer, tester, corriger, livrer.",
  "La même trace : Git, un dépôt privé, des commits nommés.",
  "La même publication : une URL publique à partager.",
  "La même journalisation : les prompts racontent le projet.",
];

export interface Specificite {
  titre: string;
  texte: string;
}

export const specificites: Specificite[] = [
  {
    titre: "Une boucle de jeu",
    texte:
      "Un site se lit, un jeu se joue. Il faut penser en cycles : lire les entrées du joueur, mettre à jour l'état, afficher le résultat, recommencer plusieurs dizaines de fois par seconde.",
  },
  {
    titre: "Un état qui vit",
    texte:
      "Score, vies, niveau, position des personnages : le jeu garde des données qui changent en permanence. C'est ce que l'on teste en premier quand quelque chose se comporte bizarrement.",
  },
  {
    titre: "Des entrées et des règles",
    texte:
      "Clavier, souris, tactile : chaque entrée doit déclencher la bonne action. Et les règles du jeu doivent être comprises par la machine, pas seulement par l'auteur.",
  },
  {
    titre: "Des ressources à gérer",
    texte:
      "Images, sons, polices : un jeu charge des fichiers. Trop lourds, ils ralentissent le démarrage ; absents, ils cassent le rendu.",
  },
  {
    titre: "La performance",
    texte:
      "Un jeu se juge à sa fluidité. Le travail consiste à mesurer, profiler, alléger — un réflexe qui n'apparaît presque jamais sur un site de contenu.",
  },
  {
    titre: "L'équilibrage",
    texte:
      "Trop facile, on s'ennuie ; trop dur, on abandonne. C'est un va-et-vient de tests humains, où l'agent propose et où le joueur tranche.",
  },
];

export interface Adaptation {
  titre: string;
  texte: string;
}

export const adaptations: Adaptation[] = [
  {
    titre: "Cadrer encore plus tôt",
    texte:
      "Pour un jeu, une phrase d'intention ne suffit pas : il faut décrire la boucle de jeu, les règles et la condition de victoire avant d'écrire la première ligne.",
  },
  {
    titre: "Prototyper petit",
    texte:
      "Une première version minuscule — un personnage, un obstacle, un score — vaut mieux qu'un jeu complet mal parti. On l'étoffe ensuite, un commit à la fois.",
  },
  {
    titre: "Tester en jouant",
    texte:
      "Le critère de réussite n'est pas une capture d'écran : c'est une partie réelle, jouée du début à la fin, sans blocage.",
  },
  {
    titre: "Publier le jeu comme un site",
    texte:
      "Le jeu se construit avec les mêmes outils, se dépose dans le même dépôt et se met en ligne sur Cloudflare Pages à la même URL.",
  },
];

export const avertissement =
  "Le sujet, les règles et les contraintes du projet final ne sont pas encore communiqués : ils seront révélés à la date annoncée sur la page du projet. Cette page explique seulement la différence entre un site et un jeu, pour que vous arriviez préparé à l'un comme à l'autre.";
