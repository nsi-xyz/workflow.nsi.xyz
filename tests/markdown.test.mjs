/**
 * Tests de la section « Markdown ».
 * Le format doit être présenté simplement, avec une syntaxe de base vérifiée.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { erreurs, pourquoi, syntaxe, usages, workflowMarkdown } from "../src/data/markdown.ts";

test("les raisons d'utiliser Markdown sont expliquées", () => {
  assert.ok(pourquoi.length >= 4, "au moins quatre raisons");
  for (const repere of pourquoi) {
    assert.ok(repere.titre.trim(), "titre manquant");
    assert.ok(repere.texte.trim().length > 40, `raison trop courte : ${repere.titre}`);
  }
});

test("la syntaxe de base est fournie et complète", () => {
  assert.ok(syntaxe.length >= 6, "au moins six lignes de syntaxe");
  for (const ligne of syntaxe) {
    assert.ok(ligne.ecrit.trim(), "exemple manquant");
    assert.ok(ligne.rendu.trim(), "rendu manquant");
    assert.ok(ligne.role.trim().length > 15, `rôle trop court : ${ligne.ecrit}`);
  }
  const ecrits = syntaxe.map((ligne) => ligne.ecrit).join(" ");
  for (const repere of ["#", "-", "**"]) {
    assert.ok(ecrits.includes(repere), `repère de syntaxe manquant : ${repere}`);
  }
});

test("les usages pointent vers de vrais fichiers Markdown", () => {
  assert.ok(usages.length >= 3, "au moins trois usages");
  for (const usage of usages) {
    assert.ok(usage.titre.trim() && usage.texte.trim().length > 30, `usage incomplet : ${usage.titre}`);
    assert.ok(/\.(md|markdown)$/.test(usage.fichier), `extension inattendue : ${usage.fichier}`);
  }
});

test("les erreurs opposent une mauvaise et une bonne pratique", () => {
  assert.ok(erreurs.length >= 3, "au moins trois erreurs");
  for (const erreur of erreurs) {
    assert.ok(erreur.mauvais.trim().length > 10, "mauvais exemple trop court");
    assert.ok(erreur.correction.trim().length > 25, "correction trop courte");
  }
});

test("le fichier workflow.md est nommé explicitement", () => {
  assert.equal(workflowMarkdown.fichier, "workflow.md");
  assert.ok(workflowMarkdown.texte.trim().length > 40, "description trop courte");
});
