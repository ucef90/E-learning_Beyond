const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
const write = (f, v) =>
  fs.writeFileSync(path.join(root, f), JSON.stringify(v, null, 2) + "\n");
const doc = read("data/detailed-programmes.json");
const regulatory = read("data/regulatory-courses.json");
const positioning = read("content/programme-depth/positioning.json");
const programmes = [
  ...doc.programmes,
  ...regulatory.courses.map((c) => c.syllabus),
];
const dir = path.join(root, "content/programme-depth");
const entries = fs
  .readdirSync(dir)
  .filter((f) => /^\d{2}-\d{2}\.json$/.test(f))
  .sort()
  .flatMap((f) => read("content/programme-depth/" + f));
assert.equal(entries.length, 83);
assert.equal(new Set(entries.map((e) => e.index)).size, 83);
let details = 0;
for (const e of entries) {
  const p = programmes[e.index];
  assert(p, "Index inconnu " + e.index);
  if (e.slug) assert.equal(e.slug, p.slug, "Ordre des programmes");
  e.slug = p.slug;
  assert(e.overview.length > 100, p.slug);
  assert.equal(e.units.length, p.modules.length, p.slug);
  p.overview = e.overview;
  const position = positioning.find((x) => x.index === e.index);
  if (position) {
    p.audience = position.audience;
    if (position.prerequisites) p.prerequisites = position.prerequisites;
  }
  p.version = 3;
  p.authoredAt = "2026-09-13";
  for (const [i, unit] of e.units.entries()) {
    assert.equal(unit.length, 4, p.slug);
    assert(
      unit.every((s) => typeof s === "string" && s.length >= 30),
      p.slug + " " + i,
    );
    p.modules[i].technicalDetails = unit.slice(0, 3);
    p.modules[i].practicalCheck = unit[3];
    details += 3;
  }
}
write("data/detailed-programmes.json", doc);
write("data/regulatory-courses.json", regulatory);
// Keep the public fallback data on the same syllabus version.
const fallback = read("apps/web/lib/regulatory-catalogue.json");
for (const c of fallback.courses || fallback) {
  const source = regulatory.courses.find(
    (r) => r.training.slug === (c.training?.slug || c.slug),
  );
  if (source && c.syllabus) c.syllabus = source.syllabus;
  if (source && c.program?.syllabus) c.program.syllabus = source.syllabus;
}
write("apps/web/lib/regulatory-catalogue.json", fallback);
for (const f of fs
  .readdirSync(dir)
  .filter((f) => /^\d{2}-\d{2}\.json$/.test(f))) {
  const records = read("content/programme-depth/" + f);
  records.forEach((e) => {
    e.slug = programmes[e.index].slug;
  });
  write("content/programme-depth/" + f, records);
}
require("./validate-programmes.cjs").loadProgrammes();
console.log(
  JSON.stringify({
    programmes: programmes.length,
    sequences: details / 3,
    detailedPoints: details,
    practicalChecks: details / 3,
  }),
);

require("./build-visitor-knowledge.cjs");
