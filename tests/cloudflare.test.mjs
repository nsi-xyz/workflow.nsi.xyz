/**
 * Tests des données de la section « Cloudflare Pages ».
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  checklistPublication,
  erreursBuild,
  etapesDeploiement,
  piegesPages,
  reglages,
  variablesSecrets,
} from "../src/data/cloudflare.ts";

test("le déploiement est décrit en quatre étapes complètes", () => {
  assert.equal(etapesDeploiement.length, 4, "push → build → mise en ligne → URL");
  for (const etape of etapesDeploiement) {
    assert.ok(etape.titre.trim(), "titre d'étape manquant");
    assert.ok(etape.texte.trim().length > 20, `résumé trop court : ${etape.titre}`);
    assert.ok(etape.detail.trim().length > 60, `détail trop court : ${etape.titre}`);
  }
});

test("les réglages de build couvrent les champs critiques", () => {
  const champs = reglages.map((reglage) => reglage.champ).join(" | ");
  for (const attendu of ["Build command", "Build output directory", "NODE_VERSION"]) {
    assert.ok(champs.includes(attendu), `réglage manquant : ${attendu}`);
  }
  const sortie = reglages.find((reglage) => reglage.champ === "Build output directory");
  assert.equal(sortie?.valeur, "dist", "le dossier de sortie Astro est dist/");
});

test("les erreurs de build associent message, cause et correction", () => {
  assert.ok(erreursBuild.length >= 4, "au moins quatre erreurs courantes");
  for (const erreur of erreursBuild) {
    assert.ok(erreur.message.trim(), "message manquant");
    assert.ok(erreur.cause.trim().length > 20, `cause trop courte : ${erreur.message}`);
    assert.ok(erreur.correction.trim().length > 40, `correction trop courte : ${erreur.message}`);
  }
});

test("le piège du domaine personnalisé est documenté", () => {
  const textes = piegesPages.map((piege) => `${piege.titre} ${piege.texte}`).join(" ");
  assert.ok(/pending/i.test(textes), "le statut pending doit être expliqué");
  assert.ok(/CNAME/i.test(textes), "la solution par CNAME doit être donnée");
  for (const piege of piegesPages) {
    assert.ok(piege.texte.trim().length > 40, `piège trop vague : ${piege.titre}`);
  }
});

test("secrets et checklist de publication sont fournis", () => {
  assert.ok(variablesSecrets.length >= 3, "au moins trois variables documentées");
  assert.ok(checklistPublication.length >= 5, "au moins cinq points de contrôle");
  for (const ligne of checklistPublication) {
    assert.ok(ligne.trim().length > 30, `point de contrôle trop court : ${ligne}`);
  }
});
