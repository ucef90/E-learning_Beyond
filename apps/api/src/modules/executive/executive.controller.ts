import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  Module,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaService } from "../../common/prisma.service";
import { TurnstileService } from "../../common/turnstile.service";
import { Public, Roles } from "../auth/access";
import {
  CreateExecutiveApplication,
  UpdateExecutiveApplication,
} from "./executive.dto";

const source = [
  resolve(process.cwd(), "content/executive/catalogue.json"),
  resolve(process.cwd(), "../../content/executive/catalogue.json"),
].find(existsSync);
if (!source) throw new Error("Catalogue exécutif absent.");
const catalogue = JSON.parse(readFileSync(source, "utf8"));
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const receipt = (p: any) => ({
  reference: p.reference,
  createdAt: p.createdAt,
});

@Roles("ADMIN")
@Controller("executive")
export class ExecutiveController {
  constructor(
    private readonly db: PrismaService,
    private readonly turnstile: TurnstileService,
  ) {}

  @Public()
  @Post("applications")
  async create(@Body() dto: CreateExecutiveApplication, @Req() req: any) {
    if (dto.website) throw new BadRequestException("Demande refusée.");
    const programme = catalogue.programmes.find(
      (p: any) => p.slug === dto.programmeSlug,
    );
    const service = catalogue.services.find(
      (p: any) => p.slug === dto.programmeSlug,
    );
    if (!programme && !service)
      throw new BadRequestException(
        "Choisissez un parcours ou un service du catalogue Beyond.",
      );
    if (service && dto.requestType !== "COMPANY")
      throw new BadRequestException(
        "Choisissez une demande d’accompagnement pour ce service.",
      );
    const data = {
      programmeSlug: dto.programmeSlug,
      programmeTitle: programme
        ? `${programme.kind} — ${programme.title}`
        : service.title,
      kind: programme?.kind || "SERVICE",
      requestType: dto.requestType,
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone?.trim() || "",
      country: dto.country.trim(),
      city: dto.city?.trim() || "",
      qualification: dto.qualification.trim(),
      experience: dto.experience,
      currentRole: dto.currentRole.trim(),
      company: dto.company?.trim() || "",
      motivation: dto.motivation.trim(),
      funding: dto.funding,
    };
    if (
      data.fullName.length < 2 ||
      data.country.length < 2 ||
      data.qualification.length < 2 ||
      data.currentRole.length < 2 ||
      data.motivation.length < 30
    )
      throw new BadRequestException(
        "Complétez votre identité, votre parcours et votre projet.",
      );
    const payloadHash = hash(JSON.stringify(data));
    const existing = await this.db.executiveApplication.findUnique({
      where: { requestKey: dto.requestKey },
    });
    if (existing) {
      if (existing.payloadHash !== payloadHash)
        throw new ConflictException(
          "Ce formulaire a déjà été enregistré avec un autre contenu. Rechargez la page pour une nouvelle demande.",
        );
      return receipt(existing);
    }
    await this.turnstile.verify(dto.turnstileToken);
    const window = Math.floor(Date.now() / 3600000);
    const key = `executive:${hash(req.ip || "unknown")}:${window}`;
    const throttle = await this.db.authThrottle.upsert({
      where: { key },
      create: { key, count: 1, expiresAt: new Date((window + 1) * 3600000) },
      update: { count: { increment: 1 } },
    });
    if (throttle.count > 12)
      throw new HttpException(
        "Trop de demandes. Réessayez dans une heure ou contactez le centre.",
        429,
      );
    try {
      const item = await this.db.executiveApplication.create({
        data: {
          ...data,
          requestKey: dto.requestKey,
          payloadHash,
          reference: `BE-${new Date().getUTCFullYear()}-${randomBytes(6).toString("hex").toUpperCase()}`,
        },
      });
      return receipt(item);
    } catch (error: any) {
      if (error.code === "P2002") {
        const item = await this.db.executiveApplication.findUnique({
          where: { requestKey: dto.requestKey },
        });
        if (item?.payloadHash === payloadHash) return receipt(item);
        throw new ConflictException(
          "Cette demande existe déjà. Rechargez le formulaire.",
        );
      }
      throw error;
    }
  }

  @Get("applications")
  async list(@Query("page") pageValue?: string) {
    const page = Number(pageValue || 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 100000)
      throw new BadRequestException("Page invalide.");
    const [items, total] = await this.db.$transaction([
      this.db.executiveApplication.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * 25,
        take: 25,
        select: {
          id: true,
          reference: true,
          programmeSlug: true,
          programmeTitle: true,
          kind: true,
          requestType: true,
          fullName: true,
          email: true,
          phone: true,
          country: true,
          city: true,
          qualification: true,
          experience: true,
          currentRole: true,
          company: true,
          motivation: true,
          funding: true,
          status: true,
          internalNote: true,
          revision: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.db.executiveApplication.count(),
    ]);
    return { items, total, page, pageSize: 25 };
  }

  @Patch("applications/:id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateExecutiveApplication,
    @Req() req: any,
  ) {
    return this.db.$transaction(async (tx) => {
      const item = await tx.executiveApplication.findUnique({ where: { id } });
      if (!item) throw new NotFoundException("Candidature introuvable.");
      const result = await tx.executiveApplication.updateMany({
        where: { id, revision: dto.revision },
        data: {
          status: dto.status,
          internalNote: dto.internalNote.trim(),
          revision: { increment: 1 },
        },
      });
      if (result.count !== 1)
        throw new ConflictException(
          "Ce dossier a été modifié. Rechargez-le avant de sauvegarder.",
        );
      await tx.learningEvent.create({
        data: {
          actorId: req.user.id,
          subjectId: id,
          action: "EXECUTIVE_APPLICATION_UPDATED",
          details: {
            from: item.status,
            to: dto.status,
            noteChanged: item.internalNote !== dto.internalNote.trim(),
          },
        },
      });
      return { id, revision: dto.revision + 1 };
    });
  }
}
@Module({ controllers: [ExecutiveController] })
export class ExecutiveModule {}
