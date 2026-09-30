/**
 * Tests des données du quiz : cohérence des questions, réponses valides,
 * explications présentes, et représentation de chaque thème.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { questions, themesQuiz } from "../src/data/quiz.ts";

test("le quiz couvre chaque thème avec assez de questions", () => {
  assert.ok(questions.length >= 20, "au moins vingt questions");
  for (const theme of themesQuiz) {
    const nombre = questions.filter((question) => question.theme === theme).length;
    assert.ok(nombre >= 4, `thème trop maigre : ${theme} (${nombre})`);
  }
});

test("les identifiants sont uniques et chaque question est complète", () => {
  const ids = questions.map((question) => question.id);
  assert.equal(new Set(ids).size, ids.length, "identifiant de question en double");
  for (const question of questions) {
    // Seuil volontairement bas : certaines questions sont des phrases à compléter,
    // ce sont les réponses proposées qui portent le contenu.
    assert.ok(question.question.trim().length >= 15, `question trop courte : ${question.id}`);
    assert.equal(question.options.length, 3, `trois réponses attendues : ${question.id}`);
    assert.ok(
      Number.isInteger(question.bonne) && question.bonne >= 0 && question.bonne < question.options.length,
      `index de bonne réponse invalide : ${question.id}`,
    );
    assert.ok(question.explication.trim().length > 60, `explication trop courte : ${question.id}`);
    assert.equal(new Set(question.options).size, 3, `réponses en double : ${question.id}`);
  }
});

test("aucune question n'a de réponse absurde ou vide", () => {
  for (const question of questions) {
    for (const option of question.options) {
      assert.ok(option.trim().length > 8, `réponse trop courte dans ${question.id} : « ${option} »`);
    }
  }
});

test("les questions de sécurité portent sur les bons réflexes", () => {
  const securite = questions.filter((question) => question.theme === "Sécurité");
  const textes = securite.map((question) => `${question.question} ${question.options.join(" ")}`).join(" ");
  assert.ok(/tourner|révoquer/i.test(textes), "la rotation d'une clé doit être vérifiée");
  assert.ok(/donnée personnelle|téléphone|RGPD/i.test(textes), "les données personnelles doivent être vérifiées");
});

test("aucun texte ne contient de pluriel paresseux", () => {
  for (const question of questions) {
    const texte = `${question.question} ${question.options.join(" ")} ${question.explication}`;
    assert.ok(!/[a-zà-ÿ]\(s\)/.test(texte), `pluriel « (s) » interdit : ${question.id}`);
  }
});
