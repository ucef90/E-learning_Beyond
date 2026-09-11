import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { TurnstileService } from "../../common/turnstile.service";
import { CreateEnrollmentRequestDto } from "./dto/create-enrollment-request.dto";
import { UpdateEnrollmentStatusDto } from "./dto/update-enrollment-status.dto";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly turnstileService: TurnstileService
  ) {}

  async findAll() {
    const enrollments = await this.prisma.enrollment.findMany({
      include: {
        company: true,
        training: true,
        session: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    return enrollments.map((enrollment) => ({
      id: enrollment.id,
      participantName: enrollment.participantName,
      participantEmail: enrollment.participantEmail,
      status: enrollment.status,
      companyName: enrollment.company?.name ?? null,
      trainingTitle: enrollment.training?.title ?? null,
      sessionStartDate: enrollment.session?.startDate?.toISOString() ?? null,
      sessionCity: enrollment.session?.city ?? null,
      updatedAt: enrollment.updatedAt.toISOString(),
      createdAt: enrollment.createdAt.toISOString()
    }));
  }

  async createRequest(payload: CreateEnrollmentRequestDto) {
    await this.turnstileService.verify(payload.turnstileToken);

    const training = payload.trainingSlug
      ? await this.prisma.training.findUnique({
          where: { slug: payload.trainingSlug },
          include: {
            sessions: {
              where: { status: "OPEN" },
              orderBy: { startDate: "asc" },
              take: 1
            }
          }
        })
      : null;

    const company = payload.companyName
      ? await this.prisma.company.upsert({
          where: { slug: toSlug(payload.companyName) },
          update: { name: payload.companyName },
          create: {
            name: payload.companyName,
            slug: toSlug(payload.companyName)
          }
        })
      : null;

    const enrollment = await this.prisma.enrollment.create({
      data: {
        companyId: company?.id,
        trainingId: training?.id,
        sessionId: training?.sessions[0]?.id,
        participantName: payload.participantName,
        participantEmail: payload.participantEmail,
        status: "PENDING"
      }
    });

    const summaryMessage = payload.message?.trim()
      ? `Demande d'inscription: ${payload.message.trim()}`
      : `Demande d'inscription envoyee pour ${payload.participantName}${training ? ` sur ${training.title}` : ""}.`;

    await this.prisma.lead.create({
      data: {
        fullName: payload.participantName,
        email: payload.participantEmail,
        companyName: payload.companyName,
        source: "enrollment_form",
        message: summaryMessage,
        status: "NEW"
      }
    });

    return {
      id: enrollment.id,
      status: enrollment.status.toLowerCase(),
      trainingTitle: training?.title ?? null,
      submittedAt: enrollment.createdAt.toISOString()
    };
  }

  async updateStatus(id: string, payload: UpdateEnrollmentStatusDto) {
    const enrollment = await this.prisma.enrollment.update({
      where: { id },
      data: {
        status: payload.status
      }
    });

    return {
      id: enrollment.id,
      status: enrollment.status,
      updatedAt: enrollment.updatedAt.toISOString()
    };
  }
}
