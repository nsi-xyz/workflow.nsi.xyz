/**
 * Tests des données du projet final : date de révélation, brief, règles,
 * compétences à maîtriser.
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  briefProjet,
  pretPourLeJourJ,
  reglesInchangees,
  revealAt,
  teaser,
} from "../src/data/projet.ts";
import { navItems } from "../src/data/navigation.ts";

test("la date de révélation est complète et interprétable", () => {
  assert.match(revealAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, "format attendu : AAAA-MM-JJTHH:MM:SS");
  const date = new Date(revealAt);
  assert.ok(!Number.isNaN(date.getTime()), "date illisible");
  assert.equal(date.getFullYear() >= 2026, true, "année inattendue");
  assert.equal(date.getHours(), 8, "l'heure annoncée est 8 h");
  assert.equal(date.getMinutes(), 42, "les minutes annoncées sont 42");
});

test("le brief couvre les quatre blocs attendus", () => {
  assert.ok(briefProjet.length >= 4, "objectif, rendu, règles, évaluation");
  const titres = briefProjet.map((section) => section.titre).join(" | ").toLowerCase();
  for (const attendu of ["objectif", "rendu", "règle", "critère"]) {
    assert.ok(titres.includes(attendu), `bloc manquant : ${attendu}`);
  }
  for (const section of briefProjet) {
    assert.ok(section.contenu.trim().length > 40, `contenu trop court : ${section.titre}`);
  }
});

test("les règles invariantes incluent la sécurité et la traçabilité", () => {
  assert.ok(reglesInchangees.length >= 5, "au moins cinq règles");
  const texte = reglesInchangees.join(" ").toLowerCase();
  assert.ok(texte.includes("secret"), "la règle sur les secrets doit figurer");
  assert.ok(texte.includes("donnée personnelle"), "la règle sur les données personnelles doit figurer");
  assert.ok(texte.includes("prompt"), "la journalisation des prompts doit figurer");
});

test("les six compétences pointent vers des sections existantes", () => {
  const connues = new Set(navItems.map((entry) => `/${entry.slug}`));
  assert.ok(pretPourLeJourJ.length >= 6, "au moins six compétences");
  for (const etape of pretPourLeJourJ) {
    assert.ok(connues.has(etape.lien), `lien inconnu : ${etape.lien}`);
    assert.ok(etape.texte.trim().length > 30, `description trop courte : ${etape.titre}`);
  }
});

test("le teaser annonce la règle du jeu sans divulgâcher", () => {
  assert.ok(teaser.length >= 3, "au moins trois phrases d'annonce");
  const texte = teaser.join(" ").toLowerCase();
  assert.ok(texte.includes("prépar"), "le teaser doit insister sur la préparation");
});
