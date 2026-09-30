#!/usr/bin/env node
/**
 * Garde-fou « espace perdu » — bug de rendu invisible à la relecture.
 *
 * Astro supprime l'espace lorsqu'un élément en ligne (<em>, <code>, <strong>, <a>,
 * <kbd>, <span>…) commence une nouvelle ligne juste après du texte :
 *
 *     puis ouvrir la section
 *     <em>Workers & Pages</em>
 *
 * donne « la sectionWorkers & Pages » dans la page. Ce script refuse ce motif,
 * et propose la correction : garder l'élément sur la ligne du texte.
 *
 * Usage : node scripts/check-whitespace.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', '.astro', '.wrangler', 'coverage']);
const INLINE_TAGS = 'em|code|strong|a|kbd|span|b|i|small';
const TEXT_END = /[\p{L}\p{N}»),.;:!?]$/u;
const ELEMENT_START = new RegExp(`^(<(${INLINE_TAGS})\\b|\\{)`);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith('.astro')) acc.push(path.relative(ROOT, full));
  }
  return acc;
}

const findings = [];

for (const file of walk(path.join(ROOT, 'src'))) {
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
  let inPre = false;
  let inScript = false;
  const finFrontmatter = lines[0]?.trim() === '---' ? lines.findIndex((l, i) => i > 0 && l.trim() === '---') : -1;

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const dansFrontmatter = finFrontmatter !== -1 && i <= finFrontmatter;
    if (line.includes('<script')) inScript = true;
    else if (line.includes('</script>')) inScript = false;
    if (line.includes('<pre')) inPre = true;
    else if (line.includes('</pre>')) inPre = false;
    if (dansFrontmatter || inScript || inPre) continue;

    const texte = line.trimEnd();
    if (!texte || !TEXT_END.test(texte)) continue;

    const suivante = lines[i + 1].trimStart();
    if (ELEMENT_START.test(suivante)) {
      findings.push({
        file,
        ligne: i + 2,
        texte: texte.split('\n').pop().trim(),
        element: suivante.slice(0, 60),
      });
    }
  }
}

if (findings.length) {
  console.error('\n❌ [espaces] Espace perdu avant un élément en ligne — le texte sera collé.\n');
  for (const f of findings) {
    console.error(`  • ${f.file}:${f.ligne}`);
    console.error(`    « …${f.texte} » puis « ${f.element} »`);
  }
  console.error('\n  → Garder l\'élément sur la même ligne que le texte, ou écrire {" "} explicitement.\n');
  process.exit(1);
}

console.log('✅ [espaces] Aucun élément en ligne orphelin en début de ligne.');
