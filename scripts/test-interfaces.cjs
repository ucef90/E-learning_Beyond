const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8"));
const base = "http://127.0.0.1:3200";
const checks = [];
let browser;
async function main() {
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  async function login(email) {
    const a = accounts.find((a) => a.email === email);
    await page.goto(base + "/connexion");
    await page.getByLabel("Adresse e-mail", { exact: true }).fill(a.email);
    await page.getByLabel("Mot de passe", { exact: true }).fill(a.password);
    await page
      .getByRole("button", { name: "Se connecter", exact: true })
      .click();
    await page.locator(".learning-topbar").waitFor();
  }
  async function pass(name, fn) {
    await fn();
    checks.push({ name, status: "PASS" });
    console.log("PASS", name);
  }
  await login("admin@pilot.invalid");
  await page
    .getByRole("button", { name: "Administration", exact: true })
    .click();
  await pass(
    "Création et édition d’un module depuis les formulaires administrateur",
    async () => {
      await page
        .getByRole("button", { name: "Créer un module", exact: true })
        .click();
      const editor = page.locator(".learning-editor");
      await editor
        .getByLabel("Titre du parcours", { exact: true })
        .fill("Module créé depuis l’interface");
      await editor
        .getByLabel("Présentation", { exact: true })
        .fill(
          "Vérification de la création et de l’attribution depuis les formulaires.",
        );
      await editor
        .getByLabel("Titre du module", { exact: true })
        .fill("Le module de recette interface");
      await editor
        .getByLabel("Titre de la leçon", { exact: true })
        .fill("Comprendre une ligne de vente");
      await editor
        .getByLabel("Contenu · Markdown accepté", { exact: true })
        .fill(
          "## Une vente\n\nUne ligne représente une vente. La quantité multipliée par le prix unitaire donne son montant. Expliquez cette relation sur un exemple de votre choix.",
        );
      await editor
        .getByRole("button", { name: "Sauvegarder le contenu", exact: true })
        .click();
      await page
        .getByRole("status")
        .filter({ hasText: "Contenu sauvegardé" })
        .waitFor();
    },
  );
  await pass("Attribution depuis le formulaire administrateur", async () => {
    const form = page.locator(".learning-admin-grid section").filter({
      has: page.getByRole("heading", {
        name: "3. Attribuer un module",
        exact: true,
      }),
    });
    await form
      .locator('select[name="courseId"]')
      .selectOption({ label: "Module créé depuis l’interface · v1" });
    await form
      .locator('select[name="userId"]')
      .selectOption(accounts.find((a) => a.email === "autre@pilot.invalid").id);
    await form
      .locator('select[name="trainerId"]')
      .selectOption(
        accounts.find((a) => a.email === "autre-formateur@pilot.invalid").id,
      );
    await form
      .getByLabel("Nom du groupe", { exact: true })
      .fill("Recette interface");
    await form
      .getByRole("button", { name: "Attribuer le module", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Module attribué" })
      .waitFor();
  });
  await page.screenshot({
    path: "../../outputs/validation-elearning/administration.png",
    fullPage: false,
  });
  await page
    .getByRole("button", { name: "Se déconnecter", exact: true })
    .click();
  await page.waitForURL("**/connexion");
  await login("formateur@pilot.invalid");
  await page
    .getByRole("button", { name: "Groupes et corrections", exact: true })
    .click();
  await pass(
    "Consultation et correction depuis l’espace formateur",
    async () => {
      await page.locator(".learning-group").first().click();
      await page
        .getByRole("button", { name: "Consulter et corriger", exact: true })
        .first()
        .click();
      await page.getByLabel("Note sur 100", { exact: true }).fill("88");
      await page
        .getByLabel("Correction et conseils")
        .fill(
          "Le nettoyage et la réconciliation sont justifiés. Pour progresser, distinguez le montant et le volume dans votre commentaire.",
        );
      await page
        .getByRole("button", { name: "Enregistrer la correction", exact: true })
        .click();
      await page
        .getByRole("status")
        .filter({ hasText: "Correction enregistrée" })
        .waitFor();
    },
  );
  await page.screenshot({
    path: "../../outputs/validation-elearning/formateur.png",
    fullPage: false,
  });
  await page
    .getByRole("button", { name: "Se déconnecter", exact: true })
    .click();
  await page.waitForURL("**/connexion");
  await login("stagiaire@pilot.invalid");
  await page
    .locator(".learning-course-card")
    .filter({ has: page.getByRole("heading", { name: /Pilote de recette/ }) })
    .first()
    .getByRole("button", { name: "Ouvrir mon module" })
    .click();
  await pass(
    "Consultation du feedback et du score dans le lecteur",
    async () => {
      await page
        .getByRole("button", { name: "Résultats et retours", exact: true })
        .click();
      await page.getByText("88/100", { exact: false }).waitFor();
      assert.ok(
        (await page.locator(".learning-content").innerText()).includes(
          "Pour progresser",
        ),
      );
    },
  );
  await page
    .getByRole("button", { name: "TP · Pratiquer sur les ventes", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Tout exécuter", exact: true })
    .waitFor();
  await pass(
    "Moteur isolé : DOM parent et réseau métier inaccessibles",
    async () => {
      const frame = page.frames().find((f) => f.url().endsWith("/lab.html"));
      assert.ok(frame);
      const test = await frame.evaluate(async () => {
        let parentBlocked = false;
        try {
          void parent.document.body;
        } catch {
          parentBlocked = true;
        }
        let networkBlocked = false;
        try {
          await fetch("http://127.0.0.1:3200/api/v1/auth/me", {
            credentials: "include",
          });
        } catch {
          networkBlocked = true;
        }
        return { parentBlocked, networkBlocked };
      });
      assert.deepEqual(test, { parentBlocked: true, networkBlocked: true });
    },
  );
  await pass("Remise du notebook depuis le lecteur", async () => {
    await page
      .getByLabel("Commentaire au formateur", { exact: true })
      .fill("Nouvelle remise de recette depuis le lecteur de cours.");
    await page
      .getByRole("button", { name: "Remettre mon travail", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Travail remis au formateur" })
      .waitFor();
  });
  await pass(
    "Import sans exécution puis exécution du notebook de départ",
    async () => {
      await page
        .locator("input[type=file]")
        .setInputFiles("content/pilot/depart.ipynb");
      await page
        .getByRole("status")
        .filter({ hasText: "Notebook importé sans exécution" })
        .waitFor();
      await page
        .getByRole("button", { name: "Tout exécuter", exact: true })
        .click();
      await page.locator(".notebook-result").waitFor({ timeout: 150000 });
      const result = await page.locator(".notebook-result").innerText();
      assert.ok(result.includes("Diagnostic à compléter"), result);
      assert.ok(!result.includes("Traceback"), result);
    },
  );
  await browser.close();
  browser = null;
}
main()
  .catch((e) => {
    console.error(e.stack);
    checks.push({ name: "Échec", status: "FAIL", error: e.stack });
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    fs.writeFileSync(
      "../../outputs/validation-elearning/recette-interfaces.json",
      JSON.stringify({ date: new Date().toISOString(), checks }, null, 2),
    );
  });
