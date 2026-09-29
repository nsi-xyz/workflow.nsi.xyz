/**
 * Tests de cohérence du contenu et de la navigation.
 * Ils protègent contre la classe de bug la plus bête : un lien mort,
 * un doublon, une page sans titre.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { navGroups, navItems, primaryNav, workflowSteps } from "../src/data/navigation.ts";
import versionInfo from "../src/version.json";

test("les slugs de navigation sont uniques", () => {
  const slugs = navItems.map((item) => item.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slug en double dans navigation.ts");
});

test("chaque page a un titre, un kicker, une accroche et un plan", () => {
  for (const item of navItems) {
    assert.ok(item.slug && !item.slug.startsWith("/"), `slug invalide : ${item.slug}`);
    assert.ok(item.title.trim(), `titre manquant : ${item.slug}`);
    assert.ok(item.kicker.trim(), `kicker manquant : ${item.slug}`);
    assert.ok(item.lead.trim().length > 40, `accroche trop courte : ${item.slug}`);
    assert.ok(item.planned.length >= 2, `plan trop court : ${item.slug}`);
  }
});

test("aucune page n'est orpheline dans un groupe", () => {
  const grouped = navGroups.flatMap((group) => group.items);
  assert.equal(grouped.length, navItems.length);
});

test("le workflow comporte exactement 5 étapes", () => {
  assert.equal(workflowSteps.length, 5);
});

test("tous les liens du workflow et de l'en-tête pointent vers une page connue", () => {
  const known = new Set(navItems.map((item) => `/${item.slug}`));
  for (const step of workflowSteps) {
    assert.ok(known.has(step.href), `étape du workflow vers une page inconnue : ${step.href}`);
  }
  for (const link of primaryNav) {
    assert.ok(known.has(link.href), `lien d'en-tête vers une page inconnue : ${link.href}`);
  }
});

test("version.json est exploitable", () => {
  assert.equal(typeof versionInfo.version, "string");
  assert.ok(Number.isInteger(versionInfo.build));
  assert.ok(versionInfo.build >= 0);
});
