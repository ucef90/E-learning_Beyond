-- CreateTable
CREATE TABLE "QualityRequest" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "requestKey" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stakeholder" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "currentLevel" TEXT,
    "rating" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "assignee" TEXT NOT NULL DEFAULT '',
    "dueDate" TIMESTAMP(3),
    "resolution" TEXT NOT NULL DEFAULT '',
    "responseReference" TEXT NOT NULL DEFAULT '',
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityRequestEvent" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QualityRequestEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityReview" (
    "indicator" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TO_COLLECT',
    "evidenceKind" TEXT NOT NULL DEFAULT 'DRAFT',
    "evidenceReference" TEXT NOT NULL DEFAULT '',
    "owner" TEXT NOT NULL DEFAULT '',
    "note" TEXT NOT NULL DEFAULT '',
    "dueDate" TIMESTAMP(3),
    "revision" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityReview_pkey" PRIMARY KEY ("indicator")
);

-- CreateTable
CREATE TABLE "QualityReviewEvent" (
    "id" TEXT NOT NULL,
    "indicator" INTEGER NOT NULL,
    "actorId" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QualityReviewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QualityRequest_reference_key" ON "QualityRequest"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "QualityRequest_requestKey_key" ON "QualityRequest"("requestKey");

-- CreateIndex
CREATE INDEX "QualityRequest_status_createdAt_idx" ON "QualityRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "QualityRequestEvent_requestId_createdAt_idx" ON "QualityRequestEvent"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "QualityReviewEvent_indicator_createdAt_idx" ON "QualityReviewEvent"("indicator", "createdAt");

-- AddForeignKey
ALTER TABLE "QualityRequestEvent" ADD CONSTRAINT "QualityRequestEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "QualityRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
