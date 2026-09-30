/**
 * GET /api/prof/prompts — liste paginée des dépôts (session prof requise).
 *
 * La pagination est volontaire : chaque lecture de valeur compte comme une
 * sous-requête, et une invocation est limitée à 50 sous-requêtes. On plafonne
 * donc à 50 dépôts par appel ; la page prof enchaîne les appels.
 */
import { json, lireCookies, NOM_COOKIE_SESSION, type Env, type PagesFunction } from "../../_lib/http";
import { verifierSession } from "../../../src/lib/journal";

const LIMITE_MAX = 50;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "GET") {
    return json({ ok: false, erreurs: ["Méthode non autorisée."] }, 405, { allow: "GET" });
  }

  const secret = env.SESSION_SECRET;
  if (!secret) {
    return json({ ok: false, erreurs: ["Espace prof non configuré."] }, 503);
  }

  const jeton = lireCookies(request)[NOM_COOKIE_SESSION];
  if (!(await verifierSession(jeton, secret))) {
    return json({ ok: false, erreurs: ["Session absente ou expirée."] }, 401);
  }

  const url = new URL(request.url);
  const limite = Math.min(Math.max(Number(url.searchParams.get("limit")) || 30, 1), LIMITE_MAX);
  const decalage = Math.max(Number(url.searchParams.get("offset")) || 0, 0);

  // 1 sous-requête : la liste des clés. Les clés commencent par l'horodatage ISO,
  // donc le tri lexicographique décroissant donne le plus récent en premier.
  const page = await env.WORKFLOW.list({ prefix: "prompt:", limit: 1000 });
  const cles = [...page.keys].sort((a, b) => (a.name < b.name ? 1 : -1));
  const tranche = cles.slice(decalage, decalage + limite);

  // Au plus 50 sous-requêtes pour récupérer les valeurs de la page.
  const bruts = await Promise.all(tranche.map((cle) => env.WORKFLOW.get(cle.name)));
  const entrees = bruts
    .map((brut) => {
      if (!brut) return null;
      try {
        return JSON.parse(brut) as {
          horodatage: string;
          empreinte: string;
          mission: string;
          mode: string;
          prompt: string;
        };
      } catch {
        return null;
      }
    })
    .filter((entree): entree is NonNullable<typeof entree> => entree !== null);

  return json({
    ok: true,
    total: cles.length,
    offset: decalage,
    limit: limite,
    hasMore: decalage + limite < cles.length,
    items: entrees,
  });
};
