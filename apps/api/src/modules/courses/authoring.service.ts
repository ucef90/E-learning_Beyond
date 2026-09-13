import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { PrismaService } from "../../common/prisma.service";
import { Identity } from "../auth/access";
import { CoursesService } from "./courses.service";
import { cleanNotebook } from "./notebook";
import {
  AuthoringCourse,
  AuthoringModule,
  ResourceInput,
  AssetInput,
  ReviewInput,
  EditorsInput,
  AccessInput,
  PositioningInput,
  WrittenWorkInput,
} from "./authoring.dto";

const structure = {
  modules: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      lessons: {
        orderBy: { sortOrder: "asc" as const },
        include: {
          quiz: {
            include: {
              questions: {
                orderBy: { sortOrder: "asc" as const },
                include: { answers: true },
              },
            },
          },
        },
      },
    },
  },
};
const assetSelect = {
  id: true,
  courseId: true,
  title: true,
  filename: true,
  mimeType: true,
  visibility: true,
  size: true,
  sha256: true,
  createdAt: true,
};
@Injectable()
export class AuthoringService {
  constructor(
    private readonly db: PrismaService,
    private readonly courses: CoursesService,
  ) {}
  private staff(who: Identity) {
    if (!who.roles.some((r) => ["ADMIN", "TRAINER"].includes(r)))
      throw new ForbiddenException("Accès formateur ou administrateur requis.");
  }
  private admin(who: Identity) {
    if (!who.roles.includes("ADMIN"))
      throw new ForbiddenException("Accès administrateur requis.");
  }
  private canEdit(who: Identity, c: any) {
    this.staff(who);
    if (!who.roles.includes("ADMIN") && !c.editorIds.includes(who.id))
      throw new ForbiddenException("Ce contenu ne vous est pas confié.");
  }
  private event(
    tx: any,
    who: Identity,
    id: string,
    action: string,
    details: any = {},
    subjectId = who.id,
  ) {
    return tx.learningEvent.create({
      data: { actorId: who.id, courseId: id, subjectId, action, details },
    });
  }
  private async lock(
    tx: Prisma.TransactionClient,
    who: Identity,
    id: string,
    revision: number,
    editable = true,
  ) {
    await tx.$queryRaw`SELECT id FROM "Course" WHERE id = ${id} FOR UPDATE`;
    const c = await tx.course.findUnique({ where: { id } });
    if (!c) throw new NotFoundException("Cours introuvable.");
    this.canEdit(who, c);
    if (c.version !== revision)
      throw new ConflictException(
        "Le cours a changé. Rechargez la version enregistrée avant de modifier.",
      );
    if (
      editable &&
      (c.isPublished ||
        (await tx.learningEnrollment.count({ where: { courseId: id } })) ||
        (await tx.quizAttempt.count({
          where: { quiz: { lesson: { module: { courseId: id } } } },
        })) ||
        (await tx.lessonProgress.count({
          where: { lesson: { module: { courseId: id } } },
        })))
    )
      throw new ConflictException(
        "Cette version est publiée ou attribuée. Dupliquez-la pour préserver les parcours existants.",
      );
    return c;
  }
  private revisionData() {
    return {
      version: { increment: 1 },
      editorialStatus: "DRAFT",
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: "",
    };
  }
  private validate(body: AuthoringCourse) {
    if (
      JSON.stringify(body.brief).length > 30000 ||
      Object.values(body.brief).some((v) => typeof v !== "string")
    )
      throw new BadRequestException(
        "La fiche doit contenir des champs textuels, 30 000 caractères maximum.",
      );
    const lessons = body.modules.flatMap((m) => m.lessons);
    if (lessons.length > 120)
      throw new BadRequestException("120 activités maximum par cours.");
    if (!lessons.some((l) => l.type === "TEXT"))
      throw new BadRequestException("Ajoutez au moins une leçon.");
    for (const l of lessons) {
      if (l.type !== "QUIZ" && l.body.trim().length < 20)
        throw new BadRequestException(
          "Chaque leçon ou énoncé doit contenir une explication.",
        );
      if (l.type === "QUIZ" && !l.quiz)
        throw new BadRequestException("Le quiz doit contenir des questions.");
      if (l.type !== "QUIZ" && l.quiz)
        throw new BadRequestException(
          "Les questions doivent appartenir à une activité quiz.",
        );
      for (const q of l.quiz?.questions || [])
        if (q.answers.filter((a) => a.isCorrect).length !== 1)
          throw new BadRequestException(
            "Chaque question doit avoir exactement une bonne réponse.",
          );
      if (l.videoUrl) {
        let u: URL;
        try {
          u = new URL(l.videoUrl);
        } catch {
          throw new BadRequestException("Adresse vidéo invalide.");
        }
        const hosts = (process.env.VIDEO_ALLOWED_HOSTS || "")
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean);
        if (
          u.protocol !== "https:" ||
          u.username ||
          u.password ||
          !hosts.includes(u.hostname) ||
          !l.transcript?.trim()
        )
          throw new BadRequestException(
            "Vidéo HTTPS sur un hébergeur autorisé et transcription requises.",
          );
      }
    }
    if (
      body.assessmentMode !== "NONE" &&
      (!body.rubric.trim() || !lessons.some((l) => l.type === "PDF"))
    )
      throw new BadRequestException(
        "Ajoutez un énoncé de travail et une grille d'évaluation.",
      );
  }
  private async writeModules(
    tx: Prisma.TransactionClient,
    id: string,
    modules: AuthoringModule[],
  ) {
    for (const [mi, m] of modules.entries()) {
      const mod = await tx.courseModule.create({
        data: { courseId: id, title: m.title, sortOrder: mi },
      });
      for (const [li, l] of m.lessons.entries()) {
        const lesson = await tx.lesson.create({
          data: {
            moduleId: mod.id,
            title: l.title,
            slug: "activite-" + (li + 1),
            type: l.type,
            sortOrder: li,
            durationMin: l.durationMin,
            videoUrl: l.videoUrl || null,
            content: { body: l.body, transcript: l.transcript || "" },
          },
        });
        if (l.quiz)
          await tx.quiz.create({
            data: {
              lessonId: lesson.id,
              title: l.quiz.title,
              passingScore: l.quiz.passingScore,
              questions: {
                create: l.quiz.questions.map((q, i) => ({
                  prompt: q.prompt,
                  explanation: q.explanation,
                  sortOrder: i,
                  answers: { create: q.answers },
                })),
              },
            },
          });
      }
    }
  }
  async list(who: Identity) {
    this.staff(who);
    return this.db.course.findMany({
      where: who.roles.includes("ADMIN") ? {} : { editorIds: { has: who.id } },
      select: {
        id: true,
        title: true,
        summary: true,
        version: true,
        editorialStatus: true,
        editorIds: true,
        isPublished: true,
        reviewedAt: true,
        reviewNote: true,
        estimatedMinutes: true,
        trainingId: true,
        _count: { select: { learning: true, assets: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
  async detail(who: Identity, id: string) {
    const c = await this.db.course.findUnique({
      where: { id },
      include: {
        ...structure,
        assets: { select: assetSelect },
        _count: { select: { learning: true } },
      },
    });
    if (!c) throw new NotFoundException();
    this.canEdit(who, c);
    const { resources, ...visible } = c;
    const r = resources as any;
    const history = await this.db.learningEvent.findMany({
      where: {
        courseId: id,
        action: {
          in: [
            "COURSE_AUTHORED",
            "COURSE_EDITED",
            "COURSE_REVIEW_SUBMIT",
            "COURSE_REVIEW_APPROVE",
            "COURSE_REVIEW_CHANGES",
            "COURSE_REVIEW_PUBLISH",
            "COURSE_REVIEW_UNPUBLISH",
            "COURSE_EDITORS_CHANGED",
            "COURSE_RESOURCE_UPDATED",
            "COURSE_ASSET_ADDED",
            "COURSE_ASSET_REMOVED",
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        actorId: true,
        action: true,
        createdAt: true,
        details: true,
      },
    });
    return {
      ...visible,
      resources: {
        hasStarter: !!r?.starter,
        hasPractice: !!r?.practice,
        hasSolution: !!r?.solution,
        hasCsv: !!r?.csv,
      },
      assessment: r?.assessment || {
        mode: r?.starter ? "NOTEBOOK" : "NONE",
        passingScore: 70,
        rubric: "",
      },
      history,
    };
  }
  async save(who: Identity, id: string | null, body: AuthoringCourse) {
    this.staff(who);
    this.validate(body);
    return this.db.$transaction(
      async (tx) => {
        const existing = id
          ? await this.lock(tx, who, id, body.revision)
          : null;
        if (
          !who.roles.includes("ADMIN") &&
          (body.trainingId || null) !== (existing?.trainingId || null)
        )
          throw new ForbiddenException(
            "Le rattachement au catalogue est réservé à l'administrateur.",
          );
        if (
          body.trainingId &&
          !(await tx.training.findUnique({ where: { id: body.trainingId } }))
        )
          throw new BadRequestException("Formation introuvable.");
        const resources = {
          ...((existing?.resources as any) || {}),
          assessment: {
            mode: body.assessmentMode,
            passingScore: body.assessmentScore,
            rubric: body.rubric,
          },
        };
        const data = {
          title: body.title,
          summary: body.summary,
          brief: body.brief as Prisma.InputJsonValue,
          trainingId: body.trainingId || null,
          resources,
          estimatedMinutes: body.modules
            .flatMap((m) => m.lessons)
            .reduce((n, l) => n + l.durationMin, 0),
        };
        const c = existing
          ? await tx.course.update({
              where: { id: id! },
              data: { ...data, ...this.revisionData() },
            })
          : await tx.course.create({
              data: {
                ...data,
                slug: "cours-" + randomBytes(8).toString("hex"),
                editorIds: who.roles.includes("ADMIN") ? [] : [who.id],
              },
            });
        if (existing)
          await tx.courseModule.deleteMany({ where: { courseId: c.id } });
        await this.writeModules(tx, c.id, body.modules);
        await this.event(
          tx,
          who,
          c.id,
          existing ? "COURSE_EDITED" : "COURSE_AUTHORED",
          { version: c.version },
        );
        return { id: c.id, version: c.version };
      },
      { timeout: 20000 },
    );
  }
  async resource(who: Identity, id: string, body: ResourceInput) {
    const data =
      body.name === "csv"
        ? body.csv
        : body.notebook
          ? cleanNotebook(body.notebook)
          : null;
    if (!data) throw new BadRequestException("Choisissez un fichier non vide.");
    return this.db.$transaction(async (tx) => {
      const c = await this.lock(tx, who, id, body.revision);
      const resources = { ...((c.resources as any) || {}), [body.name]: data };
      await tx.course.update({
        where: { id },
        data: { resources, ...this.revisionData() },
      });
      await this.event(tx, who, id, "COURSE_RESOURCE_UPDATED", {
        name: body.name,
      });
      return { saved: true };
    });
  }
  async addAsset(who: Identity, id: string, body: AssetInput) {
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(body.base64) || body.base64.length % 4)
      throw new BadRequestException("Encodage de fichier invalide.");
    const content = Buffer.from(body.base64, "base64");
    const ext = body.filename.split(".").pop()?.toLowerCase() || "";
    const types: Record<string, string> = {
      pdf: "application/pdf",
      csv: "text/csv",
      txt: "text/plain",
      ipynb: "application/x-ipynb+json",
      json: "application/json",
    };
    if (
      !types[ext] ||
      /[\\/\r\n\x00-\x1f]/.test(body.filename) ||
      !content.length ||
      content.length > 1024 * 1024
    )
      throw new BadRequestException(
        "PDF, CSV, TXT, JSON ou IPYNB de 1 Mo maximum.",
      );
    if (ext === "pdf" && content.subarray(0, 5).toString() !== "%PDF-")
      throw new BadRequestException("Le fichier n'est pas un PDF.");
    if (ext === "json" || ext === "ipynb") {
      try {
        const j = JSON.parse(content.toString("utf8"));
        if (ext === "ipynb") cleanNotebook(j);
      } catch {
        throw new BadRequestException("Fichier JSON ou notebook invalide.");
      }
    }
    return this.db.$transaction(async (tx) => {
      await this.lock(tx, who, id, body.revision);
      if ((await tx.courseAsset.count({ where: { courseId: id } })) >= 30)
        throw new BadRequestException("30 fichiers maximum par cours.");
      const a = await tx.courseAsset.create({
        data: {
          courseId: id,
          title: body.title,
          filename: body.filename,
          mimeType: types[ext],
          visibility: body.visibility,
          content,
          size: content.length,
          sha256: createHash("sha256").update(content).digest("hex"),
        },
        select: assetSelect,
      });
      await tx.course.update({ where: { id }, data: this.revisionData() });
      await this.event(tx, who, id, "COURSE_ASSET_ADDED", {
        assetId: a.id,
        sha256: a.sha256,
        visibility: a.visibility,
      });
      return a;
    });
  }
  async removeAsset(
    who: Identity,
    id: string,
    assetId: string,
    revision: number,
  ) {
    return this.db.$transaction(async (tx) => {
      await this.lock(tx, who, id, revision);
      const a = await tx.courseAsset.findFirst({
        where: { id: assetId, courseId: id },
      });
      if (!a) throw new NotFoundException();
      await tx.courseAsset.delete({ where: { id: assetId } });
      await tx.course.update({ where: { id }, data: this.revisionData() });
      await this.event(tx, who, id, "COURSE_ASSET_REMOVED", {
        assetId,
        sha256: a.sha256,
      });
      return { removed: true };
    });
  }
  private async assetScope(who: Identity, id: string) {
    await this.courses.course(who, id);
    const c = await this.db.course.findUniqueOrThrow({ where: { id } });
    const staff =
      who.roles.includes("ADMIN") ||
      c.editorIds.includes(who.id) ||
      !!(
        who.roles.includes("TRAINER") &&
        (await this.db.learningEnrollment.findFirst({
          where: { courseId: id, trainerId: who.id },
        }))
      );
    const reviewed =
      staff ||
      !!(await this.db.workSubmission.findFirst({
        where: { courseId: id, userId: who.id, reviewedAt: { not: null } },
      }));
    return staff
      ? ["LEARNER", "AFTER_REVIEW", "STAFF"]
      : reviewed
        ? ["LEARNER", "AFTER_REVIEW"]
        : ["LEARNER"];
  }
  async assets(who: Identity, id: string) {
    return this.db.courseAsset.findMany({
      where: {
        courseId: id,
        visibility: { in: await this.assetScope(who, id) },
      },
      select: assetSelect,
      orderBy: { createdAt: "asc" },
    });
  }
  async download(who: Identity, id: string, assetId: string) {
    const allowed = await this.assetScope(who, id);
    const a = await this.db.courseAsset.findFirst({
      where: { id: assetId, courseId: id, visibility: { in: allowed } },
    });
    if (!a) throw new NotFoundException("Fichier inaccessible.");
    return a;
  }
  async review(who: Identity, id: string, body: ReviewInput) {
    if (body.action !== "SUBMIT") this.admin(who);
    return this.db.$transaction(async (tx) => {
      const c = await this.lock(tx, who, id, body.revision, false);
      const fields: any = { version: { increment: 1 }, reviewNote: body.note };
      if (body.action === "SUBMIT") {
        if (c.editorialStatus !== "DRAFT")
          throw new ConflictException("Seul un brouillon peut être soumis.");
        fields.editorialStatus = "IN_REVIEW";
      } else if (body.action === "APPROVE") {
        if (c.editorialStatus !== "IN_REVIEW")
          throw new ConflictException(
            "Soumettez le cours à validation avant de l'approuver.",
          );
        const full = await tx.course.findUniqueOrThrow({
          where: { id },
          include: structure,
        });
        const lessons = full.modules.flatMap((m) => m.lessons);
        if (
          !lessons.length ||
          !lessons.some((l) => l.type === "TEXT") ||
          lessons.some(
            (l) =>
              l.type === "TEXT" &&
              String((l.content as any)?.body || "").trim().length < 20,
          )
        )
          throw new BadRequestException(
            "Le cours doit contenir des leçons rédigées.",
          );
        const brief = full.brief as any;
        for (const key of [
          "objectifs",
          "public",
          "prerequis",
          "duree",
          "modalites",
          "evaluation",
          "assistance",
          "accessibilite",
          "acces",
        ])
          if (!String(brief?.[key] || "").trim())
            throw new BadRequestException(
              "Complétez la fiche pédagogique : " + key,
            );
        const r = full.resources as any;
        if (r?.assessment?.mode === "NOTEBOOK" && (!r.starter || !r.solution))
          throw new BadRequestException(
            "Le TP nécessite un notebook de départ et un corrigé.",
          );
        fields.editorialStatus = "APPROVED";
        fields.reviewedBy = who.id;
        fields.reviewedAt = new Date();
      } else if (body.action === "CHANGES") {
        fields.editorialStatus = "DRAFT";
        fields.reviewedBy = null;
        fields.reviewedAt = null;
        fields.isPublished = false;
      } else if (body.action === "PUBLISH") {
        if (c.editorialStatus !== "APPROVED" || !c.reviewedAt || !c.trainingId)
          throw new BadRequestException(
            "La publication nécessite une validation pédagogique et une formation de rattachement.",
          );
        fields.isPublished = true;
      } else fields.isPublished = false;
      await tx.course.update({ where: { id }, data: fields });
      await this.event(tx, who, id, "COURSE_REVIEW_" + body.action, {
        note: body.note,
        version: c.version,
      });
      return { saved: true };
    });
  }
  async editors(who: Identity, id: string, body: EditorsInput) {
    this.admin(who);
    const ids = [...new Set(body.editorIds)];
    if (
      (await this.db.user.count({
        where: {
          id: { in: ids },
          status: "ACTIVE",
          roles: { some: { role: { code: "TRAINER" } } },
        },
      })) !== ids.length
    )
      throw new BadRequestException("Choisissez des formateurs actifs.");
    return this.db.$transaction(async (tx) => {
      await this.lock(tx, who, id, body.revision, false);
      await tx.course.update({
        where: { id },
        data: { editorIds: ids, version: { increment: 1 } },
      });
      await this.event(tx, who, id, "COURSE_EDITORS_CHANGED", {
        editorIds: ids,
      });
      return { saved: true };
    });
  }
  async access(
    who: Identity,
    id: string,
    learnerId: string,
    body: AccessInput,
  ) {
    this.admin(who);
    if (
      body.trainerId &&
      !(await this.db.user.findFirst({
        where: {
          id: body.trainerId,
          status: { in: ["ACTIVE", "INVITED"] },
          roles: { some: { role: { code: "TRAINER" } } },
        },
      }))
    )
      throw new BadRequestException("Formateur invalide.");
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "LearningEnrollment" WHERE "courseId" = ${id} AND "userId" = ${learnerId} FOR UPDATE`;
      const existing = await tx.learningEnrollment.findUnique({
        where: { courseId_userId: { courseId: id, userId: learnerId } },
      });
      if (!existing) throw new NotFoundException("Attribution introuvable.");
      const result = await tx.learningEnrollment.update({
        where: { id: existing.id },
        data: {
          revokedAt: body.status === "REVOKED" ? new Date() : null,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
          accessReason: body.reason,
          ...(body.trainerId ? { trainerId: body.trainerId } : {}),
          ...(body.groupName ? { groupName: body.groupName } : {}),
        },
      });
      await this.event(
        tx,
        who,
        id,
        "ENROLLMENT_ACCESS_CHANGED",
        {
          status: body.status,
          expiresAt: result.expiresAt,
          reason: body.reason,
          previousTrainerId: existing.trainerId,
          trainerId: result.trainerId,
        },
        learnerId,
      );
      return { saved: true };
    });
  }
  async position(who: Identity, id: string, body: PositioningInput) {
    await this.courses.assertLearner(who, id);
    return this.db.$transaction(async (tx) => {
      const saved = await tx.learningEnrollment.update({
        where: { courseId_userId: { courseId: id, userId: who.id } },
        data: { positioning: { ...body }, positioningAt: new Date() },
        select: { positioning: true, positioningAt: true },
      });
      await this.event(tx, who, id, "POSITIONING_SAVED");
      return saved;
    });
  }
  async written(who: Identity, id: string, body: WrittenWorkInput) {
    await this.courses.assertLearner(who, id);
    const c = await this.db.course.findUniqueOrThrow({
      where: { id },
      select: { resources: true },
    });
    if ((c.resources as any)?.assessment?.mode !== "WRITTEN")
      throw new BadRequestException(
        "Ce cours ne prévoit pas de remise écrite.",
      );
    return this.db.$transaction(async (tx) => {
      const s = await tx.workSubmission.create({
        data: {
          courseId: id,
          userId: who.id,
          writtenWork: body.writtenWork,
          comment: body.comment,
        },
      });
      await this.event(tx, who, id, "WORK_SUBMITTED", {
        submissionId: s.id,
        format: "WRITTEN",
      });
      return { id: s.id, createdAt: s.createdAt };
    });
  }
}
