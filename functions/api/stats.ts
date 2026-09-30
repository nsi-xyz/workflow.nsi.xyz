/**
 * GET /api/stats — compteurs publics affichés sur la page de dépôt.
 * Deux lectures KV, résultat mis en cache 60 s pour ménager le quota.
 */
import { json, type Env, type KvNamespaceLike, type PagesFunction } from "../_lib/http";

async function compter(kv: KvNamespaceLike, prefixe: string): Promise<number> {
  let total = 0;
  let curseur: string | undefined;

  do {
    const page = await kv.list({ prefix: prefixe, limit: 1000, cursor: curseur });
    total += page.keys.length;
    curseur = page.list_complete ? undefined : page.cursor;
  } while (curseur && total < 5000);

  return total;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "GET") {
    return json({ ok: false, erreurs: ["Méthode non autorisée."] }, 405, { allow: "GET" });
  }

  const [prompts, codes] = await Promise.all([
    compter(env.WORKFLOW, "prompt:"),
    compter(env.WORKFLOW, "code:"),
  ]);

  return json({ ok: true, prompts, codes }, 200, { "cache-control": "public, max-age=60" });
};
