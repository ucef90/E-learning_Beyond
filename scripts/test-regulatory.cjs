const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  crypto = require("node:crypto");
const { PrismaClient } = require("@prisma/client");
const { load } = require("cheerio");
const db = new PrismaClient(),
  base = "http://127.0.0.1:4200/api/v1",
  web = "http://127.0.0.1:3200";
const { courses } = require("../data/regulatory-courses.json");
const nonce = "REG-TEST-" + crypto.randomUUID(),
  ownedEnrollments = [],
  ownedAttempts = [],
  ownedEvents = [],
  ownedProgress = [];
let rights;
const report = {
  date: new Date().toISOString(),
  status: "RUNNING",
  type: "TECHNICAL_TEST_NOT_CENTRE_EVIDENCE",
  checks: [],
};
const pass = (s) => {
  report.checks.push(s);
  console.log("PASS", s);
};
async function req(
  p,
  method = "GET",
  body,
  cookie = "",
  status = 200,
  origin = web,
) {
  const r = await fetch(base + p, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await r.json();
  assert.equal(r.status, status, JSON.stringify(data));
  return { r, data };
}
async function login(email) {
  const a = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8")).find(
    (a) => a.email === email,
  );
  assert(a);
  const { r } = await req(
    "/auth/login",
    "POST",
    { email: a.email, password: a.password },
    "",
    201,
  );
  return r.headers.get("set-cookie").split(";")[0];
}
(async () => {
  const url = new URL(process.env.DATABASE_URL);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.port, "55432");
  assert.equal(url.pathname, "/beyond_pilot_elearning");
  const admin = await login("admin@pilot.invalid"),
    learner = await login("stagiaire@pilot.invalid"),
    other = await login("autre@pilot.invalid"),
    trainer = await login("formateur@pilot.invalid");
  const otherUser = (await req("/auth/me", "GET", undefined, other)).data;
  const trainerUser = (await req("/auth/me", "GET", undefined, trainer)).data;
  const all = (await req("/trainings")).data;
  assert.equal(all.length, 83);
  assert.equal(
    all.filter((t) => t.program.kind === "official-catalogue").length,
    81,
  );
  pass(
    "83 formations, dont 81 sources officielles préservées et 2 créations identifiées",
  );
  for (const c of courses) {
    const t = (await req("/trainings/" + c.slug)).data;
    assert.equal(t.program.kind, "authored-regulatory");
    assert.deepEqual(t.program.syllabus, c.syllabus);
    assert.equal(t.courses.length, 1);
    const id = t.courses[0].id;
    await req("/courses/" + id, "GET", undefined, other, 403);
    await req("/courses/" + id, "GET", undefined, trainer);
    const read = (await req("/courses/" + id, "GET", undefined, learner)).data;
    assert.equal(
      read.modules[0].lessons.filter((l) => l.type === "TEXT").length,
      8,
    );
    assert.equal(read.resources.hasNotebook, false);
    assert.equal(
      read.modules[0].lessons.reduce((n, l) => n + l.durationMin, 0),
      840,
    );
    const quiz = read.modules[0].lessons.find((l) => l.quiz).quiz;
    assert.equal(quiz.questions.length, 20);
    assert(!JSON.stringify(quiz).includes('"isCorrect"'));
    assert(!JSON.stringify(quiz).includes('"explanation"'));
    const enrollment = await db.learningEnrollment.create({
      data: {
        courseId: id,
        userId: otherUser.id,
        trainerId: trainerUser.id,
        groupName: nonce,
      },
    });
    ownedEnrollments.push(enrollment.id);
    const lessonId = read.modules[0].lessons.find((l) => l.type === "TEXT").id;
    // IDs captured from the returned records for exact test cleanup.
    const beforeEvents = await db.learningEvent.findMany({
      where: { courseId: id, subjectId: otherUser.id },
      select: { id: true },
    });
    const existingProgress = await db.lessonProgress.findUnique({
      where: { lessonId_userId: { lessonId, userId: otherUser.id } },
    });
    assert(!existingProgress);
    await req(
      "/courses/" + id + "/lessons/" + lessonId + "/progress",
      "PUT",
      { completed: true },
      other,
    );
    const progress = await db.lessonProgress.findUniqueOrThrow({
      where: { lessonId_userId: { lessonId, userId: otherUser.id } },
    });
    ownedProgress.push(progress.id);
    const good = quiz.questions.map(
      (q, i) =>
        q.answers.find((a) => a.label === c.quiz[i].options[c.quiz[i].correct])
          .id,
    );
    const bad = quiz.questions.map(
      (q, i) => q.answers.find((a) => a.id !== good[i]).id,
    );
    const attempt = (
      await req(
        "/courses/" + id + "/quizzes/" + quiz.id + "/attempts",
        "POST",
        { answers: bad },
        other,
        201,
      )
    ).data;
    ownedAttempts.push(attempt.id);
    assert.equal(attempt.score, 0);
    assert(
      attempt.feedback.every((f) => !f.correct && f.explanation.length > 70),
    );
    const success = (
      await req(
        "/courses/" + id + "/quizzes/" + quiz.id + "/attempts",
        "POST",
        { answers: good },
        other,
        201,
      )
    ).data;
    ownedAttempts.push(success.id);
    assert.equal(success.score, 100);
    const state = (
      await req("/courses/" + id + "/state", "GET", undefined, other)
    ).data;
    assert.equal(state.attempts.length, 2);
    assert(state.progress.some((p) => p.completed));
    const events = await db.learningEvent.findMany({
      where: { courseId: id, subjectId: otherUser.id },
      select: { id: true },
    });
    ownedEvents.push(
      ...events
        .filter((e) => !beforeEvents.some((b) => b.id === e.id))
        .map((e) => e.id),
    );
    const exported = (
      await req(
        "/courses/" + id + "/learners/" + otherUser.id + "/export",
        "GET",
        undefined,
        other,
      )
    ).data;
    assert.equal(exported.completed, false);
    assert(exported.rules.includes("soutenance"));
    for (const suffix of ["", "/support"]) {
      const r = await fetch(web + "/formations/" + c.slug + suffix);
      assert.equal(r.status, 200);
      const $ = load(await r.text());
      assert.equal($("main h1").length, 1);
      assert($("main").text().includes("corrigé"));
      assert(!$("main").text().includes("présenté sur le site officiel"));
    }
    for (const file of [
      "/programmes/" + c.slug + ".md",
      "/reglementation/" + c.code + "-support.md",
      "/reglementation/" + c.code + "-modeles.md",
    ]) {
      const r = await fetch(web + file);
      assert.equal(r.status, 200);
      assert((await r.text()).includes("contact@beyondexpertise.eu"));
    }
    pass(
      c.code +
        " : leçons, droits d’accès, progression, quiz 0/100 et 100/100, retours et supports",
    );
  }
  await req("/auth/my-data", "GET", undefined, "", 401);
  const me = (await req("/auth/me", "GET", undefined, learner)).data;
  const exported = await req(
    "/auth/my-data?userId=" + me.id,
    "GET",
    undefined,
    other,
  );
  assert.equal(exported.data.account.id, otherUser.id);
  assert.equal(exported.data.quizzes.length, 4);
  assert.equal(exported.r.headers.get("cache-control"), "no-store");
  assert(
    !/passwordHash|tokenHash|requestKey|AuthSession|PasswordReset/.test(
      JSON.stringify(exported.data),
    ),
  );
  pass(
    "Export limité au compte connecté, sans secrets, sans cache et sans sélection d’un autre utilisateur",
  );
  const payload = {
    requestKey: crypto.randomUUID(),
    kind: "DATA_RIGHTS",
    fullName: nonce,
    email: "reg-test@pilot.invalid",
    stakeholder: "OTHER",
    context: "Accès aux données fictives",
    message: "Test technique de demande de droits. Aucun bénéficiaire réel.",
  };
  await req(
    "/quality/requests",
    "POST",
    payload,
    "",
    403,
    "https://untrusted.invalid",
  );
  const receipt = (await req("/quality/requests", "POST", payload, "", 201))
    .data;
  rights = await db.qualityRequest.findUniqueOrThrow({
    where: { reference: receipt.reference },
  });
  assert(rights.dueDate);
  const days = (rights.dueDate - rights.createdAt) / 86400000;
  assert(days > 27.9 && days < 31.1);
  assert.deepEqual(
    (await req("/quality/requests", "POST", payload, "", 201)).data,
    receipt,
  );
  await req("/quality/requests/" + rights.id, "GET", undefined, learner, 403);
  const record = (
    await req("/quality/requests/" + rights.id, "GET", undefined, admin)
  ).data;
  assert.equal(record.kind, "DATA_RIGHTS");
  assert.equal(record.status, "NEW");
  pass(
    "Droits : réception persistante, échéance initiale d’un mois, idempotence, accès admin et contrôle d’origine",
  );
  for (const path of [
    "/",
    "/rgpd-ai-act",
    "/vos-droits",
    "/transparence-ia",
    "/confidentialite",
  ]) {
    const r = await fetch(web + path);
    assert.equal(r.status, 200);
    const html = await r.text(),
      $ = load(html);
    assert.equal($("main h1").length, 1);
    assert.equal($('video[src*="cloudfront"]').length, 0);
    assert(!html.includes("d8j0ntlcm91z4.cloudfront.net"));
    assert.equal(
      r.headers.get("permissions-policy"),
      "camera=(), microphone=(), geolocation=()",
    );
  }
  pass(
    "Pages publiques, absence de vidéo tierce et restriction caméra/micro/localisation",
  );
  report.status = "PASS";
})()
  .catch((e) => {
    report.status = "FAIL";
    report.error = e.message;
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (rights) {
      await db.qualityRequestEvent.deleteMany({
        where: { requestId: rights.id },
      });
      await db.qualityRequest.delete({ where: { id: rights.id } });
    }
    await db.learningEvent.deleteMany({ where: { id: { in: ownedEvents } } });
    await db.quizAttempt.deleteMany({ where: { id: { in: ownedAttempts } } });
    await db.lessonProgress.deleteMany({
      where: { id: { in: ownedProgress } },
    });
    await db.learningEnrollment.deleteMany({
      where: { id: { in: ownedEnrollments } },
    });
    await db.$disconnect();
    fs.mkdirSync("work", { recursive: true });
    fs.writeFileSync(
      "work/regulatory-test.json",
      JSON.stringify(report, null, 2),
    );
  });
