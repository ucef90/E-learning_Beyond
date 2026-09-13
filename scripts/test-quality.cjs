const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
const base = "http://127.0.0.1:4200/api/v1",
  origin = "http://127.0.0.1:3200";
const nonce = "QUALITY-TEST-" + crypto.randomUUID();
const owned = [],
  reviewEvents = [];
let reviewId;
const report = {
  startedAt: new Date().toISOString(),
  kind: "TECHNICAL_TEST_NOT_CENTRE_EVIDENCE",
  checks: [],
};
function pass(name) {
  report.checks.push({ name, status: "PASS" });
  console.log("PASS", name);
}
async function call(path, method = "GET", body, cookie = "", expected = 200) {
  const res = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => null);
  assert.equal(res.status, expected, JSON.stringify(data));
  return { data, res };
}
const make = (kind = "ASSISTANCE") => ({
  requestKey: crypto.randomUUID(),
  kind,
  fullName: nonce,
  email: "quality-test@pilot.invalid",
  stakeholder: "LEARNER",
  context: "SESSION SYNTHETIQUE " + nonce,
  message: "Test technique sans bénéficiaire réel. " + nonce,
  ...(kind === "NEEDS" ? { currentLevel: "BASIC" } : {}),
  ...(["SATISFACTION", "TEACHING"].includes(kind) ? { rating: 4 } : {}),
});
async function snapshot() {
  return Promise.all([
    db.training.count(),
    db.course.count(),
    db.learningEnrollment.count(),
    db.workSubmission.count(),
    db.quizAttempt.count(),
  ]);
}
(async () => {
  const url = new URL(process.env.DATABASE_URL);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.port, "55432");
  assert.equal(url.pathname, "/beyond_pilot_elearning");
  const baseline = await snapshot();
  const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8")),
    sessions = {};
  for (const role of ["ADMIN", "TRAINER", "LEARNER"]) {
    const a =
      role === "LEARNER"
        ? accounts.find((a) => a.email === "stagiaire@pilot.invalid")
        : accounts.find((a) => a.role === role);
    assert(a, "Missing role " + role);
    const { res } = await call(
      "/auth/login",
      "POST",
      { email: a.email, password: a.password },
      "",
      201,
    );
    sessions[role] = res.headers.get("set-cookie").split(";")[0];
  }
  for (const path of ["/quality/requests", "/quality/reviews"]) {
    await call(path, "GET", undefined, "", 401);
    for (const role of ["TRAINER", "LEARNER"])
      await call(path, "GET", undefined, sessions[role], 403);
  }
  pass("Registres refusés aux visiteurs, apprenants et formateurs");
  await call(
    "/quality/requests",
    "POST",
    { ...make(), kind: "INVALID" },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make(), message: "   " },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make(), email: "invalid" },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make(), website: "spam" },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make(), status: "CLOSED" },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make(), message: "x".repeat(5001) },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make("NEEDS"), currentLevel: undefined },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make("SATISFACTION"), rating: undefined },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make("SATISFACTION"), rating: null },
    "",
    400,
  );
  await call(
    "/quality/requests",
    "POST",
    { ...make("TEACHING"), stakeholder: "TRAINER" },
    "",
    400,
  );
  pass(
    "Validation serveur : type, longueur, email, anti-spam, champs requis et rôle du questionnaire",
  );
  const wrongOrigin = await fetch(base + "/quality/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://invalid.example",
    },
    body: JSON.stringify(make()),
  });
  assert.equal(wrongOrigin.status, 403);
  pass("Mutation depuis une origine étrangère refusée");
  let firstPayload, first;
  for (const kind of [
    "ASSISTANCE",
    "ACCESSIBILITY",
    "COMPLAINT",
    "NEEDS",
    "SATISFACTION",
    "TEACHING",
    "ALERT",
  ]) {
    const payload = make(kind),
      { data } = await call("/quality/requests", "POST", payload, "", 201);
    assert.deepEqual(Object.keys(data).sort(), ["createdAt", "reference"]);
    assert.match(data.reference, /^BE-[0-9]{4}-/);
    const record = await db.qualityRequest.findUnique({
      where: { requestKey: payload.requestKey },
    });
    assert.equal(record.message, payload.message);
    owned.push(record.id);
    if (kind === "COMPLAINT") {
      firstPayload = payload;
      first = record;
    }
  }
  pass("Sept formulaires persistés avec un reçu sans données personnelles");
  const retry = await call("/quality/requests", "POST", firstPayload, "", 201);
  assert.equal(retry.data.reference, first.reference);
  await call(
    "/quality/requests",
    "POST",
    {
      ...firstPayload,
      message: "Un autre contenu ne peut pas réutiliser la clé.",
    },
    "",
    409,
  );
  assert.equal(
    await db.qualityRequest.count({
      where: { requestKey: firstPayload.requestKey },
    }),
    1,
  );
  pass("Nouvel envoi idempotent et conflit de contenu détecté");
  await call(
    "/quality/requests/" + first.id,
    "GET",
    undefined,
    sessions.LEARNER,
    403,
  );
  await call(
    "/quality/requests/" + first.id,
    "PATCH",
    {
      revision: 1,
      status: "NEW",
      assignee: "",
      resolution: "",
      responseReference: "",
      note: "Essai interdit au formateur",
    },
    sessions.TRAINER,
    403,
  );
  const bad = {
    revision: 1,
    status: "CLOSED",
    assignee: nonce,
    resolution: "",
    responseReference: "",
    note: "Test clôture incomplète " + nonce,
  };
  await call(
    "/quality/requests/" + first.id,
    "PATCH",
    bad,
    sessions.ADMIN,
    400,
  );
  let updated = (
    await call(
      "/quality/requests/" + first.id,
      "PATCH",
      { ...bad, status: "IN_PROGRESS", dueDate: "2026-09-20T12:00:00.000Z" },
      sessions.ADMIN,
    )
  ).data;
  assert.equal(updated.revision, 2);
  assert.equal(updated.events.length, 1);
  assert(!("payloadHash" in updated));
  assert(!("requestKey" in updated));
  await call(
    "/quality/requests/" + first.id,
    "PATCH",
    { ...bad, status: "IN_PROGRESS" },
    sessions.ADMIN,
    409,
  );
  updated = (
    await call(
      "/quality/requests/" + first.id,
      "PATCH",
      {
        ...bad,
        revision: 2,
        resolution: "Résolution fictive pour recette seulement",
        responseReference: "TEST - aucun email adressé",
        note: "Clôture synthétique " + nonce,
      },
      sessions.ADMIN,
    )
  ).data;
  assert.equal(updated.status, "CLOSED");
  assert.equal(updated.events.length, 2);
  updated = (
    await call(
      "/quality/requests/" + first.id,
      "PATCH",
      {
        ...bad,
        revision: 3,
        status: "IN_PROGRESS",
        note: "Réouverture synthétique " + nonce,
      },
      sessions.ADMIN,
    )
  ).data;
  assert.equal(updated.status, "IN_PROGRESS");
  assert.equal(updated.events.length, 3);
  pass(
    "Affectation, échéance, clôture justifiée, réouverture et historique avec protection contre les écrasements",
  );
  const current = (
    await call("/quality/reviews", "GET", undefined, sessions.ADMIN)
  ).data;
  reviewId = Array.from({ length: 33 }, (_, i) => i + 1).find(
    (id) => !current.items.some((r) => r.indicator === id),
  );
  assert(reviewId);
  const review = {
    revision: 0,
    status: "REVIEWED",
    evidenceKind: "TEST",
    evidenceReference: "TEST-ONLY",
    owner: nonce,
    note: "Pièce synthétique " + nonce,
  };
  await call(
    "/quality/reviews/" + reviewId,
    "PATCH",
    review,
    sessions.ADMIN,
    400,
  );
  await call("/quality/reviews/34", "PATCH", review, sessions.ADMIN, 400);
  await call(
    "/quality/reviews/" + reviewId,
    "PATCH",
    { ...review, status: "NOT_APPLICABLE", evidenceReference: "" },
    sessions.ADMIN,
    400,
  );
  await call(
    "/quality/reviews/" + reviewId,
    "PATCH",
    { ...review, status: "IN_PROGRESS" },
    sessions.ADMIN,
  );
  const events = await db.qualityReviewEvent.findMany({
    where: { indicator: reviewId, actorId: undefined },
  });
  reviewEvents.push(
    ...events.filter((e) => e.details.note === review.note).map((e) => e.id),
  );
  await call(
    "/quality/reviews/" + reviewId,
    "PATCH",
    { ...review, status: "IN_PROGRESS" },
    sessions.ADMIN,
    409,
  );
  pass(
    "Modèles/tests exclus du statut preuve réelle examinée ; justification et concurrence contrôlées",
  );
  for (let i = 0; i < 51; i++) {
    const id = crypto.randomUUID();
    owned.push(id);
    await db.qualityRequest.create({
      data: {
        id,
        reference: "TEST-" + id,
        requestKey: id,
        payloadHash: "fixture",
        kind: "ASSISTANCE",
        fullName: nonce,
        email: "quality-test@pilot.invalid",
        stakeholder: "LEARNER",
        context: "TEST pagination",
        message: "Fixture technique " + nonce,
      },
    });
  }
  let cursor = null,
    ids = [];
  do {
    const { data } = await call(
      "/quality/requests" + (cursor ? "?before=" + cursor : ""),
      "GET",
      undefined,
      sessions.ADMIN,
    );
    ids.push(...data.items.map((i) => i.id));
    cursor = data.next;
  } while (cursor);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of owned) assert(ids.includes(id));
  pass("Pagination au-delà de 50 demandes sans oubli ni doublon");
  assert.deepEqual(await snapshot(), baseline);
  pass("Catalogue, cours, inscriptions, remises et quiz préservés");
  for (const cookie of Object.values(sessions))
    await call("/auth/logout", "POST", {}, cookie, 201);
})()
  .catch((e) => {
    report.error = e.message;
    process.exitCode = 1;
    console.error(e.message);
  })
  .finally(async () => {
    if (owned.length) {
      await db.qualityRequestEvent.deleteMany({
        where: { requestId: { in: owned } },
      });
      await db.qualityRequest.deleteMany({
        where: { id: { in: owned }, fullName: nonce },
      });
    }
    if (reviewEvents.length)
      await db.qualityReviewEvent.deleteMany({
        where: { id: { in: reviewEvents } },
      });
    if (reviewId)
      await db.qualityReview.deleteMany({
        where: { indicator: reviewId, owner: nonce, revision: 1 },
      });
    report.cleanup = "Only this run's synthetic records removed";
    report.finishedAt = new Date().toISOString();
    fs.mkdirSync("../validation-qualite", { recursive: true });
    fs.writeFileSync(
      "../validation-qualite/recette-api.json",
      JSON.stringify(report, null, 2),
    );
    await db.$disconnect();
  });
