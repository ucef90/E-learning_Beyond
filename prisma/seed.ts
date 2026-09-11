import { PrismaClient, TrainingFormatCode, TrainingLevelCode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const learnerRole = await prisma.role.upsert({
    where: { code: "LEARNER" },
    update: {},
    create: { code: "LEARNER", label: "Apprenant" }
  });

  const company = await prisma.company.upsert({
    where: { slug: "beyond-expertise-demo" },
    update: {},
    create: {
      name: "Beyond Expertise Demo",
      slug: "beyond-expertise-demo",
      industry: "Conseil et formation"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "learner@beyond-expertise.com" },
    update: {},
    create: {
      email: "learner@beyond-expertise.com",
      profile: {
        create: {
          fullName: "Demo Learner",
          companyName: "Beyond Expertise Demo"
        }
      },
      roles: {
        create: {
          roleId: learnerRole.id
        }
      },
      companyLinks: {
        create: {
          companyId: company.id,
          isPrimary: true
        }
      }
    }
  });

  const category = await prisma.category.upsert({
    where: { slug: "transformation-digitale" },
    update: {},
    create: {
      name: "Transformation digitale",
      slug: "transformation-digitale"
    }
  });

  const training = await prisma.training.upsert({
    where: { slug: "ia-generative-pour-les-organisations" },
    update: {},
    create: {
      slug: "ia-generative-pour-les-organisations",
      reference: "BE-IA-101",
      title: "IA générative pour les organisations",
      summary: "Déployer l’IA générative avec gouvernance, cas d’usage et conduite du changement.",
      objectives: [
        "Cadrer les usages métier",
        "Évaluer les risques et la conformité",
        "Définir une feuille de route opérationnelle"
      ],
      durationDays: 2,
      level: TrainingLevelCode.INTERMEDIATE,
      format: TrainingFormatCode.HYBRID,
      priceFromCents: 149000,
      isPublished: true,
      categories: {
        create: {
          categoryId: category.id
        }
      }
    }
  });

  const session = await prisma.trainingSession.create({
    data: {
      trainingId: training.id,
      sessionCode: "BE-IA-101-MAY26",
      status: "OPEN",
      startDate: new Date("2026-05-12T09:00:00.000Z"),
      endDate: new Date("2026-05-13T17:00:00.000Z"),
      city: "Casablanca",
      capacity: 12,
      seatsAvailable: 7
    }
  });

  const course = await prisma.course.upsert({
    where: { slug: "parcours-ia-generative" },
    update: {},
    create: {
      slug: "parcours-ia-generative",
      title: "Parcours IA générative",
      summary: "Complément e-learning à la formation synchrone.",
      isPublished: true,
      estimatedMinutes: 180,
      certificateEnabled: true,
      trainingId: training.id
    }
  });

  const module = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: "Fondamentaux et gouvernance",
      sortOrder: 1
    }
  });

  const lesson = await prisma.lesson.create({
    data: {
      moduleId: module.id,
      title: "Panorama des usages",
      slug: "panorama-des-usages",
      type: "VIDEO",
      durationMin: 18,
      sortOrder: 1,
      content: {
        summary: "Cartographie des cas d’usage et limites."
      }
    }
  });

  await prisma.courseProgress.upsert({
    where: {
      courseId_userId: {
        courseId: course.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      courseId: course.id,
      userId: user.id,
      completionRate: 0.38
    }
  });

  await prisma.enrollment.create({
    data: {
      userId: user.id,
      companyId: company.id,
      trainingId: training.id,
      sessionId: session.id,
      status: "CONFIRMED",
      participantName: "Demo Learner",
      participantEmail: user.email
    }
  });

  await prisma.contactRequest.create({
    data: {
      fullName: "Nadia El Idrissi",
      email: "nadia@example.com",
      company: "Atlas Advisory",
      message: "Je souhaite planifier une formation intra pour 15 managers."
    }
  });

  await prisma.quoteRequest.create({
    data: {
      companyId: company.id,
      companyName: company.name,
      contactName: "Amine Benali",
      email: "amine@example.com",
      requestedMode: TrainingFormatCode.HYBRID,
      participants: 12,
      brief: "Besoin d’un parcours blended sur l’IA générative pour l’équipe innovation."
    }
  });

  console.log("Seed completed:", { training: training.slug, course: course.slug, lesson: lesson.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
