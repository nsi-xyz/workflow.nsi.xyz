#!/usr/bin/env node
/**
 * Smoke test — vérifie que toutes les pages du site répondent en 200.
 *
 * Usage :
 *   node scripts/smoke-test.mjs                            # serveur local (4323)
 *   node scripts/smoke-test.mjs https://workflow.nsi.xyz   # production
 *
 * À lancer après chaque déploiement. Le site est statique : il n'y a plus d'API.
 */

const base = (process.argv[2] ?? 'http://127.0.0.1:4323').replace(/\/$/, '');
const cheminsPages = [
  '/',
  '/workflow',
  '/jeu',
  '/llm',
  '/couts',
  '/prompt',
  '/markdown',
  '/opencode',
  '/git-github',
  '/cloudflare',
  '/prompts',
  '/missions',
  '/quiz',
  '/depannage',
  '/glossaire',
  '/securite',
  '/projet',
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

for (const chemin of cheminsPages) {
  await verifierPage(chemin);
}

const echecs = resultats.filter((resultat) => !resultat.ok);
const largeur = Math.max(...resultats.map((resultat) => resultat.test.length));

console.log(`\nSmoke test — ${base}\n`);
for (const resultat of resultats) {
  const marque = resultat.ok ? '✅' : '❌';
  console.log(`${marque} ${resultat.test.padEnd(largeur)}  ${resultat.detail}`);
}

console.log(
  `\n${resultats.length - echecs.length}/${resultats.length} vérifications passées.` +
    (echecs.length ? ' Des pages ne répondent pas comme prévu.' : ''),
);

process.exit(echecs.length ? 1 : 0);
