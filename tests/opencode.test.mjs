/**
 * Tests des données de la section « OpenCode ».
 * Les commandes et raccourcis sont vérifiés à la main sur la documentation
 * officielle : ces tests garantissent qu'aucune ligne ne se perd en route.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { commandes, pieges, planVsBuild, premiersPas, raccourcis } from "../src/data/opencode.ts";

test("les commandes sont nombreuses, uniques et bien formées", () => {
  assert.ok(commandes.length >= 12, "la table des commandes doit être complète");
  const noms = commandes.map((commande) => commande.nom);
  assert.equal(new Set(noms).size, noms.length, "commande en double");
  for (const commande of commandes) {
    assert.ok(commande.nom.startsWith("/"), `une commande commence par / : ${commande.nom}`);
    assert.ok(commande.role.trim().length >= 5, `rôle trop court : ${commande.nom}`);
    assert.ok(commande.detail.trim().length >= 15, `explication trop courte : ${commande.nom}`);
  }
});

test("les commandes essentielles sont présentes", () => {
  const noms = new Set(commandes.map((commande) => commande.nom));
  for (const attendue of ["/help", "/connect", "/init", "/models", "/compact", "/undo", "/export", "/share"]) {
    assert.ok(noms.has(attendue), `commande manquante : ${attendue}`);
  }
});

test("les raccourcis couvrent Tab, @, ! et la palette", () => {
  assert.ok(raccourcis.length >= 5, "il faut au moins cinq raccourcis");
  const touches = raccourcis.map((raccourci) => raccourci.touche).join(" ");
  for (const touche of ["Tab", "@", "!", "Ctrl + p"]) {
    assert.ok(touches.includes(touche), `raccourci manquant : ${touche}`);
  }
});

test("le tableau plan/build propose un mode à chaque situation", () => {
  assert.ok(planVsBuild.length >= 4, "quatre situations au minimum");
  for (const ligne of planVsBuild) {
    assert.ok(ligne.situation.trim(), "situation manquante");
    assert.ok(
      /plan|build/i.test(ligne.mode),
      `mode invalide : « ${ligne.mode} » (attendu : plan ou build)`,
    );
    assert.ok(ligne.pourquoi.trim().length > 30, `justification trop courte : ${ligne.situation}`);
  }
});

test("la première heure et les pièges sont fournis", () => {
  assert.ok(premiersPas.length >= 6, "au moins six étapes de démarrage");
  assert.ok(pieges.length >= 4, "au moins quatre pièges");
  for (const etape of premiersPas) {
    assert.ok(etape.titre.trim() && etape.texte.trim(), "étape incomplète");
  }
  for (const piege of pieges) {
    assert.ok(piege.texte.trim().length > 40, `piège trop vague : ${piege.titre}`);
  }
});
