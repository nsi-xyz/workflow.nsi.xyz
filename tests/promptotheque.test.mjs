/**
 * Tests de la promptothèque : cohérence des catégories, complétude des fiches,
 * et absence de secret ou de pluriel paresseux dans les textes publiés.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { categories, promptsPublies } from "../src/data/promptotheque.ts";

const textesDe = (prompt) =>
  [prompt.titre, prompt.intention, prompt.prompt, prompt.adapter, ...prompt.pourquoi].join(" ");

test("chaque catégorie annoncée contient au moins un prompt", () => {
  for (const categorie of categories) {
    const nombre = promptsPublies.filter((prompt) => prompt.categorie === categorie).length;
    assert.ok(nombre >= 1, `catégorie vide dans les filtres : ${categorie}`);
  }
});

test("chaque prompt appartient à une catégorie connue, avec un identifiant unique", () => {
  const ids = promptsPublies.map((prompt) => prompt.id);
  assert.equal(new Set(ids).size, ids.length, "identifiant de prompt en double");
  for (const prompt of promptsPublies) {
    assert.ok(categories.includes(prompt.categorie), `catégorie inconnue : ${prompt.categorie}`);
  }
});

test("chaque fiche est complète : texte, explications et adaptation", () => {
  assert.ok(promptsPublies.length >= 12, "la bibliothèque doit être fournie");
  for (const prompt of promptsPublies) {
    assert.ok(prompt.titre.trim(), "titre manquant");
    assert.ok(prompt.intention.trim().length > 20, `intention trop courte : ${prompt.titre}`);
    assert.ok(prompt.prompt.trim().length > 150, `prompt trop court pour être utile : ${prompt.titre}`);
    assert.ok(prompt.pourquoi.length >= 2, `moins de deux explications : ${prompt.titre}`);
    assert.ok(prompt.adapter.trim().length > 30, `adaptation trop courte : ${prompt.titre}`);
  }
});

test("aucun prompt publié ne contient de secret reconnaissable", () => {
  for (const prompt of promptsPublies) {
    const textes = textesDe(prompt);
    assert.ok(!/sk-[A-Za-z0-9]{16,}/.test(textes), `clé ressemblant à un secret : ${prompt.id}`);
    assert.ok(!/cfut_[A-Za-z0-9]{16,}/.test(textes), `jeton ressemblant à un secret : ${prompt.id}`);
    assert.ok(!/-----BEGIN/.test(textes), `clé privée : ${prompt.id}`);
  }
});

test("aucun texte publié n'utilise le pluriel paresseux", () => {
  for (const prompt of promptsPublies) {
    assert.ok(
      !/[a-zà-ÿ]\(s\)/.test(textesDe(prompt)),
      `pluriel « (s) » interdit dans : ${prompt.id}`,
    );
  }
});

test("les prompts invitent à décrire un plan ou à vérifier", () => {
  const avecPlan = promptsPublies.filter((prompt) => /plan|attends ma validation|sans modifier/i.test(prompt.prompt));
  assert.ok(avecPlan.length >= 5, "l'aller-retour plan → validation doit être enseigné");
});
