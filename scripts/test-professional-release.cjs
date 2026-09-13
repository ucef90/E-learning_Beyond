/** Read-only release smoke test; login/logout and public assistant requests are the only POSTs. */
const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const programmes =
  require("../content/professional/programmes.json").programmes;
const executive = require("../content/executive/catalogue.json").programmes;
const base = process.argv[2],
  accountPath = process.argv[3],
  origin = process.argv[4] || base;
assert(
  base && accountPath,
  "Usage: node scripts/test-professional-release.cjs BASE ACCOUNT_FILE [PUBLIC_ORIGIN]",
);
const raw = JSON.parse(
    fs.readFileSync(accountPath, "utf8").replace(/^\uFEFF/, ""),
  ),
  account = Array.isArray(raw) ? raw.find((a) => a.role === "ADMIN") : raw;
(async () => {
  let cookie = "";
  const report = {
    result: "PASS",
    pages: 0,
    pdfs: 0,
    professionalCourses: [],
    anonymousBlocked: true,
  };
  const request = async (p, options = {}) =>
    fetch(base + p, { ...options, signal: AbortSignal.timeout(30000) });
  try {
    const r = await request("/api/v1/trainings");
    assert.equal(r.status, 200);
    const list = await r.json();
    assert.equal(list.length, 85);
    for (const p of [
      "",
      "/formations",
      "/connexion",
      "/apprentissage",
      "/mba-dba",
      "/mba",
      "/dba",
      ...list.map((t) => "/formations/" + t.slug),
      ...executive.map((p) => "/mba-dba/" + p.slug),
    ]) {
      const r = await request(p),
        html = await r.text();
      assert.equal(r.status, 200, p);
      assert(!html.includes("Ce contenu est temporairement indisponible"), p);
      report.pages++;
    }
    for (const p of programmes) {
      const r = await request("/api/v1/trainings/" + p.training.slug);
      assert.equal(r.status, 200);
      const d = await r.json();
      assert.equal(d.program.syllabus.modules.length, 20);
      assert(!JSON.stringify(d).includes("isCorrect"));
      assert(!JSON.stringify(d).includes("reperes-correction"));
      const pdf = await request("/programmes/" + p.training.slug + ".pdf");
      assert.equal(pdf.status, 200);
      assert.equal(
        Buffer.from(await pdf.arrayBuffer())
          .subarray(0, 5)
          .toString(),
        "%PDF-",
      );
      report.pdfs++;
      const answer = await request("/api/v1/assistant/ask", {
        method: "POST",
        headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Quel est le programme détaillé de cette formation ?",
          contextSlug: p.training.slug,
        }),
      });
      assert.equal(answer.status, 200);
      const a = await answer.json();
      assert(
        JSON.stringify(a).includes(p.training.slug),
        "Assistant missing new course",
      );
    }
    const sitemap = await request("/sitemap.xml").then((r) => r.text());
    if (new URL(origin).hostname === "beyond-expertise.com")
      assert(programmes.every((p) => sitemap.includes(p.training.slug)));
    else
      assert(
        !sitemap.includes("<loc>"),
        "Local preproduction must stay non-indexable",
      );
    assert.equal((await request("/api/v1/courses/authoring/list")).status, 401);
    const login = await request("/api/v1/auth/login", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: account.email,
        password: account.password,
      }),
    });
    assert.equal(login.status, 201);
    cookie = login.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
    const headers = { Origin: origin, Cookie: cookie };
    const courses = await request("/api/v1/courses/authoring/list", {
      headers,
    }).then((r) => r.json());
    assert.equal(
      courses.filter((c) =>
        executive.some((p) => c.title === p.kind + " — " + p.title),
      ).length,
      31,
    );
    for (const p of programmes) {
      const c = courses.find((c) => c.title === p.training.title);
      assert(c, "Missing private course");
      const d = await request("/api/v1/courses/" + c.id + "/authoring", {
        headers,
      }).then((r) => r.json());
      assert.equal(d.modules.length, 20);
      assert.equal(d.editorialStatus, "DRAFT");
      assert.equal(d.isPublished, false);
      const lessons = d.modules.flatMap((m) => m.lessons);
      assert.equal(lessons.length, 80);
      assert.equal(
        lessons.reduce((s, l) => s + l.durationMin, 0),
        p.syllabus.totalHours * 60,
      );
      const qs = lessons.flatMap((l) => l.quiz?.questions || []);
      assert.equal(qs.length, 40);
      assert(
        qs.every((q) => q.answers.filter((a) => a.isCorrect).length === 1),
      );
      assert(d.assets.some((a) => a.visibility === "AFTER_REVIEW"));
      for (const asset of d.assets) {
        const url =
          "/api/v1/courses/" + c.id + "/assets/" + asset.id + "/download";
        assert.equal((await request(url)).status, 401);
        const response = await request(url, { headers });
        assert.equal(response.status, 200);
        const bytes = Buffer.from(await response.arrayBuffer());
        assert.equal(bytes.length, asset.size);
      }
      if (p.training.slug.startsWith("data-fullstack")) {
        for (const key of ["practice", "starter", "solution"]) {
          const r = await request(
            "/api/v1/courses/" + c.id + "/resources/" + key,
            { headers },
          );
          assert.equal(r.status, 200);
          const n = await r.json();
          assert.equal(n.nbformat, 4);
          assert(n.cells.length >= 6);
        }
      }
      report.professionalCourses.push({
        id: c.id,
        modules: 20,
        lessons: 80,
        questions: 40,
        assets: d.assets.length,
        draft: true,
      });
    }
    report.existingExecutiveCourses = 31;
    console.log(JSON.stringify(report));
  } finally {
    if (cookie)
      await request("/api/v1/auth/logout", {
        method: "POST",
        headers: { Origin: origin, Cookie: cookie },
      });
  }
})().catch((e) => {
  console.error(e.stack);
  process.exitCode = 1;
});
