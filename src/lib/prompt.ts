/**
 * Construction d'un prompt — logique pure, testée, partagée entre le serveur
 * (rendu initial du constructeur) et le navigateur (mise à jour en direct).
 *
 * Un prompt utile répond à quatre questions : quoi, dans quel contexte, avec
 * quelles contraintes, et à quoi on reconnaîtra que c'est réussi.
 */

export interface ChampsPrompt {
  /** Ce qu'on veut obtenir. */
  objectif: string;
  /** Où l'on en est : fichiers, technologie, état du projet. */
  contexte: string;
  /** Ce qu'il ne faut pas toucher, les règles à respecter. */
  contraintes: string;
  /** Le critère de réussite, vérifiable. */
  critere: string;
  /** Manière de procéder attendue. */
  format: FormatPrompt;
}

export type FormatPrompt = "direct" | "plan" | "etapes";

export const formats: Array<{ id: FormatPrompt; label: string; phrase: string }> = [
  {
    id: "plan",
    label: "Plan d'abord (recommandé)",
    phrase: "Avant d'agir, décris ton plan sans modifier aucun fichier. J'attends ma validation.",
  },
  {
    id: "etapes",
    label: "Petites étapes",
    phrase:
      "Procède par petites étapes : annonce ce que tu vas faire, fais-le, puis attends ma validation avant de continuer.",
  },
  {
    id: "direct",
    label: "Exécution directe",
    phrase: "Tu peux modifier les fichiers nécessaires, puis explique-moi ce que tu as changé.",
  },
];

export const exempleChamps: ChampsPrompt = {
  objectif: "Ajoute une section « horaires » sous la présentation de la page d'accueil.",
  contexte:
    "Projet Astro. La page concernée est src/pages/index.astro ; les styles sont dans src/styles. Les autres sections sont déjà en place.",
  contraintes:
    "Ne modifie que src/pages/index.astro. Réutilise les classes existantes, n'ajoute aucune dépendance et ne touche pas au pied de page.",
  critere:
    "La section s'affiche sous la présentation, avec un tableau à deux colonnes ; le reste de la page est identique.",
  format: "plan",
};

/** Assemble le prompt final. Renvoie une chaîne vide si l'objectif est vide. */
export function construirePrompt(champs: ChampsPrompt): string {
  const objectif = champs.objectif.trim();
  if (!objectif) return "";

  const blocs: string[] = [objectif];
  const contexte = champs.contexte.trim();
  const contraintes = champs.contraintes.trim();
  const critere = champs.critere.trim();

  if (contexte) blocs.push(`Contexte : ${contexte}`);
  if (contraintes) blocs.push(`Contraintes : ${contraintes}`);
  if (critere) blocs.push(`C'est réussi quand : ${critere}`);

  const format = formats.find((f) => f.id === champs.format) ?? formats[0];
  blocs.push(format.phrase);

  return blocs.join("\n\n");
}

/** Nombre de blocs effectivement remplis (pour l'indicateur du constructeur). */
export function blocsRemplis(champs: ChampsPrompt): number {
  return [champs.objectif, champs.contexte, champs.contraintes, champs.critere].filter(
    (valeur) => valeur.trim().length > 0,
  ).length;
}
