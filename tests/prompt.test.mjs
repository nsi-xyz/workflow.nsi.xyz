/**
 * Tests du constructeur de prompt (src/lib/prompt.ts) et de ses données.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { blocsRemplis, construirePrompt, exempleChamps, formats } from "../src/lib/prompt.ts";
import { anatomie, antiPatterns, escalade, phrasesPilotage, presets } from "../src/data/prompt.ts";

test("un prompt sans objectif ne produit rien", () => {
  assert.equal(construirePrompt({ ...exempleChamps, objectif: "   " }), "");
});

test("les quatre blocs apparaissent dans l'ordre, séparés par une ligne vide", () => {
  const prompt = construirePrompt(exempleChamps);
  const positions = [
    prompt.indexOf(exempleChamps.objectif),
    prompt.indexOf("Contexte :"),
    prompt.indexOf("Contraintes :"),
    prompt.indexOf("C'est réussi quand :"),
  ];
  assert.ok(positions.every((p) => p >= 0), "un bloc manque dans le prompt assemblé");
  assert.deepEqual(
    [...positions].sort((a, b) => a - b),
    positions,
    "les blocs doivent apparaître dans l'ordre objectif → contexte → contraintes → critère",
  );
  assert.ok(prompt.includes("\n\n"), "les blocs doivent être séparés par une ligne vide");
});

test("les blocs vides sont omis, pas remplacés par du vide", () => {
  const prompt = construirePrompt({
    objectif: "Change le titre.",
    contexte: "",
    contraintes: "",
    critere: "",
    format: "direct",
  });
  assert.ok(prompt.startsWith("Change le titre."));
  assert.ok(!prompt.includes("Contexte :"));
  assert.ok(!prompt.includes("Contraintes :"));
  assert.ok(prompt.includes(formats.find((f) => f.id === "direct")?.phrase.slice(0, 20) ?? "x"));
});

test("chaque format ajoute sa propre phrase de procédure", () => {
  for (const format of formats) {
    const prompt = construirePrompt({ ...exempleChamps, format: format.id });
    assert.ok(prompt.includes(format.phrase), `phrase absente pour le format ${format.id}`);
  }
});

test("un format inconnu retombe sur le plan", () => {
  const prompt = construirePrompt({ ...exempleChamps, format: "nawak" });
  assert.ok(prompt.includes(formats[0].phrase));
});

test("le compteur de blocs reflète ce qui est rempli", () => {
  assert.equal(blocsRemplis({ objectif: "a", contexte: "", contraintes: " ", critere: "b", format: "plan" }), 2);
  assert.equal(blocsRemplis(exempleChamps), 4);
});

test("les quatre parties de l'anatomie sont fournies et expliquées", () => {
  assert.equal(anatomie.length, 4);
  const labels = anatomie.map((partie) => partie.label).join(" | ");
  for (const attendu of ["Objectif", "Contexte", "Contraintes", "Critère"]) {
    assert.ok(labels.includes(attendu), `partie manquante : ${attendu}`);
  }
  for (const partie of anatomie) {
    assert.ok(partie.exemple.trim().length > 20, `exemple trop court : ${partie.label}`);
    assert.ok(partie.pourquoi.trim().length > 40, `explication trop courte : ${partie.label}`);
  }
});

test("chaque anti-pattern propose une correction", () => {
  assert.ok(antiPatterns.length >= 6, "au moins six anti-patterns");
  for (const item of antiPatterns) {
    assert.ok(item.mauvais.trim(), "exemple fautif manquant");
    assert.ok(item.probleme.trim().length > 30, `problème trop vague : ${item.mauvais}`);
    assert.ok(item.correction.trim().length > 40, `correction trop courte : ${item.mauvais}`);
  }
  const textes = antiPatterns.map((item) => item.mauvais).join(" ").toLowerCase();
  assert.ok(textes.includes("clé") || textes.includes("api"), "le piège du secret dans un prompt doit figurer");
});

test("phrases de pilotage, escalade et presets sont complets", () => {
  assert.ok(phrasesPilotage.length >= 6, "au moins six phrases de pilotage");
  assert.ok(escalade.length >= 5, "au moins cinq étapes d'escalade");
  assert.ok(presets.length >= 3, "au moins trois exemples chargeables");
  for (const preset of presets) {
    assert.ok(preset.label.trim(), "preset sans nom");
    assert.ok(preset.champs.objectif.trim().length > 20, `objectif trop court dans ${preset.label}`);
    assert.ok(preset.champs.critere.trim().length > 20, `critère trop court dans ${preset.label}`);
  }
});
