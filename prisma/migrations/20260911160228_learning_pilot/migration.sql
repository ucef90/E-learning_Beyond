-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "brief" JSONB,
ADD COLUMN     "resources" JSONB,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "answers" JSONB,
ADD COLUMN     "feedback" JSONB;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "explanation" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthThrottle" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthThrottle_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "LearningEnrollment" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotebookDraft" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notebook" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotebookDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSubmission" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notebook" JSONB NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "feedback" TEXT,
    "grade" INTEGER,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningEvent" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "courseId" TEXT,
    "subjectId" TEXT,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_tokenHash_key" ON "PasswordReset"("tokenHash");

-- CreateIndex
CREATE INDEX "LearningEnrollment_trainerId_idx" ON "LearningEnrollment"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningEnrollment_courseId_userId_key" ON "LearningEnrollment"("courseId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotebookDraft_courseId_userId_key" ON "NotebookDraft"("courseId", "userId");

-- CreateIndex
CREATE INDEX "WorkSubmission_courseId_userId_idx" ON "WorkSubmission"("courseId", "userId");

-- CreateIndex
CREATE INDEX "LearningEvent_courseId_subjectId_createdAt_idx" ON "LearningEvent"("courseId", "subjectId", "createdAt");

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningEnrollment" ADD CONSTRAINT "LearningEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningEnrollment" ADD CONSTRAINT "LearningEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningEnrollment" ADD CONSTRAINT "LearningEnrollment_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookDraft" ADD CONSTRAINT "NotebookDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookDraft" ADD CONSTRAINT "NotebookDraft_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSubmission" ADD CONSTRAINT "WorkSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSubmission" ADD CONSTRAINT "WorkSubmission_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
