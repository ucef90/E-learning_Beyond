import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  HttpException,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaService } from "../../common/prisma.service";
import { TurnstileService } from "../../common/turnstile.service";
import {
  CampaignLeadDto,
  CampaignEventDto,
  CampaignUpdateDto,
} from "./campaign.dto";
const source = [
  resolve(process.cwd(), "content/executive/catalogue.json"),
  resolve(process.cwd(), "../../content/executive/catalogue.json"),
].find(existsSync)!;
const programmes = JSON.parse(readFileSync(source, "utf8")).programmes as {
  slug: string;
  title: string;
  kind: string;
}[];
export const PRIVACY_VERSION = "2026-09-13-commercial-v1";
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
const label = (v: unknown, max = 100) =>
  typeof v === "string" && v.length <= max && /^[\p{L}\p{N} _.+-]+$/u.test(v)
    ? v
    : undefined;
export function safeAttribution(value: any): any {
  if (!value || value.statistics !== true) return undefined;
  const touch = (v: any) => {
    if (!v || typeof v !== "object") return {};
    const out: any = {};
    for (const k of [
      "source",
      "medium",
      "campaign",
      "content",
      "term",
      "country",
    ]) {
      const s = label(v[k]);
      if (s) out[k] = s;
    }
    if (
      typeof v.landing === "string" &&
      /^\/(?:afrique|mba|dba|formations|contact|devis)(?:[a-z0-9/-]*)$/.test(
        v.landing,
      )
    )
      out.landing = v.landing.slice(0, 200);
    if (
      typeof v.referrer === "string" &&
      /^[a-z0-9.-]{1,150}$/.test(v.referrer)
    )
      out.referrer = v.referrer;
    return out;
  };
  return {
    statistics: true,
    advertising: value.advertising === true,
    first: touch(value.first),
    last: touch(value.last),
    version: PRIVACY_VERSION,
  };
}
export function campaignConfiguration() {
  const ga = process.env.GA4_MEASUREMENT_ID || "",
    pixel = process.env.META_PIXEL_ID || "",
    whatsapp = process.env.WHATSAPP_BUSINESS_NUMBER || "";
  return {
    ga4: /^G-[A-Z0-9]{5,20}$/.test(ga) ? ga : "",
    metaPixel: /^\d{5,25}$/.test(pixel) ? pixel : "",
    whatsapp: /^[1-9]\d{7,14}$/.test(whatsapp) ? whatsapp : "",
    privacyVersion: PRIVACY_VERSION,
  };
}
@Injectable()
export class CampaignService implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setInterval>;
  constructor(
    private db: PrismaService,
    private turnstile: TurnstileService,
  ) {}
  onModuleInit() {
    this.timer = setInterval(() => {
      void this.purge().catch(() => {});
    }, 3600000);
    this.timer.unref();
    void this.purge().catch(() => {});
  }
  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
  async purge() {
    await this.db.marketingEvent.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    // Only new managed prospect records expire. Existing requests and enrolled dossiers are preserved.
    await this.db.lead.deleteMany({
      where: {
        source: "executive_campaign",
        stage: { not: "ENROLLED" },
        expiresAt: { lt: new Date() },
      },
    });
  }
  async limit(ip: string, kind: string, max: number, seconds = 3600) {
    const slot = Math.floor(Date.now() / (seconds * 1000)),
      key = `campaign:${kind}:${hash(ip || "unknown")}:${slot}`;
    const r = await this.db.authThrottle.upsert({
      where: { key },
      create: {
        key,
        count: 1,
        expiresAt: new Date((slot + 1) * seconds * 1000),
      },
      update: { count: { increment: 1 } },
    });
    if (r.count > max)
      throw new HttpException(
        "Trop de demandes. Réessayez plus tard ou contactez le centre.",
        429,
      );
  }
  receipt(item: any) {
    return {
      reference: item.receiptCode,
      programmeSlug: item.programmeSlug,
      intent: item.intent,
      createdAt: item.createdAt,
    };
  }
  async create(dto: CampaignLeadDto, ip: string) {
    if (dto.website) throw new BadRequestException("Demande refusée.");
    const programme = programmes.find((p) => p.slug === dto.programmeSlug);
    if (!programme)
      throw new BadRequestException("Choisissez un programme Beyond.");
    const phone = dto.phone?.trim() || "";
    if (phone && !/^\+?[\d ()-]{7,40}$/.test(phone))
      throw new BadRequestException(
        "Indiquez un numéro de téléphone avec son indicatif.",
      );
    if (dto.intent === "CALLBACK" && !phone)
      throw new BadRequestException(
        "Le téléphone est nécessaire pour demander un rappel.",
      );
    const data = {
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      country: dto.country.trim(),
      phone,
      programmeSlug: dto.programmeSlug,
      intent: dto.intent,
      preferredTime: dto.preferredTime?.trim() || "",
    };
    if (data.fullName.length < 2 || data.country.length < 2)
      throw new BadRequestException("Complétez votre nom et votre pays.");
    const requestHash = hash(JSON.stringify(data)),
      existing = await this.db.lead.findUnique({
        where: { requestKey: dto.requestKey },
      });
    if (existing) {
      if (existing.requestHash !== requestHash)
        throw new ConflictException(
          "Cette demande a déjà été enregistrée. Ouvrez une nouvelle demande pour un autre projet.",
        );
      return this.receipt(existing);
    }
    await this.turnstile.verify(dto.turnstileToken);
    await this.limit(ip, "lead", 12);
    const attribution = safeAttribution(dto.attribution),
      now = new Date();
    try {
      return await this.db.$transaction(async (tx) => {
        const item = await tx.lead.create({
          data: {
            ...data,
            requestKey: dto.requestKey,
            requestHash,
            receiptCode: `BE-${now.getUTCFullYear()}-${randomBytes(6).toString("hex").toUpperCase()}`,
            source: "executive_campaign",
            contactConsentAt: now,
            privacyVersion: PRIVACY_VERSION,
            attribution,
            campaignSource: attribution?.last?.source,
            campaignName: attribution?.last?.campaign,
            expiresAt: new Date(Date.now() + 365 * 86400000),
            timeline: { create: { action: "RECEIVED" } },
          },
        });
        const admins = await tx.user.findMany({
          where: {
            status: "ACTIVE",
            roles: { some: { role: { code: "ADMIN" } } },
          },
          select: { id: true },
        });
        await tx.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            title: "Nouvelle demande MBA / DBA",
            body: `Référence ${item.receiptCode} : ${programme.kind} ${programme.title}. À traiter dans le suivi commercial.`,
          })),
        });
        return this.receipt(item);
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        const r = await this.db.lead.findUnique({
          where: { requestKey: dto.requestKey },
        });
        if (r?.requestHash === requestHash) return this.receipt(r);
        throw new ConflictException("Cette demande existe déjà.");
      }
      throw e;
    }
  }
  async getReceipt(key: string, ip: string) {
    await this.limit(ip, "receipt", 60, 60);
    const item = await this.db.lead.findUnique({ where: { requestKey: key } });
    if (!item || item.source !== "executive_campaign")
      throw new NotFoundException(
        "Confirmation indisponible. Retrouvez votre référence ou contactez le centre.",
      );
    return this.receipt(item);
  }
  async event(dto: CampaignEventDto, ip: string) {
    if (
      !/^\/(?:afrique|mba|dba|formations|contact|devis)(?:[a-z0-9/-]*)$/.test(
        dto.path,
      )
    )
      throw new BadRequestException("Page de mesure non autorisée.");
    if (
      dto.programmeSlug &&
      !programmes.some((p) => p.slug === dto.programmeSlug)
    )
      throw new BadRequestException("Programme invalide.");
    await this.limit(ip, "event", 90, 60);
    const a = safeAttribution(dto.attribution);
    await this.db.marketingEvent.upsert({
      where: { id: dto.id },
      update: {},
      create: {
        id: dto.id,
        name: dto.name,
        path: dto.path,
        programmeSlug: dto.programmeSlug,
        source: a?.last?.source,
        campaign: a?.last?.campaign,
        expiresAt: new Date(Date.now() + 90 * 86400000),
      },
    });
    return { saved: true };
  }
  async list(pageValue?: string) {
    const page = Number(pageValue || 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 10000)
      throw new BadRequestException("Page invalide.");
    const [items, total] = await this.db.$transaction([
      this.db.lead.findMany({
        where: { source: "executive_campaign" },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * 25,
        take: 25,
        select: {
          id: true,
          receiptCode: true,
          fullName: true,
          email: true,
          phone: true,
          country: true,
          programmeSlug: true,
          intent: true,
          preferredTime: true,
          stage: true,
          ownerId: true,
          nextActionAt: true,
          enrollmentReference: true,
          enrolledAt: true,
          revision: true,
          createdAt: true,
          attribution: true,
          contactConsentAt: true,
          privacyVersion: true,
          timeline: { orderBy: { createdAt: "desc" }, take: 15 },
          applications: { select: { id: true, reference: true, status: true } },
        },
      }),
      this.db.lead.count({ where: { source: "executive_campaign" } }),
    ]);
    return { items, total, page, pageSize: 25 };
  }
  async update(id: string, dto: CampaignUpdateDto, actorId: string) {
    const due = dto.nextActionAt ? new Date(dto.nextActionAt) : null;
    if (due && !Number.isFinite(due.getTime()))
      throw new BadRequestException("Échéance invalide.");
    if (dto.stage === "APPOINTMENT" && !due)
      throw new BadRequestException(
        "Précisez la date du rendez-vous confirmé.",
      );
    if (
      dto.stage === "ENROLLED" &&
      (!dto.enrollmentConfirmed || !dto.enrollmentReference?.trim())
    )
      throw new BadRequestException(
        "Confirmez l’inscription réelle et indiquez la référence du contrat ou du dossier.",
      );
    return this.db.$transaction(async (tx) => {
      const old = await tx.lead.findUnique({ where: { id } });
      if (!old || old.source !== "executive_campaign")
        throw new NotFoundException("Prospect introuvable.");
      const result = await tx.lead.updateMany({
        where: { id, revision: dto.revision },
        data: {
          stage: dto.stage,
          status:
            dto.stage === "ENROLLED"
              ? "WON"
              : dto.stage === "CLOSED"
                ? "LOST"
                : dto.stage === "NEW"
                  ? "NEW"
                  : "QUALIFIED",
          ownerId: dto.takeOwnership ? actorId : old.ownerId,
          nextActionAt: due,
          enrollmentReference: dto.enrollmentReference?.trim() || null,
          enrolledAt:
            dto.stage === "ENROLLED" ? old.enrolledAt || new Date() : null,
          revision: { increment: 1 },
        },
      });
      if (result.count !== 1)
        throw new ConflictException(
          "Le dossier a changé. Rechargez-le avant de sauvegarder.",
        );
      await tx.leadActivity.create({
        data: {
          leadId: id,
          actorId,
          action: `${old.stage} → ${dto.stage}`,
          note: dto.note.trim(),
        },
      });
      return { id, revision: dto.revision + 1 };
    });
  }
  async summary() {
    const since = new Date(Date.now() - 30 * 86400000),
      where = { source: "executive_campaign" };
    const [total, stages, overdue, events, campaigns, applications] =
      await Promise.all([
        this.db.lead.count({ where }),
        this.db.lead.groupBy({ by: ["stage"], where, _count: { _all: true } }),
        this.db.lead.count({
          where: {
            ...where,
            stage: { notIn: ["ENROLLED", "CLOSED"] },
            nextActionAt: { lt: new Date() },
          },
        }),
        this.db.marketingEvent.groupBy({
          by: ["name"],
          where: { createdAt: { gte: since } },
          _count: { _all: true },
        }),
        this.db.lead.groupBy({
          by: ["campaignSource", "campaignName"],
          where: { ...where, createdAt: { gte: since } },
          _count: { _all: true },
        }),
        this.db.executiveApplication.count({
          where: { createdAt: { gte: since } },
        }),
      ]);
    return {
      total,
      stages,
      overdue,
      events,
      campaigns,
      applications30Days: applications,
      configuration: { ...campaignConfiguration(), internalAnalytics: true },
      periodDays: 30,
    };
  }
}
