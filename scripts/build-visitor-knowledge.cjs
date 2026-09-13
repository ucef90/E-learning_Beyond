const fs = require("node:fs");
const path = require("node:path");
const { catalogue, bySlug } =
  require("./validate-programmes.cjs").loadProgrammes();
const root = path.resolve(__dirname, "..");
for (const c of require("../data/regulatory-courses.json").courses) {
  catalogue.push(c.training);
  bySlug.set(c.slug, c.syllabus);
}
const courses = catalogue.map((t, i) => ({
  id: i + 1,
  slug: t.slug,
  title: t.title,
  category: t.category,
  summary: bySlug.get(t.slug).overview,
  audience: bySlug.get(t.slug).audience || t.audience,
  prerequisites: bySlug.get(t.slug).prerequisites || t.prerequisites,
  objectives: t.objectives,
  days: t.durationDays,
  hours: bySlug.get(t.slug).totalHours,
  level: t.level,
  format: t.format,
  price: t.observedPrice || "Sur devis",
  caseStudy: bySlug.get(t.slug).caseStudy,
  assessment: bySlug.get(t.slug).assessment,
  modules: bySlug.get(t.slug).modules.map((m) => ({
    day: m.day,
    title: m.title,
    topics: m.topics,
    details: m.technicalDetails,
    workshop: m.workshop,
    deliverable: m.deliverable,
    check: m.practicalCheck,
  })),
}));
const file = path.join(root, "data/visitor-knowledge.json");
fs.writeFileSync(
  file,
  JSON.stringify({ version: 1, reviewedAt: "2026-09-13", courses }, null, 2) +
    "\n",
);
console.log(
  JSON.stringify({ publicCourses: courses.length, privateRecords: 0 }),
);
