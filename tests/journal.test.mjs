/**
 * Tests du journal des prompts : forme des codes, empreintes, validation des
 * dépôts, export CSV et signature de session. Aucun accès réseau.
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  champCsv,
  empreinteCode,
  formeCodeValide,
  memesSecrets,
  normaliserCode,
  signerSession,
  validerDepot,
  verifierSession,
  versCsv,
} from "../src/lib/journal.ts";

test("un code se normalise (majuscules, sans tirets) et se vérifie", () => {
  assert.equal(normaliserCode("abcd-efgh-jkmn"), "ABCDEFGHJKMN");
  assert.equal(normaliserCode(" abcd efgh jkmn "), "ABCDEFGHJKMN");
  assert.ok(formeCodeValide("ABCD-EFGH-JKMN"));
  assert.ok(!formeCodeValide("ABCD-EFGH-JKL"), "11 caractères : invalide");
  assert.ok(!formeCodeValide("ABCD-EFGH-JKLMI"), "13 caractères : invalide");
  assert.ok(!formeCodeValide("ABCD-EFGH-JKL0"), "le zéro est exclu de l'alphabet");
  assert.ok(!formeCodeValide("ABCD-EFGH-JKLI"), "le I est exclu de l'alphabet");
});

test("l'empreinte est stable, insensible à la casse et aux tirets", async () => {
  const a = await empreinteCode("ABCD-EFGH-JKMN");
  const b = await empreinteCode(" abcd-efgh-jkmn ");
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.notEqual(a, await empreinteCode("ABCD-EFGH-JKMQ"));
});

test("un dépôt valide passe, les autres sont refusés avec un message", () => {
  const base = { code: "ABCD-EFGH-JKMN", mission: "decouverte", prompt: "a".repeat(50), mode: "plan" };
  assert.deepEqual(validerDepot(base).erreurs, []);

  assert.ok(validerDepot({ ...base, code: "nope" }).erreurs.length >= 1);
  assert.ok(validerDepot({ ...base, mission: "inconnue" }).erreurs.join(" ").includes("Mission"));
  assert.ok(validerDepot({ ...base, prompt: "court" }).erreurs.join(" ").includes("trop court"));
  assert.ok(validerDepot({ ...base, prompt: "a".repeat(4001) }).erreurs.join(" ").includes("trop long"));
  assert.ok(validerDepot({ ...base, mode: "autre" }).erreurs.join(" ").includes("Mode"));
  assert.deepEqual(validerDepot({ ...base, mode: "" }).erreurs, [], "le mode est facultatif");
});

test("le CSV échappe les séparateurs, les guillemets et les retours à la ligne", () => {
  assert.equal(champCsv("simple"), "simple");
  assert.equal(champCsv("avec;point-virgule"), '"avec;point-virgule"');
  assert.equal(champCsv('avec"guillemet'), '"avec""guillemet"');
  assert.equal(champCsv("deux\nlignes"), "deux lignes");
});

test("l'export contient un en-tête et cinq colonnes, empreinte tronquée", () => {
  const csv = versCsv([
    {
      horodatage: "2026-09-30T08:00:00.000Z",
      empreinte: "abcdef0123456789",
      mission: "Découverte",
      mode: "plan",
      prompt: "un prompt test",
    },
  ]);
  const lignes = csv.trim().split("\n");
  assert.equal(lignes.length, 2);
  assert.equal(lignes[0], "horodatage;code_empreinte;mission;mode;prompt");
  assert.ok(lignes[1].startsWith("2026-09-30T08:00:00.000Z;abcdef0123;"));
  assert.ok(csv.endsWith("\n"));
});

test("deux secrets identiques sont reconnus, deux secrets différents non", async () => {
  assert.equal(await memesSecrets("motdepasse", "motdepasse"), true);
  assert.equal(await memesSecrets("motdepasse", "motdepassé"), false);
});

test("une session expirée ou falsifiée est refusée", async () => {
  const secret = "clé-de-test";
  const maintenant = Date.now();
  const jeton = await signerSession(maintenant + 3600_000, secret);

  assert.equal(await verifierSession(jeton, secret, maintenant), true);
  assert.equal(await verifierSession(jeton, "autre-clé", maintenant), false, "mauvaise clé");
  assert.equal(await verifierSession(jeton, secret, maintenant + 7200_000), false, "expirée");
  assert.equal(await verifierSession(undefined, secret, maintenant), false, "absente");
  assert.equal(await verifierSession(`${jeton}x`, secret, maintenant), false, "falsifiée");
});
