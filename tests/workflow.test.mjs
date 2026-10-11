/**
 * Garde-fou du document remis aux élèves.
 *
 * Le contrat vit dans `template/workflow.md` ; la version publique du site
 * (`public/workflow.md`) en est générée. Ces tests empêchent toute divergence et
 * vérifient que le contrat opérationnel (journal, schéma, sécurité) est présent.
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CIBLE, EXEMPLE_ALIAS, SOURCE, rendreEleve, renderPublic } from "../scripts/sync-workflow.mjs";

const modele = fs.readFileSync(SOURCE, "utf8");
const publicMd = fs.readFileSync(CIBLE, "utf8");

test("le modèle porte les deux jetons de personnalisation", () => {
  assert.ok(modele.includes("{{ALIAS}}"), "jeton {{ALIAS}} manquant");
  assert.ok(modele.includes("{{URL_DEPOT}}"), "jeton {{URL_DEPOT}} manquant");
});

test("la version publique est générée depuis le modèle (aucune divergence)", () => {
  assert.equal(publicMd, renderPublic(modele));
});

test("la version publique ne laisse aucun jeton", () => {
  assert.ok(!/\{\{[A-Z_]+\}\}/.test(publicMd), "jeton non remplacé dans public/workflow.md");
  assert.ok(publicMd.includes(EXEMPLE_ALIAS), "valeur d'exemple absente de la version publique");
});

test("le contrat impose le journal et fige le schéma", () => {
  for (const fichier of [modele, publicMd]) {
    assert.match(fichier, /journal\/<NNN>-<horodatage>\.json/, "nom de fichier journal manquant");
    assert.match(fichier, /workflow-nsi\/journal\/v1/, "schéma v1 manquant");
    assert.match(fichier, /git push/, "consigne de push manquante");
    assert.match(fichier, /prompt.*texte exact/i, "règle « prompt exact » manquante");
  }
});

test("le contrat interdit secrets et données personnelles", () => {
  for (const fichier of [modele, publicMd]) {
    assert.match(fichier, /check-ignore \.env/, "vérification du .gitignore manquante");
    assert.match(fichier, /donnée[s]? personnelle[s]?/i, "règle de données personnelles manquante");
  }
});

test("le contrat cadre les ressources et les droits", () => {
  for (const fichier of [modele, publicMd]) {
    assert.match(fichier, /10 Mo/, "limite de taille de fichier manquante");
    assert.match(fichier, /sous copyright|droits d'auteur/i, "règle de droits manquante");
  }
});

test("la version élève retire le marqueur et remplit les jetons", () => {
  const eleve = rendreEleve("# t\n\n<!-- NOTE-PUBLIQUE -->\n\n{{ALIAS}} — {{URL_DEPOT}}", "eleve-07", "https://x/y");
  assert.ok(!eleve.includes("NOTE-PUBLIQUE"), "marqueur public non retiré");
  assert.ok(!eleve.includes("{{"), "jeton non remplacé");
  assert.ok(eleve.includes("eleve-07") && eleve.includes("https://x/y"), "valeurs absentes");
});
