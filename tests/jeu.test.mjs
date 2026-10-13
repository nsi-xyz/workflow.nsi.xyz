/**
 * Tests de la section « Du site au jeu vidéo ».
 * Le contenu doit rester complet et renvoyer au brief du projet final.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { adaptations, avertissement, differences, invariants, specificites } from "../src/data/jeu.ts";

test("la comparaison site / jeu est fournie et complète", () => {
  assert.ok(differences.length >= 5, "au moins cinq différences");
  for (const ligne of differences) {
    assert.ok(ligne.aspect.trim(), "aspect manquant");
    assert.ok(ligne.site.trim().length > 15, `côté site trop court : ${ligne.aspect}`);
    assert.ok(ligne.jeu.trim().length > 15, `côté jeu trop court : ${ligne.aspect}`);
  }
});

test("les invariants et les spécificités sont fournis", () => {
  assert.ok(invariants.length >= 5, "au moins cinq points communs");
  for (const ligne of invariants) {
    assert.ok(ligne.trim().length > 25, `invariant trop court : ${ligne}`);
  }
  assert.ok(specificites.length >= 5, "au moins cinq spécificités d'un jeu");
  for (const specificite of specificites) {
    assert.ok(specificite.titre.trim(), "titre de spécificité manquant");
    assert.ok(specificite.texte.trim().length > 40, `spécificité trop courte : ${specificite.titre}`);
  }
});

test("les adaptations du workflow sont expliquées", () => {
  assert.ok(adaptations.length >= 4, "au moins quatre adaptations");
  for (const etape of adaptations) {
    assert.ok(etape.titre.trim(), "titre d'adaptation manquant");
    assert.ok(etape.texte.trim().length > 30, `adaptation trop courte : ${etape.titre}`);
  }
});

test("l'avertissement renvoie au brief du projet", () => {
  assert.ok(avertissement.trim().length > 40, "avertissement trop court");
  const texte = avertissement.toLowerCase();
  assert.ok(texte.includes("projet"), "l'avertissement doit renvoyer à la page du projet");
});
