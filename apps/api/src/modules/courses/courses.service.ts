import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../../common/prisma.service";
import { Identity } from "../auth/access";
import { tokenHash } from "../auth/password";
import {
  CourseDto,
  AssignDto,
  NotebookDto,
  SubmitDto,
  ReviewDto,
  QuizDto,
  AccountDto,
} from "./courses.dto";
import { cleanNotebook } from "./notebook";
const include = {
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
const activeAccess = () => ({
  revokedAt: null,
  OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
});
const accessExpired = (row: {
  revokedAt: Date | null;
  expiresAt: Date | null;
}) => !!row.revokedAt || !!(row.expiresAt && row.expiresAt <= new Date());
const userSelect = {
  id: true,
  email: true,
  status: true,
  profile: { select: { fullName: true } },
  roles: { select: { role: { select: { code: true } } } },
};
@Injectable()
export class CoursesService {
  constructor(private readonly db: PrismaService) {}
  private admin(who: Identity) {
    if (!who.roles.includes("ADMIN"))
      throw new ForbiddenException("Accès administrateur requis.");
  }
  private event(
    tx: any,
    who: Identity,
    courseId: string | null,
    action: string,
    subjectId = who.id,
    details: any = {},
  ) {
    return tx.learningEvent.create({
      data: { actorId: who.id, courseId, subjectId, action, details },
    });
  }
  async access(who: Identity, courseId: string, learnerId = who.id) {
    if (who.roles.includes("ADMIN")) return;
    const row = await this.db.learningEnrollment.findUnique({
      where: { courseId_userId: { courseId, userId: learnerId } },
    });
    if (
      !row ||
      (who.id !== row.userId &&
        !(who.roles.includes("TRAINER") && who.id === row.trainerId))
    )
      throw new ForbiddenException("Ce dossier ne vous est pas attribué.");
    if (who.id === row.userId && accessExpired(row))
      throw new ForbiddenException(
        "Votre accès à ce cours a expiré ou a été suspendu. Contactez le centre.",
      );
  }
  async assertLearner(who: Identity, courseId: string) {
    const row = await this.db.learningEnrollment.findUnique({
      where: { courseId_userId: { courseId, userId: who.id } },
    });
    if (!row || accessExpired(row))
      throw new ForbiddenException(
        "Ce module ne vous est pas attribué ou votre accès a expiré.",
      );
  }
  async list(who: Identity) {
    const own = { userId: who.id, ...activeAccess() };
    const where: Prisma.CourseWhereInput = who.roles.includes("ADMIN")
      ? {}
      : who.roles.includes("TRAINER")
        ? {
            OR: [
              { editorIds: { has: who.id } },
              { learning: { some: { trainerId: who.id } } },
              { learning: { some: own } },
            ],
          }
        : { learning: { some: own } };
    return this.db.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        summary: true,
        version: true,
        isPublished: true,
        editorialStatus: true,
        reviewedAt: true,
        estimatedMinutes: true,
        _count: { select: { learning: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async course(who: Identity, id: string) {
    const course = await this.db.course.findUnique({ where: { id }, include });
    if (!course) throw new NotFoundException("Module introuvable.");
    const editor =
      who.roles.includes("TRAINER") && course.editorIds.includes(who.id);
    const assignedTrainer =
      who.roles.includes("TRAINER") &&
      (await this.db.learningEnrollment.findFirst({
        where: { courseId: id, trainerId: who.id },
      }));
    if (!who.roles.includes("ADMIN") && !editor && !assignedTrainer)
      await this.access(who, id);
    const isAdmin = who.roles.includes("ADMIN");
    const { resources, editorIds, ...visible } = course;
    return {
      ...visible,
      assessment: (resources as any)?.assessment || {
        mode: (resources as any)?.starter ? "NOTEBOOK" : "NONE",
        passingScore: 70,
        rubric: "",
      },
      resources: {
        hasNotebook: !!(resources as any)?.starter,
        hasCsv: !!(resources as any)?.csv,
        hasPractice: !!(resources as any)?.practice,
        hasSolution: !!(resources as any)?.solution,
      },
      modules: course.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          ...l,
          quiz: l.quiz
            ? {
                ...l.quiz,
                questions: l.quiz.questions.map((q) => ({
                  id: q.id,
                  prompt: q.prompt,
                  sortOrder: q.sortOrder,
                  ...(isAdmin ? { explanation: q.explanation } : {}),
                  answers: q.answers.map((a) => ({
                    id: a.id,
                    label: a.label,
                    ...(isAdmin ? { isCorrect: a.isCorrect } : {}),
                  })),
                })),
              }
            : null,
        })),
      })),
    };
  }
  async dashboard(who: Identity) {
    const courses = await this.list(who);
    const courseIds = courses.map((c) => c.id);
    const enrollments = await this.db.learningEnrollment.findMany({
      where: who.roles.includes("ADMIN")
        ? {}
        : who.roles.includes("TRAINER")
          ? {
              OR: [
                { trainerId: who.id },
                { userId: who.id, ...activeAccess() },
              ],
            }
          : { userId: who.id, ...activeAccess() },
      select: {
        id: true,
        courseId: true,
        userId: true,
        trainerId: true,
        groupName: true,
        expiresAt: true,
        revokedAt: true,
        accessReason: true,
        user: { select: { profile: { select: { fullName: true } } } },
        trainer: { select: { profile: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    const pairs = enrollments.map(({ courseId, userId }) => ({
      courseId,
      userId,
    }));
    const [details, progress, attempts, submissions, drafts] =
      await Promise.all([
        this.db.course.findMany({
          where: { id: { in: courseIds } },
          select: {
            id: true,
            resources: true,
            modules: {
              orderBy: { sortOrder: "asc" },
              select: {
                lessons: {
                  orderBy: { sortOrder: "asc" },
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    quiz: { select: { id: true, passingScore: true } },
                  },
                },
              },
            },
          },
        }),
        this.db.lessonProgress.findMany({
          where: {
            completed: true,
            OR: pairs.map((p) => ({
              userId: p.userId,
              lesson: { type: "TEXT", module: { courseId: p.courseId } },
            })),
          },
          select: { userId: true, lessonId: true, completedAt: true },
        }),
        this.db.quizAttempt.findMany({
          where: {
            OR: pairs.map((p) => ({
              userId: p.userId,
              quiz: { lesson: { module: { courseId: p.courseId } } },
            })),
          },
          select: {
            id: true,
            userId: true,
            quizId: true,
            score: true,
            completedAt: true,
          },
          orderBy: { startedAt: "desc" },
        }),
        this.db.workSubmission.findMany({
          where: { OR: pairs },
          select: {
            id: true,
            userId: true,
            courseId: true,
            createdAt: true,
            reviewedAt: true,
            grade: true,
            feedback: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        this.db.notebookDraft.findMany({
          where: { OR: pairs },
          select: {
            userId: true,
            courseId: true,
            updatedAt: true,
            revision: true,
          },
        }),
      ]);
    const visibleCourses = courses.map(({ _count, ...c }) => {
      const detail = details.find((d) => d.id === c.id)!;
      const lessons = detail.modules.flatMap((m) => m.lessons);
      const resources = detail.resources as any;
      return {
        ...c,
        lessons: lessons
          .filter((l) => l.type === "TEXT")
          .map(({ id, title }) => ({ id, title })),
        hasNotebook: !!resources?.starter,
        hasPractice: !!resources?.practice,
        hasCsv: !!resources?.csv,
        hasSolution: !!resources?.solution,
        hasQuiz: lessons.some((l) => l.quiz),
        quizIds: lessons.flatMap((l) => (l.quiz ? [l.quiz.id] : [])),
      };
    });
    return {
      courses: visibleCourses.map(({ quizIds, ...c }) => c),
      enrollments: enrollments.map((e) => {
        const c = visibleCourses.find((c) => c.id === e.courseId)!;
        const read = progress.filter(
          (p) =>
            p.userId === e.userId && c.lessons.some((l) => l.id === p.lessonId),
        );
        const quiz = attempts.find(
          (a) => a.userId === e.userId && c.quizIds.includes(a.quizId),
        );
        const works = submissions.filter(
          (s) => s.userId === e.userId && s.courseId === e.courseId,
        );
        const draft = drafts.find(
          (d) => d.userId === e.userId && d.courseId === e.courseId,
        );
        return {
          ...e,
          lessonsRead: read.length,
          totalLessons: c.lessons.length,
          nextLesson:
            c.lessons.find((l) => !read.some((p) => p.lessonId === l.id)) ||
            null,
          latestQuiz: quiz
            ? { score: quiz.score, completedAt: quiz.completedAt }
            : null,
          submissions: works.map(({ userId, courseId, ...s }) => s),
          draft: draft
            ? { updatedAt: draft.updatedAt, revision: draft.revision }
            : null,
        };
      }),
    };
  }
  async state(who: Identity, id: string, learnerId = who.id) {
    if (learnerId === who.id && who.roles.includes("TRAINER"))
      await this.course(who, id);
    else await this.access(who, id, learnerId);
    const [progress, attempts, submissions, draft, access] = await Promise.all([
      this.db.lessonProgress.findMany({
        where: { userId: learnerId, lesson: { module: { courseId: id } } },
      }),
      this.db.quizAttempt.findMany({
        where: {
          userId: learnerId,
          quiz: { lesson: { module: { courseId: id } } },
        },
        orderBy: { startedAt: "desc" },
        take: 50,
      }),
      this.db.workSubmission.findMany({
        where: { userId: learnerId, courseId: id },
        select: {
          id: true,
          createdAt: true,
          feedback: true,
          grade: true,
          reviewedAt: true,
          comment: true,
          writtenWork: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.db.notebookDraft.findUnique({
        where: { courseId_userId: { courseId: id, userId: learnerId } },
      }),
      this.db.learningEnrollment.findUnique({
        where: { courseId_userId: { courseId: id, userId: learnerId } },
        select: {
          groupName: true,
          createdAt: true,
          expiresAt: true,
          revokedAt: true,
          positioning: true,
          positioningAt: true,
        },
      }),
    ]);
    const completion = await this.completion(
      id,
      learnerId,
      progress,
      submissions,
    );
    return { progress, attempts, submissions, draft, access, completion };
  }
  async progress(
    who: Identity,
    id: string,
    lessonId: string,
    completed: boolean,
  ) {
    await this.assertLearner(who, id);
    const lesson = await this.db.lesson.findFirst({
      where: { id: lessonId, module: { courseId: id }, type: "TEXT" },
    });
    if (!lesson) throw new BadRequestException("Leçon de lecture introuvable.");
    return this.db.$transaction(async (tx) => {
      const result = await tx.lessonProgress.upsert({
        where: { lessonId_userId: { lessonId, userId: who.id } },
        create: {
          lessonId,
          userId: who.id,
          completed,
          completedAt: completed ? new Date() : null,
        },
        update: { completed, completedAt: completed ? new Date() : null },
      });
      await this.event(
        tx,
        who,
        id,
        completed ? "LESSON_MARKED_READ" : "LESSON_REOPENED",
        who.id,
        { lessonId, selfReported: true },
      );
      return result;
    });
  }
  async resource(who: Identity, id: string, name: string) {
    await this.course(who, id);
    if (!["starter", "csv", "solution", "practice"].includes(name))
      throw new NotFoundException();
    const assignedTrainer =
      who.roles.includes("TRAINER") &&
      (await this.db.learningEnrollment.findFirst({
        where: { courseId: id, trainerId: who.id },
      }));
    if (
      name === "solution" &&
      !who.roles.includes("ADMIN") &&
      !assignedTrainer
    ) {
      const reviewed = await this.db.workSubmission.findFirst({
        where: { courseId: id, userId: who.id, reviewedAt: { not: null } },
      });
      if (!reviewed)
        throw new ForbiddenException(
          "Le corrigé est disponible après un retour du formateur.",
        );
    }
    const course = await this.db.course.findUniqueOrThrow({
      where: { id },
      select: { resources: true },
    });
    const data = (course.resources as any)?.[name];
    if (!data) throw new NotFoundException("Ressource indisponible.");
    return name === "csv" ? { content: data } : cleanNotebook(data);
  }
  async saveNotebook(who: Identity, id: string, body: NotebookDto) {
    await this.assertLearner(who, id);
    const notebook = cleanNotebook(body.notebook) as Prisma.InputJsonValue;
    try {
      return await this.db.$transaction(async (tx) => {
        if (body.revision === 0) {
          const draft = await tx.notebookDraft.create({
            data: { courseId: id, userId: who.id, notebook },
          });
          await this.event(tx, who, id, "NOTEBOOK_SAVED", who.id, {
            revision: 1,
          });
          return draft;
        }
        const update = await tx.notebookDraft.updateMany({
          where: { courseId: id, userId: who.id, revision: body.revision },
          data: { notebook, revision: { increment: 1 } },
        });
        if (!update.count)
          throw new ConflictException(
            "Une autre session a enregistré une version plus récente. Exportez votre travail puis rechargez.",
          );
        await this.event(tx, who, id, "NOTEBOOK_SAVED", who.id, {
          revision: body.revision + 1,
        });
        return tx.notebookDraft.findUniqueOrThrow({
          where: { courseId_userId: { courseId: id, userId: who.id } },
        });
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      )
        throw new ConflictException(
          "Un brouillon existe déjà. Rechargez avant de sauvegarder.",
        );
      throw e;
    }
  }
  async submit(who: Identity, id: string, body: SubmitDto) {
    await this.assertLearner(who, id);
    const notebook = cleanNotebook(body.notebook) as Prisma.InputJsonValue;
    return this.db.$transaction(async (tx) => {
      const submission = await tx.workSubmission.create({
        data: { courseId: id, userId: who.id, notebook, comment: body.comment },
      });
      await this.event(tx, who, id, "WORK_SUBMITTED", who.id, {
        submissionId: submission.id,
      });
      return submission;
    });
  }
  async submission(who: Identity, id: string, submissionId: string) {
    const submission = await this.db.workSubmission.findFirst({
      where: { id: submissionId, courseId: id },
    });
    if (!submission) throw new NotFoundException();
    await this.access(who, id, submission.userId);
    return submission;
  }
  async review(
    who: Identity,
    id: string,
    submissionId: string,
    body: ReviewDto,
  ) {
    if (!who.roles.some((r) => ["ADMIN", "TRAINER"].includes(r)))
      throw new ForbiddenException();
    const item = await this.submission(who, id, submissionId);
    return this.db.$transaction(async (tx) => {
      const result = await tx.workSubmission.update({
        where: { id: submissionId },
        data: { ...body, reviewedBy: who.id, reviewedAt: new Date() },
      });
      await this.event(tx, who, id, "WORK_REVIEWED", item.userId, {
        submissionId,
        previousGrade: item.grade,
        grade: body.grade,
        feedback: body.feedback,
      });
      return result;
    });
  }
  async quiz(who: Identity, id: string, quizId: string, body: QuizDto) {
    await this.assertLearner(who, id);
    const quiz = await this.db.quiz.findFirst({
      where: { id: quizId, lesson: { module: { courseId: id } } },
      include: {
        questions: {
          orderBy: { sortOrder: "asc" },
          include: { answers: true },
        },
      },
    });
    if (!quiz || body.answers.length !== quiz.questions.length)
      throw new BadRequestException("Répondez à toutes les questions.");
    const feedback = quiz.questions.map((q, i) => {
      const answer = q.answers.find((a) => a.id === body.answers[i]);
      if (!answer) throw new BadRequestException("Réponse invalide.");
      return {
        questionId: q.id,
        prompt: q.prompt,
        answer: answer.label,
        correct: answer.isCorrect,
        explanation: q.explanation,
      };
    });
    const score = Math.round(
      (feedback.filter((f) => f.correct).length * 100) / feedback.length,
    );
    return this.db.$transaction(async (tx) => {
      const attempt = await tx.quizAttempt.create({
        data: {
          userId: who.id,
          quizId,
          score,
          answers: body.answers,
          feedback,
          completedAt: new Date(),
        },
      });
      await this.event(tx, who, id, "QUIZ_EVALUATED", who.id, {
        attemptId: attempt.id,
        score,
      });
      return attempt;
    });
  }
  async groups(who: Identity) {
    if (!who.roles.some((r) => ["ADMIN", "TRAINER"].includes(r)))
      throw new ForbiddenException();
    return this.db.learningEnrollment.findMany({
      where: who.roles.includes("ADMIN") ? {} : { trainerId: who.id },
      include: {
        course: { select: { title: true } },
        user: { select: userSelect },
        trainer: { select: { profile: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async users(who: Identity) {
    this.admin(who);
    return this.db.user.findMany({
      select: userSelect,
      orderBy: { email: "asc" },
    });
  }
  async resetLink(who: Identity, userId: string) {
    this.admin(who);
    if (!(await this.db.user.findUnique({ where: { id: userId } })))
      throw new NotFoundException();
    const token = randomBytes(32).toString("hex");
    await this.db.$transaction(async (tx) => {
      await tx.passwordReset.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      });
      await tx.passwordReset.create({
        data: {
          userId,
          tokenHash: tokenHash(token),
          expiresAt: new Date(Date.now() + 3600000),
        },
      });
      await this.event(tx, who, null, "RESET_LINK_CREATED", userId);
    });
    return {
      url: `${process.env.APP_ORIGIN || "http://127.0.0.1:3200"}/recuperation#${token}`,
      expiresInMinutes: 60,
    };
  }
  async createUser(who: Identity, body: AccountDto) {
    this.admin(who);
    const email = body.email.toLowerCase().trim();
    if (await this.db.user.findUnique({ where: { email } }))
      throw new ConflictException("Cette adresse possède déjà un compte.");
    const role = await this.db.role.upsert({
      where: { code: body.role },
      create: { code: body.role, label: body.role },
      update: {},
    });
    const user = await this.db.user.create({
      data: {
        email,
        status: "INVITED",
        profile: { create: { fullName: body.fullName } },
        roles: { create: { roleId: role.id } },
      },
      select: userSelect,
    });
    return { user, ...(await this.resetLink(who, user.id)) };
  }
  private checkCourse(body: CourseDto) {
    if (JSON.stringify(body.brief).length > 30000)
      throw new BadRequestException("Fiche trop longue.");
    for (const l of body.lessons)
      if (l.videoUrl) {
        let url: URL;
        try {
          url = new URL(l.videoUrl);
        } catch {
          throw new BadRequestException("Adresse vidéo invalide.");
        }
        const hosts = (process.env.VIDEO_ALLOWED_HOSTS || "").split(",");
        if (
          url.protocol !== "https:" ||
          !hosts.includes(url.hostname) ||
          !l.transcript?.trim()
        )
          throw new BadRequestException(
            "Vidéo HTTPS sur un hébergeur autorisé et transcription requises.",
          );
      }
  }
  async createCourse(who: Identity, body: CourseDto) {
    this.admin(who);
    this.checkCourse(body);
    return this.db.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          title: body.title,
          slug: `module-${randomBytes(8).toString("hex")}`,
          summary: body.summary,
          brief: body.brief as Prisma.InputJsonValue,
          estimatedMinutes: body.lessons.reduce((n, l) => n + l.durationMin, 0),
          modules: {
            create: {
              title: body.moduleTitle,
              sortOrder: 0,
              lessons: {
                create: body.lessons.map((l, i) => ({
                  title: l.title,
                  slug: `lecon-${i + 1}`,
                  type: "TEXT",
                  sortOrder: i,
                  durationMin: l.durationMin,
                  videoUrl: l.videoUrl || null,
                  content: { body: l.body, transcript: l.transcript || "" },
                })),
              },
            },
          },
        },
      });
      await this.event(tx, who, course.id, "COURSE_CREATED");
      return course;
    });
  }
  async updateCourse(who: Identity, id: string, body: CourseDto) {
    this.admin(who);
    this.checkCourse(body);
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "Course" WHERE id = ${id} FOR UPDATE`;
      if (await tx.learningEnrollment.count({ where: { courseId: id } }))
        throw new ConflictException(
          "Version attribuée et figée. Dupliquez-la pour préparer une nouvelle version.",
        );
      const existing = await tx.course.findUnique({ where: { id }, include });
      if (!existing) throw new NotFoundException();
      if (existing.isPublished)
        throw new ConflictException(
          "Version publiée : dupliquez-la avant modification.",
        );
      const module = existing.modules[0];
      if (!module) throw new BadRequestException("Module manquant.");
      const texts = module.lessons.filter((l) => l.type === "TEXT");
      // Keep stable lesson identities; forbid deleting/reordering a published learning record.
      if (texts.length !== body.lessons.length)
        throw new BadRequestException(
          "Conservez le nombre de leçons ; créez un nouveau module pour une autre structure.",
        );
      await tx.course.update({
        where: { id },
        data: {
          title: body.title,
          summary: body.summary,
          brief: body.brief as Prisma.InputJsonValue,
          estimatedMinutes:
            body.lessons.reduce((n, l) => n + l.durationMin, 0) +
            module.lessons
              .filter((l) => l.type !== "TEXT")
              .reduce((n, l) => n + (l.durationMin || 0), 0),
          version: { increment: 1 },
          editorialStatus: "DRAFT",
          reviewedBy: null,
          reviewedAt: null,
          reviewNote: "",
        },
      });
      await tx.courseModule.update({
        where: { id: module.id },
        data: { title: body.moduleTitle },
      });
      for (const [i, l] of body.lessons.entries())
        await tx.lesson.update({
          where: { id: texts[i].id },
          data: {
            title: l.title,
            content: { body: l.body, transcript: l.transcript || "" },
            durationMin: l.durationMin,
            videoUrl: l.videoUrl || null,
          },
        });
      await this.event(tx, who, id, "COURSE_EDITED");
      return { id };
    });
  }
  async clone(who: Identity, id: string) {
    if (!who.roles.some((r) => ["ADMIN", "TRAINER"].includes(r)))
      throw new ForbiddenException();
    await this.course(who, id);
    const original = await this.db.course.findUnique({
      where: { id },
      include,
    });
    if (!original) throw new NotFoundException();
    return this.db.$transaction(async (tx) => {
      const copy = await tx.course.create({
        data: {
          title: `${original.title} (nouvelle version)`,
          slug: `module-${randomBytes(8).toString("hex")}`,
          summary: original.summary,
          trainingId: original.trainingId,
          estimatedMinutes: original.estimatedMinutes,
          version: original.version + 1,
          brief: original.brief || {},
          resources: original.resources || {},
          editorIds: who.roles.includes("ADMIN")
            ? original.editorIds
            : [who.id],
        },
      });
      for (const m of original.modules) {
        const mod = await tx.courseModule.create({
          data: { courseId: copy.id, title: m.title, sortOrder: m.sortOrder },
        });
        for (const l of m.lessons) {
          const lesson = await tx.lesson.create({
            data: {
              moduleId: mod.id,
              title: l.title,
              slug: l.slug,
              type: l.type,
              content: l.content || {},
              videoUrl: l.videoUrl,
              durationMin: l.durationMin,
              sortOrder: l.sortOrder,
            },
          });
          if (l.quiz)
            await tx.quiz.create({
              data: {
                lessonId: lesson.id,
                title: l.quiz.title,
                passingScore: l.quiz.passingScore,
                questions: {
                  create: l.quiz.questions.map((q) => ({
                    prompt: q.prompt,
                    explanation: q.explanation,
                    sortOrder: q.sortOrder,
                    answers: {
                      create: q.answers.map((a) => ({
                        label: a.label,
                        isCorrect: a.isCorrect,
                      })),
                    },
                  })),
                },
              },
            });
        }
      }
      const assets = await tx.courseAsset.findMany({ where: { courseId: id } });
      for (const { id: assetId, courseId, createdAt, ...asset } of assets)
        await tx.courseAsset.create({ data: { ...asset, courseId: copy.id } });
      await this.event(tx, who, copy.id, "COURSE_CLONED", who.id, {
        sourceId: id,
      });
      return copy;
    });
  }
  async assign(who: Identity, id: string, body: AssignDto) {
    this.admin(who);
    for (const [userId, role] of [
      [body.userId, "LEARNER"],
      [body.trainerId, "TRAINER"],
    ])
      if (
        !(await this.db.user.findFirst({
          where: {
            id: userId,
            status: { in: ["ACTIVE", "INVITED"] },
            roles: { some: { role: { code: role } } },
          },
        }))
      )
        throw new BadRequestException("Stagiaire ou formateur invalide.");
    return this.db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "Course" WHERE id = ${id} FOR UPDATE`;
      if (!(await tx.course.findUnique({ where: { id } })))
        throw new NotFoundException();
      const result = await tx.learningEnrollment.upsert({
        where: { courseId_userId: { courseId: id, userId: body.userId } },
        create: { courseId: id, ...body },
        update: { trainerId: body.trainerId, groupName: body.groupName },
      });
      await this.event(tx, who, id, "COURSE_ASSIGNED", body.userId, {
        trainerId: body.trainerId,
        groupName: body.groupName,
      });
      return result;
    });
  }
  private async completion(
    id: string,
    learnerId: string,
    progress: Array<{ lessonId: string; completed: boolean }>,
    submissions: Array<{ grade: number | null; reviewedAt: Date | null }>,
  ) {
    const course = await this.db.course.findUniqueOrThrow({
      where: { id },
      include,
    });
    const lessons = course.modules.flatMap((m) => m.lessons);
    const texts = lessons.filter((l) => l.type === "TEXT");
    const quizzes = lessons.flatMap((l) => (l.quiz ? [l.quiz] : []));
    const resources = course.resources as any;
    const assessment = resources?.assessment || {
      mode: resources?.starter ? "NOTEBOOK" : "NONE",
      passingScore: 70,
    };
    const scores = await this.db.quizAttempt.groupBy({
      by: ["quizId"],
      where: {
        userId: learnerId,
        quizId: { in: quizzes.map((q) => q.id) },
        completedAt: { not: null },
      },
      _max: { score: true },
    });
    const readingsPassed =
      texts.length > 0 &&
      texts.every((l) =>
        progress.some((p) => p.lessonId === l.id && p.completed),
      );
    const quizResults = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      passingScore: q.passingScore ?? 70,
      bestScore: scores.find((s) => s.quizId === q.id)?._max.score ?? null,
    }));
    const quizzesPassed =
      quizResults.length > 0 &&
      quizResults.every(
        (q) => q.bestScore !== null && q.bestScore >= q.passingScore,
      );
    const assessmentPassed =
      assessment.mode !== "NONE" &&
      submissions.some(
        (s) =>
          s.reviewedAt &&
          s.grade !== null &&
          s.grade >= assessment.passingScore,
      );
    return {
      completed: readingsPassed && quizzesPassed && assessmentPassed,
      readingsPassed,
      quizzesPassed,
      assessmentPassed,
      quizResults,
      assessment,
      rules:
        "Leçons déclarées lues, seuil propre à chaque quiz atteint et travail évalué par le formateur selon la grille du cours. Les clics ne prouvent pas à eux seuls une compétence. Aucune certification professionnelle délivrée.",
    };
  }
  async export(who: Identity, id: string, learnerId: string) {
    await this.access(who, id, learnerId);
    const state = await this.state(who, id, learnerId);
    const [course, events] = await Promise.all([
      this.db.course.findUniqueOrThrow({
        where: { id },
        select: {
          title: true,
          version: true,
          brief: true,
          resources: true,
          modules: {
            include: {
              lessons: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  content: true,
                  durationMin: true,
                },
              },
            },
          },
        },
      }),
      this.db.learningEvent.findMany({
        where: { courseId: id, subjectId: learnerId },
        orderBy: { createdAt: "asc" },
      }),
    ]);
    const count = course.modules
      .flatMap((m) => m.lessons)
      .filter((l) => l.type === "TEXT").length;
    return {
      document: "Relevé pédagogique interne",
      learnerName:
        (
          await this.db.userProfile.findUnique({
            where: { userId: learnerId },
            select: { fullName: true },
          })
        )?.fullName || learnerId,
      certification: "Aucune certification professionnelle délivrée",
      exportedAt: new Date().toISOString(),
      learnerId,
      course: { ...course, resources: undefined },
      ...state,
      completed: state.completion.completed,
      rules: state.completion.rules,
      completion: state.completion,
      events,
    };
  }
}
