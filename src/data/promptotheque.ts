/**
 * Promptothèque — prompts prêts à l'emploi, classés par intention.
 *
 * Chaque prompt est une liste de lignes jointe par \n : le contenu est ainsi
 * lisible dans le code ET exactement celui qui sera copié (aucune indentation
 * parasite). Les exemples ne contiennent volontairement aucun secret.
 */

export interface PromptPublie {
  id: string;
  categorie: string;
  titre: string;
  intention: string;
  /** Le texte exact à copier. */
  prompt: string;
  pourquoi: string[];
  adapter: string;
}

export const categories: string[] = [
  "Démarrer",
  "Construire",
  "Corriger",
  "Vérifier",
  "Comprendre",
  "Publier",
  "Sécurité",
];

export const promptsPublies: PromptPublie[] = [
  {
    id: "premier-contact",
    categorie: "Démarrer",
    titre: "Premier contact avec un projet",
    intention: "Comprendre ce qu'on a sous les yeux avant de toucher à quoi que ce soit.",
    prompt: [
      "Fais le point sur ce projet, sans modifier aucun fichier :",
      "",
      "1. liste les fichiers importants et explique le rôle de chacun en une phrase ;",
      "2. indique comment lancer le site et comment le construire ;",
      "3. signale ce qui te semble inachevé ou fragile.",
      "",
      "Réponds en français, en langage simple.",
    ].join("\n"),
    pourquoi: [
      "Aucune modification demandée : la réponse est un état des lieux, pas un chantier.",
      "L'agent est obligé de lire les fichiers — il ne peut pas inventer un projet qu'il a sous les yeux.",
      "La dernière phrase force un langage compréhensible par un débutant.",
    ],
    adapter:
      "Rien à adapter au départ. Plus tard, remplacez le point 3 par une question précise sur ce qui vous intéresse.",
  },
  {
    id: "cadrer-avant-coder",
    categorie: "Démarrer",
    titre: "Cadrer avant de coder",
    intention: "Faire poser les bonnes questions avant d'écrire la première ligne.",
    prompt: [
      "Je veux ajouter [décrivez la fonctionnalité en une phrase], mais je ne sais pas par où commencer.",
      "",
      "Avant de coder quoi que ce soit : pose-moi les questions nécessaires pour bien comprendre",
      "ce que je veux, puis propose un plan en étapes courtes.",
      "",
      "Ne crée et ne modifie aucun fichier pour l'instant.",
    ].join("\n"),
    pourquoi: [
      "Les questions révèlent les zones floues du projet — celles qui auraient coûté des allers-retours.",
      "Un plan en étapes courtes se teste et se corrige ; un gros bloc de code, non.",
      "L'interdiction finale évite le classique « j'ai déjà commencé » avant la validation.",
    ],
    adapter: "Remplacez le crochet par votre besoin réel, même s'il vous paraît évident.",
  },
  {
    id: "initialiser-propre",
    categorie: "Démarrer",
    titre: "Initialiser un projet proprement",
    intention: "Partir sur des fondations saines : structure, README, .gitignore.",
    prompt: [
      "Propose la structure de base de ce projet et explique chaque dossier en une phrase.",
      "",
      "Prépare ensuite :",
      "- un README qui dit ce que fait le projet et comment le lancer ;",
      "- un .gitignore qui protège .env, .env.*, node_modules/ et les fichiers de build ;",
      "- un fichier d'exemple .env.example, sans aucune valeur réelle.",
      "",
      "Avant d'agir, montre-moi la liste des fichiers que tu vas créer.",
    ].join("\n"),
    pourquoi: [
      "Le README et l'exemple de configuration sont ce qu'on relit six mois plus tard.",
      "Le .gitignore est demandé dès le départ : c'est la première protection contre les fuites de secrets.",
      "La validation préalable garde la main sur la structure.",
    ],
    adapter:
      "Ajoutez les dossiers propres à votre projet si vous savez déjà où ils vont (images, données, contenus).",
  },
  {
    id: "ajouter-section",
    categorie: "Construire",
    titre: "Ajouter une section",
    intention: "Obtenir exactement la section voulue, sans toucher au reste.",
    prompt: [
      "Ajoute une section [titre de la section] sous [emplacement précis].",
      "",
      "Contexte : la page concernée est [chemin du fichier] ; les styles sont dans [dossier des styles] ;",
      "les autres sections suivent [décrivez le modèle à imiter].",
      "",
      "Contraintes : ne modifie que ce fichier (et la feuille de style si nécessaire). Réutilise les classes",
      "existantes, n'ajoute aucune dépendance, ne touche pas au pied de page.",
      "",
      "C'est réussi quand la section s'affiche à l'emplacement voulu, avec [contenu attendu], et que le reste",
      "de la page est identique.",
      "",
      "Décris d'abord ton plan, puis attends ma validation.",
    ].join("\n"),
    pourquoi: [
      "Le contexte cite les fichiers : l'agent modifie le bon endroit du premier coup.",
      "Les contraintes protègent le reste de la page — la régression est l'accident le plus fréquent.",
      "Le critère de réussite est vérifiable : on ouvre la page et on regarde.",
    ],
    adapter:
      "Remplacez les crochets. Si vous ne connaissez pas un chemin, demandez-le d'abord à l'agent.",
  },
  {
    id: "changer-style",
    categorie: "Construire",
    titre: "Changer le style d'un détail",
    intention: "Un petit ajustement visuel, sans effet de bord.",
    prompt: [
      "Sur [page ou composant précis], [décrivez le changement visuel : mettre le titre en deux lignes maximum,",
      "espacer les cartes, agrandir le bouton…].",
      "",
      "Ne touche ni aux couleurs générales, ni à la disposition des autres éléments.",
      "Montre-moi la liste des fichiers modifiés et explique chaque changement en une phrase.",
    ].join("\n"),
    pourquoi: [
      "Le périmètre est minuscule : l'agent ne peut pas réécrire la page entière.",
      "Les interdictions évitent la refonte spontanée du design.",
      "La liste des fichiers modifiés rend le changement vérifiable.",
    ],
    adapter: "Décrivez l'effet voulu, pas la technique : l'agent choisit les propriétés CSS.",
  },
  {
    id: "corriger-erreur",
    categorie: "Corriger",
    titre: "Corriger une erreur au démarrage",
    intention: "Transformer un message d'erreur en correction ciblée.",
    prompt: [
      "Le site ne démarre pas. Voici le message d'erreur complet :",
      "",
      "[collez ici l'intégralité du message, sans le raccourcir]",
      "",
      "Explique d'abord ce que dit cette erreur, en français simple.",
      "Corrige ensuite uniquement la cause de cette erreur : ne refactorise rien d'autre et ne change pas le design.",
      "",
      "Termine en indiquant la commande à relancer pour vérifier.",
    ].join("\n"),
    pourquoi: [
      "Le message complet contient le fichier et la ligne : c'est l'information la plus utile du projet à ce moment-là.",
      "« Uniquement la cause » empêche la refonte opportuniste.",
      "La commande de vérification évite de croire sur parole.",
    ],
    adapter:
      "Ne coupez jamais le message d'erreur : la première ligne est souvent moins informative que la dernière.",
  },
  {
    id: "regression",
    categorie: "Corriger",
    titre: "Réparer une régression",
    intention: "Quelque chose qui fonctionnait ne fonctionne plus.",
    prompt: [
      "La dernière modification a cassé [décrivez ce qui ne marche plus].",
      "Avant, [décrivez le comportement attendu] ; maintenant, [décrivez ce qui se passe].",
      "",
      "Compare avec l'état précédent si nécessaire, puis propose la correction la plus petite possible.",
      "",
      "Ne touche pas aux fonctionnalités qui n'ont rien à voir avec ce problème.",
    ].join("\n"),
    pourquoi: [
      "« Avant / maintenant » est la description la plus efficace d'un bug.",
      "La correction minimale limite le risque de nouvelle régression.",
      "La dernière ligne évite les « pendant que j'y étais ».",
    ],
    adapter:
      "Si vous avez un commit qui fonctionnait, dites-le : « l'état du commit [message ou numéro] fonctionnait ».",
  },
  {
    id: "revenir-etat",
    categorie: "Corriger",
    titre: "Revenir à l'état qui marchait",
    intention: "Arrêter d'empiler les corrections et repartir d'une base saine.",
    prompt: [
      "La situation s'est dégradée après plusieurs modifications.",
      "",
      "1. fais la liste des fichiers modifiés depuis le dernier commit ;",
      "2. propose deux options : corriger, ou revenir au dernier état enregistré ;",
      "3. explique ce qu'on perd dans chaque option.",
      "",
      "N'applique rien avant que je choisisse.",
    ].join("\n"),
    pourquoi: [
      "L'agent documente avant d'agir : on décide sur des faits, pas sur une impression.",
      "Deux options chiffrées valent mieux qu'une correction imposée.",
      "Le dernier état enregistré est un point de retour : c'est le rôle des commits.",
    ],
    adapter:
      "Si vous avez déjà committé, précisez-le : « le dernier commit est propre, je peux revenir dessus ».",
  },
  {
    id: "relire-avant-livrer",
    categorie: "Vérifier",
    titre: "Relire avant de livrer",
    intention: "Demander à l'agent de chercher ce qui ne va pas, pas de confirmer que tout va bien.",
    prompt: [
      "Relis le projet comme un relecteur exigeant, sans modifier de fichier.",
      "",
      "Cherche en priorité :",
      "- les liens et les images qui ne mènent nulle part ;",
      "- les textes provisoires, fautes et incohérences ;",
      "- les endroits qui casseraient sur un téléphone étroit ;",
      "- les incohérences entre le README et le site.",
      "",
      "Classe tes remarques par gravité, avec le fichier concerné pour chacune.",
    ].join("\n"),
    pourquoi: [
      "« Cherche ce qui ne va pas » évite la complaisance d'un « tout est bon ».",
      "La liste de critères guide la relecture au lieu de la laisser vague.",
      "Le classement par gravité aide à choisir quoi corriger en premier.",
    ],
    adapter:
      "Ajoutez un critère propre à votre projet : orthographe des noms propres, mentions légales, crédits photo.",
  },
  {
    id: "verifier-mobile",
    categorie: "Vérifier",
    titre: "Vérifier l'affichage sur téléphone",
    intention: "Le rendu mobile est le premier point de rupture d'une page.",
    prompt: [
      "Analyse la mise en page de [page ou composant] pour un écran de téléphone (largeur 360 à 400 pixels).",
      "",
      "Signale ce qui risque de poser problème : texte trop petit, éléments qui débordent, boutons trop",
      "rapprochés, images trop lourdes, tables qui forcent un défilement horizontal.",
      "",
      "Pour chaque problème, indique le fichier et la règle concernée, puis propose une correction.",
      "N'applique rien encore.",
    ].join("\n"),
    pourquoi: [
      "Une largeur cible précise rend la réponse concrète au lieu de théorique.",
      "La liste de symptômes vient de vrais accidents, pas d'une checklist inventée.",
      "Fichier et règle concernés : la correction est ciblée.",
    ],
    adapter:
      "Si la page est surtout lue sur ordinateur, gardez tout de même le contrôle : c'est là que les débordements se voient.",
  },
  {
    id: "expliquer-fichier",
    categorie: "Comprendre",
    titre: "Faire expliquer un fichier",
    intention: "Comprendre ce qu'on a sous les yeux — et pouvoir le raconter.",
    prompt: [
      "Explique-moi [chemin du fichier] comme à un débutant, sans modifier de fichier.",
      "",
      "Structure ta réponse en trois temps :",
      "1. à quoi sert ce fichier dans le projet ;",
      "2. ce qui se passe ligne par ligne, dans l'ordre ;",
      "3. les deux ou trois endroits où il faudra faire attention en le modifiant.",
      "",
      "Puis pose-moi deux questions pour vérifier que j'ai compris.",
    ].join("\n"),
    pourquoi: [
      "L'explication structurée évite le pavé impossible à relire.",
      "Le point 3 prépare les modifications futures.",
      "Les questions de contrôle transforment la lecture en vrai apprentissage.",
    ],
    adapter:
      "Demandez la même chose pour une fonction précise plutôt qu'un fichier entier quand il est long.",
  },
  {
    id: "preparer-deploiement",
    categorie: "Publier",
    titre: "Préparer le déploiement",
    intention: "Vérifier que tout est en ordre avant de mettre le site en ligne.",
    prompt: [
      "Le site est prêt à être publié. Fais la vérification complète, sans modifier de fichier :",
      "",
      "1. le build passe-t-il, et qu'a-t-il produit comme dossier de sortie ?",
      "2. reste-t-il des textes provisoires, des liens de test ou des images manquantes ?",
      "3. y a-t-il un secret, une clé ou une donnée personnelle dans les fichiers suivis par Git ?",
      "4. quelles variables d'environnement seront nécessaires en production ?",
      "",
      "Donne la liste des points à corriger avant publication, classée par gravité.",
    ].join("\n"),
    pourquoi: [
      "Un déploiement raté se voit tout de suite ; un secret publié, beaucoup plus tard.",
      "Les quatre questions couvrent les échecs les plus fréquents.",
      "La liste classée évite de tout corriger avant de publier ce qui est prêt.",
    ],
    adapter:
      "Lancez d'abord npm run build vous-même : l'agent ne doit pas être la seule source d'information.",
  },
  {
    id: "echec-build",
    categorie: "Publier",
    titre: "Diagnostiquer un échec de build",
    intention: "Comprendre pourquoi la mise en ligne refuse de se faire.",
    prompt: [
      "Le build échoue. Voici le journal complet :",
      "",
      "[collez ici le journal, de la première erreur jusqu'à la fin]",
      "",
      "1. indique quelle est la PREMIÈRE erreur et recopie-la ;",
      "2. explique sa cause probable en français simple ;",
      "3. propose la correction minimale, puis la commande à lancer pour vérifier.",
      "",
      "Si l'erreur cache un avertissement antérieur, remonte-le.",
    ].join("\n"),
    pourquoi: [
      "La première erreur est la seule qui compte : les suivantes en découlent souvent.",
      "Une correction minimale se vérifie facilement.",
      "Le rappel de l'avertissement antérieur évite de traiter un symptôme.",
    ],
    adapter:
      "Si le build passe chez vous mais échoue en ligne, précisez-le : la différence est souvent la version de Node.",
  },
  {
    id: "audit-secrets",
    categorie: "Sécurité",
    titre: "Auditer les secrets avant publication",
    intention: "Chercher les fuites avant qu'elles ne partent en ligne.",
    prompt: [
      "Audite ce dépôt à la recherche de secrets, sans modifier de fichier et sans afficher la valeur trouvée.",
      "",
      "Cherche : les fichiers .env et équivalents suivis par Git, les clés d'API et jetons écrits en clair,",
      "les mots de passe dans le code, les adresses ou numéros personnels, les captures d'écran montrant",
      "des identifiants.",
      "",
      "Pour chaque alerte : indique le fichier, la ligne et la nature du secret — jamais sa valeur.",
      "Termine par la marche à suivre si un secret a déjà été poussé.",
    ].join("\n"),
    pourquoi: [
      "L'agent relit tout le dépôt en quelques secondes : c'est un contrôle systématique, pas un espoir.",
      "« Jamais sa valeur » évite d'afficher à nouveau le secret dans la conversation.",
      "La marche à suivre rappelle que la rotation de la clé passe avant le nettoyage.",
    ],
    adapter:
      "À lancer avant chaque publication et à la fin de chaque séance de travail sur un projet qui manipule des clés.",
  },
];
