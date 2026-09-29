/**
 * Tests des données de la section « Le workflow ».
 * Un contenu pédagogique incomplet (phase sans critère de sortie, exemple sans
 * résultat…) doit être bloqué avant publication.
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  agentStrengths,
  examplePrompts,
  humanDuties,
  loopPhases,
  myths,
  timeline,
  workflowRules,
} from "../src/data/workflow.ts";
import { navItems, workflowSteps } from "../src/data/navigation.ts";

test("la boucle compte cinq temps, chacun complet", () => {
  assert.equal(loopPhases.length, 5, "la boucle est un cycle en cinq temps");
  const ids = loopPhases.map((phase) => phase.id);
  assert.equal(new Set(ids).size, ids.length, "identifiant de phase en double");
  for (const phase of loopPhases) {
    assert.ok(phase.you.trim().length > 30, `rôle humain trop court : ${phase.id}`);
    assert.ok(phase.agent.trim().length > 30, `rôle de l'agent trop court : ${phase.id}`);
    assert.ok(phase.exit.trim().length > 30, `critère de sortie manquant : ${phase.id}`);
  }
});

test("l'exemple complet est une vraie frise, avec des prompts", () => {
  assert.ok(timeline.length >= 8, "l'exemple doit couvrir au moins huit moments");
  const phases = new Set(loopPhases.map((phase) => phase.title));
  let prompts = 0;
  for (const step of timeline) {
    assert.ok(phases.has(step.phase), `phase inconnue dans la frise : ${step.phase}`);
    assert.ok(step.title.trim(), "titre d'étape manquant");
    assert.ok(step.result.trim().length > 30, `résultat trop court : ${step.title}`);
    if (step.prompt) prompts += 1;
  }
  assert.ok(prompts >= 3, "l'exemple doit montrer au moins trois prompts réels");
});

test("la frise contient un échec et une correction", () => {
  const texts = timeline.map((step) => `${step.title} ${step.result}`).join(" ").toLowerCase();
  assert.ok(texts.includes("casse"), "un exemple qui ne casse jamais n'apprend rien");
  assert.ok(texts.includes("erreur"), "l'exemple doit montrer un message d'erreur");
});

test("rôles, règles, idées fausses et prompts sont fournis", () => {
  assert.ok(humanDuties.length >= 4, "il faut au moins quatre responsabilités humaines");
  assert.ok(agentStrengths.length >= 4, "il faut au moins quatre forces de l'agent");
  assert.ok(workflowRules.length >= 5, "il faut au moins cinq règles de travail");
  assert.ok(myths.length >= 3, "il faut au moins trois idées fausses");
  assert.ok(examplePrompts.length >= 4, "il faut au moins quatre prompts d'exemple");
  for (const myth of myths) {
    assert.ok(myth.reality.trim().length > 40, `réponse trop courte à l'idée fausse : ${myth.myth}`);
  }
});

test("chaque étape du parcours a un critère de sortie et un lien valide", () => {
  const known = new Set(navItems.map((entry) => `/${entry.slug}`));
  assert.equal(workflowSteps.length, 5);
  for (const step of workflowSteps) {
    assert.ok(step.done.trim().length > 20, `critère de sortie manquant : ${step.title}`);
    assert.ok(known.has(step.href), `lien inconnu depuis l'étape ${step.title} : ${step.href}`);
  }
});
