/**
 * Journal des prompts — logique partagée entre l'API (Pages Functions), le
 * navigateur et les tests. Aucune identité stockée : seule l'empreinte du code
 * élève est conservée, et elle n'est pas réversible.
 */

export const ALPHABET_CODE = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const LONGUEUR_CODE = 12;

export interface Mission {
  id: string;
  label: string;
}

export const MISSIONS: Mission[] = [
  { id: "decouverte", label: "Découverte d'OpenCode et du modèle" },
  { id: "depot-git", label: "Dépôt Git et publication" },
  { id: "projet-final", label: "Projet final" },
  { id: "libre", label: "Expérimentation libre" },
];

export const LONGUEUR_PROMPT_MIN = 10;
export const LONGUEUR_PROMPT_MAX = 4000;

/** Retire espaces et tirets, passe en majuscules : « abcd-efgh » → « ABCDEFGH ». */
export function normaliserCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Le code a-t-il la bonne forme ? (la validité réelle se vérifie dans KV) */
export function formeCodeValide(code: string): boolean {
  const normalise = normaliserCode(code);
  if (normalise.length !== LONGUEUR_CODE) return false;
  return [...normalise].every((caractere) => ALPHABET_CODE.includes(caractere));
}

/** Empreinte SHA-256 en hexadécimal (WebCrypto : Workers et Node ≥ 20). */
export async function sha256hex(texte: string): Promise<string> {
  const donnees = new TextEncoder().encode(texte);
  const digest = await crypto.subtle.digest("SHA-256", donnees);
  return [...new Uint8Array(digest)].map((octet) => octet.toString(16).padStart(2, "0")).join("");
}

/** Empreinte d'un code élève : normalisé avant hachage. */
export async function empreinteCode(code: string): Promise<string> {
  return sha256hex(normaliserCode(code));
}

/** Comparaison de deux secrets sans révéler la position du premier caractère différent. */
export async function memesSecrets(a: string, b: string): Promise<boolean> {
  const [empreinteA, empreinteB] = await Promise.all([sha256hex(a), sha256hex(b)]);
  let difference = 0;
  for (let index = 0; index < empreinteA.length; index += 1) {
    difference |= empreinteA.charCodeAt(index) ^ empreinteB.charCodeAt(index);
  }
  return difference === 0;
}

export interface DepotBrut {
  code: string;
  mission: string;
  prompt: string;
  mode?: string;
}

export interface DepotValide {
  mission: string;
  prompt: string;
  mode: string;
}

/** Vérifie un dépôt sans accès réseau. Renvoie la liste des erreurs lisibles. */
export function validerDepot(depot: DepotBrut): { erreurs: string[]; valeurs: DepotValide } {
  const erreurs: string[] = [];
  const prompt = String(depot.prompt ?? "").trim();
  const mission = String(depot.mission ?? "").trim();
  const mode = String(depot.mode ?? "").trim();

  if (!formeCodeValide(String(depot.code ?? ""))) {
    erreurs.push("Code invalide : 12 caractères, lettres et chiffres, sans I, L, O, 0 ni 1.");
  }
  if (!MISSIONS.some((entree) => entree.id === mission)) {
    erreurs.push("Mission inconnue.");
  }
  if (prompt.length < LONGUEUR_PROMPT_MIN) {
    erreurs.push(`Le prompt est trop court (${LONGUEUR_PROMPT_MIN} caractères minimum).`);
  }
  if (prompt.length > LONGUEUR_PROMPT_MAX) {
    erreurs.push(`Le prompt est trop long (${LONGUEUR_PROMPT_MAX} caractères maximum).`);
  }
  if (mode && mode !== "plan" && mode !== "build") {
    erreurs.push("Mode invalide : « plan » ou « build ».");
  }

  return { erreurs, valeurs: { mission, prompt, mode } };
}

/** Échappement CSV : guillemets doublés, champ encadré si nécessaire. */
export function champCsv(valeur: string): string {
  const texte = String(valeur ?? "").replace(/\r?\n/g, " ");
  if (/[";,]/.test(texte) || texte !== texte.trim()) {
    return `"${texte.replace(/"/g, '""')}"`;
  }
  return texte;
}

export interface EntreeExport {
  horodatage: string;
  empreinte: string;
  mission: string;
  mode: string;
  prompt: string;
}

/** Construit le CSV de l'espace prof (séparateur ; pour l'ouvrir dans un tableur français). */
export function versCsv(entrees: EntreeExport[]): string {
  const lignes = ["horodatage;code_empreinte;mission;mode;prompt"];
  for (const entree of entrees) {
    lignes.push(
      [
        champCsv(entree.horodatage),
        champCsv(entree.empreinte.slice(0, 10)),
        champCsv(entree.mission),
        champCsv(entree.mode),
        champCsv(entree.prompt),
      ].join(";"),
    );
  }
  return `${lignes.join("\n")}\n`;
}

/** Signature d'une session prof : « expiration.signature » (HMAC-SHA256). */
export async function signerSession(expiration: number, secret: string): Promise<string> {
  const cle = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cle, new TextEncoder().encode(String(expiration)));
  const base = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${expiration}.${base}`;
}

/** Vérifie un jeton de session : signature correcte ET non expiré. */
export async function verifierSession(
  jeton: string | undefined,
  secret: string,
  maintenant = Date.now(),
): Promise<boolean> {
  if (!jeton || !secret) return false;
  const expiration = Number(jeton.split(".")[0]);
  if (!Number.isFinite(expiration) || expiration < maintenant) return false;
  return (await signerSession(expiration, secret)) === jeton;
}
