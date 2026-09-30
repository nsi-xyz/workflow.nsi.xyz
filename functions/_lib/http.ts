/**
 * Petits utilitaires partagés par les Pages Functions.
 * Le dossier commence par « _ » : Cloudflare Pages ne le transforme pas en route.
 */

export interface Env {
  /** Namespace KV : codes élèves (hachés) et dépôts de prompts. */
  WORKFLOW: KvNamespaceLike;
  /** Mot de passe de l'espace prof (secret de production). */
  PROF_PASSWORD?: string;
  /** Clé de signature des sessions prof (secret de production). */
  SESSION_SECRET?: string;
}

/**
 * Types minimaux de l'exécution Cloudflare Pages, écrits à la main.
 *
 * Pourquoi pas `@cloudflare/workers-types` ? Ce paquet redéfinit des types DOM
 * (par exemple `ChildNode.remove`) et entre en conflit avec la bibliothèque DOM
 * qu'Astro utilise pour compiler les composants. Les fonctions dont nous avons
 * besoin sont peu nombreuses : les déclarer ici est plus simple et plus stable.
 */
export interface KvNamespaceLike {
  get(cle: string): Promise<string | null>;
  put(cle: string, valeur: string): Promise<void>;
  list(options: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ keys: Array<{ name: string }>; list_complete: boolean; cursor?: string }>;
}

export interface PagesContexte<E> {
  request: Request;
  env: E;
  params: Record<string, string>;
  next: () => Promise<Response>;
  waitUntil: (promesse: Promise<unknown>) => void;
}

export type PagesFunction<E> = (contexte: PagesContexte<E>) => Response | Promise<Response>;

export const NOM_COOKIE_SESSION = "workflow_prof";

/** Réponse JSON sans mise en cache. */
export function json(donnees: unknown, statut = 200, entetes: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(donnees), {
    status: statut,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...entetes,
    },
  });
}

/** Lecture des cookies de la requête. */
export function lireCookies(requete: Request): Record<string, string> {
  const brut = requete.headers.get("cookie") ?? "";
  const cookies: Record<string, string> = {};
  for (const morceau of brut.split(";")) {
    const index = morceau.indexOf("=");
    if (index === -1) continue;
    cookies[morceau.slice(0, index).trim()] = decodeURIComponent(morceau.slice(index + 1).trim());
  }
  return cookies;
}

/** Cookie de session : HttpOnly, SameSite strict, Secure en production. */
export function cookieSession(jeton: string, maxAgeSecondes: number, url: URL): string {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${NOM_COOKIE_SESSION}=${encodeURIComponent(jeton)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSecondes}${secure}`;
}

export function cookieEfface(url: URL): string {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${NOM_COOKIE_SESSION}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

/** Corps JSON d'une requête, ou null si illisible. */
export async function corpsJson<T>(requete: Request): Promise<T | null> {
  try {
    return (await requete.json()) as T;
  } catch {
    return null;
  }
}
