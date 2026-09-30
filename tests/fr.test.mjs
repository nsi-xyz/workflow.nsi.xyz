/**
 * Tests de l'accord en français (utilitaire partagé).
 */

import test from "node:test";
import assert from "node:assert/strict";
import { frPluriel } from "../src/lib/fr.ts";

test("un seul élément reste au singulier", () => {
  assert.equal(frPluriel(1, "requête"), "1 requête");
  assert.equal(frPluriel(0, "erreur"), "0 erreur");
});

test("plusieurs éléments passent au pluriel, y compris les irréguliers", () => {
  assert.equal(frPluriel(20, "requête"), "20 requêtes");
  assert.equal(frPluriel(3, "bloc", "blocs"), "3 blocs");
  assert.equal(frPluriel(2, "cheval", "chevaux"), "2 chevaux");
});
