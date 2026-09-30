/**
 * Données de la section « Cloudflare Pages ».
 * Réglages et pièges vérifiés sur la documentation Cloudflare et l'expérience
 * du kit (Node ≥ 22, CNAME manuel pour un domaine personnalisé, dossier dist).
 */

export interface EtapeDeploiement {
  titre: string;
  texte: string;
  detail: string;
}

export const etapesDeploiement: EtapeDeploiement[] = [
  {
    titre: "Push sur GitHub",
    texte: "Vous envoyez vos commits vers le dépôt.",
    detail:
      "Cloudflare surveille la branche principale (main). Chaque push peut déclencher un nouveau déploiement : la mise en ligne devient une conséquence du travail, pas une corvée.",
  },
  {
    titre: "Build",
    texte: "Cloudflare installe les dépendances et compile le projet.",
    detail:
      "C'est ici que tout se joue : commande de build, dossier de sortie, version de Node. Le journal du build dit exactement ce qui s'est passé.",
  },
  {
    titre: "Mise en ligne",
    texte: "Le résultat compilé est déposé sur le réseau Cloudflare.",
    detail:
      "Ce sont les fichiers compilés (dist/) qui sont servis, jamais vos sources. Le site est répliqué sur des serveurs proches des visiteurs.",
  },
  {
    titre: "URL",
    texte: "Le site répond à une adresse publique.",
    detail:
      "Par défaut : https://projet.pages.dev. Un domaine personnalisé (comme workflow.nsi.xyz) peut ensuite être rattaché.",
  },
];

export interface Reglage {
  champ: string;
  valeur: string;
  note: string;
}

export const reglages: Reglage[] = [
  {
    champ: "Framework preset",
    valeur: "Astro",
    note: "Remplit automatiquement la commande de build et le dossier de sortie. Sinon, réglez-les à la main.",
  },
  {
    champ: "Build command",
    valeur: "npm run build",
    note: "La commande qui compile le site. Elle doit fonctionner aussi chez vous, dans un terminal, avant d'espérer qu'elle marche en ligne.",
  },
  {
    champ: "Build output directory",
    valeur: "dist",
    note: "Le dossier produit par le build. Astro écrit dans dist/ par défaut.",
  },
  {
    champ: "Root directory",
    valeur: "la racine du dépôt",
    note: "Si le projet est dans un sous-dossier du dépôt, indiquez-le ici : c'est l'oubli classique.",
  },
  {
    champ: "NODE_VERSION",
    valeur: "22",
    note: "Astro 7 exige Node ≥ 22. Sans cette variable (ou un fichier .nvmrc), le build peut échouer alors qu'il passe sur votre machine.",
  },
];

export interface ErreurBuild {
  message: string;
  cause: string;
  correction: string;
}

export const erreursBuild: ErreurBuild[] = [
  {
    message: "« Build command failed » sans autre détail utile",
    cause: "Le build échoue pour une raison de configuration (commande, dossier de sortie) ou de code.",
    correction:
      "Rouvrez le journal du build et remontez à la première erreur — c'est toujours la première qui compte. Reproduisez la commande en local : npm run build.",
  },
  {
    message: "« Cannot find module … »",
    cause: "Une dépendance n'a pas été installée, ou le dossier racine est mal indiqué.",
    correction:
      "Vérifiez que package.json et package-lock.json sont bien dans le dossier racine défini, et que la dépendance est déclarée (pas installée « à la main »).",
  },
  {
    message: "Le build passe en local, échoue en ligne",
    cause: "Version de Node différente, ou nom de fichier avec une majuscule.",
    correction:
      "Déclarez NODE_VERSION=22 et vérifiez les majuscules : « Header.astro » et « header.astro » sont deux fichiers différents pour le serveur, mais un seul sur Windows.",
  },
  {
    message: "« Output directory dist not found »",
    cause: "Le dossier de sortie réel n'est pas celui déclaré.",
    correction:
      "Lancez le build en local et regardez le nom du dossier produit (dist/, build/, out/…), puis corrigez le réglage.",
  },
  {
    message: "Le site s'affiche sans style, ou une page renvoie 404",
    cause: "Fichiers compilés incomplets, ou une route qui n'existe pas dans le build.",
    correction:
      "Comparez ce que vous voyez en local (npm run preview) et en ligne. Un 404 sur une route signifie souvent qu'elle n'a pas été générée au build.",
  },
];

export interface VariableSecret {
  nom: string;
  role: string;
}

export const variablesSecrets: VariableSecret[] = [
  {
    nom: "CLOUDFLARE_API_TOKEN",
    role: "Pour déployer en ligne de commande (jamais nécessaire si vous passez par la connexion Git).",
  },
  {
    nom: "CLOUDFLARE_ACCOUNT_ID",
    role: "Identifiant du compte, utilisé par les outils de déploiement.",
  },
  {
    nom: "Clés d'API et mots de passe",
    role: "Tout secret utilisé par le site se déclare dans les réglages du projet, jamais dans un fichier poussé.",
  },
];

export interface PiegePages {
  titre: string;
  texte: string;
}

export const piegesPages: PiegePages[] = [
  {
    titre: "Le .env n'existe pas en ligne",
    texte:
      "Vos variables locales ne sont pas poussées — c'est voulu. Ce dont le site a besoin en production se déclare dans les réglages Cloudflare (variables et secrets).",
  },
  {
    titre: "Le domaine personnalisé reste « pending »",
    texte:
      "Pour un projet Pages, rattacher le domaine ne suffit pas : Cloudflare ne crée pas l'enregistrement DNS. Il faut ajouter le CNAME vers projet.pages.dev, en mode proxied. Le certificat est ensuite émis automatiquement.",
  },
  {
    titre: "Déployer les sources au lieu du build",
    texte:
      "Le dossier de sortie doit être dist/ (le résultat compilé), pas la racine du dépôt avec les fichiers .astro.",
  },
  {
    titre: "Publier sans relire",
    texte:
      "Une fois en ligne, c'est public : le site, son code compilé et ses textes. La checklist de la section Sécurité s'applique avant chaque mise en production.",
  },
  {
    titre: "Croire qu'un site statique peut tout faire",
    texte:
      "Un site Pages statique ne calcule rien côté serveur : pas de base de données, pas de compte utilisateur, pas d'API. Pour cela, il faut des Pages Functions — un autre sujet, et un autre niveau.",
  },
];

export const checklistPublication: string[] = [
  "Le build passe en local : <code>npm run build</code> se termine sans erreur.",
  "Le rendu local est vérifié : <code>npm run preview</code>, puis on clique partout.",
  "Aucun secret dans le dépôt (checklist de la section Sécurité).",
  "Les variables nécessaires en production sont déclarées dans les réglages Cloudflare.",
  "Le site répond sur l'URL publique, depuis un autre appareil que le vôtre.",
  "Le lien partagé est bien l'URL de production, pas une URL de prévisualisation.",
];
