/** Import the two original courses from a private bundle; never overwrite existing content. */
const fs = require("node:fs"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
const expected = [
  "pmp-preparation-projets-valeur-2026",
  "data-fullstack-python-sql-machine-learning",
];
const digest = (value) =>
  crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const pick = (o, keys) =>
  Object.fromEntries(
    keys
      .split(" ")
      .filter((k) => o[k] !== undefined)
      .map((k) => [k, o[k]]),
  );
async function main() {
  const sourcePath = process.argv[2],
    expectedDatabase = process.argv[3];
  assert(
    sourcePath && expectedDatabase,
    "Usage: node scripts/import-professional-courses.cjs PRIVATE_BUNDLE EXPECTED_DATABASE",
  );
  const url = new URL(process.env.DATABASE_URL);
  assert.equal(
    decodeURIComponent(url.pathname.slice(1)),
    expectedDatabase,
    "Database target mismatch",
  );
  assert(
    /^(beyond_platform_work|beyond_expertise|beyond_professional_stage_[a-f0-9]{7})$/.test(
      expectedDatabase,
    ),
    "Unexpected database",
  );
  assert(
    ["127.0.0.1", "localhost", "beyond-db"].includes(url.hostname),
    "Unexpected database host",
  );
  const source = JSON.parse(
    fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, ""),
  );
  const publicData = require("../content/professional/programmes.json");
  assert.equal(source.version, 1);
  assert.equal(source.courses.length, 2);
  assert.deepEqual(
    source.trainings.map((t) => t.slug),
    expected,
  );
  for (const [i, t] of source.trainings.entries()) {
    const { category, observedPrice, ...published } =
      publicData.programmes[i].training;
    assert.deepEqual(
      t,
      published,
      "Private bundle does not match the reviewed public syllabus",
    );
  }
  const result = await db.$transaction(
    async (tx) => {
      const ids = new Map(),
        created = [];
      for (const t of source.trainings) {
        const hash = digest(t);
        let training = await tx.training.findUnique({
          where: { slug: t.slug },
        });
        if (training) {
          assert.equal(
            training.program?.deploymentContentDigest,
            hash,
            "Training already differs; refusing overwrite",
          );
        } else {
          training = await tx.training.create({
            data: {
              ...pick(
                t,
                "slug title summary description objectives audience prerequisites durationDays level format priceFromCents isPublished",
              ),
              program: { ...t.program, deploymentContentDigest: hash },
            },
          });
          for (const { category: c } of t.categories) {
            const category = await tx.category.upsert({
              where: { slug: c.slug },
              create: c,
              update: {},
            });
            await tx.trainingCategory.create({
              data: { trainingId: training.id, categoryId: category.id },
            });
          }
        }
        ids.set(t.slug, training.id);
      }
      for (const c of source.courses) {
        assert.equal(c.resources.contentScope, "ORIGINAL_AUTHORED_COURSE");
        assert(ids.has(c.training.slug));
        assert.equal(c.modules.length, 20);
        assert.equal(
          c.modules
            .flatMap((m) => m.lessons)
            .reduce((s, l) => s + l.durationMin, 0),
          c.estimatedMinutes,
        );
        const hash = digest(c);
        let course = await tx.course.findUnique({ where: { slug: c.slug } });
        if (course) {
          assert.equal(
            course.resources?.deploymentContentDigest,
            hash,
            "Course already differs; refusing overwrite",
          );
        } else {
          const modules = c.modules.map((m) => ({
            title: m.title,
            sortOrder: m.sortOrder,
            lessons: {
              create: m.lessons.map((l) => {
                assert(
                  l.durationMin >= 1 && l.durationMin <= 240,
                  "Lesson duration exceeds authoring limits",
                );
                const lesson = pick(
                  l,
                  "title slug type content videoUrl durationMin sortOrder",
                );
                if (l.quiz) {
                  assert.equal(l.quiz.questions.length, 2);
                  for (const q of l.quiz.questions) {
                    assert.equal(
                      q.answers.filter((a) => a.isCorrect).length,
                      1,
                    );
                    assert(q.explanation);
                  }
                  lesson.quiz = {
                    create: {
                      title: l.quiz.title,
                      passingScore: l.quiz.passingScore,
                      questions: {
                        create: l.quiz.questions.map((q) => ({
                          ...pick(q, "prompt explanation sortOrder"),
                          answers: { create: q.answers },
                        })),
                      },
                    },
                  };
                }
                return lesson;
              }),
            },
          }));
          const assets = c.assets.map((a) => {
            assert(["LEARNER", "AFTER_REVIEW"].includes(a.visibility));
            const content = Buffer.from(a.content, "base64");
            assert.equal(content.length, a.size);
            assert.equal(
              crypto.createHash("sha256").update(content).digest("hex"),
              a.sha256,
            );
            assert(!/[\\/]/.test(a.filename));
            return {
              ...pick(a, "title filename mimeType visibility size sha256"),
              content,
            };
          });
          course = await tx.course.create({
            data: {
              ...pick(c, "slug title summary estimatedMinutes brief"),
              trainingId: ids.get(c.training.slug),
              isPublished: false,
              editorialStatus: "DRAFT",
              certificateEnabled: false,
              editorIds: [],
              resources: { ...c.resources, deploymentContentDigest: hash },
              modules: { create: modules },
              assets: { create: assets },
            },
          });
          created.push(course.id);
        }
      }
      return {
        database: expectedDatabase,
        trainings: await tx.training.count(),
        newCourseIds: created,
        privateCourses: 2,
        modules: 40,
        lessons: 160,
        quizQuestions: 80,
      };
    },
    { timeout: 60000 },
  );
  console.log(JSON.stringify({ ...result, result: "PASS" }));
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
