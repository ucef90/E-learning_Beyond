const { PrismaClient } = require("@prisma/client");
const { createHash } = require("node:crypto");
const { courses } = require("../data/regulatory-courses.json");
const db = new PrismaClient();
async function main() {
  const url = new URL(process.env.DATABASE_URL || "postgresql://invalid/");
  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    url.port !== "55432" ||
    url.pathname !== "/beyond_pilot_elearning"
  )
    throw Error("Import réservé à la nouvelle base locale.");
  const result = await db.$transaction(
    async (tx) => {
      const category = await tx.category.upsert({
        where: { slug: "reglementation-donnees-ia" },
        create: {
          slug: "reglementation-donnees-ia",
          name: "Réglementation, données et IA",
        },
        update: {},
      });
      const out = [];
      for (const c of courses) {
        const digest = createHash("sha256")
          .update(JSON.stringify(c))
          .digest("hex");
        const slug = c.slug + "-parcours-v1";
        const existing = await tx.course.findUnique({ where: { slug } });
        if (existing && existing.resources?.contentDigest !== digest)
          throw Error(
            "Une version différente existe ; créer une nouvelle version sans écraser les acquis.",
          );
        const training = await tx.training.upsert({
          where: { slug: c.slug },
          create: {
            slug: c.slug,
            title: c.title,
            summary: c.summary,
            objectives: c.objectives,
            audience: c.audience,
            prerequisites: c.prerequisites,
            durationDays: 2,
            level: "FOUNDATION",
            format: "REMOTE",
            isPublished: true,
            program: {
              kind: "authored-regulatory",
              authoredAt: "2026-09-12",
              programStatus: "LOCAL_DETAILED_DRAFT",
              syllabus: c.syllabus,
            },
          },
          update: {},
        });
        await tx.trainingCategory.upsert({
          where: {
            trainingId_categoryId: {
              trainingId: training.id,
              categoryId: category.id,
            },
          },
          create: { trainingId: training.id, categoryId: category.id },
          update: {},
        });
        const course =
          existing ||
          (await tx.course.create({
            data: {
              slug,
              trainingId: training.id,
              title: c.title,
              summary: c.summary,
              isPublished: true,
              estimatedMinutes: 840,
              certificateEnabled: false,
              resources: { contentDigest: digest },
              brief: {
                Public: c.audience,
                Prérequis: c.prerequisites,
                Objectifs: c.objectives.join(" "),
                Durée:
                  "14 h avec ateliers et animation, hors pauses. Le temps de lecture seul ne prouve pas cette durée.",
                Évaluation:
                  "Quiz formatif de 20 questions à livre ouvert, seuil 70 %. Dossier et soutenance à évaluer séparément par le formateur.",
                Supports:
                  "/reglementation/" +
                  c.code +
                  "-support.md ; /reglementation/" +
                  c.code +
                  "-modeles.md",
                Statut:
                  "Rédaction assistée par IA ; validation du formateur requise avant animation. Aucune certification officielle délivrée.",
              },
              modules: {
                create: {
                  title: "Parcours réglementaire — 2 journées",
                  sortOrder: 0,
                  lessons: {
                    create: [
                      ...c.lessons.map((l, i) => ({
                        title: l.title,
                        slug: "lecon-" + (i + 1),
                        type: "TEXT",
                        sortOrder: i,
                        durationMin: l.durationMin,
                        content: { body: l.content },
                      })),
                      {
                        title: "Quiz formatif — 20 questions",
                        slug: "quiz",
                        type: "QUIZ",
                        sortOrder: 8,
                        durationMin: 20,
                        quiz: {
                          create: {
                            title: "Vérifier et comprendre mes acquis",
                            passingScore: 70,
                            questions: {
                              create: c.quiz.map((q, i) => ({
                                prompt: q.prompt,
                                explanation: q.explanation,
                                sortOrder: i,
                                answers: {
                                  create: q.options.map((label, j) => ({
                                    label,
                                    isCorrect: j === q.correct,
                                  })),
                                },
                              })),
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          }));
        // Only the existing synthetic demonstration users receive these new courses.
        const learner = await tx.user.findUnique({
          where: { email: "stagiaire@pilot.invalid" },
        });
        const trainer = await tx.user.findUnique({
          where: { email: "formateur@pilot.invalid" },
        });
        if (learner && trainer)
          await tx.learningEnrollment.upsert({
            where: {
              courseId_userId: { courseId: course.id, userId: learner.id },
            },
            create: {
              courseId: course.id,
              userId: learner.id,
              trainerId: trainer.id,
              groupName: "Découverte RGPD et AI Act — démonstration locale",
            },
            update: {},
          });
        out.push({ slug: c.slug, courseId: course.id, created: !existing });
      }
      return out;
    },
    { timeout: 60000 },
  );
  console.log(JSON.stringify(result));
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
