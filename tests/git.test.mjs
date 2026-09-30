/**
 * Tests des données de la section « Git et GitHub ».
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  commandesGit,
  cycleDeTravail,
  interdits,
  messagesCommit,
  piegesGit,
  vocabulaire,
} from "../src/data/git.ts";

test("le vocabulaire couvre les huit notions de base", () => {
  assert.ok(vocabulaire.length >= 8, "il faut au moins huit notions");
  const termes = vocabulaire.map((mot) => mot.terme);
  assert.equal(new Set(termes).size, termes.length, "terme en double");
  for (const mot of vocabulaire) {
    assert.ok(mot.image.trim(), `image manquante : ${mot.terme}`);
    assert.ok(mot.definition.trim().length > 40, `définition trop courte : ${mot.terme}`);
  }
});

test("les commandes Git essentielles sont présentes et expliquées", () => {
  const noms = commandesGit.map((commande) => commande.commande).join(" | ");
  for (const attendue of ["git init", "git status", "git add", "git commit", "git push", "git pull", "git log"]) {
    assert.ok(noms.includes(attendue), `commande manquante : ${attendue}`);
  }
  for (const commande of commandesGit) {
    assert.ok(commande.effet.trim().length > 30, `effet trop court : ${commande.commande}`);
    assert.ok(commande.quand.trim().length > 20, `contexte manquant : ${commande.commande}`);
  }
});

test("le cycle de travail est complet", () => {
  assert.ok(cycleDeTravail.length >= 5, "le cycle doit couvrir au moins cinq temps");
  const titres = cycleDeTravail.map((etape) => etape.titre).join(" | ");
  for (const attendu of ["Modifier", "Tester", "Committer", "Pousser"]) {
    assert.ok(titres.includes(attendu), `étape manquante dans le cycle : ${attendu}`);
  }
});

test("les messages de commit opposent toujours une mauvaise et une bonne version", () => {
  assert.ok(messagesCommit.length >= 4, "au moins quatre exemples");
  for (const message of messagesCommit) {
    assert.ok(message.mauvais.trim(), "mauvais exemple manquant");
    assert.ok(message.bon.trim().length > 20, `bon exemple trop court : ${message.mauvais}`);
    assert.ok(message.pourquoi.trim().length > 30, `justification trop courte : ${message.mauvais}`);
  }
});

test("les interdits et les pièges sont fournis", () => {
  assert.ok(interdits.length >= 4, "au moins quatre interdits");
  assert.ok(piegesGit.length >= 4, "au moins quatre pièges");
  const texteInterdits = interdits.map((ligne) => ligne.element).join(" ");
  assert.ok(texteInterdits.includes(".env"), "le .env doit figurer dans les interdits");
});
