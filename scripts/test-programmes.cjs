const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { load } = require("cheerio");
const { loadProgrammes } = require("./validate-programmes.cjs");
const { catalogue, bySlug } = loadProgrammes();
for (const c of require("../data/regulatory-courses.json").courses) {
  catalogue.push(c.training);
  bySlug.set(c.slug, c.syllabus);
}
const api = "http://127.0.0.1:4200/api/v1";
const web = "http://127.0.0.1:3200";

async function main() {
  const response = await fetch(`${api}/trainings`);
  assert.equal(response.status, 200);
  const entries = await response.json();
  assert.equal(
    entries.length,
    81 + require("../data/regulatory-courses.json").courses.length,
  );
  assert(
    entries.every((t) => t.program?.syllabusSummary && !t.program.syllabus),
    "Résumé léger sur le catalogue",
  );
  assert.equal(
    entries
      .filter((t) => t.program.kind === "official-catalogue")
      .reduce((n, t) => n + t.courses.length, 0),
    1,
    "Le seul module pilote reste distinct",
  );
  const results = [];
  // Three HTTP requests at a time keep the local Next server responsive.
  let cursor = 0;
  async function worker() {
    while (cursor < catalogue.length) {
      const t = catalogue[cursor++],
        expected = bySlug.get(t.slug);
      const detailResponse = await fetch(`${api}/trainings/${t.slug}`);
      assert.equal(detailResponse.status, 200, t.slug);
      const detail = await detailResponse.json();
      assert.deepEqual(
        detail.program.syllabus,
        expected,
        `Programme persistant : ${t.slug}`,
      );
      assert(
        detail.courses.every((c) =>
          c.modules.every((m) => m.lessons.every((l) => !("body" in l))),
        ),
        "Pas de corps de leçon dans la fiche publique",
      );
      const pageResponse = await fetch(`${web}/formations/${t.slug}`);
      assert.equal(pageResponse.status, 200, t.slug);
      const $ = load(await pageResponse.text());
      assert.equal($("#programme-title").text(), "Programme détaillé", t.slug);
      assert.equal(
        $(".programme-sequence").length,
        expected.modules.length,
        t.slug,
      );
      assert.equal(
        $(".programme-workshop").length,
        expected.modules.length,
        t.slug,
      );
      assert.equal($(".programme-day").length, t.durationDays, t.slug);
      assert.equal(
        $(".programme-assessment li").length,
        expected.assessment.criteria.length,
        t.slug,
      );
      assert.equal(
        $(".programme-deliverable").length,
        expected.modules.length,
        t.slug,
      );
      assert.equal(
        $(".programme-challenge").length,
        expected.modules.length,
        t.slug,
      );
      for (const m of expected.modules) {
        assert($("#programme").text().includes(m.deliverable), t.slug);
        assert($("#programme").text().includes(m.expertChallenge), t.slug);
        assert(
          $("#programme").text().includes(m.workshop),
          `Atelier rendu : ${t.slug}`,
        );
      }
      assert.equal(
        $("#programme a[download]").attr("href"),
        `/programmes/${t.slug}.md`,
      );
      assert(!$("main").text().includes("détaillé reste à rédiger"));
      const download = await fetch(`${web}/programmes/${t.slug}.md`);
      assert.equal(download.status, 200, `Téléchargement : ${t.slug}`);
      assert.equal(
        await download.text(),
        fs.readFileSync(
          path.resolve(
            __dirname,
            "../apps/web/public/programmes",
            `${t.slug}.md`,
          ),
          "utf8",
        ),
      );
      results.push({
        slug: t.slug,
        status: "PASS",
        sequences: expected.modules.length,
        days: t.durationDays,
      });
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  const missing = await fetch(`${api}/trainings/programme-inexistant-recette`);
  assert.equal(missing.status, 404);
  const report = {
    status: "PASS",
    checkedAt: new Date().toISOString(),
    programmes: results.length,
    sequences: results.reduce((n, r) => n + r.sequences, 0),
    checks: [
      "83 programmes API conformes à la source enrichie",
      "83 pages avec ateliers, livrables et approfondissements",
      "83 téléchargements identiques aux fichiers",
      "catalogue allégé et pilote conservé",
      "404 formation inconnue",
    ],
    results: results.sort((a, b) => a.slug.localeCompare(b.slug)),
  };
  const out = path.resolve(__dirname, "../../validation-programmes");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(
    path.join(out, "recette-programmes.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
