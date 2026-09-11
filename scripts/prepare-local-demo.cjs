const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
async function main() {
  const url = new URL(process.env.DATABASE_URL || "postgresql://invalid/");
  if (
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    url.pathname !== "/beyond_pilot_elearning"
  )
    throw Error("Base de démonstration locale requise.");
  const training = await db.training.findUniqueOrThrow({
    where: { slug: "python-pour-data-analyst" },
  });
  const course = await db.course.update({
    where: { slug: "pilote-ventes-pandas" },
    data: { trainingId: training.id, isPublished: true },
  });
  const learner = await db.user.findUniqueOrThrow({
    where: { email: "stagiaire@pilot.invalid" },
  });
  const trainer = await db.user.findUniqueOrThrow({
    where: { email: "formateur@pilot.invalid" },
  });
  await db.learningEnrollment.upsert({
    where: { courseId_userId: { courseId: course.id, userId: learner.id } },
    create: {
      courseId: course.id,
      userId: learner.id,
      trainerId: trainer.id,
      groupName: "Validation pédagogique locale",
    },
    update: {},
  });
  console.log(
    "Module pilote rattaché à Python pour Data Analyst et attribué au compte stagiaire local.",
  );
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
