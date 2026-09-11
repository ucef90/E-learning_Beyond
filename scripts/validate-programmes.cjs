const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");

function loadProgrammes() {
  const catalogue = JSON.parse(
    fs.readFileSync(path.join(root, "data/official-catalogue.json"), "utf8"),
  ).trainings;
  // The capture contains 17 escaped apostrophes. Preserve the raw snapshot,
  // while exposing its intended text to imports and document exports.
  for (const training of catalogue) {
    for (const key of Object.keys(training)) {
      const value = training[key];
      if (typeof value === "string")
        training[key] = value.replaceAll("&#x27;", "'");
      else if (Array.isArray(value))
        training[key] = value.map((item) =>
          typeof item === "string" ? item.replaceAll("&#x27;", "'") : item,
        );
    }
  }
  const document = JSON.parse(
    fs.readFileSync(path.join(root, "data/detailed-programmes.json"), "utf8"),
  );
  assert.equal(document.schemaVersion, 1);
  assert.equal(
    document.programmes.length,
    catalogue.length,
    "Couverture du catalogue",
  );
  assert.equal(catalogue.length, 81);
  const bySlug = new Map();
  const cases = new Set();
  const workshops = new Set();
  const bodies = new Set();
  for (const p of document.programmes) {
    const training = catalogue.find((t) => t.slug === p.slug);
    assert(training, `Formation inconnue : ${p.slug}`);
    assert(!bySlug.has(p.slug), `Doublon : ${p.slug}`);
    assert.equal(p.status, "DRAFT_FOR_TRAINER_REVIEW");
    assert.equal(p.totalHours, training.durationDays * 7, p.slug);
    assert(
      p.caseStudy.length > 60 && !cases.has(p.caseStudy),
      `Cas fil rouge absent ou dupliqué : ${p.slug}`,
    );
    cases.add(p.caseStudy);
    assert(
      p.preparation.length > 60 &&
        p.methods &&
        p.scheduleNote &&
        p.materialsStatus,
    );
    assert(p.modules.length >= 4 && p.modules.length <= 8);
    assert.equal(
      p.modules.reduce((n, m) => n + m.durationMinutes, 0),
      p.totalHours * 60,
    );
    for (let day = 1; day <= training.durationDays; day++) {
      assert.equal(
        p.modules
          .filter((m) => m.day === day)
          .reduce((n, m) => n + m.durationMinutes, 0),
        420,
        `${p.slug}, jour ${day}`,
      );
    }
    for (const [i, m] of p.modules.entries()) {
      assert(
        Number.isInteger(m.day) && m.day >= 1 && m.day <= training.durationDays,
      );
      assert(
        i === 0 || m.day >= p.modules[i - 1].day,
        `Ordre des journées : ${p.slug}`,
      );
      assert(m.title.length > 10 && m.topics.length >= 3);
      assert(m.topics.every((t) => typeof t === "string" && t.length >= 20));
      assert(
        m.workshop.length >= 70 && !workshops.has(m.workshop),
        `Atelier générique ou dupliqué : ${p.slug}`,
      );
      workshops.add(m.workshop);
    }
    assert(
      p.assessment.criteria.length >= 3 &&
        p.assessment.criteria.every((c) => c.length > 30),
    );
    assert(
      p.assessment.durationMinutes > 0 &&
        p.assessment.durationMinutes <= p.modules.at(-1).durationMinutes,
    );
    for (const ref of p.references) {
      assert(ref.title.length > 10 && new URL(ref.url).protocol === "https:");
    }
    const body = JSON.stringify(p.modules);
    assert(!bodies.has(body), `Programme dupliqué : ${p.slug}`);
    assert(
      !/Cadrage des enjeux métier et des usages prioritaires|Un contenu structuré pour alterner apports|\uFFFD|Ã©|Ã¨/.test(
        body,
      ),
      `Texte générique ou encodage invalide : ${p.slug}`,
    );
    bodies.add(body);
    bySlug.set(p.slug, p);
  }
  return { document, catalogue, bySlug };
}

if (require.main === module) {
  const { document } = loadProgrammes();
  console.log(
    JSON.stringify(
      {
        status: "PASS",
        programmes: document.programmes.length,
        sequences: document.programmes.reduce(
          (n, p) => n + p.modules.length,
          0,
        ),
        uniqueWorkshops: document.programmes.reduce(
          (n, p) => n + p.modules.length,
          0,
        ),
        evaluations: document.programmes.length,
        checks: [
          "couverture et unicité",
          "durées par jour et total",
          "ateliers distincts",
          "critères observables",
          "références HTTPS",
          "absence du programme générique",
        ],
      },
      null,
      2,
    ),
  );
}
module.exports = { loadProgrammes };
