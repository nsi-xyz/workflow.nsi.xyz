/**
 * POST /api/prof/logout — ferme la session prof.
 */
import { cookieEfface, json, type Env, type PagesFunction } from "../../_lib/http";

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ ok: false, erreurs: ["Méthode non autorisée."] }, 405, { allow: "POST" });
  }
  return json({ ok: true }, 200, { "set-cookie": cookieEfface(new URL(request.url)) });
};
