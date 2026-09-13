const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  { randomUUID } = require("node:crypto"),
  { PrismaClient } = require("@prisma/client");
const db = new PrismaClient(),
  base = "http://127.0.0.1:4300/api/v1",
  origin = "http://127.0.0.1:3300",
  email = "campaign-" + randomUUID() + "@example.invalid",
  ids = [],
  events = [],
  cookies = [];
let checks = 0;
function check(v, m) {
  assert(v, m);
  checks++;
}
async function req(path, method = "GET", body, cookie, from = origin) {
  const r = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: from,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return {
    status: r.status,
    body: await r.json(),
    cookie: r.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; "),
  };
}
async function main() {
  const u = new URL(process.env.DATABASE_URL);
  assert(
    ["127.0.0.1", "localhost"].includes(u.hostname) &&
      u.pathname === "/beyond_platform_work",
  );
  const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8"));
  for (const role of ["ADMIN", "LEARNER"]) {
    const a = accounts.find((a) => a.role === role),
      r = await req("/auth/login", "POST", {
        email: a.email,
        password: a.password,
      });
    check(r.status === 201, "login " + role);
    cookies.push(r.cookie);
  }
  check(
    (await req("/campaigns/leads")).status === 401,
    "private CRM requires auth",
  );
  check(
    (await req("/campaigns/summary", "GET", null, cookies[1])).status === 403,
    "learner cannot read CRM",
  );
  const programmeSlug = "mba-direction-strategie-croissance",
    payload = {
      requestKey: randomUUID(),
      programmeSlug,
      intent: "BROCHURE",
      fullName: "Test Campagne",
      email,
      country: "Sénégal",
      contactConsent: true,
    };
  for (const mutation of [
    { contactConsent: false },
    { programmeSlug: "unknown" },
    { intent: "CALLBACK" },
    { website: "spam" },
    { email: "invalid" },
  ])
    check(
      (await req("/campaigns/leads", "POST", { ...payload, ...mutation }))
        .status === 400,
      "invalid lead rejected",
    );
  check(
    (
      await req(
        "/campaigns/leads",
        "POST",
        payload,
        null,
        "https://untrusted.invalid",
      )
    ).status === 403,
    "cross origin rejected",
  );
  const results = await Promise.all([
    req("/campaigns/leads", "POST", payload),
    req("/campaigns/leads", "POST", payload),
  ]);
  check(
    results.every((r) => r.status === 201),
    "concurrent lead requests succeed",
  );
  check(
    results[0].body.reference === results[1].body.reference,
    "idempotent receipt",
  );
  const lead = await db.lead.findUnique({
    where: { requestKey: payload.requestKey },
  });
  ids.push(lead.id);
  check(
    (await db.lead.count({ where: { requestKey: payload.requestKey } })) === 1,
    "one lead",
  );
  check(!lead.attribution, "no attribution without consent");
  check(
    Object.keys(results[0].body).sort().join(",") ===
      "createdAt,intent,programmeSlug,reference",
    "public receipt excludes PII",
  );
  check(
    (await req("/campaigns/leads", "POST", { ...payload, fullName: "Changed" }))
      .status === 409,
    "changed replay rejected",
  );
  check(
    (await req("/campaigns/receipt", "POST", { requestKey: randomUUID() }))
      .status === 404,
    "false confirmation blocked",
  );
  check(
    (await db.notification.count({
      where: { body: { contains: lead.receiptCode } },
    })) > 0,
    "internal admin notification",
  );
  const attributed = {
    ...payload,
    requestKey: randomUUID(),
    attribution: {
      statistics: true,
      advertising: false,
      first: {
        source: "meta",
        campaign: "afrique_mba",
        email: "private@example.invalid",
      },
      last: {
        source: "google",
        campaign: "search_mba",
        term: "bad@example.invalid",
        landing: "/afrique?email=bad",
      },
      fbclid: "discard",
    },
  };
  const r = await req("/campaigns/leads", "POST", attributed);
  check(r.status === 201, "attributed lead");
  const l2 = await db.lead.findUnique({
    where: { requestKey: attributed.requestKey },
  });
  ids.push(l2.id);
  check(
    l2.attribution.first.source === "meta" &&
      l2.attribution.last.source === "google",
    "first and last preserved",
  );
  check(
    !JSON.stringify(l2.attribution).includes("@") && !l2.attribution.fbclid,
    "attribution strips unexpected PII",
  );
  let revision = 1;
  check(
    (
      await req(
        "/campaigns/leads/" + lead.id,
        "PATCH",
        { revision, stage: "ENROLLED", note: "" },
        cookies[0],
      )
    ).status === 400,
    "enrollment requires actual confirmation",
  );
  check(
    (
      await req(
        "/campaigns/leads/" + lead.id,
        "PATCH",
        { revision, stage: "APPOINTMENT", note: "" },
        cookies[0],
      )
    ).status === 400,
    "appointment requires date",
  );
  check(
    (
      await req(
        "/campaigns/leads/" + lead.id,
        "PATCH",
        {
          revision,
          stage: "CONTACTED",
          note: "Test exchange",
          takeOwnership: true,
        },
        cookies[0],
      )
    ).status === 200,
    "CRM update",
  );
  revision++;
  check(
    (
      await req(
        "/campaigns/leads/" + lead.id,
        "PATCH",
        { revision: 1, stage: "CLOSED", note: "" },
        cookies[0],
      )
    ).status === 409,
    "revision protects simultaneous edits",
  );
  const app = {
    requestKey: randomUUID(),
    leadRequestKey: payload.requestKey,
    programmeSlug,
    requestType: "APPLICATION",
    fullName: "Test Campagne",
    email,
    country: "Sénégal",
    qualification: "Master",
    experience: 6,
    currentRole: "Directeur",
    motivation:
      "Je souhaite piloter un projet de transformation dans mon organisation.",
    funding: "SELF",
    consent: true,
  };
  const applied = await req("/executive/applications", "POST", app);
  check(applied.status === 201, "application from lead");
  const stored = await db.executiveApplication.findUnique({
    where: { requestKey: app.requestKey },
  });
  check(
    stored.leadId === lead.id && stored.consentAt,
    "application link and consent",
  );
  let current = await db.lead.findUnique({ where: { id: lead.id } });
  check(current.stage === "APPLICATION", "lead advances to candidature");
  check(
    (
      await req(
        "/campaigns/leads/" + lead.id,
        "PATCH",
        {
          revision: current.revision,
          stage: "ENROLLED",
          note: "Contrat vérifié pour test",
          enrollmentConfirmed: true,
          enrollmentReference: "TEST-CONTRACT",
        },
        cookies[0],
      )
    ).status === 200,
    "confirmed enrollment recorded",
  );
  const ev = {
    id: randomUUID(),
    name: "view_programme",
    path: "/mba-dba/" + programmeSlug,
    programmeSlug,
    statisticsConsent: true,
  };
  events.push(ev.id);
  check(
    (
      await req("/campaigns/events", "POST", {
        ...ev,
        statisticsConsent: false,
      })
    ).status === 400,
    "event consent required",
  );
  check(
    (await req("/campaigns/events", "POST", { ...ev, name: "purchase" }))
      .status === 400,
    "public cannot forge sales events",
  );
  check(
    (
      await req("/campaigns/events", "POST", {
        ...ev,
        path: "/apprentissage/secret",
      })
    ).status === 400,
    "private paths refused",
  );
  check(
    (await req("/campaigns/events", "POST", ev)).status === 201,
    "consented event",
  );
  await req("/campaigns/events", "POST", ev);
  check(
    (await db.marketingEvent.count({ where: { id: ev.id } })) === 1,
    "event deduplication",
  );
  const stats = await req("/campaigns/summary", "GET", null, cookies[0]);
  check(
    stats.body.stages.some((s) => s.stage === "ENROLLED" && s._count._all > 0),
    "real enrollment counted",
  );
  check(
    (await req("/campaigns/leads", "GET", null, cookies[0])).body.items.every(
      (l) => !l.requestKey && !l.requestHash,
    ),
    "CRM hides receipt capability keys",
  );
  await db.executiveApplication.delete({ where: { id: stored.id } });
  console.log(JSON.stringify({ checks, result: "PASS" }));
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.executiveApplication.deleteMany({ where: { email } });
    const rows = await db.lead.findMany({ where: { email } });
    for (const l of rows)
      if (l.receiptCode)
        await db.notification.deleteMany({
          where: { body: { contains: l.receiptCode } },
        });
    await db.lead.deleteMany({ where: { email } });
    await db.marketingEvent.deleteMany({ where: { id: { in: events } } });
    for (const c of cookies)
      await req("/auth/logout", "POST", {}, c).catch(() => {});
    await db.$disconnect();
  });
