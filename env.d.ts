/// <reference types="astro/client" />

// Les types de l'exécution Cloudflare (KV, Pages Functions) sont déclarés à la
// main dans functions/_lib/http.ts : `@cloudflare/workers-types` redéfinit des
// types DOM et entre en conflit avec ceux qu'Astro utilise pour les composants.
