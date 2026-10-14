/**
 * Données de la page « Projet final ».
 *
 * `revealAt` est la seule date du site : le lundi de la dernière semaine avant
 * les vacances de la Toussaint, à 8 h 42 (heure locale de Paris).
 * Format ISO sans fuseau : interprété dans le fuseau du visiteur, ce qui
 * correspond au fuseau de la classe pour l'usage prévu.
 *
 * C'est une constante ÉDITORIALE, écrite ici et nulle part ailleurs : pas de
 * variable d'environnement. Le site est un bundle statique et `tests/projet.test.mjs`
 * importe directement ce module (où `import.meta.env` n'existe pas) ; pour changer
 * la date une année sur l'autre, on modifie donc uniquement cette ligne.
 */

export const revealAt = "2026-10-12T08:42:00";

export const teaser = [
  "Le sujet n'est pas encore dévoilé. Il le sera exactement à l'heure indiquée, sur cette page.",
  "Ce que l'on sait déjà : le projet des vacances consiste à créer un jeu vidéo de A à Z.",
  "D'ici là, tout ce qu'il faut maîtriser est déjà en ligne : le workflow, OpenCode, le journal des prompts, Git, Cloudflare et la sécurité.",
  "Arriver préparé ne veut pas dire connaître le sujet : cela veut dire savoir piloter l'agent, publier un projet et protéger ses secrets.",
];

export interface SectionProjet {
  titre: string;
  contenu: string;
}

/** Le brief du projet final : sujet libre, démarche et règles imposées. */
export const briefProjet: SectionProjet[] = [
  {
    titre: "L'objectif",
    contenu:
      "Inventer et réaliser un jeu vidéo jouable dans un navigateur, de A à Z, en pilotant une IA. Le sujet est libre : aucun thème ni titre n'est imposé. Ce qui est imposé, c'est la démarche — cadrer le jeu (sa boucle, ses règles, sa condition de victoire, son public) avant d'écrire la première ligne, prototyper petit, tester en jouant vraiment, publier en ligne, puis consigner chaque échange dans le journal du dépôt.",
  },
  {
    titre: "Le rendu attendu",
    contenu:
      "Une URL publique qui charge le jeu et permet d'y jouer du début à la fin ; le dépôt GitHub privé avec le code, le .gitignore, le projet.json complété (url et hebergeur) et le dossier journal/ à jour ; et une démonstration orale de 2 minutes, jeu exécuté en direct au vidéoprojecteur, sans notes ni diaporama — juste votre jeu et votre talent oratoire.",
  },
  {
    titre: "Les règles du jeu",
    contenu:
      "Travail individuel. Le workflow se met en place AVANT le jeu : dépôt privé, workflow.md et AGENTS.md d'abord, et tout le projet se construit dans ce dossier — jamais à côté. Technologie : HTML, CSS et JavaScript, jouable dans un navigateur et publié sur un hébergeur qui accepte un dépôt privé (Cloudflare Pages…). Aucune base de données, aucun compte utilisateur, aucune donnée personnelle. Aucun secret dans le dépôt : la clé vit dans .env, ignoré par Git. Ressources optimisées — aucun fichier de plus de 10 Mo, aucun contenu sous copyright. Le projet doit être terminé avant la reprise des cours, le lundi 2 novembre 2026.",
  },
  {
    titre: "Les interdits",
    contenu:
      "Interdit de recycler un projet déjà commencé ou déjà terminé : le jeu se crée de A à Z, pour ce projet. Interdit de récupérer un jeu tout fait sur Internet, de recopier un tutoriel complet ou de reprendre le code d'un autre : ce serait rater l'objectif, qui est d'apprendre à piloter une IA. L'agent écrit le code, mais le projet reste le vôtre : vous devez pouvoir expliquer chaque partie et répondre à la question « pourquoi ça marche ».",
  },
  {
    titre: "Les critères d'évaluation",
    contenu:
      "Un jeu vraiment jouable et fini : on gagne, on perd, on recommence. La trace : journal/ raconte le projet, un commit par échange. La mise en ligne effective, l'URL renseignée dans projet.json. L'autonomie : savoir expliquer l'organisation du projet (le rôle des fichiers, la structure) et vos choix — sans lire le code ligne à ligne. La qualité technique : fluidité, équilibrage, ressources légères. L'originalité. Et une présentation orale claire, vivante, surprenante et originale, qui donne envie de jouer.",
  },
];

export const reglesInchangees: string[] = [
  "Aucun secret dans le dépôt : la clé reste dans .env, ignoré par Git.",
  "Aucune donnée personnelle d'autrui dans le site, le dépôt ou un prompt.",
  "Le dépôt est privé, le site est public : on vérifie avant de publier.",
  "Les prompts utilisés sont consignés dans le dépôt (dossier journal/) : c'est la trace du travail.",
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
    texte: "Consigner les prompts qui racontent le projet, du premier cadrage à la publication.",
    lien: "/git-github",
  },
];

export const messageRevele = "Le sujet est dévoilé. Bonne construction !";
