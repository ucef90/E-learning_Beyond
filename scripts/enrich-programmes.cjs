const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const file = path.join(root, "data/detailed-programmes.json");
const document = JSON.parse(fs.readFileSync(file, "utf8"));
const dir = path.join(root, "content/programme-enrichments");
const entries = fs
  .readdirSync(dir)
  .filter((f) => /^\d{2}-\d{2}\.json$/.test(f))
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
assert.equal(entries.length, 81);
assert.equal(new Set(entries.map((e) => e.slug)).size, 81);
let sequences = 0;
for (const [index, p] of document.programmes.entries()) {
  const entry = entries.find((e) => e.slug === p.slug);
  assert(entry && entry.index === index, p.slug);
  assert.equal(entry.units.length, p.modules.length, p.slug);
  p.modules.forEach((m, i) => {
    const unit = entry.units[i];
    assert(
      unit.length === 3 &&
        unit.every((s) => typeof s === "string" && s.length > 20),
      p.slug,
    );
    assert([3, 4].includes(m.topics.length), p.slug);
    m.topics = [...m.topics.slice(0, 3), unit[0]];
    m.expertChallenge = unit[1];
    m.deliverable = unit[2];
    sequences++;
  });
  p.version = 2;
  p.authoredAt = "2026-09-12";
  const note =
    " Les approfondissements « Pour aller plus loin » sont sélectionnés par le formateur selon le positionnement et le temps disponible ; ils ne constituent pas des heures supplémentaires garanties.";
  if (!p.scheduleNote.includes("Pour aller plus loin")) p.scheduleNote += note;
}
assert.equal(sequences, 420);
fs.writeFileSync(file, JSON.stringify(document, null, 2) + "\n", "utf8");
require("./validate-programmes.cjs").loadProgrammes();
console.log(
  JSON.stringify({ programmes: entries.length, enrichedSequences: sequences }),
);
