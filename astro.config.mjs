// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Site entièrement statique : Astro pré-rend toutes les pages dans dist/.
// Aucune API, aucun adaptateur SSR — Cloudflare Pages se contente de servir dist/.
export default defineConfig({
  site: 'https://workflow.nsi.xyz',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
