const fs = require("node:fs");
const path = require("node:path");
const { loadProgrammes } = require("./validate-programmes.cjs");
const { catalogue, bySlug } = loadProgrammes();
const output = path.resolve(__dirname, "../apps/web/public/programmes");
fs.mkdirSync(output, { recursive: true });
for (const t of catalogue) {
  const p = bySlug.get(t.slug);
  const text = [
    `# ${t.title}`,
    "",
    `Beyond Expertise · Programme détaillé · Version ${p.version} du ${p.authoredAt}`,
    "",
    "**Version enrichie proposée, à valider par le formateur avant animation.**",
    "",
    `${t.durationDays} jour(s) · ${p.totalHours} heures indicatives · ${t.level} · ${t.format}`,
    "",
    p.scheduleNote,
    "",
    "## Objectifs de la fiche de référence",
    "",
    ...t.objectives.map((g) => `- ${g}`),
    "",
    "## Public et prérequis",
    "",
    `Public : ${t.audience}`,
    "",
    `Prérequis de la fiche : ${t.prerequisites}`,
    "",
    "## Préparation de la formation",
    "",
    p.preparation,
    "",
    "## Cas fil rouge",
    "",
    p.caseStudy,
    "",
    "## Méthode pédagogique",
    "",
    p.methods,
    "",
  ];
  for (let day = 1; day <= t.durationDays; day++) {
    text.push(`## Jour ${day} · 7 heures`, "");
    for (const m of p.modules.filter((m) => m.day === day)) {
      text.push(
        `### ${m.title} · ${m.durationMinutes} min`,
        "",
        ...m.topics.map((v) => `- ${v}`),
        "",
        `**Atelier prévu :** ${m.workshop}`,
        "",
      );
    }
  }
  text.push(
    "## Évaluation finale prévue",
    "",
    `${p.assessment.format} Durée indicative : ${p.assessment.durationMinutes} minutes.`,
    "",
    ...p.assessment.criteria.map((c) => `- ${c}`),
    "",
    "## Disponibilité des supports",
    "",
    p.materialsStatus,
    "",
    "## Origine et références",
    "",
    p.origin,
    "",
    `[Fiche officielle observée le 11 septembre 2026](${t.sourceUrl})`,
    "",
  );
  if (p.references.length)
    text.push(
      "Références pour approfondir les notions. Les ateliers et la progression sont une rédaction originale ; ces liens ne constituent pas une validation du programme par leurs éditeurs.",
      "",
      ...p.references.map((r) => `- [${r.title}](${r.url})`),
      "",
    );
  fs.writeFileSync(path.join(output, `${t.slug}.md`), text.join("\n"), "utf8");
}
console.log(`${catalogue.length} programmes téléchargeables exportés.`);
