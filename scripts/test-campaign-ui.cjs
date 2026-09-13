const { chromium, expect } = require("@playwright/test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  { randomUUID } = require("node:crypto"),
  { PrismaClient } = require("@prisma/client");
const db = new PrismaClient(),
  root = "http://127.0.0.1:3300",
  email = "campaign-ui-" + randomUUID() + "@example.invalid",
  prefix = "qa_" + Date.now(),
  slug = "mba-direction-strategie-croissance";
let browser;
let checks = 0;
const errors = [];
const check = (v, m) => {
  assert(v, m);
  checks++;
};
async function main() {
  const url = new URL(process.env.DATABASE_URL);
  assert(
    url.pathname === "/beyond_platform_work" &&
      ["127.0.0.1", "localhost"].includes(url.hostname),
  );
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const ctx = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    }),
    page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  const requests = [];
  ctx.on("request", (r) => {
    if (
      /campaigns\/events|googletagmanager|facebook.net|facebook.com\/tr/.test(
        r.url(),
      )
    )
      requests.push(r.url());
  });
  await ctx.route("https://**/*", (r) => r.abort());
  await page.goto(
    root +
      "/afrique?utm_source=meta&utm_medium=paid_social&utm_campaign=" +
      prefix,
    { waitUntil: "networkidle" },
  );
  await expect(
    page.getByRole("button", { name: "Tout refuser", exact: true }),
  ).toBeVisible();
  check(requests.length === 0, "no optional measurement before consent");
  check(
    (await page.locator(".campaign-programmes article").count()) === 4,
    "four programmes",
  );
  await page.getByRole("button", { name: "Tout refuser", exact: true }).click();
  check(
    (await page.evaluate(() => localStorage.getItem("beyond-campaign-v1"))) ===
      null,
    "refusal leaves no attribution",
  );
  await page
    .locator(".campaign-form input[name=fullName]")
    .fill("Test Campagne UI");
  await page.locator(".campaign-form input[name=email]").fill(email);
  await page.locator(".campaign-form input[name=country]").fill("Sénégal");
  await page
    .locator(".campaign-form select[name=programmeSlug]")
    .selectOption(slug);
  await page.locator(".campaign-form input[name=contactConsent]").check();
  await page
    .locator(".campaign-form select[name=intent]")
    .selectOption("CALLBACK");
  await page.locator(".campaign-form button[type=submit]").click();
  check(
    await page
      .locator(".campaign-form input[name=phone]")
      .evaluate((e) => !e.validity.valid),
    "callback phone required",
  );
  await page
    .locator(".campaign-form select[name=intent]")
    .selectOption("BROCHURE");
  let fail = true;
  await page.route("**/api/v1/campaigns/leads", async (route) => {
    if (fail) {
      fail = false;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "Indisponibilité de test" }),
      });
    } else await route.continue();
  });
  await page.locator(".campaign-form button[type=submit]").click();
  await expect(page.locator(".campaign-error")).toContainText(
    "Indisponibilité de test",
  );
  check(
    (await page.locator("[name=email]").inputValue()) === email,
    "failed form retains data",
  );
  await page.locator(".campaign-form button[type=submit]").click();
  await page.waitForURL("**/mba-dba/merci");
  await expect(
    page.getByRole("heading", { name: "Votre prochaine étape commence ici." }),
  ).toBeVisible();
  const receipt = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("beyond-lead-receipt")),
  );
  check(
    receipt.reference && receipt.requestKey,
    "receipt stored without form fields",
  );
  check(!("email" in receipt), "no PII in browser receipt");
  const pdf = await page
    .getByRole("link", { name: "Télécharger ma brochure PDF" })
    .getAttribute("href");
  check(
    (await ctx.request.get(root + pdf)).status() === 200,
    "receipt PDF available",
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Votre prochaine étape commence ici." }),
  ).toBeVisible();
  check(
    (await db.lead.count({ where: { email } })) === 1,
    "receipt reload does not duplicate lead",
  );
  check(
    requests.length === 0,
    "refused visitor does not send events during funnel",
  );
  const blank = await browser.newContext(),
    blankPage = await blank.newPage();
  await blankPage.goto(root + "/mba-dba/merci");
  await expect(
    blankPage.getByRole("heading", { name: "Retrouvons votre projet." }),
  ).toBeVisible();
  await blank.close();
  await page.goto(root + "/afrique?utm_source=meta&utm_campaign=" + prefix);
  await page.getByRole("button", { name: "Gérer mes cookies" }).click();
  await page
    .getByRole("button", { name: "Tout accepter", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("beyond-campaign-v1") || "null")
            ?.first?.source,
      ),
    )
    .toBe("meta");
  await page.locator(".campaign-programmes article a").first().click();
  await page.waitForURL("**/mba-dba/" + slug);
  check(
    (await page.evaluate(
      () => JSON.parse(localStorage.getItem("beyond-campaign-v1")).last.source,
    )) === "meta",
    "UTM persists through programme click",
  );
  await page
    .getByRole("link", { name: "Recevoir la brochure", exact: true })
    .click();
  await page.waitForURL("**/afrique?**");
  const form = page.locator(".campaign-form");
  await form.locator("[name=fullName]").fill("Test Campagne Attribuée");
  await form.locator("[name=email]").fill(email);
  await form.locator("[name=country]").fill("Cameroun");
  await form.locator("[name=contactConsent]").check();
  await form.locator("button[type=submit]").click();
  await page.waitForURL("**/mba-dba/merci");
  await expect(
    page.getByRole("link", { name: "Télécharger ma brochure PDF" }),
  ).toBeVisible();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("link", { name: "Télécharger ma brochure PDF" }).click();
  await downloadEvent;
  await expect
    .poll(() =>
      db.marketingEvent.count({
        where: { campaign: prefix, name: "download_brochure" },
      }),
    )
    .toBeGreaterThan(0);
  check(true, "receipt brochure click measured after consent");
  const attributed = await db.lead.findFirst({
    where: { email, campaignName: prefix },
  });
  check(
    attributed?.attribution?.first?.source === "meta",
    "lead keeps consented source",
  );
  check(
    (await db.marketingEvent.count({ where: { campaign: prefix } })) > 0,
    "internal events saved",
  );
  await page.goto(root + "/afrique");
  await page.getByRole("button", { name: "Gérer mes cookies" }).click();
  await page.getByRole("button", { name: "Tout refuser", exact: true }).click();
  await page.waitForLoadState("networkidle");
  check(
    (await page.evaluate(() => localStorage.getItem("beyond-campaign-v1"))) ===
      null,
    "withdrawal clears attribution",
  );
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(root + "/afrique", { waitUntil: "networkidle" });
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      "no overflow " + width,
    );
    await page.screenshot({
      path: "work/campaign/afrique-" + width + ".png",
      fullPage: true,
    });
  }
  const tagged = await browser.newContext(),
    tp = await tagged.newPage(),
    tags = [];
  tagged.on("request", (r) => {
    if (/googletagmanager|connect.facebook.net/.test(r.url()))
      tags.push(r.url());
  });
  await tagged.route("https://**/*", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "/* test: no external tracking */",
    }),
  );
  await tagged.route("**/api/v1/campaigns/configuration", (r) =>
    r.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ga4: "G-TEST12345",
        metaPixel: "123456789",
        whatsapp: "",
      }),
    }),
  );
  await tp.goto(root + "/afrique?utm_source=meta&utm_campaign=safe_test");
  await expect(
    tp.getByRole("button", { name: "Tout accepter", exact: true }),
  ).toBeVisible();
  check(tags.length === 0, "configured tags still blocked before consent");
  await tp.getByRole("button", { name: "Tout accepter", exact: true }).click();
  await expect.poll(() => tags.length).toBe(2);
  check(true, "both tags activate after consent");
  const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8")),
    a = accounts.find((a) => a.role === "ADMIN");
  check(
    (
      await ctx.request.post(root + "/api/v1/auth/login", {
        headers: { Origin: root },
        data: { email: a.email, password: a.password },
      })
    ).status() === 201,
    "admin browser login",
  );
  await page.goto(root + "/admin/commercial");
  await expect(
    page.getByRole("heading", {
      name: "Prospects MBA & DBA · Campagnes Afrique",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Test Campagne Attribuée/ }).click();
  await expect(page.locator(".campaign-crm-details")).toContainText(prefix);
  await page.screenshot({ path: "work/campaign/crm.png", fullPage: true });
  check(errors.length === 0, "no browser errors");
  fs.writeFileSync(
    "work/campaign/ui-result.json",
    JSON.stringify({ checks, result: "PASS", errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, result: "PASS" }));
  await tagged.close();
  await ctx.close();
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    const leads = await db.lead.findMany({ where: { email } });
    for (const l of leads)
      if (l.receiptCode)
        await db.notification.deleteMany({
          where: { body: { contains: l.receiptCode } },
        });
    await db.lead.deleteMany({ where: { email } });
    await db.marketingEvent.deleteMany({ where: { campaign: prefix } });
    await db.$disconnect();
  });
