const { chromium } = require("@playwright/test");
const fs = require("node:fs"),
  assert = require("node:assert/strict");
const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8"));
const run = JSON.parse(
  fs.readFileSync("work/validation/platform-api.json", "utf8"),
);
const base = "http://127.0.0.1:3300";
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const a = accounts.find((a) => a.role === "ADMIN");
  const login = await context.request.post(base + "/api/v1/auth/login", {
    headers: { Origin: base },
    data: { email: a.email, password: a.password },
  });
  assert.equal(login.status(), 201);
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/apprentissage");
  await page
    .getByRole("button", { name: "Contenus pédagogiques", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Contenus pédagogiques", exact: true })
    .waitFor();
  const buttons = page.locator(".studio-list nav button");
  await buttons.filter({ hasText: "nouvelle version" }).first().click();
  await page.getByLabel("Titre du cours", { exact: true }).waitFor();
  const title = await page
    .getByLabel("Titre du cours", { exact: true })
    .inputValue();
  await page
    .getByLabel("Titre du cours", { exact: true })
    .fill(title + " · contrôle écran");
  await page
    .getByRole("button", { name: "Enregistrer le brouillon", exact: true })
    .click();
  await page
    .getByText(
      "Brouillon enregistré. La validation pédagogique reste une étape distincte.",
      { exact: true },
    )
    .waitFor();
  await page.getByRole("button", { name: "Fichiers", exact: true }).click();
  await page
    .getByRole("heading", { name: "Contenus pédagogiques", exact: true })
    .waitFor();
  assert.equal(await page.locator(".studio-assets li").count(), 3);
  await page.screenshot({
    path: "work/validation/studio-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Validation", exact: true }).click();
  await page
    .getByText("Formateurs autorisés à préparer ce cours", { exact: true })
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "Débordement horizontal sur mobile",
  );
  await page.screenshot({
    path: "work/validation/studio-mobile.png",
    fullPage: true,
  });
  const learner = accounts.find((a) => a.email === "stagiaire@pilot.invalid");
  const lc = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  await lc.request.post(base + "/api/v1/auth/login", {
    headers: { Origin: base },
    data: { email: learner.email, password: learner.password },
  });
  const lp = await lc.newPage();
  lp.on("pageerror", (e) => errors.push(e.message));
  await lp.goto(base + "/apprentissage/releve/" + run.courses[0]);
  await lp.getByRole("heading", { name: "Résultats enregistrés" }).waitFor();
  await lp.getByText("Critères du module atteints", { exact: true }).waitFor();
  await lp.emulateMedia({ media: "print" });
  await lp.pdf({
    path: "work/validation/releve-recette.pdf",
    format: "A4",
    printBackground: true,
  });
  assert.equal(errors.length, 0, errors.join("\n"));
  const report = {
    status: "PASS",
    checks: [
      "Éditeur ouvert et brouillon modifié dans le navigateur",
      "Trois supports privés visibles par l'administrateur",
      "Circuit de validation visible",
      "Mobile 390 px sans débordement",
      "Relevé apprenant avec critères atteints",
      "Impression PDF produite",
      "Aucune exception JavaScript",
    ],
    checkedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    "work/validation/platform-ui.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
  await browser.close();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
