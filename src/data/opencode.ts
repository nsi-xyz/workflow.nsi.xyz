/**
 * Données de la section « OpenCode ».
 * Commandes et raccourcis vérifiés sur https://opencode.ai/docs/tui/ (29/09/2026).
 * L'interface évolue : la page invite à confirmer avec /help.
 */

export interface Commande {
  nom: string;
  role: string;
  detail: string;
}

export const commandes: Commande[] = [
  {
    nom: "/help",
    role: "Afficher l'aide",
    detail: "La liste des commandes et raccourcis de votre version. En cas de doute, commencez par là.",
  },
  {
    nom: "/connect",
    role: "Brancher un fournisseur de modèle",
    detail: "Choisir DeepSeek, puis coller sa clé d'API. C'est l'étape qui donne accès au modèle.",
  },
  {
    nom: "/init",
    role: "Préparer le projet",
    detail: "L'agent analyse le dossier et écrit AGENTS.md : le document qui décrit le projet et ses conventions. À committer.",
  },
  {
    nom: "/models",
    role: "Choisir le modèle",
    detail: "Affiche les modèles disponibles. Pour ce projet : le modèle Flash de DeepSeek, bon marché et largement suffisant.",
  },
  {
    nom: "/new",
    role: "Nouvelle session",
    detail: "Alias /clear. Repartir d'un contexte vide, quand une session devient longue ou confuse.",
  },
  {
    nom: "/sessions",
    role: "Retrouver une session",
    detail: "Alias /resume et /continue. Reprendre une conversation précédente sans la relire depuis le début.",
  },
  {
    nom: "/compact",
    role: "Résumer le contexte",
    detail: "Alias /summarize. L'agent résume la conversation pour libérer de la place et faire baisser le coût, sans perdre le fil.",
  },
  {
    nom: "/details",
    role: "Voir ce que fait l'agent",
    detail: "Affiche le détail des outils exécutés (fichiers lus, commandes lancées). Indispensable pour surveiller, pas seulement pour admirer.",
  },
  {
    nom: "/undo",
    role: "Annuler",
    detail: "Supprime le dernier message et ses conséquences, fichiers compris. Repose sur Git : le projet doit être un dépôt.",
  },
  {
    nom: "/redo",
    role: "Rétablir",
    detail: "Rétablit ce qui vient d'être annulé avec /undo.",
  },
  {
    nom: "/export",
    role: "Exporter la conversation",
    detail: "Écrit la session dans un fichier Markdown, ouvert dans votre éditeur. Idéal pour journaliser vos prompts et vos corrections.",
  },
  {
    nom: "/share",
    role: "Partager la session",
    detail: "Crée un lien public vers la conversation. À n'utiliser qu'après avoir relu : une session peut contenir des secrets ou des données personnelles.",
  },
  {
    nom: "/thinking",
    role: "Afficher le raisonnement",
    detail: "Montre les blocs de réflexion du modèle. Pédagogique : on voit l'agent douter, hésiter, se corriger.",
  },
  {
    nom: "/exit",
    role: "Quitter",
    detail: "Alias /quit et /q.",
  },
];

export interface Raccourci {
  touche: string;
  role: string;
}

export const raccourcis: Raccourci[] = [
  { touche: "Tab", role: "Basculer entre le mode plan et le mode build (l'indicateur est en bas à droite)." },
  { touche: "@", role: "Chercher et joindre un fichier du projet à votre message ; son contenu est ajouté au contexte." },
  { touche: "!", role: "Exécuter une commande du terminal depuis la conversation (ex. !ls)." },
  { touche: "Ctrl + p", role: "Palette de commandes : toutes les actions, même celles sans raccourci." },
  { touche: "Ctrl + t", role: "Faire défiler les variantes du modèle (dont réflexion / réponse directe)." },
  { touche: "Ctrl + x", role: "Touche « chef » : Ctrl+x puis une lettre (m pour les modèles, n pour une session, c pour compacter…)." },
];

export interface CriterePlanBuild {
  situation: string;
  mode: string;
  pourquoi: string;
}

export const planVsBuild: CriterePlanBuild[] = [
  {
    situation: "Ajouter une fonctionnalité ou refaire une page",
    mode: "Plan d'abord, build ensuite",
    pourquoi: "On valide l'approche avant d'écrire 300 lignes, puis on bascule pour exécuter.",
  },
  {
    situation: "Comprendre un fichier ou une erreur",
    mode: "Plan",
    pourquoi: "Le mode plan ne modifie rien : parfait pour poser des questions sans risque.",
  },
  {
    situation: "Corriger une faute, un texte, une couleur",
    mode: "Build",
    pourquoi: "La solution est connue et locale : un détour par le plan fait perdre du temps.",
  },
  {
    situation: "Commande risquée (supprimer, réinstaller, refactoriser)",
    mode: "Plan, puis relecture, puis build",
    pourquoi: "Le mode plan empêche les modifications : on voit la manœuvre avant qu'elle ait lieu.",
  },
];

export interface PremierPas {
  titre: string;
  texte: string;
}

export const premiersPas: PremierPas[] = [
  {
    titre: "Ouvrir un terminal dans le dossier du projet",
    texte: "L'agent travaille dans le dossier courant : c'est ce dossier qui est « son monde ».",
  },
  {
    titre: "Lancer OpenCode et brancher le modèle",
    texte: "/connect, choisir DeepSeek, coller la clé d'API, puis /models pour vérifier le modèle utilisé.",
  },
  {
    titre: "Initialiser le projet",
    texte: "/init : l'agent découvre le dossier et rédige AGENTS.md. Relisez-le, il décrit votre projet.",
  },
  {
    titre: "Poser une première question sans risque",
    texte: "« Résume-moi ce projet et liste les fichiers » : vous vérifiez que l'agent lit le bon dossier.",
  },
  {
    titre: "Créer un dépôt Git avant de modifier quoi que ce soit",
    texte: "Sans dépôt, /undo ne peut rien annuler. C'est le filet de sécurité, à poser au début.",
  },
  {
    titre: "Passer en mode plan pour la première vraie demande",
    texte: "Tab, puis décrire ce que vous voulez. Lire le plan, le corriger, puis basculer en build.",
  },
  {
    titre: "Regarder le coût et le détail",
    texte: "Le coût de la session et les tokens consommés sont affichés ; /details montre chaque outil utilisé.",
  },
];

export interface Piege {
  titre: string;
  texte: string;
}

export const pieges: Piege[] = [
  {
    titre: "Plus de 2 € de « jeton » sans avoir compris",
    texte: "Le coût vient du contexte relu à chaque tour, pas de votre question. Une session laissée ouverte sur un gros projet peut tourner toute seule.",
  },
  {
    titre: "Partager une session sans la relire",
    texte: "/share crée un lien public. Une session peut contenir une clé d'API collée par erreur, un chemin personnel, un message privé.",
  },
  {
    titre: "Croire que l'agent « sait »",
    texte: "Il ne connaît que ce qu'il a lu : le dossier ouvert, les fichiers joints avec @, l'historique. S'il n'a pas vu un fichier, il ne peut pas en tenir compte.",
  },
  {
    titre: "Travailler hors du dossier du projet",
    texte: "Un terminal ouvert dans le mauvais dossier, et l'agent modifie les mauvais fichiers. Vérifiez le dossier avant la première demande.",
  },
  {
    titre: "Laisser une session s'éterniser",
    texte: "Au bout d'un moment, l'agent relit trop de choses : il répond moins bien et coûte plus cher. /compact ou /new, et on repart propre.",
  },
];
