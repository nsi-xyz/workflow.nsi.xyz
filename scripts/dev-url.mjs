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
  const ports = new Set();
  try {
    const lines = execSync('ss -ltnp 2>/dev/null || true').toString().split('\n');
    const socketsByPid = new Map();
    for (const line of lines) {
      const m = line.match(/LISTEN\s+\d+\s+\d+\s+(\S+):(\d+)\s+.*?pid=(\d+)/);
      if (!m) continue;
      const [, addr, port, pid] = m;
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
      // Serveur de dev de CE projet uniquement (les `workerd` sont écartés).
      if (!cmd.includes(root) || cmd.includes('workerd')) continue;
      if (!/astro(\.m?js)?\s+dev|[/\\]\.bin[/\\]astro\s+dev/.test(cmd)) continue;

      const declared = cmd.match(/--port\s+(\d+)/);
      if (declared) {
        ports.add(Number(declared[1]));
        continue;
      }
      const exposed = sockets.find((s) => !s.addr.startsWith('127.') && s.addr !== '::1');
      if (exposed) ports.add(exposed.port);
    }
  } catch {
    /* ss indisponible : on retombera sur DEV_PORT */
  }
  return [...ports];
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
for (const port of ports) {
  for (const { iface, ip } of lan) urls.push({ kind: 'local', iface, url: `http://${ip}:${port}` });
  for (const { iface, ip } of vpn) urls.push({ kind: 'vpn', iface, url: `http://${ip}:${port}` });
}

if (asJson) {
  console.log(JSON.stringify({ running: true, project: projectName, ports, urls }));
} else {
  console.log(`Serveur de dev « ${projectName} » — port ${ports.join(', ')} :`);
  for (const u of urls) console.log(`  ${u.kind.padEnd(6)} (${u.iface}) : ${u.url}`);
  if (!urls.length) console.log('  (aucune adresse réseau détectée)');
}
