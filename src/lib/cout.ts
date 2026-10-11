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

/* ------------------------------------------------------------------ *
 * Catalogue multi-modèles — page « Coûts et budget ».
 *
 * Tarifs relevés le 30/09/2026 (dollars US par million de jetons), pour
 * un usage d'agent réaliste : 70 % de cache, 20 % d'entrée, 10 % de sortie.
 * `abonnement` signale un modèle ouvert couvert par un abonnement type
 * OpenCode Go, dont l'enveloppe amplifiée divise le coût effectif par ~6.
 * ------------------------------------------------------------------ */

export interface ModeleCout {
  id: string;
  nom: string;
  famille: string;
  /** Prix d'entrée, en dollars par million de jetons. */
  entree: number;
  /** Prix de sortie, en dollars par million de jetons. */
  sortie: number;
  /** Prix de lecture de cache, en dollars par million de jetons. */
  cache: number;
  /** Modèle ouvert couvert par un abonnement type OpenCode Go. */
  abonnement?: boolean;
  /** Modèle conseillé pour le projet d'élève. */
  recommande?: boolean;
}

export const modeles: ModeleCout[] = [
  { id: "mimo-flash", nom: "MiMo V2.6 Flash", famille: "Xiaomi · Chine", entree: 0.14, sortie: 0.28, cache: 0.0028, abonnement: true },
  { id: "gpt6-luna", nom: "GPT-6 Luna", famille: "OpenAI · USA", entree: 0.1, sortie: 0.5, cache: 0.01 },
  { id: "qwen38-flash", nom: "Qwen3.8 Flash", famille: "Alibaba · Chine", entree: 0.15, sortie: 0.47, cache: 0.016, abonnement: true },
  { id: "deepseek-creux", nom: "DeepSeek V4.1 Flash (heures creuses)", famille: "DeepSeek · Chine", entree: 0.15, sortie: 0.6, cache: 0.003, abonnement: true, recommande: true },
  { id: "glm53-flash", nom: "GLM-5.3 Flash", famille: "Zhipu · Chine", entree: 0.15, sortie: 0.5, cache: 0.03, abonnement: true },
  { id: "gpt56-luna", nom: "GPT-5.6 Luna", famille: "OpenAI · USA", entree: 0.2, sortie: 1.2, cache: 0.02 },
  { id: "deepseek-pointe", nom: "DeepSeek V4.1 Flash (heures pleines)", famille: "DeepSeek · Chine", entree: 0.3, sortie: 1.2, cache: 0.006, abonnement: true },
  { id: "minimax-m3", nom: "MiniMax M3", famille: "MiniMax · Chine", entree: 0.3, sortie: 1.2, cache: 0.06, abonnement: true },
  { id: "kimi-k27", nom: "Kimi K2.7 Code", famille: "Moonshot · Chine", entree: 0.95, sortie: 4.0, cache: 0.19, abonnement: true },
  { id: "qwen38-max", nom: "Qwen3.8 Max", famille: "Alibaba · Chine", entree: 2.0, sortie: 6.0, cache: 0.25 },
  { id: "kimi-k3", nom: "Kimi K3", famille: "Moonshot · Chine", entree: 3.0, sortie: 15.0, cache: 0.3 },
  { id: "claude-sonnet5", nom: "Claude Sonnet 5", famille: "Anthropic · USA", entree: 3.0, sortie: 15.0, cache: 0.3 },
  { id: "claude-opus5", nom: "Claude Opus 5", famille: "Anthropic · USA", entree: 5.0, sortie: 25.0, cache: 0.5 },
  { id: "gpt56-sol", nom: "GPT-5.6 Sol", famille: "OpenAI · USA", entree: 5.0, sortie: 30.0, cache: 0.5 },
  { id: "claude-fable5", nom: "Claude Fable 5", famille: "Anthropic · USA", entree: 10.0, sortie: 50.0, cache: 1.0 },
];

/** Modèle de référence des comparaisons : DeepSeek Flash en heures creuses. */
export const MODELE_REFERENCE = "deepseek-creux";

/** Profil d'usage d'agent qui sert de référence pédagogique. */
export const MIX_DEFAUT = { cache: 0.7, entree: 0.2, sortie: 0.1 };

/**
 * Répartit 100 % du volume à partir de la seule part de cache : le reste est
 * coupé en deux tiers d'entrée et un tiers de sortie (soit 20 % / 10 % quand
 * le cache vaut 70 %).
 */
export function partsDepuisCache(partCache: number): { cache: number; entree: number; sortie: number } {
  const cache = Math.min(Math.max(partCache, 0), 1);
  const reste = 1 - cache;
  return { cache, entree: reste * (2 / 3), sortie: reste / 3 };
}

/** Coût d'un scénario (volume en millions de jetons) pour un modèle donné. */
export function coutModele(modele: ModeleCout, volumeMillions: number, partCache = MIX_DEFAUT.cache): number {
  const parts = partsDepuisCache(partCache);
  return (
    volumeMillions *
    (parts.entree * modele.entree + parts.sortie * modele.sortie + parts.cache * modele.cache)
  );
}
