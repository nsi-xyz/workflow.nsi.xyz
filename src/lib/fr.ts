/**
 * Accords en français — un utilitaire partagé plutôt qu'un « (s) » recopié.
 * Le « pluriel paresseux » est interdit par le kit : il produit « 1 requête(s) ».
 */

/** Accorde un nom avec son nombre : « 1 requête », « 2 requêtes ». */
export function frPluriel(nombre: number, singulier: string, pluriel?: string): string {
  const mot = nombre > 1 ? (pluriel ?? `${singulier}s`) : singulier;
  return `${nombre} ${mot}`;
}
