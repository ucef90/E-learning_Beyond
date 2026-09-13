const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = process.env.PLATFORM_API || "http://127.0.0.1:4300/api/v1";
assert(
  ["127.0.0.1", "localhost"].includes(new URL(base).hostname),
  "Recette locale uniquement",
);
const origin = "http://127.0.0.1:3300";
const accounts = JSON.parse(fs.readFileSync(".pilot/accounts.json", "utf8"));
const report = { startedAt: new Date().toISOString(), checks: [], courses: [] };
async function login(email) {
  const a =
    accounts.find((a) => a.email === email) ||
    accounts.find((a) => a.role === email);
  assert(a);
  const r = await fetch(base + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email: a.email, password: a.password }),
  });
  assert.equal(r.status, 201);
  return {
    cookie: r.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; "),
    user: await r.json(),
  };
}
async function call(session, url, method = "GET", data) {
  const r = await fetch(base + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(session ? { Cookie: session.cookie } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  const text = await r.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: r.status, body, headers: r.headers };
}
async function ok(session, url, method = "GET", data) {
  const r = await call(session, url, method, data);
  assert(r.status < 300, url + " " + r.status + " " + JSON.stringify(r.body));
  return r.body;
}
async function check(name, fn) {
  await fn();
  report.checks.push({ name, status: "PASS" });
  console.log("PASS", name);
}
const q = (passingScore) => ({
  title: "Évaluation " + passingScore,
  type: "QUIZ",
  body: "",
  durationMin: 10,
  quiz: {
    title: "Quiz au seuil " + passingScore,
    passingScore,
    questions: [
      {
        prompt: "Quelle démarche permet de vérifier un total ?",
        explanation:
          "On recalcule le total à partir des lignes détaillées pour le rapprocher de la valeur annoncée.",
        answers: [
          { label: "Recalculer les lignes et comparer", isCorrect: true },
          { label: "Copier le nombre affiché sans contrôle", isCorrect: false },
        ],
      },
      {
        prompt: "Comment traiter une valeur manquante ?",
        explanation:
          "Le traitement dépend de la signification métier ; une valeur inconnue ne vaut pas automatiquement zéro.",
        answers: [
          { label: "Examiner la signification métier", isCorrect: true },
          { label: "Toujours la remplacer par zéro", isCorrect: false },
        ],
      },
    ],
  },
});
const lesson = {
  title: "Contrôler les données",
  type: "TEXT",
  body: "On rapproche chaque résultat de ses données sources et on explique les écarts. Exercice : retrouvez pourquoi deux totaux diffèrent.",
  durationMin: 20,
};
const payload = {
  revision: 1,
  title: "Recette complète " + Date.now(),
  summary:
    "Cours synthétique de vérification de la plateforme, sans publication commerciale.",
  trainingId: "",
  brief: Object.fromEntries(
    [
      "objectifs",
      "public",
      "prerequis",
      "duree",
      "modalites",
      "evaluation",
      "assistance",
      "accessibilite",
      "acces",
    ].map((k) => [k, "Information pédagogique de recette : " + k]),
  ),
  modules: [
    { title: "Première étape", lessons: [lesson, q(50)] },
    {
      title: "Projet de synthèse",
      lessons: [
        { ...lesson, title: "Interpréter les écarts" },
        q(100),
        {
          title: "Dossier de synthèse",
          type: "PDF",
          body: "Expliquez vos calculs, les écarts observés et leurs limites dans un dossier écrit argumenté.",
          durationMin: 30,
        },
      ],
    },
  ],
  assessmentMode: "WRITTEN",
  assessmentScore: 80,
  rubric:
    "Diagnostic 40 points, méthode 40 points, limites et restitution 20 points.",
};
async function main() {
  const admin = await login("ADMIN"),
    learner = await login("stagiaire@pilot.invalid"),
    trainer = await login("formateur@pilot.invalid"),
    other = await login("autre@pilot.invalid"),
    otherTrainer = await login("autre-formateur@pilot.invalid");
  const me = await ok(learner, "/auth/me"),
    prof = await ok(trainer, "/auth/me");
  await check("Éditeur inaccessible aux visiteurs et stagiaires", async () => {
    assert.equal((await call(null, "/courses/authoring/list")).status, 401);
    assert.equal((await call(learner, "/courses/authoring/list")).status, 403);
    assert.equal(
      (await call(learner, "/courses/authoring", "POST", payload)).status,
      403,
    );
  });
  let id, course;
  await check("Création de deux modules, deux quiz et un dossier", async () => {
    const c = await ok(admin, "/courses/authoring", "POST", payload);
    id = c.id;
    report.courses.push(id);
    course = await ok(admin, "/courses/" + id + "/authoring");
    assert.equal(course.modules.length, 2);
    assert.equal(course.modules[1].lessons.length, 3);
  });
  const root = () => "/courses/" + id;
  await check("Validation des quiz : une seule bonne réponse", async () => {
    const bad = structuredClone(payload);
    bad.modules[0].lessons[1].quiz.questions[0].answers[1].isCorrect = true;
    assert.equal(
      (await call(admin, root() + "/authoring", "PUT", bad)).status,
      400,
    );
  });
  await check("Protection des modifications concurrentes", async () => {
    await ok(admin, root() + "/authoring", "PUT", payload);
    assert.equal(
      (await call(admin, root() + "/authoring", "PUT", payload)).status,
      409,
    );
    course = await ok(admin, root() + "/authoring");
  });
  await check("Formateur éditeur limité au cours confié", async () => {
    assert.equal((await call(trainer, root() + "/authoring")).status, 403);
    await ok(admin, root() + "/authoring/editors", "PUT", {
      revision: course.version,
      editorIds: [prof.id],
    });
    assert.equal((await ok(trainer, root() + "/authoring")).id, id);
    assert.equal((await call(otherTrainer, root() + "/authoring")).status, 403);
    course = await ok(admin, root() + "/authoring");
  });
  let staffAsset, reviewAsset, publicAsset;
  await check("Fichiers privés et contrôle des formats", async () => {
    for (const visibility of ["STAFF", "AFTER_REVIEW", "LEARNER"]) {
      course = await ok(admin, root() + "/authoring");
      const a = await ok(admin, root() + "/assets", "POST", {
        revision: course.version,
        title: "Support " + visibility,
        filename: "support.txt",
        base64: Buffer.from(
          "Exemple pédagogique original pour la recette.",
        ).toString("base64"),
        visibility,
      });
      if (visibility === "STAFF") staffAsset = a;
      if (visibility === "AFTER_REVIEW") reviewAsset = a;
      if (visibility === "LEARNER") publicAsset = a;
    }
    course = await ok(admin, root() + "/authoring");
    assert.equal(
      (
        await call(admin, root() + "/assets", "POST", {
          revision: course.version,
          title: "Faux PDF",
          filename: "faux.pdf",
          base64: Buffer.from("<script>alert(1)</script>").toString("base64"),
          visibility: "LEARNER",
        })
      ).status,
      400,
    );
  });
  await check(
    "Circuit de relecture avec décision humaine requise",
    async () => {
      assert.equal(
        (
          await call(admin, root() + "/authoring/review", "PUT", {
            revision: course.version,
            action: "APPROVE",
            note: "Essai hors du circuit de relecture",
          })
        ).status,
        409,
      );
      await ok(trainer, root() + "/authoring/review", "PUT", {
        revision: course.version,
        action: "SUBMIT",
        note: "Contenu synthétique prêt pour la vérification technique.",
      });
      course = await ok(admin, root() + "/authoring");
      assert.equal(
        (
          await call(trainer, root() + "/authoring/review", "PUT", {
            revision: course.version,
            action: "APPROVE",
            note: "Le formateur ne valide pas à la place du responsable.",
          })
        ).status,
        403,
      );
      await ok(admin, root() + "/authoring/review", "PUT", {
        revision: course.version,
        action: "APPROVE",
        note: "Validation technique de recette, aucune validation commerciale réelle.",
      });
      course = await ok(admin, root() + "/authoring");
      assert.equal(course.editorialStatus, "APPROVED");
      assert.equal(
        (
          await call(admin, root() + "/authoring/review", "PUT", {
            revision: course.version,
            action: "PUBLISH",
            note: "Publication refusée sans formation de rattachement.",
          })
        ).status,
        400,
      );
    },
  );
  await check("Attribution et conservation des versions", async () => {
    await ok(admin, root() + "/assign", "POST", {
      userId: me.id,
      trainerId: prof.id,
      groupName: "Recette administration",
    });
    course = await ok(admin, root() + "/authoring");
    assert.equal(
      (
        await call(admin, root() + "/authoring", "PUT", {
          ...payload,
          revision: course.version,
        })
      ).status,
      409,
    );
    assert.equal(
      (
        await call(admin, root() + "/assets/" + staffAsset.id, "DELETE", {
          revision: course.version,
        })
      ).status,
      409,
    );
    const copy = await ok(trainer, root() + "/clone", "POST", {});
    report.courses.push(copy.id);
    const c = await ok(trainer, "/courses/" + copy.id + "/authoring");
    assert.equal(c.assets.length, 3);
    assert.equal(c.editorialStatus, "DRAFT");
    assert.equal(c.reviewedAt, null);
  });
  await check("Questions visibles sans corrigés avant tentative", async () => {
    const c = await ok(learner, root());
    for (const q of c.modules
      .flatMap((m) => m.lessons)
      .flatMap((l) => (l.quiz ? l.quiz.questions : []))) {
      assert(!("explanation" in q));
      assert(q.answers.every((a) => !("isCorrect" in a)));
    }
    assert.equal((await call(other, root())).status, 403);
    assert.equal((await call(other, root() + "/assets")).status, 403);
    assert.equal(
      (await call(learner, root() + "/assets/" + staffAsset.id + "/download"))
        .status,
      404,
    );
    assert.equal(
      (await call(learner, root() + "/assets/" + reviewAsset.id + "/download"))
        .status,
      404,
    );
    assert.equal(
      (await call(learner, root() + "/assets/" + publicAsset.id + "/download"))
        .status,
      200,
    );
  });
  await check("Positionnement sauvegardé et isolé", async () => {
    await ok(learner, root() + "/positioning", "PUT", {
      goals: "Réconcilier les indicateurs du projet.",
      experience: "Bases du tableur.",
      equipment: "Ordinateur avec navigateur récent.",
      support: "Un point pédagogique en début de parcours.",
    });
    assert(
      (
        await ok(trainer, root() + "/learners/" + me.id + "/state")
      ).access.positioning.goals.includes("Réconcilier"),
    );
    assert.equal(
      (await call(other, root() + "/learners/" + me.id + "/state")).status,
      403,
    );
  });
  await check("Tous les quiz et leurs seuils propres sont requis", async () => {
    const c = await ok(admin, root());
    const lessons = c.modules.flatMap((m) => m.lessons),
      quizzes = lessons.flatMap((l) => (l.quiz ? [l.quiz] : []));
    for (const l of lessons.filter((l) => l.type === "TEXT"))
      await ok(learner, root() + "/lessons/" + l.id + "/progress", "PUT", {
        completed: true,
      });
    const answers = (q, right) =>
      q.questions.map(
        (x, i) => x.answers.find((a) => a.isCorrect === i < right).id,
      );
    await ok(
      learner,
      root() + "/quizzes/" + quizzes[0].id + "/attempts",
      "POST",
      { answers: answers(quizzes[0], 1) },
    );
    let s = await ok(learner, root() + "/state");
    assert.equal(s.completion.quizzesPassed, false);
    await ok(
      learner,
      root() + "/quizzes/" + quizzes[1].id + "/attempts",
      "POST",
      { answers: answers(quizzes[1], 2) },
    );
    s = await ok(learner, root() + "/state");
    assert.equal(s.completion.quizzesPassed, true);
    assert.equal(s.completion.completed, false);
  });
  let submission;
  await check("Dossier écrit et seuil formateur propres au cours", async () => {
    submission = await ok(learner, root() + "/written-submissions", "POST", {
      writtenWork:
        "Je recalcule chaque montant par produit, rapproche les totaux et documente les écarts avant toute interprétation du résultat.",
      comment: "Dossier synthétique de recette.",
    });
    assert.equal(
      (await call(otherTrainer, root() + "/submissions/" + submission.id))
        .status,
      403,
    );
    assert.equal(
      (
        await call(
          learner,
          root() + "/submissions/" + submission.id + "/review",
          "PUT",
          { grade: 100, feedback: "Auto-correction interdite par le serveur." },
        )
      ).status,
      403,
    );
    await ok(
      trainer,
      root() + "/submissions/" + submission.id + "/review",
      "PUT",
      {
        grade: 75,
        feedback: "Bonne méthode mais une justification reste à compléter.",
      },
    );
    assert.equal(
      (await ok(learner, root() + "/state")).completion.completed,
      false,
    );
    await ok(
      trainer,
      root() + "/submissions/" + submission.id + "/review",
      "PUT",
      {
        grade: 85,
        feedback: "La démarche et les limites répondent à la grille du cours.",
      },
    );
    assert.equal(
      (await ok(learner, root() + "/state")).completion.completed,
      true,
    );
    assert.equal(
      (await call(learner, root() + "/assets/" + reviewAsset.id + "/download"))
        .status,
      200,
    );
  });
  await check(
    "Expiration et révocation bloquent lecture, fichiers et écritures",
    async () => {
      for (const configuration of [
        { status: "ACTIVE", expiresAt: "2020-01-01T00:00:00.000Z" },
        { status: "REVOKED", expiresAt: null },
      ]) {
        await ok(admin, root() + "/learners/" + me.id + "/access", "PUT", {
          ...configuration,
          reason: "Test d'interruption des droits d'accès.",
        });
        for (const u of [
          root(),
          root() + "/state",
          root() + "/assets",
          root() + "/assets/" + publicAsset.id + "/download",
        ])
          assert.equal((await call(learner, u)).status, 403, u);
        assert.equal(
          (
            await call(learner, root() + "/written-submissions", "POST", {
              writtenWork:
                "Tentative de nouvelle remise sans accès actif au cours.",
              comment: "",
            })
          ).status,
          403,
        );
        const d = await ok(learner, "/courses/dashboard");
        assert(!d.courses.some((c) => c.id === id));
        assert.equal(
          (await ok(trainer, root() + "/learners/" + me.id + "/state"))
            .submissions.length,
          1,
        );
      }
    },
  );
  await check(
    "Réactivation conserve travaux, positionnement et progression",
    async () => {
      await ok(admin, root() + "/learners/" + me.id + "/access", "PUT", {
        status: "ACTIVE",
        expiresAt: null,
        reason: "Fin de la vérification des droits.",
      });
      const fresh = await login("stagiaire@pilot.invalid");
      const s = await ok(fresh, root() + "/state");
      assert.equal(s.completion.completed, true);
      assert(s.access.positioning);
      assert.equal(s.progress.length, 2);
      const exp = await ok(fresh, root() + "/learners/" + me.id + "/export");
      assert.equal(exp.completed, true);
      assert.equal(exp.course.resources, undefined);
    },
  );
  report.status = "PASS";
  report.finishedAt = new Date().toISOString();
  fs.mkdirSync("work/validation", { recursive: true });
  fs.writeFileSync(
    "work/validation/platform-api.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify({
      status: report.status,
      checks: report.checks.length,
      courses: report.courses,
    }),
  );
}
main().catch((e) => {
  report.status = "FAIL";
  report.error = e.message;
  fs.mkdirSync("work/validation", { recursive: true });
  fs.writeFileSync(
    "work/validation/platform-api.json",
    JSON.stringify(report, null, 2),
  );
  console.error(e);
  process.exitCode = 1;
});
