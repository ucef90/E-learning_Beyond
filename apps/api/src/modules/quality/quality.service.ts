import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  HttpException,
} from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { PrismaService } from "../../common/prisma.service";
import { TurnstileService } from "../../common/turnstile.service";
import {
  CreateQualityDto,
  UpdateQualityDto,
  UpdateReviewDto,
} from "./quality.dto";
function rightsDeadline(now = new Date()) {
  const target = new Date(now);
  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() + 1);
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(now.getUTCDate(), last));
  return target;
}
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
@Injectable()
export class QualityService {
  constructor(
    private readonly db: PrismaService,
    private readonly turnstile: TurnstileService,
  ) {}
  async create(dto: CreateQualityDto, ip: string) {
    if (dto.website) throw new BadRequestException("Demande refusée.");
    if (dto.fullName.trim().length < 2 || dto.message.trim().length < 10)
      throw new BadRequestException("Précisez votre nom et votre demande.");
    if (
      ["NEEDS", "SATISFACTION", "TEACHING"].includes(dto.kind) &&
      !dto.context.trim()
    )
      throw new BadRequestException(
        "Indiquez la formation ou la session concernée.",
      );
    if (dto.kind === "NEEDS" && !dto.currentLevel)
      throw new BadRequestException("Indiquez votre niveau actuel.");
    if (["SATISFACTION", "TEACHING"].includes(dto.kind) && dto.rating == null)
      throw new BadRequestException("Sélectionnez une appréciation de 1 à 5.");
    if (dto.kind === "TEACHING" && dto.stakeholder !== "LEARNER")
      throw new BadRequestException(
        "Ce questionnaire concerne les apprenants.",
      );
    const data = {
      kind: dto.kind,
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      stakeholder: dto.stakeholder,
      context: dto.context.trim(),
      message: dto.message.trim(),
      currentLevel: dto.kind === "NEEDS" ? dto.currentLevel : null,
      rating: ["SATISFACTION", "TEACHING"].includes(dto.kind)
        ? dto.rating
        : null,
    };
    const payloadHash = hash(JSON.stringify(data));
    const existing = await this.db.qualityRequest.findUnique({
      where: { requestKey: dto.requestKey },
    });
    if (existing) {
      if (existing.payloadHash !== payloadHash)
        throw new ConflictException(
          "Cette demande a déjà été enregistrée avec un autre contenu. Rechargez le formulaire.",
        );
      return { reference: existing.reference, createdAt: existing.createdAt };
    }
    await this.turnstile.verify(dto.turnstileToken);
    const window = Math.floor(Date.now() / 3600000);
    const throttle = await this.db.authThrottle.upsert({
      where: { key: `quality:${hash(ip)}:${window}` },
      create: {
        key: `quality:${hash(ip)}:${window}`,
        count: 1,
        expiresAt: new Date((window + 1) * 3600000),
      },
      update: { count: { increment: 1 } },
    });
    if (throttle.count > 100)
      throw new HttpException(
        "Trop de demandes. Réessayez dans une heure ou contactez le centre par téléphone.",
        429,
      );
    try {
      const item = await this.db.qualityRequest.create({
        data: {
          ...data,
          ...(dto.kind === "DATA_RIGHTS" ? { dueDate: rightsDeadline() } : {}),
          requestKey: dto.requestKey,
          payloadHash,
          reference: `BE-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
        },
      });
      return { reference: item.reference, createdAt: item.createdAt };
    } catch (e: any) {
      if (e.code === "P2002") {
        const retry = await this.db.qualityRequest.findUnique({
          where: { requestKey: dto.requestKey },
        });
        if (retry?.payloadHash === payloadHash)
          return { reference: retry.reference, createdAt: retry.createdAt };
        throw new ConflictException(
          "Demande déjà enregistrée. Réessayez sans modifier le contenu.",
        );
      }
      throw e;
    }
  }
  async list(before?: string) {
    if (before && before.length > 100)
      throw new BadRequestException("Curseur invalide.");
    const items = await this.db.qualityRequest.findMany({
      take: 51,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...(before ? { cursor: { id: before }, skip: 1 } : {}),
      select: {
        id: true,
        reference: true,
        kind: true,
        fullName: true,
        email: true,
        context: true,
        stakeholder: true,
        status: true,
        assignee: true,
        dueDate: true,
        createdAt: true,
      },
    });
    const more = items.length > 50;
    if (more) items.pop();
    return { items, next: more ? items[items.length - 1].id : null };
  }
  async detail(id: string) {
    const item = await this.db.qualityRequest.findUnique({
      where: { id },
      include: { events: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] } },
    });
    if (!item) throw new NotFoundException("Demande introuvable.");
    const { requestKey, payloadHash, ...safe } = item;
    return safe;
  }
  async update(id: string, dto: UpdateQualityDto, actorId: string) {
    if (dto.note.trim().length < 10)
      throw new BadRequestException("Documentez l’action réalisée.");
    if (dto.status !== "NEW" && !dto.assignee.trim())
      throw new BadRequestException("Désignez le responsable du traitement.");
    if (
      dto.status === "CLOSED" &&
      (!dto.resolution.trim() || !dto.responseReference.trim())
    )
      throw new BadRequestException(
        "La clôture nécessite une résolution et la référence de la réponse effectivement adressée.",
      );
    const { revision, note, dueDate, ...fields } = dto;
    await this.db.$transaction(async (tx) => {
      const result = await tx.qualityRequest.updateMany({
        where: { id, revision },
        data: {
          ...fields,
          dueDate: dueDate ? new Date(dueDate) : null,
          revision: { increment: 1 },
        },
      });
      if (result.count !== 1)
        throw new ConflictException(
          "Demande modifiée ailleurs ou introuvable. Rechargez avant de réessayer.",
        );
      await tx.qualityRequestEvent.create({
        data: {
          requestId: id,
          actorId,
          action: "UPDATE",
          details: { ...dto, note: note.trim() },
        },
      });
    });
    return this.detail(id);
  }
  async reviews() {
    const [items, events] = await Promise.all([
      this.db.qualityReview.findMany({ orderBy: { indicator: "asc" } }),
      this.db.qualityReviewEvent.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return { items, events };
  }
  async review(indicator: number, dto: UpdateReviewDto, actorId: string) {
    if (indicator < 1 || indicator > 33)
      throw new BadRequestException("Indicateur invalide.");
    if (dto.note.trim().length < 10)
      throw new BadRequestException("Une justification est nécessaire.");
    if (
      ["REVIEWED", "NOT_APPLICABLE"].includes(dto.status) &&
      (!dto.owner.trim() || !dto.evidenceReference.trim())
    )
      throw new BadRequestException(
        "Le responsable et une référence justificative sont requis.",
      );
    if (dto.status === "REVIEWED" && dto.evidenceKind !== "REAL")
      throw new BadRequestException(
        "Un modèle ou un test ne constitue pas une preuve réelle du centre.",
      );
    const { revision, dueDate, ...fields } = dto;
    try {
      await this.db.$transaction(async (tx) => {
        const data = { ...fields, dueDate: dueDate ? new Date(dueDate) : null };
        if (revision === 0)
          await tx.qualityReview.create({ data: { indicator, ...data } });
        else {
          const result = await tx.qualityReview.updateMany({
            where: { indicator, revision },
            data: { ...data, revision: { increment: 1 } },
          });
          if (result.count !== 1)
            throw new ConflictException(
              "Registre modifié ailleurs. Rechargez avant de réessayer.",
            );
        }
        await tx.qualityReviewEvent.create({
          data: { indicator, actorId, details: { ...dto } },
        });
      });
    } catch (e: any) {
      if (e.code === "P2002")
        throw new ConflictException(
          "Registre modifié ailleurs. Rechargez avant de réessayer.",
        );
      throw e;
    }
    return this.reviews();
  }
}
