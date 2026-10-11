/**
 * Données de la section « Markdown ».
 *
 * Markdown est le format d'écriture qui relie l'élève, l'agent IA et le dépôt :
 * lisible par un humain, structuré pour la machine, versionnable par Git.
 */

export interface Repere {
  titre: string;
  texte: string;
}

export const pourquoi: Repere[] = [
  {
    titre: "C'est du texte pur",
    texte:
      "Un fichier Markdown est un simple fichier texte, avec une extension .md. Il s'ouvre partout, il ne dépend d'aucun logiciel, et il ne casse pas au fil des ans.",
  },
  {
    titre: "C'est structuré pour la machine",
    texte:
      "Titres, listes, tableaux, blocs de code : les mêmes repères se retrouvent d'un fichier à l'autre. L'agent IA sait exactement où se trouve chaque information.",
  },
  {
    titre: "C'est lisible sans être rendu",
    texte:
      "Même brut, un Markdown reste compréhensible : les #, les - et les ** sautent aux yeux. On n'a pas besoin d'un aperçu pour suivre un document.",
  },
  {
    titre: "Git suit chaque modification",
    texte:
      "Une consigne en Markdown se compare, se corrige et se restaure comme du code. C'est la mémoire des règles du projet.",
  },
];

export interface LigneSyntaxe {
  ecrit: string;
  rendu: string;
  role: string;
}

export const syntaxe: LigneSyntaxe[] = [
  { ecrit: "# Titre", rendu: "Titre", role: "Le titre principal du document." },
  { ecrit: "## Sous-titre", rendu: "Sous-titre", role: "Une section, puis des sous-sections." },
  { ecrit: "- une puce", rendu: "• une puce", role: "Une liste d'éléments à parcourir." },
  { ecrit: "1. une étape", rendu: "1. une étape", role: "Une suite ordonnée : un mode d'emploi." },
  { ecrit: "**important**", rendu: "important", role: "Un mot mis en avant, en gras." },
  { ecrit: "`une commande`", rendu: "une commande", role: "Du code court, au milieu d'une phrase." },
  { ecrit: "> une citation", rendu: "Citation", role: "Une règle ou un avertissement mis à part." },
];

export interface Usage {
  titre: string;
  fichier: string;
  texte: string;
}

export const usages: Usage[] = [
  {
    titre: "Donner ses instructions à l'agent",
    fichier: "AGENTS.md",
    texte:
      "Le document que l'agent relit à chaque session : ce qu'est le projet, ses conventions, ce qu'il faut savoir avant d'y toucher.",
  },
  {
    titre: "Se souvenir du projet",
    fichier: "README.md",
    texte:
      "Ce que fait le projet, comment on le lance, ce qu'il ne faut pas casser. Le premier fichier qu'on relit six mois plus tard.",
  },
  {
    titre: "Transporter un mode d'emploi",
    fichier: "workflow.md",
    texte:
      "Le workflow complet, remis à l'agent au début du projet : il guide l'élève pas à pas, sans lui demander de tout retenir.",
  },
];

export interface ErreurMarkdown {
  mauvais: string;
  correction: string;
}

export const erreurs: ErreurMarkdown[] = [
  {
    mauvais: "Écrire un \"document Word\" et le renommer en .md.",
    correction:
      "Un Markdown est du texte pur. On l'écrit dans un éditeur de texte, pas dans un traitement de texte qui ajoute sa propre mise en forme invisible.",
  },
  {
    mauvais: "Mélanger consignes, code et brouillons dans un même gros fichier.",
    correction:
      "Un fichier, un rôle : l'agent s'y retrouve mieux, et vous aussi. On découpe plutôt que d'entasser.",
  },
  {
    mauvais: "Copier un tutoriel sans jamais le relire.",
    correction:
      "Un document de consignes se vérifie avant d'être donné à l'agent : il engage le travail qui suit.",
  },
];

export const workflowMarkdown = {
  fichier: "workflow.md",
  texte:
    "Ce fichier rassemble tout le workflow, écrit pour être remis à l'agent IA au début du projet. Il rappelle que l'élève débute, qu'il n'a jamais utilisé GitHub ni Cloudflare Pages, et que l'agent doit faire le maximum des manipulations techniques — en expliquant ce qu'il fait.",
};
