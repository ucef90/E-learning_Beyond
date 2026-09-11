const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { request, chromium } = require("@playwright/test");
const base = process.env.PILOT_BASE_URL || "http://127.0.0.1:3200";
const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8"));
const bundle = JSON.parse(fs.readFileSync("content/pilot/pilot.json", "utf8"));
const report = {
  startedAt: new Date().toISOString(),
  base,
  checks: [],
  environment: {},
  screenshot: [],
};
const reportDir = path.resolve("../../outputs/validation-elearning");
fs.mkdirSync(reportDir, { recursive: true });
let browser;
function check(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      report.checks.push({ name, status: "PASS" });
      console.log("PASS", name);
    });
}
async function main() {
  const adminAccount = accounts.find((a) => a.role === "ADMIN"),
    learnerAccount = accounts.find(
      (a) => a.email === "stagiaire@pilot.invalid",
    ),
    otherAccount = accounts.find((a) => a.email === "autre@pilot.invalid"),
    trainerAccount = accounts.find(
      (a) => a.email === "formateur@pilot.invalid",
    ),
    otherTrainerAccount = accounts.find(
      (a) => a.email === "autre-formateur@pilot.invalid",
    );
  async function session(a) {
    const c = await request.newContext({
      baseURL: base,
      extraHTTPHeaders: { Origin: base },
    });
    const r = await c.post("/api/v1/auth/login", {
      data: { email: a.email, password: a.password },
    });
    assert.equal(r.status(), 201, await r.text());
    return c;
  }
  async function ok(c, url, method = "get", data) {
    const r = await c[method](
      "/api/v1" + url,
      data === undefined ? {} : { data },
    );
    assert.ok(r.ok(), `${method} ${url} ${r.status()} ${await r.text()}`);
    return r.json();
  }
  const guest = await request.newContext({
    baseURL: base,
    extraHTTPHeaders: { Origin: base },
  });
  await check("Mot de passe erroné refusé", async () => {
    const r = await guest.post("/api/v1/auth/login", {
      data: { email: learnerAccount.email, password: "incorrect-password" },
    });
    assert.equal(r.status(), 401);
  });
  await check("Accès anonyme et anciens accès démo refusés", async () => {
    for (const u of [
      "/courses/me",
      "/users/me",
      "/contacts",
      "/quotes",
      "/enrollments",
      "/admin/commercial/overview",
    ])
      assert.equal(
        (
          await guest.get("/api/v1" + u, {
            headers: { Authorization: "Bearer demo-user" },
          })
        ).status(),
        401,
      );
  });
  const admin = await session(adminAccount),
    learner = await session(learnerAccount),
    other = await session(otherAccount),
    trainer = await session(trainerAccount),
    otherTrainer = await session(otherTrainerAccount);
  await check(
    "Connexion réelle, cookie HttpOnly et absence de jeton exposé",
    async () => {
      const cookies = (await admin.storageState()).cookies;
      const cookie = cookies.find((c) => c.name === "be_elearning_session");
      assert.ok(cookie.httpOnly);
      assert.equal(cookie.sameSite, "Strict");
      const me = await ok(learner, "/auth/me");
      assert.equal(me.id, learnerAccount.id);
    },
  );
  const original = (await ok(admin, "/courses/me")).find(
    (c) => c.title === bundle.title,
  );
  let course;
  await check("Création d’un module avec une leçon", async () => {
    const created = await ok(admin, "/courses", "post", {
      title: "Module créé pendant la recette",
      summary: "Module de contrôle de la création via formulaire.",
      moduleTitle: "Premiers pas",
      brief: { objectifs: "Vérifier la création" },
      lessons: [
        {
          title: "Leçon de contrôle",
          body: "Une explication pédagogique suffisamment détaillée pour le contrôle de création.",
          durationMin: 10,
        },
      ],
    });
    assert.ok(created.id);
  });
  await check(
    "Duplication et édition du module complet avant attribution",
    async () => {
      course = await ok(admin, `/courses/${original.id}/clone`, "post", {});
      const updated = {
        title: "Pilote de recette " + new Date().toISOString().slice(0, 19),
        summary: bundle.summary,
        moduleTitle: bundle.moduleTitle,
        brief: bundle.brief,
        lessons: bundle.lessons,
      };
      await ok(admin, `/courses/${course.id}`, "put", updated);
      course = await ok(admin, `/courses/${course.id}`);
      assert.equal(course.modules[0].lessons.length, 8);
    },
  );
  await check(
    "Attribution nominative et séparation des formateurs",
    async () => {
      await ok(admin, `/courses/${course.id}/assign`, "post", {
        userId: learnerAccount.id,
        trainerId: trainerAccount.id,
        groupName: "Pilote A",
      });
      await ok(admin, `/courses/${course.id}/assign`, "post", {
        userId: otherAccount.id,
        trainerId: otherTrainerAccount.id,
        groupName: "Pilote B",
      });
      const groups = await ok(trainer, "/courses/groups");
      assert.ok(groups.some((g) => g.userId === learnerAccount.id));
      assert.ok(!groups.some((g) => g.userId === otherAccount.id));
    },
  );
  await check("Modification d’une version déjà attribuée refusée", async () => {
    const r = await admin.put(`/api/v1/courses/${course.id}`, {
      data: {
        title: course.title,
        summary: bundle.summary,
        moduleTitle: bundle.moduleTitle,
        brief: bundle.brief,
        lessons: bundle.lessons,
      },
    });
    assert.equal(r.status(), 409);
  });
  await check(
    "Droits serveur : pas de création par un stagiaire ni de liste des comptes",
    async () => {
      assert.equal(
        (await learner.get("/api/v1/courses/admin/users")).status(),
        403,
      );
      assert.equal(
        (
          await learner.post(`/api/v1/courses/${course.id}/clone`, { data: {} })
        ).status(),
        403,
      );
    },
  );
  let visible = await ok(learner, `/courses/${course.id}`);
  await check(
    "Cours consultable, réponses et corrigé réservés non divulgués",
    async () => {
      assert.ok(visible.modules[0].lessons[0].content.body.length > 1000);
      const text = JSON.stringify(visible);
      assert.ok(!text.includes("isCorrect"));
      assert.ok(!text.includes("solution_code"));
      assert.equal(
        (
          await learner.get(`/api/v1/courses/${course.id}/resources/solution`)
        ).status(),
        403,
      );
    },
  );
  await check(
    "Progression sauvegardée et reprise après déconnexion",
    async () => {
      const lesson = visible.modules[0].lessons[0];
      await ok(
        learner,
        `/courses/${course.id}/lessons/${lesson.id}/progress`,
        "put",
        { completed: true },
      );
      const cookie = (await learner.storageState()).cookies.find(
        (c) => c.name === "be_elearning_session",
      );
      await ok(learner, "/auth/logout", "post", {});
      assert.equal(
        (
          await learner.get("/api/v1/auth/me", {
            headers: { Cookie: `be_elearning_session=${cookie.value}` },
          })
        ).status(),
        401,
      );
      await learner.post("/api/v1/auth/login", {
        data: {
          email: learnerAccount.email,
          password: learnerAccount.password,
        },
      });
      const s = await ok(learner, `/courses/${course.id}/state`);
      assert.ok(s.progress.find((p) => p.lessonId === lesson.id).completed);
    },
  );
  await check(
    "IDOR : dossiers, exports et modifications interstagiaires refusés",
    async () => {
      for (const suffix of ["state", "export"]) {
        assert.equal(
          (
            await learner.get(
              `/api/v1/courses/${course.id}/learners/${otherAccount.id}/${suffix}`,
            )
          ).status(),
          403,
        );
        assert.equal(
          (
            await trainer.get(
              `/api/v1/courses/${course.id}/learners/${otherAccount.id}/${suffix}`,
            )
          ).status(),
          403,
        );
      }
      const l = visible.modules[0].lessons[0];
      assert.equal(
        (
          await learner.put(
            `/api/v1/courses/${course.id}/lessons/${l.id}/progress`,
            { data: { completed: true, userId: otherAccount.id } },
          )
        ).status(),
        400,
      );
    },
  );
  await check(
    "Origine étrangère refusée sur les mutations authentifiées",
    async () => {
      assert.equal(
        (
          await learner.post("/api/v1/auth/logout", {
            headers: { Origin: "https://example.org" },
            data: {},
          })
        ).status(),
        403,
      );
    },
  );
  await check(
    "Notebook et CSV protégés et accessibles aux inscrits",
    async () => {
      assert.equal(
        (
          await guest.get(`/api/v1/courses/${course.id}/resources/starter`)
        ).status(),
        401,
      );
      const csv = await ok(learner, `/courses/${course.id}/resources/csv`);
      assert.equal(csv.content.split("\n").filter(Boolean).length, 39);
    },
  );
  await check(
    "Sauvegarde notebook persistante et conflit entre appareils détecté",
    async () => {
      const d = await ok(learner, `/courses/${course.id}/notebook`, "put", {
        notebook: bundle.resources.starter,
        revision: 0,
      });
      assert.equal(d.revision, 1);
      await ok(learner, `/courses/${course.id}/notebook`, "put", {
        notebook: bundle.resources.solution,
        revision: 1,
      });
      assert.equal(
        (
          await learner.put(`/api/v1/courses/${course.id}/notebook`, {
            data: { notebook: bundle.resources.starter, revision: 1 },
          })
        ).status(),
        409,
      );
      const s = await ok(learner, `/courses/${course.id}/state`);
      assert.equal(s.draft.revision, 2);
    },
  );
  let submission;
  await check("Remise persistante et accès aux travaux contrôlé", async () => {
    submission = await ok(
      learner,
      `/courses/${course.id}/submissions`,
      "post",
      {
        notebook: bundle.resources.solution,
        comment: "Diagnostic, nettoyage et comparaison des produits.",
      },
    );
    assert.equal(
      (
        await other.get(
          `/api/v1/courses/${course.id}/submissions/${submission.id}`,
        )
      ).status(),
      403,
    );
    assert.equal(
      (
        await otherTrainer.get(
          `/api/v1/courses/${course.id}/submissions/${submission.id}`,
        )
      ).status(),
      403,
    );
    assert.equal(
      (
        await learner.put(
          `/api/v1/courses/${course.id}/submissions/${submission.id}/review`,
          { data: { grade: 100, feedback: "Auto-évaluation interdite" } },
        )
      ).status(),
      403,
    );
  });
  await check(
    "Correction formateur visible par le stagiaire et corrigé débloqué",
    async () => {
      await ok(
        trainer,
        `/courses/${course.id}/submissions/${submission.id}/review`,
        "put",
        {
          grade: 85,
          feedback:
            "Diagnostic clair et calculs cohérents. Précisez davantage l’impact des trois rejets sur la comparaison des produits.",
        },
      );
      const s = await ok(learner, `/courses/${course.id}/state`);
      assert.equal(s.submissions[0].grade, 85);
      assert.ok(s.submissions[0].feedback.includes("rejets"));
      assert.ok(
        (await ok(learner, `/courses/${course.id}/resources/solution`)).cells
          .length,
      );
    },
  );
  await check(
    "Quiz réellement évalué sur le serveur et feedback conservé",
    async () => {
      const q = course.modules[0].lessons.find((l) => l.quiz).quiz;
      const answers = q.questions.map(
        (q) => q.answers.find((a) => a.isCorrect).id,
      );
      const r = await ok(
        learner,
        `/courses/${course.id}/quizzes/${q.id}/attempts`,
        "post",
        { answers },
      );
      assert.equal(r.score, 100);
      assert.equal(r.feedback.length, 10);
      assert.ok(r.feedback.every((f) => f.explanation.length > 20));
      const bad = await learner.post(
        `/api/v1/courses/${course.id}/quizzes/${q.id}/attempts`,
        { data: { answers, score: 100 } },
      );
      assert.equal(bad.status(), 400);
    },
  );
  await check(
    "Export des preuves datées, statut et limites explicites",
    async () => {
      const r = await ok(
        trainer,
        `/courses/${course.id}/learners/${learnerAccount.id}/export`,
      );
      assert.ok(r.events.some((e) => e.action === "WORK_REVIEWED"));
      assert.equal(
        r.certification,
        "Aucune certification professionnelle délivrée",
      );
      assert.equal(r.completed, false);
    },
  );
  await check(
    "Invitation et récupération par lien unique, révocation des anciens liens",
    async () => {
      const r = await ok(admin, "/courses/admin/users", "post", {
        email: `recovery-${Date.now()}@pilot.invalid`,
        fullName: "Compte récupération recette",
        role: "LEARNER",
      });
      const token = r.url.split("#")[1];
      const reset = await guest.post("/api/v1/auth/reset", {
        data: { token, password: "Mot-de-passe-recette-2026!" },
      });
      assert.equal(reset.status(), 201);
      assert.equal(
        (
          await guest.post("/api/v1/auth/reset", {
            data: { token, password: "Mot-de-passe-recette-2026!" },
          })
        ).status(),
        400,
      );
    },
  );
  // Attach the original pilot for the user's review; keep the recipe artifacts separate.
  await ok(admin, `/courses/${original.id}/assign`, "post", {
    userId: learnerAccount.id,
    trainerId: trainerAccount.id,
    groupName: "Démonstration du pilote",
  });
  const cookie = await guest.get("/connexion");
  assert.equal(
    cookie.headers()["x-robots-tag"],
    "noindex, nofollow, noarchive",
  );
  if (process.env.PILOT_API_ONLY === "true") {
    await check("81 fiches sourcées, programme générique retiré et un seul module pilote", async () => {
      const catalogue = await ok(guest, "/trainings");
      assert.equal(catalogue.length, 81);
      assert.equal(new Set(catalogue.map(t=>t.slug)).size, 81);
      assert.equal(catalogue.reduce((n,t)=>n+t.courses.length,0),1);
      for(const t of catalogue){assert.ok(t.objectives.length);assert.ok(t.program.sourceUrl.startsWith("https://beyond-expertise.com/formations/"));}
    });
    await check("Atelier guidé protégé, disponible et distinct du TP", async () => {
      const practice = await ok(learner, `/courses/${original.id}/resources/practice`);
      assert.equal(practice.cells.length,26);
      assert.ok(JSON.stringify(practice).includes("Carnet"));
      assert.ok(!JSON.stringify(practice).includes("7945"));
      assert.equal((await guest.get(`/api/v1/courses/${original.id}/resources/practice`)).status(),401);
      assert.equal((await otherTrainer.get(`/api/v1/courses/${original.id}/resources/practice`)).status(),403);
      const detail=await ok(learner,`/courses/${original.id}`);
      assert.ok(detail.resources.hasPractice);
      assert.ok(detail.modules[0].lessons.filter(l=>l.type==="TEXT").every(l=>l.content.body.split(/\s+/).length>450));
    });
    for(const c of [admin,learner,other,trainer,otherTrainer,guest]) await c.dispose();
    report.completedAt=new Date().toISOString(); report.result="PASS"; report.scope="API uniquement ; navigateur vérifié séparément avec CUA";
    return;
  }
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await check("Connexion et consultation dans Chrome", async () => {
    await page.goto(base + "/connexion");
    await page
      .getByLabel("Adresse e-mail", { exact: true })
      .fill(learnerAccount.email);
    await page
      .getByLabel("Mot de passe", { exact: true })
      .fill(learnerAccount.password);
    await page
      .getByRole("button", { name: "Se connecter", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Votre prochain pas commence ici." })
      .waitFor();
    const card = page.locator(".learning-course-card").filter({
      has: page.getByRole("heading", { name: course.title, exact: true }),
    });
    await card.getByRole("button", { name: "Ouvrir mon module" }).click();
    await page.locator(".lesson-prose").waitFor();
    assert.ok(await page.locator(".lesson-prose").innerText());
  });
  const desktop = path.join(reportDir, "lecteur-desktop.png");
  await page.screenshot({ path: desktop, fullPage: false });
  report.screenshot.push(desktop);
  await check(
    "Laboratoire réel : Python, pandas, matplotlib et graphique",
    async () => {
      await page
        .getByRole("button", { name: "TP · Pratiquer sur les ventes" })
        .click();
      await page
        .getByRole("button", { name: "Tout exécuter", exact: true })
        .waitFor();
      await page
        .getByRole("button", { name: "Tout exécuter", exact: true })
        .click();
      await page
        .getByRole("heading", { name: "Résultat de l’exécution" })
        .waitFor({ timeout: 150000 });
      const text = await page.locator(".notebook-result").innerText();
      assert.ok(
        text.includes("Contrôles de cohérence réussis."),
        text.slice(-2000),
      );
      assert.equal(await page.locator(".notebook-result img").count(), 1);
      report.environment.pyodide = text
        .split("Environnement utilisé :")[1]
        ?.trim();
      await page
        .getByRole("button", { name: "Sauvegarder sur le serveur" })
        .click();
      await page
        .getByRole("status")
        .filter({ hasText: "Sauvegardé sur le serveur" })
        .waitFor();
    },
  );
  await check(
    "Isolation du laboratoire vis-à-vis des cookies et du DOM",
    async () => {
      const result = await page
        .locator('iframe[title="Moteur Python isolé"]')
        .evaluate((el) => {
          return el.getAttribute("sandbox");
        });
      assert.equal(result, "allow-scripts allow-same-origin");
      const frame = page.frames().find((f) => f.url().endsWith("/lab.html"));
      const blocked = await frame.evaluate(() => {
        try {
          void parent.document.body;
          return false;
        } catch {
          return true;
        }
      });
      assert.equal(blocked, true);
    },
  );
  const notebookShot = path.join(reportDir, "notebook-resultat.png");
  await page.locator(".notebook-result").screenshot({ path: notebookShot });
  report.screenshot.push(notebookShot);
  await check("Export .ipynb depuis le navigateur", async () => {
    const d = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Exporter .ipynb", exact: true })
      .click();
    const file = await d;
    assert.equal(file.suggestedFilename(), "mon-travail.ipynb");
  });
  await check("Vue mobile 390 px sans débordement horizontal", async () => {
    await page
      .getByRole("button", { name: "Fiche et objectifs", exact: true })
      .click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      true,
    );
    await page.screenshot({
      path: path.join(reportDir, "lecteur-mobile.png"),
      fullPage: true,
    });
  });
  await check("Navigation clavier, labels et focus visible", async () => {
    await page.goto(base + "/connexion");
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent.trim()),
      "Aller au contenu",
    );
    await page.getByLabel("Adresse e-mail", { exact: true }).focus();
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.getAttribute("name")),
      "password",
    );
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent.trim()),
      "Se connecter",
    );
    assert.notEqual(
      await page.evaluate(
        () => getComputedStyle(document.activeElement).outlineStyle,
      ),
      "none",
    );
  });
  await check(
    "Aucune exception JavaScript sur le parcours navigateur",
    async () => {
      assert.deepEqual(errors, []);
    },
  );
  await context.close();
  await browser.close();
  browser = null;
  for (const c of [admin, learner, other, trainer, otherTrainer, guest])
    await c.dispose();
  report.completedAt = new Date().toISOString();
  report.result = "PASS";
}
main()
  .catch((e) => {
    report.result = "FAIL";
    report.error = e.stack;
    console.error(e.stack);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    fs.writeFileSync(
      path.join(reportDir, "recette-pilote.json"),
      JSON.stringify(report, null, 2),
    );
  });
