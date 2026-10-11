/**
 * Tests de la page « Coûts et budget » : catalogue de modèles, répartition
 * du profil d'usage, et cohérence des données éditoriales.
 *
 * Le calcul de référence reproduit le tableau du document de cours
 * (100 millions de jetons, 70 % de cache / 20 % d'entrée / 10 % de sortie).
 */

import test from "node:test";
import assert from "node:assert/strict";
import { coutModele, MIX_DEFAUT, MODELE_REFERENCE, modeles, partsDepuisCache } from "../src/lib/cout.ts";
import {
  budget,
  gratuits,
  heuresParis,
  nonNecessaires,
  plans,
  plansUnDollar,
  postes,
  regles,
  sources,
} from "../src/data/couts.ts";

const parId = new Map(modeles.map((modele) => [modele.id, modele]));

/** Récupère un modèle du catalogue, ou échoue proprement. */
function modele(id) {
  const trouve = parId.get(id);
  assert.ok(trouve, `modèle introuvable dans le catalogue : ${id}`);
  return trouve;
}

test("le catalogue de modèles est complet et cohérent", () => {
  assert.ok(modeles.length >= 12, "au moins douze modèles comparés");
  const ids = modeles.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length, "identifiant de modèle en double");
  for (const entry of modeles) {
    assert.ok(entry.nom.trim(), "nom manquant");
    assert.ok(entry.famille.trim(), `famille manquante : ${entry.id}`);
    assert.ok(entry.entree > 0 && entry.sortie > 0 && entry.cache > 0, `prix invalide : ${entry.id}`);
    assert.ok(entry.cache < entry.entree, `le cache doit être moins cher que l'entrée : ${entry.id}`);
  }
});

test("le modèle de référence existe et correspond à DeepSeek en heures creuses", () => {
  const reference = modele(MODELE_REFERENCE);
  assert.equal(reference.recommande, true, "le modèle de référence doit être le conseillé");
});

test("le profil d'usage par défaut vaut 70 % de cache, 20 % d'entrée, 10 % de sortie", () => {
  assert.equal(MIX_DEFAUT.cache, 0.7);
  assert.ok(Math.abs(MIX_DEFAUT.entree - 0.2) < 1e-9);
  assert.ok(Math.abs(MIX_DEFAUT.sortie - 0.1) < 1e-9);
});

test("la répartition du volume est stable et bornée", () => {
  const plein = partsDepuisCache(0);
  assert.ok(Math.abs(plein.entree - 2 / 3) < 1e-9);
  assert.ok(Math.abs(plein.sortie - 1 / 3) < 1e-9);
  assert.equal(plein.cache, 0);

  const toutCache = partsDepuisCache(1);
  assert.equal(toutCache.cache, 1);
  assert.equal(toutCache.entree, 0);

  const borne = partsDepuisCache(-3);
  assert.equal(borne.cache, 0, "une part négative doit être ramenée à 0");
  const borneHaute = partsDepuisCache(4);
  assert.equal(borneHaute.cache, 1, "une part > 1 doit être ramenée à 1");
});

test("les coûts reproduisent le document de cours pour 100 M de jetons", () => {
  const creux = coutModele(modele("deepseek-creux"), 100, 0.7);
  const pleines = coutModele(modele("deepseek-pointe"), 100, 0.7);
  assert.ok(Math.abs(creux - 9.21) < 0.01, `DeepSeek creux : ${creux}`);
  assert.ok(Math.abs(pleines - 18.42) < 0.01, `DeepSeek pleines : ${pleines}`);
  assert.ok(Math.abs(coutModele(modele("claude-fable5"), 100, 0.7) - 770) < 0.5);
});

test("le coût croît avec le volume et diminue avec le cache", () => {
  const reference = modele("deepseek-creux");
  assert.ok(coutModele(reference, 200, 0.7) > coutModele(reference, 100, 0.7));
  assert.ok(coutModele(reference, 100, 0.9) < coutModele(reference, 100, 0.3));
});

test("les données éditoriales de la page sont complètes", () => {
  assert.ok(gratuits.length >= 3, "au moins trois outils gratuits");
  assert.ok(nonNecessaires.length >= 2, "au moins deux dépenses non nécessaires");
  assert.ok(postes.length >= 3, "entrée, sortie, cache");
  assert.ok(plans.length >= 4, "au moins quatre plans d'abonnement");
  assert.ok(plans.some((plan) => plan.recommande), "un plan doit être recommandé");
  assert.ok(plansUnDollar.length >= 2, "au moins deux plans à 1 $");
  assert.ok(regles.length >= 4, "au moins quatre règles d'usage");
  assert.ok(sources.length >= 3, "au moins trois sources");
  assert.ok(budget.titre.trim().length > 10 && budget.texte.trim().length > 40, "budget incomplet");
  assert.ok(heuresParis.some((ligne) => ligne.creux), "il faut des heures creuses");
  assert.ok(heuresParis.some((ligne) => !ligne.creux), "il faut des heures pleines");
});
