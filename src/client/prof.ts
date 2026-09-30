import { MISSIONS, versCsv, type EntreeExport } from "../lib/journal";

interface Depot {
  horodatage: string;
  empreinte: string;
  mission: string;
  mode: string;
  prompt: string;
}

interface ReponseListe {
  ok: boolean;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  items: Depot[];
}

const $ = <T extends Element>(selecteur: string) => document.querySelector<T>(selecteur);

const connexion = $<HTMLElement>("[data-prof-connexion]");
const panneau = $<HTMLElement>("[data-prof-panneau]");
const formulaire = $<HTMLFormElement>("[data-prof-login]");
const motDePasse = $<HTMLInputElement>("[data-prof-motdepasse]");
const message = $<HTMLElement>("[data-prof-message]");
const etat = $<HTMLElement>("[data-prof-etat]");
const liste = $<HTMLOListElement>("[data-prof-liste]");
const champMission = $<HTMLSelectElement>("[data-prof-mission]");
const champRecherche = $<HTMLInputElement>("[data-prof-recherche]");
const boutonPlus = $<HTMLButtonElement>("[data-prof-plus]");
const boutonExport = $<HTMLButtonElement>("[data-prof-export]");
const boutonDeconnexion = $<HTMLButtonElement>("[data-prof-deconnexion]");

let depots: Depot[] = [];
let total = 0;

const libelle = (id: string) => MISSIONS.find((mission) => mission.id === id)?.label ?? id;

function afficher(vue: "connexion" | "panneau") {
  if (connexion) connexion.hidden = vue !== "connexion";
  if (panneau) panneau.hidden = vue !== "panneau";
}

function lireTous(): Promise<Depot[]> {
  const collecte = async (offset: number, acc: Depot[]): Promise<Depot[]> => {
    const reponse = await fetch(`/api/prof/prompts?offset=${offset}&limit=50`);
    if (reponse.status === 401) throw new Error("session");
    const donnees = (await reponse.json()) as ReponseListe;
    const suite: Depot[] = [...acc, ...donnees.items];
    return donnees.hasMore ? collecte(offset + 50, suite) : suite;
  };
  return collecte(0, []);
}

function dessiner() {
  if (!liste) return;
  const mission = champMission?.value ?? "";
  const recherche = (champRecherche?.value ?? "").trim().toLowerCase();
  const visibles = depots.filter(
    (depot) =>
      (!mission || depot.mission === mission) &&
      (!recherche || depot.prompt.toLowerCase().includes(recherche)),
  );

  liste.textContent = "";
  for (const depot of visibles) {
    const item = document.createElement("li");
    item.className = "glass card prof-item";

    const entete = document.createElement("p");
    entete.className = "prof-entete";
    const date = new Date(depot.horodatage).toLocaleString("fr-FR");
    entete.textContent = `${date} · ${libelle(depot.mission)}${depot.mode ? ` · mode ${depot.mode}` : ""} · code ${depot.empreinte.slice(0, 10)}`;

    const texte = document.createElement("pre");
    texte.className = "prof-prompt";
    texte.textContent = depot.prompt;

    item.appendChild(entete);
    item.appendChild(texte);
    liste.appendChild(item);
  }

  if (etat) {
    etat.textContent = `Affichés : ${visibles.length} — chargés : ${depots.length} — total de la classe : ${total}.`;
  }
}

async function charger() {
  try {
    const page = await fetch(`/api/prof/prompts?offset=${depots.length}&limit=50`);
    if (page.status === 401) throw new Error("session");
    const donnees = (await page.json()) as ReponseListe;
    depots = [...depots, ...donnees.items];
    total = donnees.total;
    if (boutonPlus) boutonPlus.disabled = !donnees.hasMore;
    afficher("panneau");
    dessiner();
  } catch {
    afficher("connexion");
  }
}

function telecharger(contenu: string, nom: string) {
  const url = URL.createObjectURL(new Blob([contenu], { type: "text/csv;charset=utf-8" }));
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = nom;
  lien.click();
  URL.revokeObjectURL(url);
}

function initialiser() {
  formulaire?.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();
    if (!motDePasse) return;
    const reponse = await fetch("/api/prof/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: motDePasse.value }),
    });
    if (reponse.ok) {
      if (message) message.textContent = "";
      await charger();
    } else if (message) {
      message.textContent = "Mot de passe incorrect.";
    }
  });

  champMission?.addEventListener("change", dessiner);
  champRecherche?.addEventListener("input", dessiner);

  boutonPlus?.addEventListener("click", charger);

  boutonExport?.addEventListener("click", async () => {
    const tous = await lireTous();
    const entrees: EntreeExport[] = tous.map((depot) => ({
      horodatage: depot.horodatage,
      empreinte: depot.empreinte,
      mission: libelle(depot.mission),
      mode: depot.mode,
      prompt: depot.prompt,
    }));
    telecharger(versCsv(entrees), `prompts-workflow-${new Date().toISOString().slice(0, 10)}.csv`);
  });

  boutonDeconnexion?.addEventListener("click", async () => {
    await fetch("/api/prof/logout", { method: "POST" });
    depots = [];
    total = 0;
    afficher("connexion");
  });

  void charger();
}

initialiser();
