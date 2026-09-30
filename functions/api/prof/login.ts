/**
 * POST /api/prof/login — ouvre une session prof (cookie signé, 8 heures).
 * Le mot de passe et la clé de signature sont des secrets de déploiement.
 */
import { cookieSession, corpsJson, json, type Env, type PagesFunction } from "../../_lib/http";
import { memesSecrets, signerSession } from "../../../src/lib/journal";

const DUREE_SESSION_S = 8 * 3600;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "POST") {
    return json({ ok: false, erreurs: ["Méthode non autorisée."] }, 405, { allow: "POST" });
  }

  const motDePasseAttendu = env.PROF_PASSWORD;
  const secret = env.SESSION_SECRET;
  if (!motDePasseAttendu || !secret) {
    return json(
      { ok: false, erreurs: ["Espace prof non configuré sur ce déploiement (mot de passe manquant)."] },
      503,
    );
  }

  const corps = await corpsJson<{ password?: string }>(request);
  const fourni = String(corps?.password ?? "");
  if (!fourni || !(await memesSecrets(fourni, motDePasseAttendu))) {
    return json({ ok: false, erreurs: ["Mot de passe incorrect."] }, 401);
  }

  const expiration = Date.now() + DUREE_SESSION_S * 1000;
  const jeton = await signerSession(expiration, secret);
  const url = new URL(request.url);

  return json({ ok: true }, 200, { "set-cookie": cookieSession(jeton, DUREE_SESSION_S, url) });
};
