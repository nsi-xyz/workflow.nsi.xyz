/**
 * Missions guidées — trois parcours d'entraînement, en autonomie.
 * La progression est mémorisée dans le navigateur de l'élève, jamais envoyée.
 */

export interface EtapeMission {
  id: string;
  texte: string;
  /** Consigne à taper, si utile. */
  commande?: string;
}

export interface Mission {
  id: string;
  titre: string;
  objectif: string;
  duree: string;
  etapes: EtapeMission[];
  finiQuand: string;
  lienUtile: { href: string; label: string };
}

export const missions: Mission[] = [
  {
    id: "mission-1",
    titre: "Mission 1 — Premier contact",
    objectif:
      "Installer l'agent, brancher la clé et obtenir une page visible dans le navigateur, sans rien casser.",
    duree: "45 minutes",
    etapes: [
      { id: "m1-1", texte: "Installer OpenCode et vérifier que la commande répond.", commande: "opencode --version" },
      { id: "m1-2", texte: "Créer un dossier de projet vide, puis ouvrir un terminal dedans.", commande: "mkdir mon-projet && cd mon-projet" },
      { id: "m1-3", texte: "Lancer l'agent, brancher la clé DeepSeek (/connect) et choisir le modèle Flash." },
      { id: "m1-4", texte: "Demander un état des lieux : « fais le point sur ce projet, sans modifier de fichier »." },
      { id: "m1-5", texte: "Passer en mode plan (Tab) et demander la création d'une page d'accueil minimale." },
      { id: "m1-6", texte: "Lire le plan, le corriger si besoin, puis basculer en mode build pour l'exécuter." },
      { id: "m1-7", texte: "Lancer le serveur local et ouvrir la page dans le navigateur.", commande: "npm run dev" },
    ],
    finiQuand: "Une page s'affiche dans votre navigateur, et vous savez expliquer à quoi sert chacun des fichiers créés.",
    lienUtile: { href: "/opencode", label: "La section OpenCode" },
  },
  {
    id: "mission-2",
    titre: "Mission 2 — Garder une trace et publier",
    objectif:
      "Mettre le projet à l'abri dans un dépôt privé, puis obtenir une URL publique vérifiée.",
    duree: "45 minutes",
    etapes: [
      { id: "m2-1", texte: "Écrire le .gitignore AVANT tout le reste (.env, .env.*, node_modules/, dist/)." },
      { id: "m2-2", texte: "Vérifier que le secret est ignoré.", commande: "git check-ignore .env" },
      { id: "m2-3", texte: "Initialiser le dépôt et enregistrer un premier point de retour.", commande: "git init && git add -A && git commit -m \"Première version\"" },
      { id: "m2-4", texte: "Créer un dépôt GitHub privé, vide (aucune case cochée), puis le relier et pousser." },
      { id: "m2-5", texte: "Vérifier en ligne que les fichiers et le message de commit apparaissent." },
      { id: "m2-6", texte: "Relier le dépôt à Cloudflare Pages et lancer le premier déploiement." },
      { id: "m2-7", texte: "Tester l'URL publique depuis un autre appareil que celui du développement." },
    ],
    finiQuand: "L'URL publique répond sur le téléphone d'un camarade, et le dépôt contient l'historique.",
    lienUtile: { href: "/cloudflare", label: "La section Cloudflare Pages" },
  },
  {
    id: "mission-3",
    titre: "Mission 3 — Piloter comme un pro",
    objectif:
      "Construire une page complète à partir de rien, en journalisant les prompts et en corrigeant une erreur.",
    duree: "1 heure",
    etapes: [
      { id: "m3-1", texte: "Choisir un sujet et écrire, en une phrase, ce que la page doit apprendre au visiteur." },
      { id: "m3-2", texte: "Cadrer la demande : poser cinq questions avant toute création de fichier." },
      { id: "m3-3", texte: "Ajouter une première section avec un prompt complet (objectif, contexte, contraintes, critère)." },
      { id: "m3-4", texte: "Tester, puis décrire précisément ce qui ne va pas ; corriger." },
      { id: "m3-5", texte: "Provoquer volontairement une erreur, puis la corriger en collant le message entier." },
      { id: "m3-6", texte: "Committer chaque étape qui fonctionne, avec un message clair." },
      { id: "m3-7", texte: "Déposer quatre prompts dans le journal : cadrage, création, correction, vérification." },
      { id: "m3-8", texte: "Passer le quiz sécurité et corriger au moins une erreur de compréhension." },
    ],
    finiQuand: "La page est en ligne, le dépôt est à jour, le journal contient quatre prompts, et vous savez expliquer chaque choix.",
    lienUtile: { href: "/prompts/depot", label: "Le journal des prompts" },
  },
];
