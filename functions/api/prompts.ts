/**
 * POST /api/prompts — dépôt d'un prompt par un élève.
 *
 * Garde-fous : code à 12 caractères (vérifié dans KV), mission connue,
 * longueur bornée, aucun identifiant personnel stocké (seule l'empreinte).
 */
import { corpsJson, json, type Env, type PagesFunction } from "../_lib/http";
import { empreinteCode, validerDepot, type DepotBrut } from "../../src/lib/journal";

export const onRequest: PagesFunction<Env> = async (contexte) => {
  const { request, env } = contexte;

  if (request.method !== "POST") {
    return json({ ok: false, erreurs: ["Méthode non autorisée."] }, 405, { allow: "POST" });
  }

  const depot = await corpsJson<DepotBrut>(request);
  if (!depot) return json({ ok: false, erreurs: ["Requête illisible."] }, 400);

  const { erreurs, valeurs } = validerDepot(depot);
  if (erreurs.length) return json({ ok: false, erreurs }, 400);

  const empreinte = await empreinteCode(depot.code);
  const connu = await env.WORKFLOW.get(`code:${empreinte}`);
  if (connu === null) {
    return json({ ok: false, erreurs: ["Code inconnu. Vérifiez le code distribué en classe."] }, 403);
  }

  const horodatage = new Date().toISOString();
  const alea = crypto.randomUUID().slice(0, 8);
  const entree = {
    horodatage,
    empreinte,
    mission: valeurs.mission,
    mode: valeurs.mode,
    prompt: valeurs.prompt,
  };

  await env.WORKFLOW.put(`prompt:${horodatage}-${alea}`, JSON.stringify(entree));

  return json({ ok: true, message: "Prompt déposé. Merci !", horodatage });
};
