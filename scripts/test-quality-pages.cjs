const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  { load } = require("cheerio");
const base = "http://127.0.0.1:3200";
const report = { date: new Date().toISOString(), pages: [], trainings: [] };
const pages = [
  "/contact",
  "/qualite",
  "/informations-pratiques",
  "/assistance",
  "/accessibilite",
  "/reclamations",
  "/avis",
  "/positionnement",
  "/signalement",
  "/mentions-legales",
  "/confidentialite",
];
async function html(path) {
  const res = await fetch(base + path);
  assert.equal(res.status, 200, path);
  return load(await res.text());
}
(async () => {
  for (const path of pages) {
    const $ = await html(path);
    assert.equal($("main h1").length, 1, path);
    assert($('main a[href="tel:+33954702380"]').length, path);
    assert($('main a[href="mailto:contact@beyondexpertise.eu"]').length, path);
    assert(!$("main").text().includes("Casablanca"));
    assert.equal($("main#contenu").length, 1);
    report.pages.push({ path, status: "PASS" });
  }
  const catalogue = JSON.parse(
    fs.readFileSync("data/official-catalogue.json", "utf8"),
  ).trainings;
  let index = 0;
  async function worker() {
    while (index < catalogue.length) {
      const t = catalogue[index++],
        $ = await html("/formations/" + t.slug);
      assert($("#acces-formation").text().includes("délai d’accès"), t.slug);
      assert($('#acces-formation a[href="/accessibilite"]').length);
      assert($('#acces-formation a[href="/assistance"]').length);
      assert(
        $('#acces-formation a[href^="/positionnement?formation="]').length,
      );
      const f = await fetch(base + "/programmes/" + t.slug + ".pdf");
      assert.equal(f.status, 200);
      assert(f.headers.get("content-type").includes("application/pdf"));
      const body = Buffer.from(await f.arrayBuffer());
      assert(body.subarray(0, 5).toString() === "%PDF-");
      assert.equal($('a[href$=".md"]').length, 0);
      report.trainings.push({ slug: t.slug, status: "PASS" });
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  assert.equal(report.trainings.length, 81);
  const home = await html("/");
  assert(home.text().includes("Ils nous ont fait confiance"));
  assert(home.text().includes("BNP Paribas"));
  assert(home.text().includes("sous-traitance"));
  assert(home.text().includes("Finalisation en cours"));
  const company = await html("/entreprises");
  assert(!company.text().includes("sous 24h"));
  assert(!company.text().includes("sous 5 jours"));
  console.log(
    "PASS",
    report.pages.length,
    "pages publiques,",
    report.trainings.length,
    "fiches et téléchargements ; contacts, accès, transparence et liens.",
  );
})()
  .catch((e) => {
    report.error = e.message;
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => {
    fs.mkdirSync("../validation-qualite", { recursive: true });
    fs.writeFileSync(
      "../validation-qualite/recette-pages.json",
      JSON.stringify(report, null, 2),
    );
  });
