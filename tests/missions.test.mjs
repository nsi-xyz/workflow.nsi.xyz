/**
 * Tests des missions guidées.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { missions } from "../src/data/missions.ts";
import { navItems } from "../src/data/navigation.ts";

test("trois missions complètes sont proposées", () => {
  assert.equal(missions.length, 3, "trois missions : premier contact, dépôt et publication, pilotage");
  for (const mission of missions) {
    assert.ok(mission.titre.trim(), "titre manquant");
    assert.ok(mission.objectif.trim().length > 40, `objectif trop court : ${mission.titre}`);
    assert.ok(mission.duree.trim(), `durée manquante : ${mission.titre}`);
    assert.ok(mission.finiQuand.trim().length > 40, `critère de fin trop court : ${mission.titre}`);
  }
});

test("les identifiants sont uniques, étapes comprises", () => {
  const idsMissions = missions.map((mission) => mission.id);
  assert.equal(new Set(idsMissions).size, idsMissions.length, "identifiant de mission en double");

  const idsEtapes = missions.flatMap((mission) => mission.etapes.map((etape) => etape.id));
  assert.equal(new Set(idsEtapes).size, idsEtapes.length, "identifiant d'étape en double");
});

test("chaque mission propose au moins six étapes utiles", () => {
  for (const mission of missions) {
    assert.ok(mission.etapes.length >= 6, `trop peu d'étapes : ${mission.titre}`);
    for (const etape of mission.etapes) {
      assert.ok(etape.texte.trim().length > 25, `étape trop courte : ${etape.id}`);
    }
  }
});

test("chaque mission renvoie vers une section existante", () => {
  const connues = new Set(navItems.map((entry) => `/${entry.slug}`));
  for (const mission of missions) {
    assert.ok(connues.has(mission.lienUtile.href), `lien inconnu : ${mission.lienUtile.href}`);
    assert.ok(mission.lienUtile.label.trim(), "libellé de lien manquant");
  }
});

test("les commandes fournies restent sûres", () => {
  const commandes = missions
    .flatMap((mission) => mission.etapes.map((etape) => etape.commande ?? ""))
    .filter(Boolean)
    .join(" | ");
  assert.ok(!/rm\s+-rf/.test(commandes), "aucune commande destructrice dans les missions");
  assert.ok(/git check-ignore/.test(commandes), "la vérification du .env doit être enseignée");
});

test("aucun texte ne contient de pluriel paresseux", () => {
  const texte = missions
    .flatMap((mission) => [
      mission.titre,
      mission.objectif,
      mission.finiQuand,
      ...mission.etapes.map((etape) => etape.texte),
    ])
    .join(" ");
  assert.ok(!/[a-zà-ÿ]\(s\)/.test(texte), "pluriel « (s) » interdit");
});
