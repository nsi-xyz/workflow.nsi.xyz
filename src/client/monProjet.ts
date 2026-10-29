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
  journalDates: string[];
  url: string | null;
  urlOk: boolean;
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
  slug?: string;
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
  apercu?: { code: string; nom?: string | null };
}

interface LigneProjet {
  project: string;
  code: string;
  slug?: string;
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

const LIBELLES_JALONS: Record<string, string> = {
  contrat: "Contrat en place",
  premier_journal: "Premier échange",
  publie: "URL déclarée",
  publie_ok: "En ligne (200)",
};

/** `journal/009-2026-10-15T….json` → `2026-10-15`. */
function dateJournal(valeur: string | null): string {
  if (!valeur) return "—";
  const tiret = valeur.indexOf("-");
  const brut = tiret >= 0 ? valeur.slice(tiret + 1) : valeur;
  return brut.slice(0, 10);
}

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

/** Message lisible quand la lecture GitHub échoue (réseau, quota, 5xx…). */
function messageLecture(erreur: string, valeurConnue: boolean): string {
  const suite = valeurConnue
    ? "dernières valeurs connues conservées"
    : "nouvelle tentative automatique";
  if (erreur === "reseau") return `Réseau GitHub indisponible — ${suite}.`;
  if (erreur === "jeton_absent") return `Jeton GitHub absent — ${suite}.`;
  if (erreur === "http_429") return `Quota GitHub atteint — ${suite}.`;
  if (/^http_5\d\d$/.test(erreur)) return `GitHub indisponible (${erreur}) — ${suite}.`;
  if (erreur === "absent") return "Dépôt introuvable sur GitHub.";
  return `Lecture du dépôt : ${erreur} — ${suite}.`;
}

function jalons(progression: Progression): string {
  return Object.entries(LIBELLES_JALONS)
    .map(
      ([cle, label]) =>
        `<span class="j ${progression.jalons.includes(cle) ? "j-ok" : ""}">${echapper(label)}</span>`,
    )
    .join("");
}

/** Slug de 2 caractères (D24X-… → D2) ; repli sur le code si absent. */
function slugDe(ligne: { code: string; slug?: string }): string {
  return ligne.slug || ligne.code.slice(0, 2).toUpperCase();
}

/** Checklist d'avancement : 5 cases, aide au survol. */
function bareme(p: Progression): string {
  const bonus = Math.min(Math.max(p.journalCount - 1, 0), 42);
  const items: Array<{ ok: boolean; label: string; aide: string }> = [
    { ok: p.contratOk, label: "Contrat", aide: "Contrat en place (AGENTS.md + workflow.md) : +21 %" },
    { ok: p.journalCount >= 1, label: "1er", aide: "Premier échange journalisé : +15 %" },
    {
      ok: bonus >= 42,
      label: "Journal+",
      aide: `Bonus journal : 1 % par échange au-delà du premier, plafonné à 42 % (actuel : ${bonus} %).`,
    },
    { ok: Boolean(p.url), label: "URL", aide: "URL déclarée dans projet.json : +21 %" },
    { ok: Boolean(p.urlOk), label: "200", aide: "URL qui répond HTTP 200 : +42 %" },
  ];
  return `<span class="bareme">${items
    .map(
      (item) =>
        `<span class="b ${item.ok ? "b-ok" : ""}" title="${echapper(item.aide)}" aria-label="${echapper(item.aide)}">${
          item.ok ? "☑" : "☐"
        } ${item.label}</span>`,
    )
    .join("")}</span>`;
}

function carteProjet(projet: Projet): string {
  const p = projet.progression;
  const lien = p.url
    ? `<a href="${echapper(p.url)}" target="_blank" rel="noopener noreferrer">${echapper(p.url)}</a> ${
        p.urlOk ? `<span class="muet">(200)</span>` : `<span class="muet">(non vérifié)</span>`
      }`
    : `<span class="muet">pas encore publié</span>`;
  const repo = `https://github.com/nsi-xyz-projets/projet-${projet.code}`;
  return `<article class="glass mention">
    <div class="mention-tete">
      <h3>${echapper(projet.nom || "Mon projet")}</h3>
      <span class="pill">${echapper(projet.code)}</span>
    </div>
    ${barre(p.pourcentage)}
    <p class="mention-ligne"><strong>${p.pourcentage} %</strong> · ${p.journalCount} échange${p.journalCount > 1 ? "s" : ""} journalisé${p.journalCount > 1 ? "s" : ""}${
      p.lastEntryAt ? ` · dernier : ${echapper(dateJournal(p.lastEntryAt))}` : ""
    }</p>
    ${p.pourcentage > 100 ? `<p class="mention-ligne muet">Score bonus : le barème monte jusqu’à 120 % avec un journal très complet.</p>` : ""}
    <p class="mention-ligne">Publié : ${lien}</p>
    <div class="jalons">${jalons(p)}</div>
    ${!p.urlOk && p.pourcentage >= 90 ? `<p class="mention-ligne muet">Plafonné à 90 % : le site doit répondre 200 pour dépasser.</p>` : ""}
    ${p.erreur ? `<p class="mention-ligne muet">${echapper(messageLecture(p.erreur, Boolean(p.fetchedAt)))}</p>` : ""}
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
  const err = p.erreur
    ? ` <span class="muet" title="${echapper(messageLecture(p.erreur, Boolean(p.fetchedAt)))}">(lecture indisponible)</span>`
    : "";
  const slug = slugDe(ligne);
  const codeComplet = admin ? `<br><span class="muet">${echapper(ligne.code)}</span>` : "";
  const voirComme = admin
    ? ` · <a class="lien-depot" href="/mon-projet?comme=${encodeURIComponent(ligne.code)}">Voir comme</a>`
    : "";
  const depot = admin
    ? `<br><a class="lien-depot" href="https://github.com/nsi-xyz-projets/projet-${encodeURIComponent(ligne.code)}" target="_blank" rel="noopener noreferrer">Dépôt GitHub ↗</a>${voirComme}`
    : "";
  const retard = (p.journalDates || []).filter((d) => d > FIN_SUIVI).length;
  const retardHtml = retard
    ? ` <span class="late" title="Contributions après le 2 novembre">+${retard} hors délais</span>`
    : "";
  return `<tr>
    <td><span class="pill" title="${echapper(ligne.code)}">${echapper(slug)}</span>${moi}${nom ? `<br>${nom}${github}${email}` : ""}${codeComplet}${depot}</td>
    <td>${p.pourcentage} %${url}${err}</td>
    <td>${p.journalCount}</td>
    <td>${p.journalDates.length}</td>
    <td>${echapper(dateJournal(p.lastEntryAt))}${retardHtml}</td>
    <td>${bareme(p)}</td>
  </tr>`;
}

function tableauListe(liste: LigneProjet[], admin: boolean): string {
  const corps = liste.map((ligne) => ligneListe(ligne, admin)).join("");
  return `<div class="table-scroll"><table>
    <thead><tr><th>Projet</th><th>Score</th><th>Échanges</th><th>Jours</th><th>Dernière</th><th>Avancement</th></tr></thead>
    <tbody>${corps}</tbody>
  </table></div>`;
}

function resumeClasse(liste: LigneProjet[]): string {
  const total = liste.length || 1;
  const publies = liste.filter((l) => l.progression.urlOk).length;
  const cinq = liste.filter((l) => l.progression.journalCount >= 5).length;
  const moyenne = Math.round(liste.reduce((somme, l) => somme + l.progression.pourcentage, 0) / total);
  const cartes = [
    ["Projets suivis", `${liste.length}`],
    ["En ligne (200)", `${publies}`],
    ["≥ 5 échanges", `${cinq}`],
    ["Avancement moyen", `${moyenne} %`],
  ];
  return `<div class="grid-cards">${cartes
    .map(([titre, valeur]) => `<article class="glass card"><span class="card-kicker">${titre}</span><h3>${valeur}</h3></article>`)
    .join("")}</div>`;
}

/** Fenêtre de suivi : du 13 octobre au 2 novembre 2026. */
const DEBUT_SUIVI = "2026-10-13";
const FIN_SUIVI = "2026-11-02";
const MOIS_COURT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

function dateLocale(iso: string): Date {
  const [annee, mois, jour] = iso.split("-").map(Number);
  return new Date(annee, mois - 1, jour);
}

function isoLocal(d: Date): string {
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
}

function aujourdhui(): string {
  return isoLocal(new Date());
}

/** Tous les jours entre deux dates incluses. */
function joursEntre(debut: string, fin: string): string[] {
  const jours: string[] = [];
  const courant = dateLocale(debut);
  const cible = dateLocale(fin);
  while (courant <= cible) {
    jours.push(isoLocal(courant));
    courant.setDate(courant.getDate() + 1);
  }
  return jours;
}

/** Calendrier d'activité : une ligne par slug, une colonne par jour de suivi.
 *  Les contributions postérieures au 2 novembre sont affichées en rouge (« hors délais »). */
function rendreCalendrier(liste: LigneProjet[]): string {
  const finAffichee = aujourdhui() > FIN_SUIVI ? aujourdhui() : FIN_SUIVI;
  const jours = joursEntre(DEBUT_SUIVI, finAffichee);
  const entete = jours
    .map((jour) => {
      const [, mois, num] = jour.split("-");
      const debutMois = num === "01" || jour === jours[0];
      return `<th title="${jour}">${num}${debutMois ? `<small>${MOIS_COURT[Number(mois) - 1]}</small>` : ""}</th>`;
    })
    .join("");

  const lignes = liste
    .map((ligne) => {
      const slug = slugDe(ligne);
      const dates = new Set(ligne.progression.journalDates || []);
      const cases = jours
        .map((jour) => {
          if (!dates.has(jour)) {
            return `<td class="cal-off" title="${echapper(slug)} — ${jour} : rien"></td>`;
          }
          const retard = jour > FIN_SUIVI;
          return `<td class="${retard ? "cal-late" : "cal-on"}" title="${echapper(slug)} — ${jour} : ${
            retard ? "hors délais" : "a travaillé"
          }">•</td>`;
        })
        .join("");
      return `<tr><th scope="row"><span class="pill">${echapper(slug)}</span>${
        ligne.moi ? ` <span class="muet">moi</span>` : ""
      }</th>${cases}</tr>`;
    })
    .join("");

  const { dansDelais, retard } = liste.reduce(
    (acc, l) => {
      for (const jour of l.progression.journalDates || []) {
        if (jour > FIN_SUIVI) acc.retard += 1;
        else if (jour >= DEBUT_SUIVI) acc.dansDelais += 1;
      }
      return acc;
    },
    { dansDelais: 0, retard: 0 },
  );
  const actifsAujourdhui = liste
    .filter((l) => (l.progression.journalDates || []).includes(aujourdhui()))
    .map(slugDe);

  return `<p class="muet">Suivi du <strong>13 octobre</strong> au <strong>2 novembre 2026</strong> · actifs aujourd’hui : <strong>${
    actifsAujourdhui.length ? actifsAujourdhui.map(echapper).join(", ") : "—"
  }</strong> · <strong>${dansDelais}</strong> jours-actifs dans les délais${
    retard ? ` · <span class="late">${retard} hors délais</span>` : ""
  }.</p>
    <div class="table-scroll"><table class="calendrier">
      <thead><tr><th></th>${entete}</tr></thead>
      <tbody>${lignes}</tbody>
    </table></div>`;
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
async function posterJson<T>(chemin: string, corps: unknown): Promise<{ ok: boolean; data: T | null }> {
  try {
    const reponse = await fetch(`${LOGIN}${chemin}`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corps),
    });
    const data = (await reponse.json().catch(() => null)) as T | null;
    return { ok: reponse.ok, data };
  } catch (erreur) {
    console.warn("espace : envoi impossible", erreur);
    return { ok: false, data: null };
  }
}

async function initialiser(): Promise<void> {
  const racine = qs<HTMLElement>("[data-espace]");
  if (!racine) return;

  const params = new URLSearchParams(location.search);
  const comme = params.get("comme");
  const suffixe = comme ? `?comme=${encodeURIComponent(comme)}` : "";

  const moi = await chargerJson<ReponseMoi>(`/api/me${suffixe}`);
  if (!moi) {
    if (comme) {
      // Paramètre d'aperçu invalide ou non autorisé : on revient à sa propre vue.
      location.replace("/mon-projet");
      return;
    }
    afficherInvite();
    return;
  }

  const bandeau = qs<HTMLElement>("[data-espace-apercu]");
  if (bandeau) {
    if (moi.apercu) {
      bandeau.hidden = false;
      bandeau.innerHTML = `<span class="callout-title">Aperçu de la vue élève</span><p>Tu vois la page comme <strong>${echapper(
        moi.apercu.code,
      )}</strong>${
        moi.apercu.nom ? ` (${echapper(moi.apercu.nom)})` : ""
      }, sans les noms des autres élèves. <a href="/mon-projet">Revenir à ma vue d’administration</a>.</p>`;
    } else {
      bandeau.hidden = true;
    }
  }

  const sous = qs<HTMLElement>("[data-espace-sous]");
  if (sous) sous.textContent = `${moi.profil.name || moi.profil.email || ""} — rôle : ${moi.profil.role}`;

  const monProjet = qs<HTMLElement>("[data-espace-monprojet]");
  if (monProjet) {
    monProjet.innerHTML = moi.projets.length
      ? moi.projets.map(carteProjet).join("")
      : `<p class="muet">Aucun code de projet déclaré. Va sur <a href="${LOGIN}/projet">login.nsi.xyz/projet</a> pour déclarer le code reçu en classe.</p>`;
  }

  const liste = await chargerJson<ReponseListe>(`/api/projets${suffixe}`);
  const admin = moi.profil.role === "admin";
  if (liste) {
    const conteneurListe = qs<HTMLElement>("[data-espace-liste]");
    if (conteneurListe) conteneurListe.innerHTML = tableauListe(liste.liste, admin);
    const classe = qs<HTMLElement>("[data-espace-classe]");
    if (classe) classe.innerHTML = resumeClasse(liste.liste);
    const calendrier = qs<HTMLElement>("[data-espace-calendrier]");
    if (calendrier) calendrier.innerHTML = rendreCalendrier(liste.liste);
  }

  const messages = await chargerJson<{ messages: Message[] }>(`/api/messages${suffixe}`);
  const boiteMessages = qs<HTMLElement>("[data-espace-messages]");
  if (boiteMessages) boiteMessages.innerHTML = rendreMessages(messages ? messages.messages : []);

  // Contenu réservé à l'administration (vue nominative).
  const adminBloc = qs<HTMLElement>("[data-espace-admin]");
  if (adminBloc) adminBloc.hidden = !admin;
  if (admin) {
    const boutonRaf = qs<HTMLButtonElement>("[data-espace-refresh]");
    const etatRaf = qs<HTMLElement>("[data-espace-refresh-etat]");
    boutonRaf?.addEventListener("click", async () => {
      boutonRaf.disabled = true;
      let traites = 0;
      let lus = 0;
      let echecs = 0;
      let restants = 1;
      let tours = 0;
      while (restants > 0 && tours < 20) {
        if (etatRaf) {
          etatRaf.textContent = `Agrégation en cours… ${traites} ${
            traites === 1 ? "dépôt traité" : "dépôts traités"
          }`;
        }
        const { ok, data } = await posterJson<{
          total: number;
          ok: number;
          erreurs?: number;
          restants?: number;
          raison?: string;
        }>("/api/admin/refresh", {});
        if (!ok || !data) break;
        traites += data.total;
        lus += data.ok;
        echecs += data.erreurs || 0;
        restants = data.restants ?? 0;
        tours += 1;
      }
      if (etatRaf) {
        etatRaf.textContent = traites
          ? `Agrégation terminée : ${lus} ${lus === 1 ? "dépôt lu" : "dépôts lus"}, ${echecs} ${
              echecs === 1 ? "échec" : "échecs"
            } sur ${traites}. Recharge la page.`
          : "Échec : vérifie le jeton GitHub ou le quota.";
      }
      boutonRaf.disabled = false;
    });
  }

  const contenu = qs<HTMLElement>("[data-espace-contenu]");
  if (contenu) contenu.hidden = false;
}

void initialiser();

export {};
