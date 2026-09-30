/**
 * Glossaire — tous les mots du workflow, définis simplement, avec un exemple.
 * Les thèmes servent aussi de filtres dans la page.
 */

export interface Terme {
  terme: string;
  theme: string;
  definition: string;
  exemple: string;
}

export const themesGlossaire: string[] = [
  "IA et agent",
  "Git et dépôt",
  "Web et publication",
  "Sécurité",
  "Projet",
];

export const termes: Terme[] = [
  {
    terme: "IA générative",
    theme: "IA et agent",
    definition:
      "Programme qui produit du texte (ou des images) à partir d'une consigne, en prédisant la suite la plus plausible.",
    exemple: "Écrire une description de projet, traduire un paragraphe, proposer du code.",
  },
  {
    terme: "Modèle de langage (LLM)",
    theme: "IA et agent",
    definition:
      "Le moteur de l'IA générative : un très grand réseau entraîné sur des textes. Il ne « sait » pas, il calcule des probabilités.",
    exemple: "DeepSeek V4.1 Flash est le modèle utilisé dans ce projet.",
  },
  {
    terme: "Token",
    theme: "IA et agent",
    definition: "Morceau de mot, unité de mesure du modèle : environ trois à quatre caractères en français.",
    exemple: "Un prompt de dix lignes coûte quelques centaines de tokens ; une session entière, des dizaines de milliers.",
  },
  {
    terme: "Fenêtre de contexte",
    theme: "IA et agent",
    definition:
      "Quantité maximale de texte que le modèle peut lire en une fois : votre demande, l'historique et les fichiers joints.",
    exemple: "Une fenêtre d'un million de tokens peut contenir un gros projet — mais coûte cher si on la remplit.",
  },
  {
    terme: "Prompt",
    theme: "IA et agent",
    definition:
      "La consigne donnée à l'agent. Un bon prompt contient un objectif, du contexte, des contraintes et un critère de réussite.",
    exemple: "« Ajoute une section horaires sous la présentation, sans toucher au pied de page. »",
  },
  {
    terme: "Agent",
    theme: "IA et agent",
    definition:
      "Programme qui combine un modèle de langage et des outils : il lit des fichiers, en écrit, lance des commandes.",
    exemple: "OpenCode est l'agent utilisé ici ; le modèle, lui, ne touche pas aux fichiers.",
  },
  {
    terme: "Mode plan / mode build",
    theme: "IA et agent",
    definition:
      "Deux réglages de l'agent : en plan, il explique sans rien modifier ; en build, il exécute les changements.",
    exemple: "On demande toujours un plan pour une fonctionnalité, puis on bascule en build pour l'appliquer.",
  },
  {
    terme: "Compaction",
    theme: "IA et agent",
    definition:
      "Résumé automatique d'une longue conversation pour libérer de la place dans le contexte et faire baisser le coût.",
    exemple: "La commande /compact d'OpenCode résume la session sans perdre le fil.",
  },
  {
    terme: "Réflexion (thinking)",
    theme: "IA et agent",
    definition:
      "Mode où le modèle écrit son raisonnement avant de répondre. Efficace sur les problèmes difficiles, facturé au prix de la sortie.",
    exemple: "Inutile pour renommer un fichier ; précieux pour comprendre une erreur obscure.",
  },
  {
    terme: "Hallucination",
    theme: "IA et agent",
    definition:
      "Réponse fausse mais formulée avec assurance : une fonction inventée, une bibliothèque qui n'existe pas.",
    exemple: "Un « ça fonctionne, j'ai corrigé » sans test derrière : vérifier soi-même reste obligatoire.",
  },
  {
    terme: "Dépôt (repository)",
    theme: "Git et dépôt",
    definition:
      "Dossier surveillé par Git, avec tout son historique. Sur GitHub, c'est la copie en ligne de ce dossier.",
    exemple: "Le projet workflow.nsi.xyz a son dépôt sur GitHub, en public.",
  },
  {
    terme: "Commit",
    theme: "Git et dépôt",
    definition:
      "Photo de l'état du projet à un instant donné, avec un message. C'est le point de retour du travail.",
    exemple: "« Ajoute la section horaires » : un commit par étape qui fonctionne.",
  },
  {
    terme: "Push / pull",
    theme: "Git et dépôt",
    definition: "Envoyer ses commits vers GitHub (push), ou récupérer ceux qui y sont (pull).",
    exemple: "On termine la séance par un push, et on commence la suivante par un pull.",
  },
  {
    terme: "Branche",
    theme: "Git et dépôt",
    definition:
      "Ligne de développement indépendante. Un projet d'élève vit très bien sur une seule branche : main.",
    exemple: "GitHub Pages crée une URL de prévisualisation par branche, mais ce n'est pas nécessaire ici.",
  },
  {
    terme: "Dépôt distant (remote)",
    theme: "Git et dépôt",
    definition: "L'adresse du dépôt en ligne auquel on envoie le travail. Par convention : origin.",
    exemple: "git remote -v affiche l'adresse vers laquelle pointe origin.",
  },
  {
    terme: "Clone",
    theme: "Git et dépôt",
    definition: "Copie complète d'un dépôt distant, historique compris, sur une machine locale.",
    exemple: "git clone permet de relire un projet sur un autre ordinateur.",
  },
  {
    terme: "Fichier .gitignore",
    theme: "Git et dépôt",
    definition: "Liste des fichiers que Git doit ignorer : secrets, dépendances, fichiers de build.",
    exemple: ".env, node_modules/ et dist/ n'ont rien à faire dans un dépôt.",
  },
  {
    terme: "Historique",
    theme: "Git et dépôt",
    definition:
      "Ensemble des commits, du plus ancien au plus récent. Il se relit (git log) et ne s'efface pas facilement.",
    exemple: "Retirer un fichier dans un nouveau commit ne l'efface pas de l'historique.",
  },
  {
    terme: "Build",
    theme: "Web et publication",
    definition:
      "Compilation du projet : les sources (Astro, Markdown, styles) sont transformées en fichiers HTML, CSS et images prêts à être servis.",
    exemple: "npm run build produit le dossier dist/.",
  },
  {
    terme: "Déploiement",
    theme: "Web et publication",
    definition:
      "Mise en ligne du résultat du build sur un hébergeur, avec une adresse publique.",
    exemple: "Cloudflare Pages relit le dépôt, compile et publie à chaque push.",
  },
  {
    terme: "Hébergement statique",
    theme: "Web et publication",
    definition:
      "Service qui distribue des fichiers déjà préparés, sans calcul côté serveur. Rapide, peu coûteux, sans base de données.",
    exemple: "Cloudflare Pages est un hébergement statique : une landing page y est chez elle.",
  },
  {
    terme: "URL de prévisualisation",
    theme: "Web et publication",
    definition:
      "Adresse temporaire d'une version non publiée, créée automatiquement pour une branche ou une proposition de modification.",
    exemple: "Elle sert à faire relire une modification, pas à être partagée comme adresse officielle.",
  },
  {
    terme: "Domaine personnalisé (CNAME)",
    theme: "Web et publication",
    definition:
      "Nom de domaine propre (mon-projet.nsi.xyz) rattaché à l'hébergement. Chez Cloudflare Pages, il faut créer soi-même l'enregistrement CNAME.",
    exemple: "Sans ce CNAME, le domaine reste en « pending » et le certificat n'est pas émis.",
  },
  {
    terme: "Pages Functions",
    theme: "Web et publication",
    definition:
      "Petites fonctions exécutées par l'hébergeur, déployées avec le site : elles permettent une API, un formulaire, un accès à un stockage.",
    exemple: "L'API du journal des prompts (dépôt, statistiques, espace prof) est faite de Pages Functions.",
  },
  {
    terme: "Secret",
    theme: "Sécurité",
    definition:
      "Information qui donne un accès : clé d'API, jeton, mot de passe, cookie de session. Elle ne se publie jamais.",
    exemple: "La clé DeepSeek vit dans .env en local et dans les réglages Cloudflare en production.",
  },
  {
    terme: "Clé d'API",
    theme: "Sécurité",
    definition:
      "Longue chaîne fournie par un service pour identifier et facturer vos appels. Elle se comporte comme un mot de passe.",
    exemple: "Une clé DeepSeek commence par sk- et ne s'affiche qu'une seule fois.",
  },
  {
    terme: "Empreinte (hash)",
    theme: "Sécurité",
    definition:
      "Résultat d'un calcul irréversible appliqué à une donnée : impossible de remonter au texte d'origine.",
    exemple: "Le journal des prompts ne stocke que l'empreinte SHA-256 du code élève.",
  },
  {
    terme: "Rotation d'une clé",
    theme: "Sécurité",
    definition:
      "Révoquer un secret exposé puis en créer un nouveau. C'est la première action en cas de fuite, avant tout nettoyage.",
    exemple: "Une clé poussée sur GitHub est publique dès la seconde : on la tourne immédiatement.",
  },
  {
    terme: "Données personnelles (RGPD)",
    theme: "Sécurité",
    definition:
      "Informations qui identifient une personne : nom, téléphone, adresse, photo, date de naissance, notes. À ne jamais publier ni envoyer dans un prompt.",
    exemple: "Ce site ne collecte aucune donnée personnelle : les dépôts sont liés à une empreinte de code.",
  },
  {
    terme: "Injection de prompt",
    theme: "Sécurité",
    definition:
      "Contenu (page, fichier, message) qui contient des instructions cachées destinées à détourner l'agent.",
    exemple: "Avant d'exécuter une consigne trouvée dans un fichier, se demander si elle vient bien de vous.",
  },
  {
    terme: "Environnement de développement",
    theme: "Projet",
    definition:
      "Tout ce qui tourne sur votre machine pour construire le projet : l'éditeur, le terminal, Node, l'agent, un navigateur de test.",
    exemple: "Il ne faut pas confondre ce qui marche « chez vous » et ce qui marche en production.",
  },
  {
    terme: "Terminal",
    theme: "Projet",
    definition:
      "Interface textuelle où l'on tape des commandes. Le dossier courant y est déterminant : c'est là que l'agent travaille.",
    exemple: "Vérifier le dossier avant de lancer opencode évite la moitié des malentendus.",
  },
  {
    terme: "Dépendance",
    theme: "Projet",
    definition:
      "Bibliothèque externe dont le projet a besoin, déclarée dans package.json et installée dans node_modules/.",
    exemple: "Astro est une dépendance ; node_modules/ n'est jamais poussé, seulement reconstruit avec npm install.",
  },
  {
    terme: "README",
    theme: "Projet",
    definition:
      "Fichier qui dit ce que fait le projet et comment le lancer. C'est la première chose que lit un visiteur du dépôt.",
    exemple: "Un README à jour permet de relancer le projet six mois plus tard, sans rien deviner.",
  },
  {
    terme: "AGENTS.md",
    theme: "Projet",
    definition:
      "Document que l'agent écrit à la première session (/init) : il décrit la structure du projet et ses conventions, et sert de contexte permanent.",
    exemple: "Il se relit et se commite comme n'importe quel fichier du projet.",
  },
  {
    terme: "Numéro de version (build)",
    theme: "Projet",
    definition:
      "Compteur incrémenté à chaque mise en production : le « build #12 » permet de savoir quelle version est en ligne.",
    exemple: "Le pied de page de ce site affiche le numéro de build en cours.",
  },
];
