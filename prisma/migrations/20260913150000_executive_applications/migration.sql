CREATE TABLE "ExecutiveApplication" (
  "id" TEXT NOT NULL, "reference" TEXT NOT NULL, "requestKey" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL, "programmeSlug" TEXT NOT NULL, "programmeTitle" TEXT NOT NULL,
  "kind" TEXT NOT NULL, "requestType" TEXT NOT NULL, "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL, "phone" TEXT NOT NULL DEFAULT '', "country" TEXT NOT NULL,
  "city" TEXT NOT NULL DEFAULT '', "qualification" TEXT NOT NULL, "experience" INTEGER NOT NULL,
  "currentRole" TEXT NOT NULL, "company" TEXT NOT NULL DEFAULT '', "motivation" TEXT NOT NULL,
  "funding" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'RECEIVED',
  "internalNote" TEXT NOT NULL DEFAULT '', "revision" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExecutiveApplication_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ExecutiveApplication_reference_key" ON "ExecutiveApplication"("reference");
CREATE UNIQUE INDEX "ExecutiveApplication_requestKey_key" ON "ExecutiveApplication"("requestKey");
CREATE INDEX "ExecutiveApplication_status_createdAt_idx" ON "ExecutiveApplication"("status", "createdAt");
CREATE INDEX "ExecutiveApplication_programmeSlug_createdAt_idx" ON "ExecutiveApplication"("programmeSlug", "createdAt");
