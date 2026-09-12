const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
  fs.writeFileSync(path.join(root, p), s);
};
const meta = JSON.parse(read("content/regulatory/metadata.json"));
const enrichments = JSON.parse(
  read("content/regulatory/programme-enrichments.json"),
);
const courses = meta.courses.map((c) => {
  const extra = enrichments[c.code];
  assert.equal(extra.length, 8);
  const lessons = Array.from({ length: 8 }, (_, i) =>
    JSON.parse(read(`content/regulatory/${c.code}/0${i + 1}.json`)),
  );
  const quiz = JSON.parse(read(`content/regulatory/${c.code}/quiz.json`));
  assert.equal(quiz.length, 20);
  quiz.forEach((q) =>
    assert(
      q.options.length === 3 &&
        q.correct >= 0 &&
        q.correct < 3 &&
        q.explanation.length > 70,
    ),
  );
  lessons.forEach((l) =>
    assert(
      l.body.length > 1500 &&
        l.exercise.length > 100 &&
        l.solution.length > 150 &&
        l.topics.length === 3,
    ),
  );
  const models = read(`content/regulatory/${c.code}/modeles.md`);
  const syllabus = {
    slug: c.slug,
    version: 2,
    status: "DRAFT_FOR_TRAINER_REVIEW",
    authoredAt: meta.reviewedAt,
    totalHours: 14,
    caseStudy: c.caseStudy,
    preparation:
      c.prerequisites +
      " Un positionnement initial précise le métier, les usages et les objectifs avant la session.",
    methods:
      "Lecture commentée, huit ateliers sur cas fictifs, correction guidée, dossier de synthèse et quiz formatif de 20 questions. Les supports sont consultables en local ; le formateur doit valider et adapter l’animation.",
    scheduleNote:
      "Deux journées de 7 heures hors pauses, avec ateliers et échanges. Chaque séquence dure 105 minutes ; la dernière inclut le quiz de 20 minutes. La durée ne correspond pas au seul temps de lecture des pages. Les approfondissements sont sélectionnés avec le formateur selon le positionnement et le temps disponible.",
    materialsStatus:
      "16 éléments d’apprentissage par parcours : huit leçons et huit cas corrigés, un carnet de cinq modèles et un quiz formatif de 20 questions disponibles. Validation pédagogique humaine et animation de la session à organiser. Aucune certification officielle délivrée.",
    modules: lessons.map((l, i) => ({
      day: Math.floor(i / 4) + 1,
      title: l.title,
      durationMinutes: 105,
      topics: [...l.topics, extra[i][0]],
      workshop: l.exercise,
      expertChallenge: extra[i][1],
      deliverable: extra[i][2],
    })),
    assessment: {
      format:
        "Dossier de synthèse et soutenance avec appréciation du formateur ; quiz formatif à livre ouvert. Le quiz seul ne valide pas la soutenance.",
      durationMinutes: 60,
      criteria: [
        "Qualifier correctement les acteurs, les données ou usages et les textes applicables.",
        "Justifier les décisions avec des sources datées et reconnaître les informations manquantes.",
        "Produire les livrables du cas sans donnée personnelle réelle ni preuve inventée.",
        "Atteindre les seuils pédagogiques proposés et reprendre les erreurs critiques avec le formateur.",
      ],
    },
    references: c.references,
  };
  const training = {
    slug: c.slug,
    title: c.title,
    category: "Réglementation, données et IA",
    summary: c.summary,
    objectives: c.objectives,
    audience: c.audience,
    prerequisites: c.prerequisites,
    durationDays: 2,
    level: "Fondamental",
    format: "Distanciel",
    observedPrice: "Sur devis",
    sourceUrl: null,
    observedAt: meta.reviewedAt,
  };
  const lessonBody = (l) =>
    `Références : ${l.articles}. Sources datées en fin de support.\n\n${l.body}\n\n### Mise en pratique\n\n${l.exercise}\n\n:::details Consulter le corrigé pédagogique\n${l.solution}\n:::\n`;
  const support = `# ${c.title}\n\nBeyond Expertise — version du 12 septembre 2026. Rédaction assistée par IA ; validation pédagogique du formateur à réaliser avant animation. Aucune certification officielle revendiquée.\n\n## Mode d’emploi\n\nParcours animé de 14 heures hors pauses ; huit séquences de 105 minutes. Séquences 1 à 7 : apport 25 min, lecture et analyse 15 min, atelier 40 min, correction 20 min, synthèse 5 min. Séquence 8 : synthèse 20 min, finalisation du dossier 25 min, soutenance 10 min, quiz 20 min, correction et transfert 30 min. En autonomie, le temps dépend des exercices ; ne pas déduire une présence de 14 h des connexions. Quiz formatif à livre ouvert ; les corrigés servent à apprendre.\n\n## Positionnement\n\n${c.initialQuestions.map((q) => "- " + q).join("\n")}\n\n## Objectifs\n\n${c.objectives.map((q) => "- " + q).join("\n")}\n\n## Cas fil rouge\n\n${c.caseStudy}\n\n${lessons.map((l, i) => `## Séquence ${i + 1} — ${l.title}\n\n${lessonBody(l)}`).join("\n")}\n## Quiz formatif et corrigé\n\n${quiz.map((q, i) => `### ${i + 1}. ${q.prompt}\n\n${q.options.map((o, j) => `${j + 1}. ${o}`).join("\n")}\n\nRéponse : ${q.correct + 1}. ${q.explanation}\n`).join("\n")}\n## Sources\n\n${c.references.map((r) => `- [${r.title}](${r.url})`).join("\n")}\n\nPour plus de détails ou le programme détaillé, contactez le centre : 09 54 70 23 80 — contact@beyondexpertise.eu.\n`;
  const programme = `# ${c.title}\n\n2 jours — 14 h hors pauses — distanciel accompagné à organiser — tarif sur devis. Version 12 septembre 2026. Programme original ajouté localement ; validation du formateur requise avant animation.\n\n## Public\n${c.audience}\n\n## Prérequis\n${c.prerequisites}\n\n## Objectifs\n${c.objectives.map((o) => "- " + o).join("\n")}\n\n## Déroulé\n${syllabus.modules.map((m) => `### Jour ${m.day} — ${m.title} — 105 min\n${m.topics.map((t) => "- " + t).join("\n")}\n\nAtelier : ${m.workshop}\n\nLivrable attendu : ${m.deliverable}\n\nPour aller plus loin : ${m.expertChallenge}\n`).join("\n")}\n## Évaluation et moyens\n${syllabus.assessment.format}\n${syllabus.methods}\n${syllabus.scheduleNote}\n\nSupports, cas corrigés et modèles disponibles. Aucune certification officielle RGPD, DPO ou AI Act délivrée.\n\n## Accès et accessibilité\nPositionnement et adaptation avec le centre avant inscription. Dates et délai d’accès à confirmer selon besoins et disponibilité. Pour un aménagement, décrivez votre besoin pratique sans diagnostic médical.\n\nPour plus de détails ou le programme détaillé, contactez le centre : 09 54 70 23 80 — contact@beyondexpertise.eu.\n\n## Sources\n${c.references.map((r) => `- [${r.title}](${r.url})`).join("\n")}\n`;
  write(`apps/web/public/programmes/${c.slug}.md`, programme);
  write(`apps/web/public/reglementation/${c.code}-support.md`, support);
  write(`apps/web/public/reglementation/${c.code}-modeles.md`, models);
  return {
    ...c,
    training,
    syllabus,
    lessons: lessons.map((l, i) => ({
      ...l,
      durationMin: i === 7 ? 85 : 105,
      content: lessonBody(l),
    })),
    quiz,
  };
});
write(
  "data/regulatory-courses.json",
  JSON.stringify({ ...meta, courses }, null, 2) + "\n",
);
write(
  "apps/web/lib/regulatory-catalogue.json",
  JSON.stringify(
    {
      reviewedAt: meta.reviewedAt,
      courses: courses.map(({ quiz, ...c }) => c),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    courses: courses.length,
    lessons: 16,
    cases: 16,
    quizQuestions: 40,
    templateFamilies: 10,
  }),
);
