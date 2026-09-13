import type {
  AssistantReply,
  KnowledgeCourse,
  Intent,
} from "./assistant.types";
export const normalize = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const refusal =
  "Je peux vous aider sur les formations, leurs programmes et les informations publiques de Beyond Expertise. Pour une autre demande, contactez le centre.";
export function guidance(
  answer = refusal,
  href = "/formations",
  label = "Explorer les formations",
): AssistantReply {
  return {
    answer,
    links: [{ label, href }],
    courses: [],
    selectedSlugs: [],
    mode: "guidance",
  };
}
export function scopeCheck(message: string): AssistantReply | undefined {
  const q = normalize(message);
  if (
    /(mot[s]? de passe|password|secret|api.?key|cle[s]? api|code[s]? (de )?securite|identifiant[s]? (admin|interne)|jeton[s]? (?:d |de )?(prive|acces)|token[s]? (?:d |de )?(admin|secret|acces)|\.env|prompt.{0,15}(system|interne)|instruction[s]?.{0,12}(system|interne)|ignore.{0,25}(instruction|regle)|oublie.{0,25}(instruction|regle)|jailbreak|system prompt|developer prompt|developer message|system message|credentials|security code|access token|who.{0,35}(wrote|generated|created)|content.{0,20}(author|generator))/.test(
      q,
    ) ||
    /(qui|quel outil|quelle ia).{0,55}(gener|redig|ecrit|cre[e ]|auteur)|(gener|redig|ecrit).{0,40}(par qui|par chatgpt)|auteur.{0,25}(contenu|programme)|qui es tu vraiment/.test(
      q,
    ) ||
    /(recette de cuisine|meteo|horoscope|blague|raconte.{0,15}histoire|capitale de|paris sportif|cours de bourse|ecris.{0,15}poeme|traduis.{0,20}(texte|phrase)|donne.{0,15}(script|code python|code java)|execute.{0,15}(commande|script)|base64|rot13)/.test(
      q,
    )
  )
    return guidance();
  const withoutCentre = message
    .replaceAll("contact@beyondexpertise.eu", "")
    .replace(/09[ .-]?54[ .-]?70[ .-]?23[ .-]?80/g, "");
  if (
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(withoutCentre) ||
    /(?:\d[ .-]?){10,}/.test(withoutCentre)
  )
    return guidance(
      "Ne partagez pas de coordonnées personnelles dans cet assistant. Posez votre question sur la formation sans ces informations ; pour votre dossier, utilisez le formulaire du centre.",
      "/contact",
      "Contacter le centre",
    );
}
const stop = new Set(
  "je tu il elle nous vous ils elles le la les un une des de du dans pour par avec sur au aux et ou en a ce cet cette ces mon ma mes ton ta tes son sa ses notre votre leurs est sont etre avoir faire veux veut voudrais souhaite cherche besoin formation formations programme programmes cours apprendre savoir comment quel quels quelle quelles peut peux faut donne moi bien bon toute tous tout merci svp".split(
    " ",
  ),
);
export function terms(s: string) {
  return [
    ...new Set(
      normalize(s)
        .replace(/[^a-z0-9+#. -]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stop.has(w)),
    ),
  ];
}
function match(token: string, word: string) {
  if (token === word) return 1;
  if (
    token.length > 4 &&
    word.length > 4 &&
    (token.startsWith(word) || word.startsWith(token))
  )
    return 0.7;
  return 0;
}
export function rankCourses(
  query: string,
  courses: KnowledgeCourse[],
  expanded = "",
) {
  const queryTerms = terms(query),
    extra = terms(expanded).filter((t) => !queryTerms.includes(t));
  return courses
    .map((course) => {
      const title = terms(course.title),
        body = terms(
          course.summary +
            " " +
            course.category +
            " " +
            course.modules
              .map((m) => m.title + " " + m.details.join(" "))
              .join(" "),
        );
      const scoreFor = (token: string) =>
        Math.max(0, ...title.map((w) => match(token, w))) * 8 +
        Math.max(0, ...body.map((w) => match(token, w))) * 1.5;
      let score =
        queryTerms.reduce((n, t) => n + scoreFor(t), 0) +
        extra.reduce((n, t) => n + scoreFor(t) * 0.5, 0);
      // Exact short product names and course titles outrank tangential mentions.
      const q = normalize(query),
        titleText = normalize(course.title);
      if (titleText.length > 8 && q.includes(titleText)) score += 60;
      if (/power\s?bi/.test(q) && /power\s?bi/.test(titleText)) score += 18;
      if (/python/.test(q) && /python/.test(titleText)) score += 15;
      if (/\bsql\b/.test(q) && /\bsql\b/.test(titleText)) score += 15;
      if (
        /debut|initiat|decouvr|premier/.test(q) &&
        /debut|fondament|initiat|decouvr/.test(
          normalize(course.title + " " + course.level),
        )
      )
        score += 3;
      if (
        /\bavanc/.test(q) &&
        /avance|perfection/.test(normalize(course.title + " " + course.level))
      )
        score += 3;
      return { course, score };
    })
    .filter((x) => x.score >= 5)
    .sort((a, b) => b.score - a.score || a.course.id - b.course.id);
}
export function knownIntent(q: string): Intent | undefined {
  const s = normalize(q);
  if (/qualiopi|certif|diplome|rncp|accredit/.test(s)) return "quality";
  if (/cpf|opco|financ|prise en charge/.test(s)) return "financing";
  if (/handicap|accessibil|amenagement/.test(s)) return "accessibility";
  if (/confidential|cookie|vie privee|mes donnees/.test(s)) return "privacy";
  if (
    /joindre|telephone|numero|adresse|horaires|contacter|coordonnees|appele/.test(
      s,
    )
  )
    return "contact";
  if (/inscri|devis|reserve|reservation/.test(s)) return "enrollment";
  if (
    /connexion|connecter|compte|assistance|reclamation|support technique/.test(
      s,
    )
  )
    return "support";
  if (/^(bonjour|salut|bonsoir|hello|merci)[ !?.]*$/.test(s)) return "greeting";
  if (
    /prerequi|pre requis|niveau|debutant|experience necessaire/.test(s) &&
    !/choisir|conseill|recommand/.test(s)
  )
    return "prerequisites";
  if (/prix|tarif|cout|combien coute/.test(s)) return "price";
  if (/prochaine|session|calendrier|date|quand/.test(s)) return "session";
  if (/duree|combien (de )?(jour|heure)|temps/.test(s)) return "duration";
  if (/distanciel|presentiel|hybride|modalit|\bformats?\b/.test(s)) return "format";
  if (/evaluat|quiz|examen|test final/.test(s)) return "assessment";
  if (/compar|difference|plutot|versus| vs /.test(s)) return "compare";
  if (
    /programme|contenu|apprend|pandas|jointure|jour [1-9]|atelier|exercic/.test(
      s,
    )
  )
    return "programme";
}
