const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  crypto = require("node:crypto");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
const origin = "http://127.0.0.1:3300",
  base = "http://127.0.0.1:4300/api/v1";
const catalogue = require("../content/executive/catalogue.json"),
  accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8"));
const appIds = [],
  cookies = [];
let assertions = 0;
function check(value, message) {
  assert(value, message);
  assertions++;
}
async function request(
  path,
  method = "GET",
  data,
  cookie,
  requestOrigin = origin,
) {
  const r = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: requestOrigin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  return {
    status: r.status,
    body: await r.json(),
    cookie: r.headers
      .getSetCookie()
      .map((x) => x.split(";")[0])
      .join("; "),
  };
}
async function login(role) {
  const a = accounts.find((x) => x.role === role);
  const r = await request("/auth/login", "POST", {
    email: a.email,
    password: a.password,
  });
  check(r.status === 201, role + " login");
  cookies.push(r.cookie);
  return r.cookie;
}
async function main() {
  check(
    new URL(process.env.DATABASE_URL).pathname === "/beyond_platform_work",
    "Tests limited to local working database",
  );
  check(
    catalogue.programmes.filter((p) => p.kind === "MBA").length === 21,
    "21 MBA",
  );
  check(
    catalogue.programmes.filter((p) => p.kind === "DBA").length === 10,
    "10 DBA",
  );
  const admin = await login("ADMIN"),
    learner = await login("LEARNER");
  check(
    (await request("/executive/applications")).status === 401,
    "Anonymous cannot read applications",
  );
  check(
    (await request("/executive/applications", "GET", null, learner)).status ===
      403,
    "Learner cannot read applications",
  );
  const payload = {
    requestKey: crypto.randomUUID(),
    programmeSlug: catalogue.programmes[0].slug,
    requestType: "APPLICATION",
    fullName: "Vérification technique Beyond",
    email: "executive-verification@example.invalid",
    country: "Sénégal",
    city: "Dakar",
    qualification: "Master de gestion",
    experience: 7,
    currentRole: "Responsable de projets",
    company: "Vérification locale",
    motivation:
      "Je souhaite structurer une démarche de transformation et comparer plusieurs scénarios sur un terrain pédagogique.",
    funding: "TO_DISCUSS",
    consent: true,
  };
  check(
    (
      await request("/executive/applications", "POST", {
        ...payload,
        consent: false,
      })
    ).status === 400,
    "Consent required",
  );
  check(
    (
      await request("/executive/applications", "POST", {
        ...payload,
        programmeSlug: "unknown-programme",
      })
    ).status === 400,
    "Unknown programme rejected",
  );
  check(
    (
      await request("/executive/applications", "POST", {
        ...payload,
        status: "ACCEPTED",
      })
    ).status === 400,
    "Mass assignment rejected",
  );
  check(
    (
      await request(
        "/executive/applications",
        "POST",
        payload,
        null,
        "https://untrusted.example",
      )
    ).status === 403,
    "Cross-origin mutation rejected",
  );
  const [one, two] = await Promise.all([
    request("/executive/applications", "POST", payload),
    request("/executive/applications", "POST", payload),
  ]);
  check(
    one.status === 201 && two.status === 201,
    "Concurrent repeated requests accepted idempotently",
  );
  check(one.body.reference === two.body.reference, "Same receipt for retries");
  check(
    Object.keys(one.body).sort().join(",") === "createdAt,reference",
    "Public response contains no application data",
  );
  const item = await db.executiveApplication.findUniqueOrThrow({
    where: { requestKey: payload.requestKey },
  });
  appIds.push(item.id);
  check(
    (await db.executiveApplication.count({
      where: { requestKey: payload.requestKey },
    })) === 1,
    "Single stored application",
  );
  check(
    (
      await request("/executive/applications", "POST", {
        ...payload,
        motivation: payload.motivation + " Modifié.",
      })
    ).status === 409,
    "Changed replay rejected",
  );
  check(
    (
      await request(
        "/executive/applications/" + item.id,
        "PATCH",
        { revision: 1, status: "REVIEW", internalNote: "Contrôle local" },
        learner,
      )
    ).status === 403,
    "Learner cannot update application",
  );
  const updated = await request(
    "/executive/applications/" + item.id,
    "PATCH",
    {
      revision: 1,
      status: "INTERVIEW",
      internalNote: "À organiser après vérification du terrain.",
    },
    admin,
  );
  check(
    updated.status === 200 && updated.body.revision === 2,
    "Admin can update with optimistic revision",
  );
  check(
    (
      await request(
        "/executive/applications/" + item.id,
        "PATCH",
        { revision: 1, status: "CLOSED", internalNote: "" },
        admin,
      )
    ).status === 409,
    "Stale write rejected",
  );
  check(
    (await db.learningEvent.count({
      where: { subjectId: item.id, action: "EXECUTIVE_APPLICATION_UPDATED" },
    })) === 1,
    "Audit trail persisted",
  );
  const listed = await request("/executive/applications", "GET", null, admin);
  check(
    listed.body.items.some((x) => x.id === item.id),
    "Admin list includes saved request",
  );
  check(
    !listed.body.items.some((x) => "requestKey" in x || "payloadHash" in x),
    "Private request keys excluded from list",
  );
  check(
    (await request("/executive/applications?page=0", "GET", null, admin))
      .status === 400,
    "Invalid pagination rejected",
  );
  const dba = {
    ...payload,
    requestKey: crypto.randomUUID(),
    programmeSlug: catalogue.programmes.find((p) => p.kind === "DBA").slug,
  };
  const dbaResult = await request("/executive/applications", "POST", dba);
  check(dbaResult.status === 201, "DBA application saved");
  appIds.push(
    (
      await db.executiveApplication.findUniqueOrThrow({
        where: { requestKey: dba.requestKey },
      })
    ).id,
  );
  const service = {
    ...payload,
    requestKey: crypto.randomUUID(),
    programmeSlug: catalogue.services[0].slug,
    requestType: "COMPANY",
  };
  const sr = await request("/executive/applications", "POST", service);
  check(sr.status === 201, "Corporate service request saved");
  appIds.push(
    (
      await db.executiveApplication.findUniqueOrThrow({
        where: { requestKey: service.requestKey },
      })
    ).id,
  );
  for (const p of catalogue.programmes) {
    const c = await db.course.findUniqueOrThrow({
      where: { slug: p.slug },
      include: { modules: { include: { lessons: true } } },
    });
    check(
      !c.isPublished && c.editorialStatus === "DRAFT",
      "Course remains private draft: " + p.slug,
    );
    check(
      c.modules.length === p.modules.length &&
        c.modules.every((m) => m.lessons.length >= 2),
      "All programme workbooks imported: " + p.slug,
    );
  }
  const assistant = await request("/assistant/ask", "POST", {
    message: "Je cherche les programmes MBA en finance",
  });
  check(
    assistant.status === 200 &&
      assistant.body.links.some((x) => x.href === "/mba"),
    "Visitor assistant finds MBA",
  );
  const cert = await request("/assistant/ask", "POST", {
    message: "Ce DBA est il reconnu par l’État ?",
  });
  check(
    cert.status === 200 && cert.body.answer.includes("ne revendique"),
    "Assistant qualifies degree status",
  );
  fs.mkdirSync("work/validation", { recursive: true });
  fs.writeFileSync(
    "work/validation/executive-api.json",
    JSON.stringify({ assertions, programmes: 31, result: "PASS" }, null, 2),
  );
  console.log(JSON.stringify({ assertions, programmes: 31, result: "PASS" }));
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    for (const cookie of cookies)
      await request("/auth/logout", "POST", {}, cookie).catch(() => {});
    await db.learningEvent.deleteMany({
      where: {
        subjectId: { in: appIds },
        action: "EXECUTIVE_APPLICATION_UPDATED",
      },
    });
    await db.executiveApplication.deleteMany({
      where: {
        id: { in: appIds },
        email: "executive-verification@example.invalid",
      },
    });
    await db.$disconnect();
  });
