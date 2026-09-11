const fs = require("node:fs");
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
async function main() {
  const url = new URL(process.env.DATABASE_URL || "postgresql://invalid/");
  if (
    process.env.LOCAL_CATALOGUE_IMPORT !== "true" ||
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    url.pathname !== "/beyond_pilot_elearning"
  )
    throw Error(
      "Import réservé à la nouvelle base locale beyond_pilot_elearning.",
    );
  const snapshot = JSON.parse(
    fs.readFileSync("data/official-catalogue.json", "utf8"),
  );
  if (
    snapshot.trainings.length !== 81 ||
    new Set(snapshot.trainings.map((t) => t.slug)).size !== 81
  )
    throw Error("Inventaire incomplet ou doublonné.");
  const levels = {
    Fondamental: "FOUNDATION",
    Intermédiaire: "INTERMEDIATE",
    Avancé: "ADVANCED",
    Expert: "EXPERT",
  };
  const formats = {
    Distanciel: "REMOTE",
    Hybride: "HYBRID",
    Présentiel: "ONSITE",
  };
  await db.$transaction(
    async (tx) => {
      for (const t of snapshot.trainings) {
        if (
          !levels[t.level] ||
          !formats[t.format] ||
          !t.title ||
          !t.objectives.length
        )
          throw Error(`Fiche invalide : ${t.slug}`);
        const categorySlug = t.category
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const category = await tx.category.upsert({
          where: { slug: categorySlug },
          create: { slug: categorySlug, name: t.category },
          update: {},
        });
        const data = {
          title: t.title,
          summary: t.summary,
          objectives: t.objectives,
          audience: t.audience,
          prerequisites: t.prerequisites,
          durationDays: t.durationDays,
          level: levels[t.level],
          format: formats[t.format],
          priceFromCents: null,
          isPublished: true,
          program: {
            kind: "official-catalogue",
            sourceUrl: t.sourceUrl,
            observedAt: t.observedAt,
            observedPrice: t.observedPrice,
            observedSessions: t.observedSessions,
            programStatus: "GENERIC_ON_SOURCE",
          },
        };
        const training = await tx.training.upsert({
          where: { slug: t.slug },
          create: { slug: t.slug, ...data },
          update: data,
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
      }
    },
    { timeout: 60000 },
  );
  console.log(
    "81 fiches officielles importées. Aucun compte, session commerciale ou cours complet inventé.",
  );
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
