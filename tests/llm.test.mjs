/**
 * Tests des tarifs et du calcul de coût DeepSeek.
 * Un calculateur pédagogique qui se trompe d'un facteur 2 est pire que pas de
 * calculateur : ces tests verrouillent les formules et la règle des heures pleines.
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  coutEnDollars,
  dollars,
  estHeurePleine,
  tarifs,
  tarifsPour,
  tokensDepuisTexte,
} from "../src/lib/cout.ts";

const lundi = (h, m = 0) => new Date(Date.UTC(2026, 8, 28, h, m)); // lundi 28/09/2026
const samedi = (h) => new Date(Date.UTC(2026, 9, 3, h)); // samedi 03/10/2026
const dimanche = (h) => new Date(Date.UTC(2026, 9, 4, h)); // dimanche 04/10/2026

test("les heures pleines suivent la règle officielle 01–04 et 06–10 UTC, en semaine", () => {
  assert.equal(estHeurePleine(lundi(2)), true, "lundi 02 h UTC doit être plein");
  assert.equal(estHeurePleine(lundi(4)), false, "04 h UTC pile doit être creux");
  assert.equal(estHeurePleine(lundi(5)), false, "05 h UTC doit être creux");
  assert.equal(estHeurePleine(lundi(7)), true, "07 h UTC doit être plein");
  assert.equal(estHeurePleine(lundi(10)), false, "10 h UTC pile doit être creux");
  assert.equal(estHeurePleine(lundi(13)), false, "13 h UTC doit être creux");
  assert.equal(estHeurePleine(samedi(7)), false, "le samedi est toujours creux");
  assert.equal(estHeurePleine(dimanche(2)), false, "le dimanche est toujours creux");
});

test("les heures pleines valent exactement le double des heures creuses", () => {
  for (const modele of ["flash", "pro"]) {
    const creux = tarifsPour(modele, false);
    const pointe = tarifsPour(modele, true);
    assert.equal(pointe.entree, creux.entree * 2, `entrée ×2 attendu pour ${modele}`);
    assert.equal(pointe.sortie, creux.sortie * 2, `sortie ×2 attendu pour ${modele}`);
    assert.equal(pointe.cache, creux.cache * 2, `cache ×2 attendu pour ${modele}`);
  }
});

test("le cache est bien plus de dix fois moins cher que l'entrée", () => {
  for (const modele of ["flash", "pro"]) {
    const tarif = tarifsPour(modele, false);
    assert.ok(
      tarif.cache * 10 < tarif.entree,
      `cache non négligeable pour ${modele} : ${tarif.cache} vs ${tarif.entree}`,
    );
  }
});

test("le coût se calcule au million de tokens, sans cache", () => {
  // 1 M d'entrée + 1 M de sortie, hors cache, heures creuses, une requête.
  const cout = coutEnDollars({
    modele: "flash",
    tokensEntree: 1_000_000,
    tokensSortie: 1_000_000,
    requetes: 1,
    partCache: 0,
    pointe: false,
  });
  assert.equal(cout, tarifs.flash.entreeCreux + tarifs.flash.sortieCreux);

  const coutPro = coutEnDollars({
    modele: "pro",
    tokensEntree: 1_000_000,
    tokensSortie: 1_000_000,
    requetes: 1,
    partCache: 0,
    pointe: false,
  });
  assert.equal(coutPro, tarifs.pro.entreeCreux + tarifs.pro.sortieCreux);
});

test("le cache réduit la facture, et la part de cache est bornée", () => {
  const base = {
    modele: "flash",
    tokensEntree: 1_000_000,
    tokensSortie: 0,
    requetes: 1,
    pointe: false,
  };
  const sansCache = coutEnDollars({ ...base, partCache: 0 });
  const avecCache = coutEnDollars({ ...base, partCache: 1 });
  assert.equal(sansCache, tarifs.flash.entreeCreux);
  assert.equal(avecCache, tarifs.flash.cacheCreux);
  assert.ok(avecCache < sansCache);

  const partNegative = coutEnDollars({ ...base, partCache: -3 });
  const partTropGrande = coutEnDollars({ ...base, partCache: 4 });
  assert.equal(partNegative, sansCache, "une part négative doit être ramenée à 0");
  assert.equal(partTropGrande, avecCache, "une part > 1 doit être ramenée à 1");
});

test("le coût est proportionnel au nombre de requêtes", () => {
  const une = coutEnDollars({
    modele: "flash",
    tokensEntree: 4_000,
    tokensSortie: 800,
    requetes: 1,
    partCache: 0.5,
    pointe: false,
  });
  const dix = coutEnDollars({
    modele: "flash",
    tokensEntree: 4_000,
    tokensSortie: 800,
    requetes: 10,
    partCache: 0.5,
    pointe: false,
  });
  assert.ok(Math.abs(dix - une * 10) < 1e-12);
});

test("l'affichage des montants ne perd pas les petits nombres", () => {
  assert.equal(dollars(0), "0,00 $");
  assert.equal(dollars(0.045), "0,0450 $");
  assert.equal(dollars(1.5), "1,50 $");
  assert.equal(dollars(12), "12,00 $");
});

test("l'estimation du nombre de tokens reste plausible", () => {
  assert.equal(tokensDepuisTexte(""), 0);
  assert.equal(tokensDepuisTexte("Bonjour"), 2);
  const page = "a".repeat(3500);
  assert.equal(tokensDepuisTexte(page), 1000);
});
