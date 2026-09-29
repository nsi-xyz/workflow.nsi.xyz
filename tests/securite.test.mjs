/**
 * Tests des données de la section Sécurité (jeu « trouvez la fuite »).
 * Ils garantissent qu'un contenu pédagogique incomplet ne parte jamais en ligne.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { leakSituations, scoreMessages } from "../src/data/securite.ts";

test("le jeu propose des identifiants uniques", () => {
  const ids = leakSituations.map((situation) => situation.id);
  assert.equal(new Set(ids).size, ids.length, "identifiant en double dans leakSituations");
});

test("le jeu contient de vraies fuites ET de faux positifs", () => {
  const leaks = leakSituations.filter((situation) => situation.isLeak);
  const safe = leakSituations.filter((situation) => !situation.isLeak);
  assert.ok(leaks.length >= 3, "il faut au moins trois vraies fuites");
  assert.ok(safe.length >= 2, "il faut au moins deux situations sans danger (pièges inverses)");
});

test("chaque situation est complète et expliquée", () => {
  for (const situation of leakSituations) {
    assert.ok(situation.file.trim(), `fichier manquant pour ${situation.id}`);
    assert.ok(situation.code.trim(), `extrait manquant pour ${situation.id}`);
    assert.ok(
      situation.why.trim().length > 60,
      `explication trop courte pour ${situation.id} : l'élève doit comprendre le pourquoi`,
    );
  }
});

test("les messages de score couvrent toutes les réponses possibles", () => {
  const total = leakSituations.length;
  assert.ok(
    scoreMessages.some((message) => message.min === 0),
    "aucun message pour un score nul",
  );
  assert.ok(
    scoreMessages.some((message) => message.max === total),
    "aucun message pour un score parfait",
  );
  for (let score = 0; score <= total; score++) {
    const covering = scoreMessages.filter((message) => score >= message.min && score <= message.max);
    assert.ok(covering.length >= 1, `aucun message pour le score ${score}`);
  }
});
