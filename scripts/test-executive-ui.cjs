const { chromium, expect } = require("@playwright/test"),
  fs = require("node:fs"),
  assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");
const catalogue = require("../content/executive/catalogue.json");
const root = "http://127.0.0.1:3300",
  email = "executive-ui-check@example.invalid";
async function main() {
  assert.equal(
    new URL(process.env.DATABASE_URL).pathname,
    "/beyond_platform_work",
    "Use the local test database only",
  );
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  fs.mkdirSync("work/validation/executive-ui", { recursive: true });
  try {
    const home = await page.goto(root + "/mba-dba");
    assert.equal(home.status(), 200);
    await page.locator(".executive-programme").first().waitFor();
    assert.equal(await page.locator(".executive-programme").count(), 31);
    await page.screenshot({
      path: "work/validation/executive-ui/catalogue-desktop.png",
    });
    await page.getByLabel("Rechercher un parcours").fill("sante");
    assert((await page.locator(".executive-programme").count()) >= 4);
    await page.getByLabel("Rechercher un parcours").fill("absent-zzzz");
    await page
      .getByRole("button", { name: "Réinitialiser la recherche" })
      .click();
    assert.equal(await page.locator(".executive-programme").count(), 31);
    await page
      .getByRole("navigation", { name: "Types de parcours" })
      .getByRole("link", { name: "MBA", exact: false })
      .filter({ hasText: /^MBA/ })
      .click();
    await page.waitForURL(root + "/mba");
    assert.equal(await page.locator(".executive-programme").count(), 21);
    await page.locator(".executive-programme h3 a").first().click();
    await page.locator(".executive-detail-hero h1").waitFor();
    assert((await page.url()).includes("/mba-dba/mba-"));
    await page.screenshot({
      path: "work/validation/executive-ui/detail-desktop.png",
    });
    await page
      .getByRole("link", { name: "Lire le programme", exact: true })
      .click();
    await page
      .locator(".executive-modules details")
      .nth(4)
      .locator("summary")
      .click();
    assert(
      (await page
        .locator(".executive-modules details")
        .nth(4)
        .getAttribute("open")) !== null,
    );
    await page.screenshot({
      path: "work/validation/executive-ui/modules-desktop.png",
    });
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(root + "/mba-dba");
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await page.screenshot({
        path: `work/validation/executive-ui/catalogue-${width}.png`,
      });
      await page.goto(root + "/mba-dba/" + catalogue.programmes[2].slug);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await page.screenshot({
        path: `work/validation/executive-ui/detail-${width}.png`,
      });
    }
    await page.setViewportSize({ width: 1440, height: 1050 });
    await page.goto(
      root + "/mba-dba/candidature?programme=" + catalogue.programmes[0].slug,
    );
    assert.equal(
      await page.getByLabel("Parcours ou service souhaité").inputValue(),
      catalogue.programmes[0].slug,
    );
    await page.screenshot({
      path: "work/validation/executive-ui/application-desktop.png",
    });
    await page.getByLabel("Nom complet").fill("Vérification interface Beyond");
    await page.getByLabel("Email de réponse").fill(email);
    await page.getByLabel("Pays de résidence").fill("Côte d’Ivoire");
    await page.getByLabel("Dernier diplôme").fill("Master de gestion");
    await page.getByLabel("Années d’expérience").fill("6");
    await page
      .getByLabel("Fonction ou situation")
      .fill("Responsable de programme");
    await page
      .getByLabel("Votre objectif et le contexte")
      .fill(
        "Je souhaite comparer plusieurs options de développement pour une organisation et construire une feuille de route mesurable.",
      );
    await page.locator("input[name=consent]").check();
    await page
      .getByRole("button", { name: "Envoyer ma demande", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Votre projet est entre nos mains." })
      .waitFor();
    await page.screenshot({ path: "work/validation/executive-ui/receipt.png" });
    const a = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8")).find(
      (a) => a.role === "ADMIN",
    );
    const login = await context.request.post(root + "/api/v1/auth/login", {
      headers: { Origin: root },
      data: { email: a.email, password: a.password },
    });
    assert.equal(login.status(), 201);
    await page.goto(root + "/apprentissage");
    await page
      .getByRole("button", { name: "Candidatures MBA & DBA", exact: true })
      .click();
    await page
      .getByRole("heading", {
        name: "Vérification interface Beyond",
        exact: true,
      })
      .waitFor();
    await page.screenshot({
      path: "work/validation/executive-ui/admin-desktop.png",
    });
    await page
      .getByRole("button", { name: "Étudier le dossier", exact: true })
      .first()
      .click();
    await page.getByLabel("État du dossier").selectOption("REVIEW");
    await page.getByLabel("Note interne").fill("Contrôle interface local.");
    await page.getByRole("button", { name: "Enregistrer le suivi" }).click();
    await page
      .getByText("Le suivi du dossier a été enregistré.", { exact: true })
      .waitFor();
    await page
      .getByRole("button", { name: "Contenus pédagogiques", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Contenus pédagogiques", exact: true })
      .waitFor();
    await expect(
      page.locator(".studio-list nav button").filter({ hasText: "MBA —" }),
    ).toHaveCount(21);
    await page
      .locator(".studio-list nav button")
      .filter({ hasText: "MBA —" })
      .first()
      .click();
    await page.getByLabel("Titre du cours", { exact: true }).waitFor();
    await page.screenshot({
      path: "work/validation/executive-ui/studio-mba.png",
    });
    const resources = [];
    for (const p of catalogue.programmes) {
      const r = await context.request.get(root + "/mba-dba/" + p.slug);
      assert.equal(r.status(), 200, p.slug);
      assert(
        (await r.text()).includes(p.title.replaceAll("&", "&amp;")) ||
          (await r.text()).includes(p.title),
      );
      const pdf = await context.request.get(
        root + "/programmes-executive/" + p.slug + ".pdf",
      );
      assert.equal(pdf.status(), 200);
      assert((await pdf.body()).subarray(0, 5).toString() === "%PDF-");
      resources.push(p.slug);
    }
    assert.equal(
      (await context.request.get(root + "/mba-dba/introuvable")).status(),
      404,
    );
    assert.deepEqual(errors, []);
    await context.request.post(root + "/api/v1/auth/logout", {
      headers: { Origin: root },
    });
    fs.writeFileSync(
      "work/validation/executive-ui.json",
      JSON.stringify(
        {
          result: "PASS",
          programmes: resources.length,
          pdfs: resources.length,
          viewports: [1440, 768, 390],
          errors,
        },
        null,
        2,
      ),
    );
    console.log(
      "PASS: 31 pages, 31 PDF, application, admin, private studio, mobile/tablet/desktop.",
    );
  } finally {
    await browser.close();
    const db = new PrismaClient();
    const items = await db.executiveApplication.findMany({ where: { email } });
    await db.learningEvent.deleteMany({
      where: {
        subjectId: { in: items.map((x) => x.id) },
        action: "EXECUTIVE_APPLICATION_UPDATED",
      },
    });
    await db.executiveApplication.deleteMany({ where: { email } });
    await db.$disconnect();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
