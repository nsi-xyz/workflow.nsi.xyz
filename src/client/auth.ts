/**
 * Identification sur le site statique workflow.nsi.xyz.
 *
 * Le site n'a aucun serveur : le widget interroge `login.nsi.xyz/userinfo`
 * (cookie de session central, envoyé car login et workflow partagent le site
 * `nsi.xyz`). Un seul appel par session : le résultat est mémorisé dans
 * `sessionStorage`. Un retour de connexion porte `?auth=1`, ce qui force une
 * vérification fraîche et efface le paramètre.
 *
 * Aucune décision d'accès ici : le serveur (login) décide. Ce module ne fait
 * qu'afficher.
 */

const LOGIN = "https://login.nsi.xyz";
const CLE = "wf_auth";

interface Profil {
  sub: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  picture?: string | null;
}

interface Cache {
  profil: Profil | null;
  ts: number;
}

function lireCache(): Cache | null {
  try {
    const brut = sessionStorage.getItem(CLE);
    if (!brut) return null;
    const valeur = JSON.parse(brut) as Cache;
    if (typeof valeur !== "object" || valeur === null || !("profil" in valeur)) return null;
    return valeur;
  } catch {
    return null;
  }
}

function ecrireCache(profil: Profil | null): void {
  try {
    sessionStorage.setItem(CLE, JSON.stringify({ profil, ts: Date.now() }));
  } catch {
    /* mode privé : on continue sans cache */
  }
}

function oublierCache(): void {
  try {
    sessionStorage.removeItem(CLE);
  } catch {
    /* ignore */
  }
}

/** URL de la page courante, avec ou sans le marqueur `?auth=1`. */
function urlCourante(marqueAuth: boolean): string {
  const url = new URL(location.href);
  url.hash = "";
  if (marqueAuth) url.searchParams.set("auth", "1");
  else url.searchParams.delete("auth");
  return url.toString();
}

function lienLogin(): string {
  return `${LOGIN}/login?redirect_uri=${encodeURIComponent(urlCourante(true))}`;
}

function lienLogout(): string {
  return `${LOGIN}/logout?redirect_uri=${encodeURIComponent(location.origin + "/")}`;
}

function echapper(valeur: string): string {
  return valeur.replace(/[&<>"']/g, (caractere) => {
    switch (caractere) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function initiales(profil: Profil): string {
  const base = (profil.name || profil.email || "?").trim();
  const mots = base.split(/[\s@._-]+/).filter(Boolean);
  const premier = (mots[0] ?? "?").charAt(0);
  const second = (mots[1] ?? "").charAt(0);
  return `${premier}${second}`.toUpperCase();
}

/** `null` = anonyme, `undefined` = indéterminé (réseau), sinon le profil. */
async function chargerProfil(): Promise<Profil | null | undefined> {
  try {
    const reponse = await fetch(`${LOGIN}/userinfo`, { credentials: "include" });
    if (reponse.status === 401) return null;
    if (!reponse.ok) return undefined;
    return (await reponse.json()) as Profil;
  } catch {
    return undefined;
  }
}

function rendreInvite(racine: HTMLElement): void {
  racine.innerHTML =
    `<a class="auth-btn" href="${lienLogin()}" aria-label="S’identifier" title="S’identifier">` +
    `<svg class="auth-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">` +
    `<circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.8"></circle>` +
    `<path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>` +
    `</svg><span class="auth-nom">S’identifier</span></a>`;
}

function rendreConnecte(racine: HTMLElement, profil: Profil): void {
  const nom = echapper(profil.name || profil.email || "Mon compte");
  const admin = profil.role === "admin" ? `<a href="/mon-projet?admin=1">Administration</a>` : "";
  const avatar = profil.picture
    ? `<img class="auth-avatar" src="${echapper(profil.picture)}" alt="" width="30" height="30" loading="lazy" referrerpolicy="no-referrer">`
    : `<span class="auth-initiales" aria-hidden="true">${initiales(profil)}</span>`;
  racine.innerHTML =
    `<details class="auth-menu">` +
    `<summary class="auth-btn" aria-label="Compte de ${nom}" title="${nom}">${avatar}</summary>` +
    `<nav class="auth-panel" aria-label="Mon compte">` +
    `<span class="auth-entete">${nom}</span>` +
    `<a href="/mon-projet">Mon projet</a>${admin}` +
    `<a href="${LOGIN}/compte/identite">Mon compte</a>` +
    `<a href="${lienLogout()}" data-auth-logout>Se déconnecter</a>` +
    `</nav></details>`;
  racine.querySelector("[data-auth-logout]")?.addEventListener("click", oublierCache);
}

async function initialiser(): Promise<void> {
  const racine = document.querySelector<HTMLElement>("[data-auth]");
  if (!racine) return;

  const force = new URLSearchParams(location.search).get("auth") === "1";
  if (force) history.replaceState(null, "", urlCourante(false));

  const cache = lireCache();
  let profil: Profil | null | undefined;
  if (!force && cache) {
    profil = cache.profil;
  } else {
    profil = await chargerProfil();
    if (profil !== undefined) ecrireCache(profil);
  }

  if (profil) rendreConnecte(racine, profil);
  else rendreInvite(racine);
}

void initialiser();
