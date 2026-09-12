const { PrismaClient } = require("@prisma/client");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { loadProgrammes } = require("./validate-programmes.cjs");
const db = new PrismaClient();
async function main() {
  const url = new URL(process.env.DATABASE_URL || "postgresql://invalid/");
  assert(
    process.env.LOCAL_PROGRAMME_IMPORT === "true" &&
      ["localhost", "127.0.0.1"].includes(url.hostname) &&
      url.port === "55432" &&
      url.pathname === "/beyond_pilot_elearning",
    "Mise à jour réservée à la base locale E-learning sur le port 55432.",
  );
  const { bySlug } = loadProgrammes();
  const regulatory = require("../data/regulatory-courses.json").courses;
  const programmes = new Map([
    ...bySlug,
    ...regulatory.map((c) => [c.slug, c.syllabus]),
  ]);
  assert.equal(programmes.size, 83);
  const report = await db.$transaction(
    async (tx) => {
      const rows = await tx.training.findMany({ orderBy: { slug: "asc" } });
      assert.equal(rows.length, programmes.size);
      assert(
        rows.every(
          (t) =>
            programmes.has(t.slug) &&
            t.program &&
            typeof t.program === "object",
        ),
      );
      const tables = await tx.$queryRawUnsafe(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name",
      );
      async function fingerprint() {
        const result = {};
        for (const { table_name: table } of tables) {
          if (table === "Training") continue;
          assert(/^[A-Za-z0-9_]+$/.test(table));
          const [r] = await tx.$queryRawUnsafe(
            `SELECT count(*)::int AS count, md5(COALESCE(string_agg(row_to_json(t)::text, '' ORDER BY row_to_json(t)::text), '')) AS digest FROM "${table}" t`,
          );
          result[table] = r;
        }
        return result;
      }
      const before = await fingerprint();
      const backup = path.resolve(
        __dirname,
        "../../..",
        "work",
        "programmes-before-" + Date.now() + ".json",
      );
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.writeFileSync(
        backup,
        JSON.stringify(
          rows.map(({ id, slug, program }) => ({ id, slug, program })),
          null,
          2,
        ),
      );
      for (const row of rows) {
        await tx.training.update({
          where: { id: row.id },
          data: {
            program: { ...row.program, syllabus: programmes.get(row.slug) },
          },
        });
      }
      const after = await fingerprint();
      assert.deepEqual(
        after,
        before,
        "Cours, comptes, progressions et autres tables préservés",
      );
      const unchanged = (r) => {
        const { program, updatedAt, ...rest } = r;
        return rest;
      };
      assert.deepEqual(
        (await tx.training.findMany({ orderBy: { slug: "asc" } })).map(
          unchanged,
        ),
        rows.map(unchanged),
      );
      return {
        updated: rows.length,
        protectedTables: Object.keys(before).length,
        preserved: before,
        backup,
      };
    },
    { timeout: 120000, isolationLevel: "Serializable" },
  );
  const out = path.resolve(
    __dirname,
    "../../..",
    "work",
    "programme-import-report.json",
  );
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify({
      updated: report.updated,
      protectedTables: report.protectedTables,
      integrity: "PASS",
    }),
  );
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
