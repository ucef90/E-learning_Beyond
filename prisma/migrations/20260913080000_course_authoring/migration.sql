ALTER TABLE "Course"
  ADD COLUMN "editorialStatus" TEXT NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "editorIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "reviewedBy" TEXT,
  ADD COLUMN "reviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewNote" TEXT NOT NULL DEFAULT '';

ALTER TABLE "LearningEnrollment"
  ADD COLUMN "expiresAt" TIMESTAMP(3),
  ADD COLUMN "revokedAt" TIMESTAMP(3),
  ADD COLUMN "accessReason" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "positioning" JSONB,
  ADD COLUMN "positioningAt" TIMESTAMP(3);

ALTER TABLE "WorkSubmission" ALTER COLUMN "notebook" DROP NOT NULL;
ALTER TABLE "WorkSubmission" ADD COLUMN "writtenWork" TEXT;

CREATE TABLE "CourseAsset" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "visibility" TEXT NOT NULL DEFAULT 'LEARNER',
  "content" BYTEA NOT NULL,
  "size" INTEGER NOT NULL,
  "sha256" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CourseAsset_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CourseAsset_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "CourseAsset_courseId_idx" ON "CourseAsset"("courseId");
