import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

// The catalogue only needs a summary. Full programmes remain on detail routes.
function programmeSummary(program: unknown) {
  if (!program || typeof program !== "object" || Array.isArray(program))
    return program;
  const { syllabus, ...source } = program as Record<string, any>;
  return {
    ...source,
    ...(syllabus && Array.isArray(syllabus.modules)
      ? {
          syllabusSummary: {
            totalHours: syllabus.totalHours,
            moduleCount: syllabus.modules.length,
            status: syllabus.status,
          },
        }
      : {}),
  };
}

@Injectable()
export class TrainingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const trainings = await this.prisma.training.findMany({
      where: {
        isPublished: true,
      },
      include: {
        courses: {
          where: {
            isPublished: true,
            editorialStatus: "APPROVED",
            reviewedAt: { not: null },
          },
          select: {
            id: true,
            title: true,
            estimatedMinutes: true,
            modules: {
              select: {
                lessons: {
                  select: { title: true, type: true, durationMin: true },
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        sessions: {
          where: {
            status: "OPEN",
          },
          orderBy: {
            startDate: "asc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return trainings.map((training) => ({
      id: training.id,
      slug: training.slug,
      title: training.title,
      summary: training.summary,
      objectives: training.objectives,
      audience: training.audience,
      prerequisites: training.prerequisites,
      program: programmeSummary(training.program),
      courses: training.courses,
      durationDays: training.durationDays,
      format: training.format,
      level: training.level,
      priceFromCents: training.priceFromCents,
      category: training.categories[0]?.category.name ?? "Catalogue",
      nextSessionDate: training.sessions[0]?.startDate ?? null,
    }));
  }

  async findOneBySlug(slug: string) {
    const training = await this.prisma.training.findFirst({
      where: { slug, isPublished: true },
      include: {
        courses: {
          where: {
            isPublished: true,
            editorialStatus: "APPROVED",
            reviewedAt: { not: null },
          },
          select: {
            id: true,
            title: true,
            estimatedMinutes: true,
            modules: {
              select: {
                lessons: {
                  select: { title: true, type: true, durationMin: true },
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        sessions: {
          orderBy: {
            startDate: "asc",
          },
          take: 3,
        },
        documents: true,
      },
    });

    if (!training) {
      throw new NotFoundException("Formation introuvable.");
    }

    return {
      id: training.id,
      slug: training.slug,
      title: training.title,
      summary: training.summary,
      description: training.description,
      objectives: training.objectives,
      audience: training.audience,
      prerequisites: training.prerequisites,
      program: training.program,
      courses: training.courses,
      durationDays: training.durationDays,
      format: training.format,
      level: training.level,
      priceFromCents: training.priceFromCents,
      category: training.categories[0]?.category.name ?? "Catalogue",
      sessions: training.sessions,
      documents: training.documents,
    };
  }
}
