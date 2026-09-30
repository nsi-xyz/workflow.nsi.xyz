#!/usr/bin/env node
/**
 * Smoke test — vérifie que le site répond et que l'API refuse ce qu'elle doit refuser.
 *
 * Usage :
 *   node scripts/smoke-test.mjs                                  # serveur local avec API (4324)
 *   node scripts/smoke-test.mjs https://workflow.nsi.xyz         # production
 *
 * À lancer après chaque déploiement. Aucun test « positif » d'écriture : on ne
 * pollue pas le journal de la classe (le dépôt réel est testé en local).
 */

const base = (process.argv[2] ?? 'http://127.0.0.1:4324').replace(/\/$/, '');
const cheminsPages = [
  '/',
  '/workflow',
  '/llm',
  '/prompt',
  '/opencode',
  '/git-github',
  '/cloudflare',
  '/prompts',
  '/prompts/depot',
  '/missions',
  '/quiz',
  '/depannage',
  '/glossaire',
  '/securite',
  '/projet',
  '/prof',
];

const resultats = [];

async function verifierPage(chemin) {
  try {
    const reponse = await fetch(`${base}${chemin}`, { redirect: 'follow' });
    resultats.push({ test: `page ${chemin}`, ok: reponse.status === 200, detail: `HTTP ${reponse.status}` });
  } catch (erreur) {
    resultats.push({ test: `page ${chemin}`, ok: false, detail: `erreur réseau : ${erreur.message}` });
  }
}

async function verifierStatut(nom, chemin, attendu, options = {}) {
  try {
    const reponse = await fetch(`${base}${chemin}`, { redirect: 'manual', ...options });
    resultats.push({
      test: nom,
      ok: reponse.status === attendu,
      detail: `HTTP ${reponse.status} (attendu ${attendu})`,
    });
  } catch (erreur) {
    resultats.push({ test: nom, ok: false, detail: `erreur réseau : ${erreur.message}` });
  }
}

for (const chemin of cheminsPages) {
  await verifierPage(chemin);
}

await verifierStatut('API stats répond', '/api/stats', 200);
await verifierStatut('API refuse un code inconnu', '/api/prompts', 403, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ code: 'ABCD-EFGH-JKMN', mission: 'libre', prompt: 'Test de smoke : ce code ne doit pas exister.' }),
});
await verifierStatut('espace prof refuse sans session', '/api/prof/prompts', 401);

const echecs = resultats.filter((resultat) => !resultat.ok);
const largeur = Math.max(...resultats.map((resultat) => resultat.test.length));

console.log(`\nSmoke test — ${base}\n`);
for (const resultat of resultats) {
  const marque = resultat.ok ? '✅' : '❌';
  console.log(`${marque} ${resultat.test.padEnd(largeur)}  ${resultat.detail}`);
}

console.log(
  `\n${resultats.length - echecs.length}/${resultats.length} vérifications passées.` +
    (echecs.length ? ' Des routes ou des garde-fous ne répondent pas comme prévu.' : ''),
);

process.exit(echecs.length ? 1 : 0);
