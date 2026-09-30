/**
 * Quiz — logique du navigateur : thème, questions, correction immédiate, score.
 * Aucune donnée n'est envoyée : tout se passe dans la page.
 */
import { questions, themesQuiz, type QuestionQuiz } from "../data/quiz";

const $ = <T extends Element>(selecteur: string) => document.querySelector<T>(selecteur);

const racine = $<HTMLElement>("[data-quiz]");
const intro = $<HTMLElement>("[data-quiz-intro]");
const jeu = $<HTMLElement>("[data-quiz-jeu]");
const fin = $<HTMLElement>("[data-quiz-fin]");
const listeThemes = $<HTMLElement>("[data-quiz-themes]");
const champProgression = $<HTMLElement>("[data-quiz-progression]");
const champQuestion = $<HTMLElement>("[data-quiz-question]");
const champOptions = $<HTMLElement>("[data-quiz-options]");
const champFeedback = $<HTMLElement>("[data-quiz-feedback]");
const boutonSuivant = $<HTMLButtonElement>("[data-quiz-suivant]");
const boutonCommencer = $<HTMLButtonElement>("[data-quiz-commencer]");
const boutonRecommencer = $<HTMLButtonElement>("[data-quiz-recommencer]");
const champScore = $<HTMLElement>("[data-quiz-score]");
const champMessage = $<HTMLElement>("[data-quiz-message]");

let selection: QuestionQuiz[] = [];
let index = 0;
let score = 0;
let theme = "tout";

function montrer(vue: "intro" | "jeu" | "fin") {
  if (intro) intro.hidden = vue !== "intro";
  if (jeu) jeu.hidden = vue !== "jeu";
  if (fin) fin.hidden = vue !== "fin";
}

function melanger(liste: QuestionQuiz[]): QuestionQuiz[] {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function afficherQuestion() {
  const question = selection[index];
  if (!question) return;

  if (champProgression) {
    champProgression.textContent = `Question ${index + 1} sur ${selection.length} · score ${score}`;
  }
  if (champQuestion) champQuestion.textContent = question.question;
  if (champFeedback) {
    champFeedback.textContent = "";
    champFeedback.dataset.etat = "";
  }
  if (boutonSuivant) boutonSuivant.hidden = true;
  if (!champOptions) return;

  champOptions.textContent = "";
  question.options.forEach((option, position) => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "btn btn-ghost quiz-option";
    bouton.textContent = option;
    bouton.dataset.position = String(position);
    champOptions.appendChild(bouton);
  });
}

function repondre(position: number) {
  const question = selection[index];
  if (!question || !champOptions || !champFeedback) return;

  const boutons = [...champOptions.querySelectorAll<HTMLButtonElement>("[data-position]")];
  for (const bouton of boutons) {
    const estBonne = Number(bouton.dataset.position) === question.bonne;
    bouton.disabled = true;
    if (estBonne) bouton.classList.add("quiz-bonne");
    else if (Number(bouton.dataset.position) === position) bouton.classList.add("quiz-fausse");
  }

  const reussi = position === question.bonne;
  if (reussi) score += 1;
  champFeedback.dataset.etat = reussi ? "ok" : "ko";
  champFeedback.textContent = `${reussi ? "✅ Exact." : "❌ Pas tout à fait."} ${question.explication}`;

  if (champProgression) {
    champProgression.textContent = `Question ${index + 1} sur ${selection.length} · score ${score}`;
  }
  if (boutonSuivant) {
    boutonSuivant.hidden = false;
    boutonSuivant.textContent = index + 1 < selection.length ? "Question suivante" : "Voir mon score";
  }
}

function terminer() {
  if (champScore) champScore.textContent = `${score} bonne réponse sur ${selection.length}`;
  if (champMessage) {
    const pourcentage = selection.length ? score / selection.length : 0;
    champMessage.textContent =
      pourcentage === 1
        ? "Sans faute. Vous pouvez expliquer ces notions à quelqu'un d'autre : c'est le vrai test."
        : pourcentage >= 0.7
          ? "Bonne maîtrise. Relisez l'explication des questions manquées, puis refaites le quiz."
          : "Relisez la section correspondante du site, puis recommencez : ce quiz n'est pas noté, il est fait pour ça.";
  }
  montrer("fin");
}

function demarrer(choix: string) {
  theme = choix;
  selection = melanger(choix === "tout" ? questions : questions.filter((q) => q.theme === choix));
  index = 0;
  score = 0;
  if (!selection.length) return;
  montrer("jeu");
  afficherQuestion();
}

function initialiser() {
  if (!racine) return;

  for (const bouton of listeThemes?.querySelectorAll<HTMLButtonElement>("[data-theme]") ?? []) {
    bouton.addEventListener("click", () => {
      for (const autre of listeThemes?.querySelectorAll<HTMLButtonElement>("[data-theme]") ?? []) {
        const actif = autre === bouton;
        autre.setAttribute("aria-pressed", actif ? "true" : "false");
        autre.classList.toggle("btn-primary", actif);
        autre.classList.toggle("btn-ghost", !actif);
      }
      theme = bouton.dataset.theme ?? "tout";
    });
  }

  boutonCommencer?.addEventListener("click", () => demarrer(theme));

  champOptions?.addEventListener("click", (evenement) => {
    const bouton = (evenement.target as HTMLElement).closest<HTMLButtonElement>("[data-position]");
    if (bouton && !bouton.disabled) repondre(Number(bouton.dataset.position));
  });

  boutonSuivant?.addEventListener("click", () => {
    if (index + 1 < selection.length) {
      index += 1;
      afficherQuestion();
    } else {
      terminer();
    }
  });

  boutonRecommencer?.addEventListener("click", () => montrer("intro"));

  montrer("intro");
}

initialiser();

export { themesQuiz };
