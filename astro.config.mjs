// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Site statique + Pages Functions (dossier `functions/`) : le tout tient dans
// un seul projet Cloudflare Pages. Pas d'adaptateur SSR : les pages sont
// pré-rendues, l'API vit à côté.
export default defineConfig({
  site: 'https://workflow.nsi.xyz',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
