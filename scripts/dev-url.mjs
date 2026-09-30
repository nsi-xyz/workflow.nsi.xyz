#!/usr/bin/env node
/**
 * Affiche les URL RÉELLES du serveur de dev de CE projet.
 *
 * Pourquoi : plusieurs projets peuvent tourner en parallèle, et Astro décale son
 * port quand 4321 est pris. Écrire « http://…:4321 » à l'aveugle dans le compte
 * rendu peut donc pointer vers un autre projet. Ce script retrouve le processus
 * du projet courant et son port effectif, puis affiche les deux adresses utiles
 * (réseau local et VPN, détectées automatiquement).
 *
 * Usage : npm run dev:url          (affichage lisible)
 *         npm run dev:url -- --json (pour un assistant)
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import './env.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectName = root.split('/').filter(Boolean).pop();
const asJson = process.argv.includes('--json');

/** Adresses IPv4 de la machine, classées (réseau local / VPN). */
function localAddresses() {
  const lan = [];
  const vpn = [];
  try {
    const out = execSync('ip -4 -o addr show 2>/dev/null || true').toString();
    for (const line of out.split('\n')) {
      const m = line.match(/^\d+:\s+(\S+)\s+inet\s+(\d+\.\d+\.\d+\.\d+)/);
      if (!m) continue;
      const [, iface, ip] = m;
      if (ip.startsWith('127.')) continue;
      if (/^(wg|tun|tailscale)/.test(iface)) vpn.push({ iface, ip });
      else lan.push({ iface, ip });
    }
  } catch {
    /* pas d'iproute2 : on rendra une liste vide */
  }
  return { lan, vpn };
}

/**
 * Port du serveur de dev de CE projet.
 *
 * Un même processus Node ouvre plusieurs sockets : la vraie écoute du serveur est
 * celle liée à `0.0.0.0` (ou à une IP réseau), les autres restant sur `127.0.0.1`
 * (sockets internes de Vite et de l'adaptateur Cloudflare). On privilégie donc le
 * port déclaré (`--port`), sinon la socket non-loopback.
 */
function devPorts() {
  /** port → le serveur accepte-t-il les connexions venant d'un autre poste ? */
  const trouves = new Set();
  /** port → au moins une socket écoute hors de la boucle locale (y compris un processus fils). */
  const exposes = new Map();
  try {
    const lines = execSync('ss -ltnp 2>/dev/null || true').toString().split('\n');
    const socketsByPid = new Map();
    const estExpose = (addr) => !addr.startsWith('127.') && addr !== '::1';

    for (const line of lines) {
      const m = line.match(/LISTEN\s+\d+\s+\d+\s+(\S+):(\d+)\s+.*?pid=(\d+)/);
      if (!m) continue;
      const [, addr, port, pid] = m;
      if (estExpose(addr)) exposes.set(Number(port), true);
      if (!socketsByPid.has(pid)) socketsByPid.set(pid, []);
      socketsByPid.get(pid).push({ addr, port: Number(port) });
    }

    for (const [pid, sockets] of socketsByPid) {
      let cmd = '';
      try {
        cmd = readFileSync(`/proc/${pid}/cmdline`, 'utf8').replace(/\0/g, ' ');
      } catch {
        continue;
      }
      // Serveur de dev de CE projet uniquement (les `workerd` sont écartés :
      // ils n'hébergent pas la commande, ils écoutent pour elle).
      if (!cmd.includes(root) || cmd.includes('workerd')) continue;
      const astroDev = /astro(\.m?js)?\s+dev|[/\\]\.bin[/\\]astro\s+dev/.test(cmd);
      const pagesDev = /pages\s+dev/.test(cmd) && /wrangler/.test(cmd);
      if (!astroDev && !pagesDev) continue;

      const declared = cmd.match(/--port[= ](\d+)/);
      if (declared) {
        trouves.add(Number(declared[1]));
        continue;
      }
      for (const socket of sockets) {
        if (exposes.get(socket.port)) trouves.add(socket.port);
        else if (socket.addr !== '::1' && !socket.addr.startsWith('127.')) trouves.add(socket.port);
      }
    }
  } catch {
    /* ss indisponible : on retombera sur DEV_PORT */
  }
  return [...trouves].sort((a, b) => b - a).map((port) => ({ port, expose: exposes.get(port) ?? false }));
}

const ports = devPorts();
const fallback = Number(process.env.DEV_PORT) || 4321;
const { lan, vpn } = localAddresses();

if (!ports.length) {
  if (asJson) {
    console.log(JSON.stringify({ running: false, port: fallback, project: projectName }));
  } else {
    console.log(`❌ Le serveur de dev de « ${projectName} » ne tourne pas (port attendu : ${fallback}).`);
    console.log('   → npm run dev');
  }
  process.exit(1);
}

const urls = [];
for (const { port, expose } of ports) {
  if (expose) {
    for (const { iface, ip } of lan) urls.push({ kind: 'local', iface, url: `http://${ip}:${port}` });
    for (const { iface, ip } of vpn) urls.push({ kind: 'vpn', iface, url: `http://${ip}:${port}` });
  } else {
    // Serveur attaché à la boucle locale : les autres postes ne peuvent pas y accéder.
    urls.push({ kind: 'boucle', iface: 'localhost', url: `http://localhost:${port}` });
  }
}

if (asJson) {
  console.log(JSON.stringify({ running: true, project: projectName, ports, urls }));
} else {
  console.log(`Serveur de dev « ${projectName} » — port ${ports.map((entree) => entree.port).join(', ')} :`);
  for (const u of urls) console.log(`  ${u.kind.padEnd(6)} (${u.iface}) : ${u.url}`);
  if (!urls.length) console.log('  (aucune adresse réseau détectée)');
  for (const { port, expose } of ports) {
    if (!expose) {
      console.log(
        `\n⚠️  Le serveur du port ${port} n'écoute que sur localhost : il est injoignable depuis un autre poste.`,
      );
      console.log('   → relancer avec --host 0.0.0.0 (Astro) ou --ip=0.0.0.0 (Wrangler).');
    }
  }
}
