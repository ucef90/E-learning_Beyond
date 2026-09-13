const { PrismaClient } = require("@prisma/client"),
  fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  { spawnSync } = require("node:child_process"),
  assert = require("node:assert/strict");
async function main() {
  process.loadEnvFile(".env");
  const u = new URL(process.env.DATABASE_URL);
  assert.equal(u.hostname, "127.0.0.1");
  assert.equal(u.port, "55432");
  assert.equal(u.pathname, "/beyond_platform_work");
  const target = "beyond_restore_" + Date.now(),
    pg = "C:/Program Files/PostgreSQL/15/bin";
  const args = [
    "-h",
    u.hostname,
    "-p",
    u.port,
    "-U",
    decodeURIComponent(u.username),
  ];
  const env = { ...process.env, PGPASSWORD: decodeURIComponent(u.password) };
  function run(bin, params) {
    const r = spawnSync(path.join(pg, bin + ".exe"), params, {
      env,
      encoding: "utf8",
    });
    if (r.status !== 0) throw Error(bin + " a échoué : " + r.stderr);
    return r.stdout.trim();
  }
  const source = new PrismaClient(),
    v = new URL(u);
  v.pathname = "/" + target;
  const restored = new PrismaClient({
    datasources: { db: { url: v.toString() } },
  });
  const tables = [
    "Course",
    "CourseModule",
    "Lesson",
    "Quiz",
    "QuizQuestion",
    "QuizAnswer",
    "QuizAttempt",
    "LearningEnrollment",
    "LessonProgress",
    "NotebookDraft",
    "WorkSubmission",
    "CourseAsset",
    "LearningEvent",
  ];
  async function hashes(db) {
    const out = {};
    for (const table of tables) {
      const rows = await db.$queryRawUnsafe(
        'SELECT row_to_json(t)::text AS data FROM "' +
          table +
          '" t ORDER BY id',
      );
      out[table] = {
        rows: rows.length,
        sha256: crypto
          .createHash("sha256")
          .update(rows.map((r) => r.data).join("\n"))
          .digest("hex"),
      };
    }
    return out;
  }
  const dump = path.resolve(".private/platform-verified.dump"),
    start = Date.now();
  let created = false;
  try {
    const before = await hashes(source);
    run("pg_dump", [...args, "-d", u.pathname.slice(1), "-Fc", "-f", dump]);
    run("createdb", [...args, target]);
    created = true;
    run("pg_restore", [
      ...args,
      "-d",
      target,
      "--no-owner",
      "--exit-on-error",
      dump,
    ]);
    const after = await hashes(restored);
    assert.deepEqual(
      after,
      before,
      "Le contenu restauré doit correspondre au contenu sauvegardé",
    );
    const result = {
      status: "PASS",
      at: new Date().toISOString(),
      durationMs: Date.now() - start,
      dumpBytes: fs.statSync(dump).size,
      tables: after,
      scope:
        "Restauration PostgreSQL locale neuve ; contenus, fichiers privés, travaux et progression comparés par empreintes. Aucun stockage externe testé.",
    };
    fs.writeFileSync(
      "work/validation/backup-restore.json",
      JSON.stringify(result, null, 2),
    );
    console.log(
      JSON.stringify({
        status: result.status,
        tables: tables.length,
        durationMs: result.durationMs,
        dumpBytes: result.dumpBytes,
      }),
    );
  } finally {
    await source.$disconnect();
    await restored.$disconnect();
    if (created) {
      assert(/^beyond_restore_\d+$/.test(target));
      run("dropdb", [...args, target]);
    }
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
