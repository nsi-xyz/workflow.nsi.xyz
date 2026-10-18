/**
 * Espace privé — page /mon-projet.
 *
 * Page statique : ce module interroge l'API de login.nsi.xyz (session
 * centrale), puis affiche « mon projet », l'avancement des projets et la
 * progression de la classe. Les données nominatives ne sont renvoyées par
 * l'API qu'aux administrateurs ; ici, on ne fait qu'afficher.
 */

const LOGIN = "https://login.nsi.xyz";

interface Progression {
  repoOk: boolean;
  contratOk: boolean;
  journalCount: number;
  lastEntryAt: string | null;
  url: string | null;
  hebergeur: string | null;
  jalons: string[];
  pourcentage: number;
  erreur: string | null;
  fetchedAt: string | null;
}

interface Projet {
  project: string;
  nom?: string | null;
  code: string;
  progression: Progression;
}

interface ReponseMoi {
  profil: {
    sub: string;
    name?: string | null;
    email?: string | null;
    role: string;
    canAppoint?: boolean;
    picture?: string | null;
  };
  projets: Projet[];
}

interface LigneProjet {
  project: string;
  code: string;
  moi: boolean;
  progression: Progression;
  nom?: string | null;
  github?: string | null;
  email?: string | null;
}

interface ReponseListe {
  role: string;
  projets: { code: string; name: string }[];
  liste: LigneProjet[];
  seuilEchanges: number;
}

interface Message {
  id: string;
  project: string;
  subject: string | null;
  body: string | null;
  created_at: string;
}

interface AdminItem {
  userId: string;
  nom: string | null;
  email: string | null;
}

interface ReponseAdmins {
  canAppoint: boolean;
  admins: AdminItem[];
}

const LIBELLES_JALONS: Record<string, string> = {
  depot: "Dépôt accessible",
  contrat: "Contrat en place",
  premier_journal: "Premier échange",
  echanges: "5 échanges",
  publie: "Publié en ligne",
};

function qs<T extends Element>(selecteur: string): T | null {
  return document.querySelector<T>(selecteur);
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

/** Appel JSON vers login ; `null` si non authentifié, `undefined` si erreur. */
async function chargerJson<T>(chemin: string): Promise<T | null | undefined> {
  try {
    const reponse = await fetch(`${LOGIN}${chemin}`, { credentials: "include" });
    if (reponse.status === 401) return null;
    if (!reponse.ok) return undefined;
    return (await reponse.json()) as T;
  } catch (erreur) {
    console.warn("espace : requête impossible", erreur);
    return undefined;
  }
}

function barre(pourcentage: number): string {
  const sur = Math.max(0, Math.min(100, pourcentage));
  return `<div class="prog" role="img" aria-label="${sur} %"><span style="width:${sur}%"></span></div>`;
}

function jalons(progression: Progression): string {
  return Object.entries(LIBELLES_JALONS)
    .map(
      ([cle, label]) =>
        `<span class="j ${progression.jalons.includes(cle) ? "j-ok" : ""}">${echapper(label)}</span>`,
    )
    .join("");
}

function carteProjet(projet: Projet): string {
  const p = projet.progression;
  const lien = p.url
    ? `<a href="${echapper(p.url)}" target="_blank" rel="noopener noreferrer">${echapper(p.url)}</a>`
    : `<span class="muet">pas encore publié</span>`;
  const repo = `https://github.com/nsi-xyz-projets/projet-${projet.code}`;
  return `<article class="glass mention">
    <div class="mention-tete">
      <h3>${echapper(projet.nom || "Mon projet")}</h3>
      <span class="pill">${echapper(projet.code)}</span>
    </div>
    ${barre(p.pourcentage)}
    <p class="mention-ligne"><strong>${p.pourcentage} %</strong> · ${p.journalCount} échange${p.journalCount > 1 ? "s" : ""} journalisé${p.journalCount > 1 ? "s" : ""}${
      p.lastEntryAt ? ` · dernier : ${echapper(p.lastEntryAt)}` : ""
    }</p>
    <p class="mention-ligne">Publié : ${lien}</p>
    <div class="jalons">${jalons(p)}</div>
    <p class="mention-ligne"><a href="${repo}" target="_blank" rel="noopener noreferrer">Voir le dépôt</a></p>
  </article>`;
}

function ligneListe(ligne: LigneProjet, admin: boolean): string {
  const p = ligne.progression;
  const nom = admin && ligne.nom ? echapper(ligne.nom) : "";
  const github = admin && ligne.github ? ` <span class="muet">@${echapper(ligne.github)}</span>` : "";
  const email = admin && ligne.email ? ` <span class="muet">${echapper(ligne.email)}</span>` : "";
  const moi = ligne.moi ? ` <span class="pill">moi</span>` : "";
  const url = p.url
    ? ` <a href="${echapper(p.url)}" target="_blank" rel="noopener noreferrer">lien</a>`
    : "";
  return `<tr>
    <td><span class="pill">${echapper(ligne.code)}</span>${moi}${nom ? `<br>${nom}${github}${email}` : ""}</td>
    <td>${p.pourcentage} %${url}</td>
    <td>${p.journalCount}</td>
    <td>${p.lastEntryAt ? echapper(p.lastEntryAt.slice(0, 10)) : "—"}</td>
  </tr>`;
}

function tableauListe(liste: LigneProjet[], admin: boolean): string {
  const corps = liste.map((ligne) => ligneListe(ligne, admin)).join("");
  return `<div class="table-scroll"><table>
    <thead><tr><th>Projet</th><th>Avancement</th><th>Échanges</th><th>Dernière</th></tr></thead>
    <tbody>${corps}</tbody>
  </table></div>`;
}

function resumeClasse(liste: LigneProjet[]): string {
  const total = liste.length || 1;
  const publies = liste.filter((l) => l.progression.url).length;
  const cinq = liste.filter((l) => l.progression.journalCount >= 5).length;
  const moyenne = Math.round(liste.reduce((somme, l) => somme + l.progression.pourcentage, 0) / total);
  const cartes = [
    ["Projets suivis", `${liste.length}`],
    ["Publiés en ligne", `${publies}`],
    ["≥ 5 échanges", `${cinq}`],
    ["Avancement moyen", `${moyenne} %`],
  ];
  return `<div class="grid-cards">${cartes
    .map(([titre, valeur]) => `<article class="glass card"><span class="card-kicker">${titre}</span><h3>${valeur}</h3></article>`)
    .join("")}</div>`;
}

function rendreMessages(messages: Message[]): string {
  if (!messages.length) return `<p class="muet">Aucun message pour l’instant.</p>`;
  return messages
    .map(
      (m) => `<article class="glass mention">
        <div class="mention-tete"><h3>${echapper(m.subject || "Message")}</h3><span class="muet">${echapper(m.created_at.slice(0, 10))}</span></div>
        <p class="mention-ligne">${echapper(m.body || "").replace(/\n/g, "<br>")}</p>
      </article>`,
    )
    .join("");
}

function afficherInvite(): void {
  const invite = qs<HTMLElement>("[data-espace-invite]");
  const contenu = qs<HTMLElement>("[data-espace-contenu]");
  const sous = qs<HTMLElement>("[data-espace-sous]");
  if (invite) invite.hidden = false;
  if (contenu) contenu.hidden = true;
  if (sous) sous.textContent = "Connecte-toi pour voir ton projet et l’avancement de la classe.";
}

/** Envoi JSON vers login (POST). */
async function posterJson(chemin: string, corps: unknown): Promise<boolean> {
  try {
    const reponse = await fetch(`${LOGIN}${chemin}`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corps),
    });
    return reponse.ok;
  } catch (erreur) {
    console.warn("espace : envoi impossible", erreur);
    return false;
  }
}

/** Bloc de nomination des administrateurs (superadmin uniquement). */
async function rendreNomination(conteneur: HTMLElement, canAppoint: boolean): Promise<void> {
  if (!canAppoint) {
    conteneur.innerHTML = `<p class="muet">Seul le superadmin peut nommer ou révoquer des administrateurs.</p>`;
    return;
  }

  const chargerListe = async (): Promise<void> => {
    const reponse = await chargerJson<ReponseAdmins>("/api/admin/admins");
    const admins = reponse ? reponse.admins : [];
    const items = admins
      .map(
        (a) => `<li>
          <span>${echapper(a.nom || a.email || a.userId)}${a.email ? ` <span class="muet">${echapper(a.email)}</span>` : ""}</span>
          <button class="btn btn-ghost" type="button" data-revoquer="${echapper(a.userId)}">Révoquer</button>
        </li>`,
      )
      .join("");
    conteneur.innerHTML =
      `<form class="nomination" data-nomination>` +
      `<input type="email" name="email" placeholder="adresse Google du futur admin" required>` +
      `<button class="btn btn-primary" type="submit">Nommer</button>` +
      `</form>` +
      `<p class="muet" data-nomination-etat role="status" aria-live="polite"></p>` +
      `<ul class="admins">${items}</ul>`;

    const formulaire = conteneur.querySelector<HTMLFormElement>("[data-nomination]");
    const etat = conteneur.querySelector<HTMLElement>("[data-nomination-etat]");
    formulaire?.addEventListener("submit", async (evenement) => {
      evenement.preventDefault();
      const email = String(new FormData(formulaire).get("email") || "").trim();
      if (!email) return;
      if (etat) etat.textContent = "Enregistrement…";
      const ok = await posterJson("/api/admin/nommer", { email });
      if (etat) {
        etat.textContent = ok
          ? `${email} est désormais administrateur.`
          : "Échec : compte introuvable (ou déjà superadmin).";
      }
      if (ok) await chargerListe();
    });

    for (const bouton of conteneur.querySelectorAll<HTMLButtonElement>("[data-revoquer]")) {
      bouton.addEventListener("click", async () => {
        const userId = bouton.dataset.revoquer || "";
        if (!userId) return;
        const ok = await posterJson("/api/admin/revoquer", { userId });
        if (etat) etat.textContent = ok ? "Administrateur révoqué." : "Échec de la révocation.";
        if (ok) await chargerListe();
      });
    }
  };

  await chargerListe();
}

async function initialiser(): Promise<void> {
  const racine = qs<HTMLElement>("[data-espace]");
  if (!racine) return;

  const moi = await chargerJson<ReponseMoi>("/api/me");
  if (!moi) {
    afficherInvite();
    return;
  }

  const sous = qs<HTMLElement>("[data-espace-sous]");
  if (sous) sous.textContent = `${moi.profil.name || moi.profil.email || ""} — rôle : ${moi.profil.role}`;

  const monProjet = qs<HTMLElement>("[data-espace-monprojet]");
  if (monProjet) {
    monProjet.innerHTML = moi.projets.length
      ? moi.projets.map(carteProjet).join("")
      : `<p class="muet">Aucun code de projet déclaré. Va sur <a href="${LOGIN}/projet">login.nsi.xyz/projet</a> pour déclarer le code reçu en classe.</p>`;
  }

  const liste = await chargerJson<ReponseListe>("/api/projets");
  const admin = moi.profil.role === "admin";
  if (liste) {
    const conteneurListe = qs<HTMLElement>("[data-espace-liste]");
    if (conteneurListe) conteneurListe.innerHTML = tableauListe(liste.liste, admin);
    const classe = qs<HTMLElement>("[data-espace-classe]");
    if (classe) classe.innerHTML = resumeClasse(liste.liste);
  }

  const messages = await chargerJson<{ messages: Message[] }>("/api/messages");
  const boiteMessages = qs<HTMLElement>("[data-espace-messages]");
  if (boiteMessages) boiteMessages.innerHTML = rendreMessages(messages ? messages.messages : []);

  // Contenu réservé à l'administration (vue nominative).
  const adminBloc = qs<HTMLElement>("[data-espace-admin]");
  if (adminBloc) adminBloc.hidden = !admin;
  const nomination = qs<HTMLElement>("[data-espace-nomination]");
  if (nomination && admin) await rendreNomination(nomination, Boolean(moi.profil.canAppoint));

  const contenu = qs<HTMLElement>("[data-espace-contenu]");
  if (contenu) contenu.hidden = false;
}

void initialiser();

export {};
