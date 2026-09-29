import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versionFilePath = path.join(__dirname, '../src/version.json');

try {
  let versionData = { version: '0.01', build: 1, last_deployed: new Date().toISOString() };
  if (fs.existsSync(versionFilePath)) {
    const raw = fs.readFileSync(versionFilePath, 'utf-8');
    versionData = JSON.parse(raw);
  }

  // Parse current version (e.g. "0.01" -> 1, "0.02" -> 2)
  const currentVersionStr = versionData.version || '0.01';
  const parts = currentVersionStr.split('.');
  const major = parts[0] || '0';
  let minor = parseInt(parts[1] || '1', 10);
  minor += 1;
  const newVersion = `${major}.${String(minor).padStart(2, '0')}`;

  versionData.version = newVersion;
  versionData.build = (versionData.build || 0) + 1;
  versionData.last_deployed = new Date().toISOString();

  fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2) + '\n', 'utf-8');
  console.log(`[Version Auto-Increment] Nouvelle version générée : v${newVersion} (Build #${versionData.build})`);
} catch (err) {
  console.error('[Version Auto-Increment] Erreur lors de la mise à jour de la version:', err);
}
