/**
 * Tests des données du glossaire.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { termes, themesGlossaire } from "../src/data/glossaire.ts";

test("le glossaire est fourni et chaque thème est représenté", () => {
  assert.ok(termes.length >= 30, "au moins trente termes");
  for (const theme of themesGlossaire) {
    const nombre = termes.filter((entree) => entree.theme === theme).length;
    assert.ok(nombre >= 4, `thème trop maigre : ${theme} (${nombre})`);
  }
});

test("les termes sont uniques et chaque fiche est complète", () => {
  const noms = termes.map((entree) => entree.terme);
  assert.equal(new Set(noms).size, noms.length, "terme en double");
  for (const entree of termes) {
    assert.ok(themesGlossaire.includes(entree.theme), `thème inconnu : ${entree.theme}`);
    assert.ok(entree.definition.trim().length > 40, `définition trop courte : ${entree.terme}`);
    assert.ok(entree.exemple.trim().length > 20, `exemple trop court : ${entree.terme}`);
  }
});

test("les notions indispensables sont définies", () => {
  const noms = termes.map((entree) => entree.terme.toLowerCase()).join(" | ");
  for (const attendu of ["commit", "token", "cname", "rgpd", "prompt", "build"]) {
    assert.ok(noms.includes(attendu), `notion manquante : ${attendu}`);
  }
});

test("aucune définition ne contient de pluriel paresseux ni de secret", () => {
  for (const entree of termes) {
    const texte = `${entree.definition} ${entree.exemple}`;
    assert.ok(!/[a-zà-ÿ]\(s\)/.test(texte), `pluriel « (s) » interdit : ${entree.terme}`);
    assert.ok(!/sk-[A-Za-z0-9]{16,}|cfut_[A-Za-z0-9]{16,}/.test(texte), `secret dans : ${entree.terme}`);
  }
});
