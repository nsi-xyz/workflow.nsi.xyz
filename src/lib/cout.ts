/**
 * Calculs de coût DeepSeek — source unique, testée, utilisée par le site ET par
 * le calculateur interactif.
 *
 * Tarifs officiels relevés le 29/09/2026 sur https://api-docs.deepseek.com/quick_start/pricing
 * (prix en dollars US par million de tokens). Ils peuvent changer : la page
 * « L'IA et les modèles » affiche la date de vérification.
 *
 * Heures pleines : 01:00–04:00 et 06:00–10:00 UTC, du lundi au vendredi
 * (hors jours fériés chinois). Tout le reste — dont les week-ends entiers —
 * est en heures creuses, à moitié prix.
 */

export type ModeleId = "flash" | "pro";

export interface TarifModele {
  id: ModeleId;
  /** Nom d'API à utiliser. */
  api: string;
  /** Nom lisible (documentation). */
  nom: string;
  /** Contexte maximal, en tokens. */
  contexte: number;
  /** Sortie maximale, en tokens. */
  sortieMax: number;
  /** USD par million de tokens — entrée, cache manqué. */
  entreeCreux: number;
  entreePointe: number;
  /** USD par million de tokens — entrée, cache touché. */
  cacheCreux: number;
  cachePointe: number;
  /** USD par million de tokens — sortie. */
  sortieCreux: number;
  sortiePointe: number;
}

export const tarifs: Record<ModeleId, TarifModele> = {
  flash: {
    id: "flash",
    api: "deepseek-flash",
    nom: "DeepSeek V4.1 Flash",
    contexte: 1_000_000,
    sortieMax: 384_000,
    entreeCreux: 0.15,
    entreePointe: 0.3,
    cacheCreux: 0.003,
    cachePointe: 0.006,
    sortieCreux: 0.6,
    sortiePointe: 1.2,
  },
  pro: {
    id: "pro",
    api: "deepseek-v4-pro",
    nom: "DeepSeek V4 Pro",
    contexte: 1_000_000,
    sortieMax: 384_000,
    entreeCreux: 0.66,
    entreePointe: 1.32,
    cacheCreux: 0.022,
    cachePointe: 0.044,
    sortieCreux: 1.98,
    sortiePointe: 3.96,
  },
};

/** Tarifs applicables à un instant donné, selon le mode choisi. */
export function tarifsPour(
  modele: ModeleId,
  pointe: boolean,
): { cache: number; entree: number; sortie: number } {
  const tarif = tarifs[modele];
  return pointe
    ? { cache: tarif.cachePointe, entree: tarif.entreePointe, sortie: tarif.sortiePointe }
    : { cache: tarif.cacheCreux, entree: tarif.entreeCreux, sortie: tarif.sortieCreux };
}

/** Heures pleines : 01:00–04:00 et 06:00–10:00 UTC, du lundi au vendredi. */
export function estHeurePleine(date: Date): boolean {
  const jour = date.getUTCDay();
  if (jour === 0 || jour === 6) return false;
  const heures = date.getUTCHours() + date.getUTCMinutes() / 60;
  return (heures >= 1 && heures < 4) || (heures >= 6 && heures < 10);
}

export interface CoutDemande {
  modele: ModeleId;
  /** Tokens d'entrée par requête (contexte, fichiers, historique). */
  tokensEntree: number;
  /** Tokens de sortie par requête (réponse, code, raisonnement). */
  tokensSortie: number;
  /** Nombre de requêtes. */
  requetes: number;
  /** Part de l'entrée déjà en cache (0 à 1). */
  partCache?: number;
  /** true = heures pleines, false = heures creuses. */
  pointe: boolean;
}

/** Coût total en dollars US. */
export function coutEnDollars(demande: CoutDemande): number {
  const { modele, tokensEntree, tokensSortie, requetes, pointe } = demande;
  const partCache = Math.min(Math.max(demande.partCache ?? 0, 0), 1);
  const tarif = tarifsPour(modele, pointe);

  const entree = (tokensEntree * ((1 - partCache) * tarif.entree + partCache * tarif.cache)) / 1e6;
  const sortie = (tokensSortie * tarif.sortie) / 1e6;
  return (entree + sortie) * requetes;
}

/** Montant lisible en dollars, sans arrondir les petits montants à zéro. */
export function dollars(montant: number): string {
  const decimales = montant > 0 && montant < 0.1 ? 4 : 2;
  return `${montant.toFixed(decimales).replace(".", ",")} $`;
}

/** Estimation « au doigt mouillé » du nombre de tokens d'un texte français. */
export function tokensDepuisTexte(texte: string): number {
  return Math.ceil(texte.length / 3.5);
}
