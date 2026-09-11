import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../apps/api/src/modules/auth/password";
const db = new PrismaClient();
async function main() {
  if (
    process.env.PILOT_SEED !== "true" ||
    !process.env.DATABASE_URL?.includes("beyond_pilot")
  )
    throw new Error(
      "Seed réservé à une base beyond_pilot avec PILOT_SEED=true.",
    );
  const data = JSON.parse(readFileSync("content/pilot/pilot.json", "utf8"));
  const credentials: any[] = [];
  for (const [email, name, code] of [
    ["admin@pilot.invalid", "Administration pilote", "ADMIN"],
    ["formateur@pilot.invalid", "Formateur pilote", "TRAINER"],
    ["stagiaire@pilot.invalid", "Stagiaire pilote", "LEARNER"],
    ["autre@pilot.invalid", "Autre stagiaire", "LEARNER"],
    ["autre-formateur@pilot.invalid", "Autre formateur", "TRAINER"],
  ]) {
    const role = await db.role.upsert({
      where: { code },
      create: { code, label: code },
      update: {},
    });
    if (!(await db.user.findUnique({ where: { email } }))) {
      const password = randomBytes(18).toString("base64url");
      const user = await db.user.create({
        data: {
          email,
          passwordHash: await hashPassword(password),
          profile: { create: { fullName: name } },
          roles: { create: { roleId: role.id } },
        },
      });
      credentials.push({ email, password, id: user.id, role: code });
    }
  }
  if (credentials.length) {
    mkdirSync(".pilot", { recursive: true });
    writeFileSync(".pilot/accounts.json", JSON.stringify(credentials, null, 2));
  }
  if (
    !(await db.course.findUnique({ where: { slug: "pilote-ventes-pandas" } }))
  ) {
    const course = await db.course.create({
      data: {
        slug: "pilote-ventes-pandas",
        title: data.title,
        summary: data.summary,
        brief: data.brief,
        resources: data.resources,
        estimatedMinutes: 120,
        isPublished: false,
      },
    });
    const module = await db.courseModule.create({
      data: { courseId: course.id, title: data.moduleTitle, sortOrder: 0 },
    });
    for (const [i, l] of data.lessons.entries())
      await db.lesson.create({
        data: {
          moduleId: module.id,
          title: l.title,
          slug: `lecon-${i + 1}`,
          type: "TEXT",
          sortOrder: i,
          durationMin: 10,
          content: { body: l.body },
        },
      });
    await db.lesson.create({
      data: {
        moduleId: module.id,
        title: "TP de synthèse",
        slug: "tp",
        type: "PDF",
        sortOrder: 6,
        durationMin: 40,
        content: { body: data.tp },
      },
    });
    const lesson = await db.lesson.create({
      data: {
        moduleId: module.id,
        title: "Quiz de validation",
        slug: "quiz",
        type: "QUIZ",
        sortOrder: 7,
        durationMin: 20,
      },
    });
    await db.quiz.create({
      data: {
        lessonId: lesson.id,
        title: "Vérifier mes acquis",
        passingScore: 70,
        questions: {
          create: data.questions.map((q: any, i: number) => ({
            prompt: q.prompt,
            explanation: q.explanation,
            sortOrder: i,
            answers: {
              create: q.options.map((label: string, index: number) => ({
                label,
                isCorrect: index === q.correct,
              })),
            },
          })),
        },
      },
    });
  }
  console.log(
    "Pilote chargé en brouillon. Comptes nouveaux conservés dans .pilot/accounts.json, fichier ignoré par Git. Aucune attribution automatique.",
  );
}
main().finally(() => db.$disconnect());
