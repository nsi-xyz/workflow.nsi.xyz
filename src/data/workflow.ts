/**
 * Données de la section « Le workflow ».
 *
 * Deux niveaux à ne pas confondre :
 *   - `loopPhases` : la BOUCLE, à chaque demande faite à l'agent ;
 *   - `timeline`   : un exemple complet, de la première phrase à l'URL publique.
 * Les cinq étapes du projet vivent dans navigation.ts (`workflowSteps`).
 */

export interface LoopPhase {
  id: string;
  title: string;
  /** Ce que fait l'humain. */
  you: string;
  /** Ce que fait l'agent. */
  agent: string;
  /** Critère pour passer à la phase suivante. */
  exit: string;
}

export const loopPhases: LoopPhase[] = [
  {
    id: "decrire",
    title: "Décrire",
    you: "Vous formulez l'objectif, le contexte, les contraintes et le critère de réussite. Vous découpez en une demande à la fois.",
    agent: "Il pose des questions si quelque chose est ambigu — laissez-le faire, ses questions révèlent vos oublis.",
    exit: "L'agent a reformulé ce qu'il allait faire, et c'est bien ce que vous voulez.",
  },
  {
    id: "generer",
    title: "Générer",
    you: "Vous lisez ce qui est produit : quels fichiers sont créés ou modifiés, et pourquoi. Vous ne validez pas à l'aveugle.",
    agent: "Il écrit le code, crée les fichiers, propose un plan de travail.",
    exit: "Les fichiers annoncés existent réellement et le plan vous paraît juste.",
  },
  {
    id: "tester",
    title: "Tester",
    you: "Vous lancez, vous ouvrez dans le navigateur, vous regardez le rendu et les erreurs.",
    agent: "Il démarre le serveur, explique comment vérifier, et propose des tests si vous le demandez.",
    exit: "Le résultat fonctionne pour de vrai — pas « ça a l'air bon ».",
  },
  {
    id: "corriger",
    title: "Corriger",
    you: "Vous décrivez l'écart précisément : « le bouton chevauche le titre sur téléphone », pas « c'est moche ».",
    agent: "Il corrige, et parfois casse autre chose : c'est à vous de re-tester ce qui marchait.",
    exit: "Le test repasse, et rien d'autre n'a régressé.",
  },
  {
    id: "livrer",
    title: "Livrer",
    you: "Vous committez, vous déployez, vous partagez l'URL — et vous journalisez les prompts utilisés.",
    agent: "Il prépare les commandes et rédige le message de commit si vous le lui demandez.",
    exit: "L'URL publique répond, le dépôt est à jour, les prompts sont déposés.",
  },
];

export interface TimelineStep {
  /** Phase de la boucle concernée (badge). */
  phase: string;
  title: string;
  prompt?: string;
  result: string;
  note?: string;
}

export const timeline: TimelineStep[] = [
  {
    phase: "Décrire",
    title: "Cadrer le projet avant de coder",
    prompt:
      "Tu vas m'aider à construire une page d'accueil sur les abeilles. Avant de coder : pose-moi 5 questions pour préciser le sujet, le public et le style. Ne crée aucun fichier.",
    result:
      "L'agent pose des questions, l'élève répond. À la fin, on sait quoi construire — et on a déjà évité deux malentendus.",
    note: "Un projet qui commence par des questions coûte moins cher qu'un projet qui commence par du code.",
  },
  {
    phase: "Décrire",
    title: "Demander une seule chose à la fois",
    prompt:
      "Crée une page d'accueil avec : un titre, un paragraphe de présentation, une image d'abeille et un bouton « En savoir plus ». Explique-moi chaque fichier que tu crées.",
    result: "Les fichiers sont créés, et l'explication permet de comprendre où vit quoi.",
  },
  {
    phase: "Tester",
    title: "Lancer et regarder",
    prompt: "Comment je lance le site pour le voir dans mon navigateur ?",
    result:
      "Une erreur apparaît au démarrage. L'élève copie le message d'erreur dans la conversation — c'est la meilleure façon de demander de l'aide.",
  },
  {
    phase: "Corriger",
    title: "Corriger avec le message d'erreur, pas avec des suppositions",
    prompt:
      "Voici l'erreur complète quand je lance le serveur : [message]. Explique ce qu'elle veut dire, puis corrige.",
    result: "L'agent explique, corrige, le serveur démarre. La page s'affiche.",
    note: "Coller l'erreur ENTIÈRE fait gagner des dizaines de minutes : elle contient le fichier et la ligne.",
  },
  {
    phase: "Livrer",
    title: "Enregistrer un premier point de retour",
    prompt: "Prépare les commandes Git pour enregistrer cette première version, et explique chaque commande.",
    result:
      "Premier commit : la page d'accueil existe et l'historique commence. C'est le point de retour en cas de bêtise.",
    note: "Une étape terminée = un commit. Ce n'est pas du rangement, c'est une assurance.",
  },
  {
    phase: "Tester",
    title: "Améliorer… puis casser",
    prompt: "Ajoute une section « Pourquoi les abeilles sont essentielles » et change les couleurs.",
    result:
      "La nouvelle section s'affiche, mais le CSS casse l'ancienne. C'est normal : chaque modification peut casser ce qui marchait.",
    note: "Le réflexe est de re-tester TOUTE la page, pas seulement la nouveauté.",
  },
  {
    phase: "Corriger",
    title: "Revenir en arrière plutôt que s'enliser",
    prompt: "Le bouton chevauche le titre sur téléphone. Compare avec la version du commit précédent si nécessaire.",
    result:
      "Soit l'agent corrige et on vérifie, soit on restaure le dernier commit (git restore) et on repart d'une base saine. Dans les deux cas, on ne reste pas bloqué.",
    note: "Un commit qui fonctionne vaut mieux qu'une heure de corrections empilées.",
  },
  {
    phase: "Livrer",
    title: "Publier et partager",
    prompt: "Explique-moi les étapes pour publier ce projet sur Cloudflare Pages, et ce que je dois vérifier avant.",
    result:
      "Le site est déployé à une URL publique. On vérifie qu'elle répond, puis on envoie le lien.",
    note: "Avant de publier : la checklist de la section Sécurité.",
  },
  {
    phase: "Livrer",
    title: "Journaliser les prompts",
    prompt: "Aide-moi à résumer les prompts qui ont mené à cette version.",
    result:
      "Les prompts sont déposés sur le site du projet avec le code anonyme. C'est la trace du travail : ce que l'élève a demandé, compris et corrigé.",
    note: "Le journal des prompts raconte la vraie histoire du projet — bien mieux qu'un fichier final.",
  },
];

export const humanDuties: string[] = [
  "Choisir le sujet, le public et le message : l'IA n'a ni goût ni intention.",
  "Décider ce qui est acceptable : un texte, une image, une couleur se valident.",
  "Vérifier la sécurité : aucun secret dans le dépôt, aucune donnée personnelle publiée.",
  "Comprendre ce qui est écrit : on ne signe pas un projet qu'on ne peut pas expliquer.",
  "Publier et assumer : c'est votre nom qui est derrière l'URL.",
];

export const agentStrengths: string[] = [
  "Écrire vite du code répétitif et de la structure : pages, styles, formulaires.",
  "Expliquer un message d'erreur, un fichier, une commande.",
  "Proposer des variantes quand on est bloqué sur un choix.",
  "Exécuter des tâches longues et minutieuses : renommer, réorganiser, vérifier.",
  "Traduire une intention en étapes techniques — quand l'intention est claire.",
];

export const workflowRules: string[] = [
  "Une demande = un objectif. Deux objectifs dans un même prompt, c'est deux fois plus de chances de tout casser.",
  "Toujours lire avant de valider : ce que vous acceptez sans lire devient votre responsabilité.",
  "Tester après chaque modification, même petite : le rendu, pas l'impression.",
  "Committer avant les grosses demandes : un commit est un point de retour.",
  "Journaliser les prompts : sans trace, le travail devient invisible.",
  "Ne jamais publier un secret : le dépôt, les prompts et les captures ne sont pas des coffres-forts.",
];

export const myths: Array<{ myth: string; reality: string }> = [
  {
    myth: "« L'IA fait tout, je n'ai qu'à attendre. »",
    reality:
      "L'agent produit très vite, mais il ne sait pas ce qu'il doit obtenir. Sans direction ni vérification, il livre du code qui a l'air fini et ne fonctionne pas.",
  },
  {
    myth: "« Un bon prompt règle tout du premier coup. »",
    reality:
      "Le premier jet est un brouillon. Le travail réel est la boucle : tester, décrire l'écart, corriger. C'est là qu'on apprend.",
  },
  {
    myth: "« Le code généré est forcément correct. »",
    reality:
      "Un modèle prédit du texte plausible : il peut inventer une fonction, une bibliothèque, une commande. La vérification n'est pas optionnelle.",
  },
  {
    myth: "« Ça marche sur ma machine, donc c'est fini. »",
    reality:
      "Un site fini répond à une URL publique, sur un autre poste, et son dépôt contient tout ce qu'il faut pour le reconstruire.",
  },
];

export const examplePrompts: Array<{ label: string; prompt: string }> = [
  {
    label: "Cadrer",
    prompt:
      "Avant de coder, pose-moi les questions nécessaires pour bien comprendre ce que je veux. Ne crée aucun fichier pour l'instant.",
  },
  {
    label: "Faire expliquer",
    prompt:
      "Explique-moi ce que tu viens de faire, fichier par fichier, comme si je débutais. Signale ce que je devrais vérifier moi-même.",
  },
  {
    label: "Corriger",
    prompt:
      "Voici le comportement attendu : […]. Voici ce qui se passe : […]. Voici le message d'erreur complet : […]. Propose une correction et explique-la.",
  },
  {
    label: "Revenir en arrière",
    prompt:
      "La dernière modification a cassé […]. Montre-moi comment revenir au dernier état qui fonctionnait, sans perdre le reste.",
  },
];
