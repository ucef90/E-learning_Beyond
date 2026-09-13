// Read-only in production. Synthetic submissions are explicitly limited to isolated staging.
const assert = require("node:assert/strict"),
  { randomUUID } = require("node:crypto");
const root = process.argv[2],
  stage = process.argv[3] === "isolated-stage",
  origin = "https://beyond-expertise.com";
assert(
  /^http:\/\/beyond-(campaign-web-[a-f0-9]{7}|platform-web-1):3300$/.test(root),
);
if (stage) assert(root.includes("beyond-campaign-web-"));
const slugs = [
  "mba-direction-strategie-croissance",
  "mba-projets-programmes-agilite",
  "mba-transformation-digitale-ia",
  "dba-innovation-technologies",
];
async function post(path, body) {
  const r = await fetch(root + "/api/v1" + path, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: r.status, body: await r.json() };
}
(async () => {
  const paths = [
    "/afrique",
    "/mba",
    "/dba",
    "/mba-dba",
    "/mba-dba/merci",
    "/mentions-legales",
    "/conditions-formation",
    "/confidentialite",
    "/connexion",
  ];
  for (const s of slugs)
    paths.push("/mba-dba/" + s, "/programmes-executive/" + s + ".pdf");
  for (const path of paths) {
    const r = await fetch(root + path);
    assert.equal(r.status, 200, path);
    if (path === "/afrique") {
      const t = await r.text();
      assert(
        t.includes("Votre projet, en quelques mots") &&
          t.includes("BEYOND EXPERTISE"),
      );
    }
    if (path === "/mentions-legales")
      assert((await r.text()).includes("932 551 674"));
  }
  const config = await (
    await fetch(root + "/api/v1/campaigns/configuration")
  ).json();
  assert("ga4" in config && "metaPixel" in config);
  assert.equal((await fetch(root + "/api/v1/campaigns/leads")).status, 401);
  if (stage) {
    const data = {
      requestKey: randomUUID(),
      programmeSlug: slugs[0],
      intent: "BROCHURE",
      fullName: "Validation préproduction",
      email: "campaign-stage@example.invalid",
      country: "Sénégal",
      contactConsent: true,
    };
    const first = await post("/campaigns/leads", data);
    assert.equal(first.status, 201, JSON.stringify(first.body));
    assert(first.body.reference && !first.body.email);
    const replay = await post("/campaigns/leads", data);
    assert.equal(first.body.reference, replay.body.reference);
    const receipt = await post("/campaigns/receipt", {
      requestKey: data.requestKey,
    });
    assert.equal(receipt.body.reference, first.body.reference);
    assert.equal(
      (
        await post("/campaigns/events", {
          id: randomUUID(),
          name: "page_view",
          path: "/afrique",
          statisticsConsent: false,
        })
      ).status,
      400,
    );
  }
  console.log(
    JSON.stringify({
      status: "PASS",
      pages: paths.length,
      syntheticLead: stage,
      externalTracking: { ga4: !!config.ga4, meta: !!config.metaPixel },
      whatsapp: !!config.whatsapp,
    }),
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
