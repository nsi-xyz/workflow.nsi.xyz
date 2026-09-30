/**
 * Tests des données de la section « Dépannage ».
 */

import test from "node:test";
import assert from "node:assert/strict";
import { famillesPannes, pannes } from "../src/data/depannage.ts";

test("chaque famille annoncée contient au moins une panne", () => {
  for (const famille of famillesPannes) {
    const nombre = pannes.filter((panne) => panne.famille === famille).length;
    assert.ok(nombre >= 1, `famille vide : ${famille}`);
  }
});

test("les identifiants sont uniques et chaque famille est connue", () => {
  const ids = pannes.map((panne) => panne.id);
  assert.equal(new Set(ids).size, ids.length, "identifiant de panne en double");
  for (const panne of pannes) {
    assert.ok(famillesPannes.includes(panne.famille), `famille inconnue : ${panne.famille}`);
  }
});

test("chaque fiche est complète : message, traduction, correction, prévention", () => {
  assert.ok(pannes.length >= 12, "la base doit couvrir au moins douze pannes");
  assert.ok(famillesPannes.length >= 4, "au moins quatre familles");
  for (const panne of pannes) {
    assert.ok(panne.message.trim().length > 10, `message trop court : ${panne.id}`);
    assert.ok(panne.traduction.trim().length > 20, `traduction trop courte : ${panne.id}`);
    assert.ok(panne.correction.trim().length > 40, `correction trop courte : ${panne.id}`);
    assert.ok(panne.prevention.trim().length > 30, `prévention trop courte : ${panne.id}`);
  }
});

test("les pannes les plus fréquentes sont documentées", () => {
  const textes = pannes.map((panne) => `${panne.id} ${panne.message}`).join(" ").toLowerCase();
  for (const attendu of ["401", "not a git repository", "pending", "port"]) {
    assert.ok(textes.includes(attendu.toLowerCase()), `panne manquante : ${attendu}`);
  }
});

test("le secret poussé par erreur mène à la procédure de rotation", () => {
  const fuite = pannes.find((panne) => panne.id === "env-committe");
  assert.ok(fuite, "la panne « .env poussé par erreur » doit exister");
  assert.ok(/tourner/i.test(fuite.correction), "la correction doit dire de tourner la clé d'abord");
});

test("aucun texte ne contient de pluriel paresseux", () => {
  const textes = pannes.map((panne) => Object.values(panne).join(" ")).join(" ");
  assert.ok(!/[a-zà-ÿ]\(s\)/.test(textes), "pluriel « (s) » interdit");
});
