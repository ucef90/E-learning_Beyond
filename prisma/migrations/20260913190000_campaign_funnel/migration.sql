ALTER TABLE "Lead"
 ADD COLUMN "requestKey" TEXT, ADD COLUMN "receiptCode" TEXT, ADD COLUMN "requestHash" TEXT,
 ADD COLUMN "programmeSlug" TEXT, ADD COLUMN "intent" TEXT, ADD COLUMN "phone" TEXT,
 ADD COLUMN "country" TEXT, ADD COLUMN "preferredTime" TEXT, ADD COLUMN "contactConsentAt" TIMESTAMP(3),
 ADD COLUMN "privacyVersion" TEXT, ADD COLUMN "attribution" JSONB, ADD COLUMN "campaignSource" TEXT,
 ADD COLUMN "campaignName" TEXT, ADD COLUMN "stage" TEXT NOT NULL DEFAULT 'NEW',
 ADD COLUMN "ownerId" TEXT, ADD COLUMN "nextActionAt" TIMESTAMP(3), ADD COLUMN "enrollmentReference" TEXT,
 ADD COLUMN "enrolledAt" TIMESTAMP(3), ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1, ADD COLUMN "expiresAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "Lead_requestKey_key" ON "Lead"("requestKey");
CREATE UNIQUE INDEX "Lead_receiptCode_key" ON "Lead"("receiptCode");
CREATE INDEX "Lead_source_createdAt_idx" ON "Lead"("source", "createdAt");
CREATE INDEX "Lead_stage_nextActionAt_idx" ON "Lead"("stage", "nextActionAt");
CREATE TABLE "LeadActivity" (
 "id" TEXT NOT NULL, "leadId" TEXT NOT NULL, "actorId" TEXT, "action" TEXT NOT NULL,
 "note" TEXT NOT NULL DEFAULT '', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "LeadActivity_leadId_createdAt_idx" ON "LeadActivity"("leadId", "createdAt");
CREATE TABLE "MarketingEvent" (
 "id" TEXT NOT NULL, "name" TEXT NOT NULL, "programmeSlug" TEXT, "path" TEXT NOT NULL,
 "source" TEXT, "campaign" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "expiresAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "MarketingEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MarketingEvent_createdAt_name_idx" ON "MarketingEvent"("createdAt", "name");
CREATE INDEX "MarketingEvent_expiresAt_idx" ON "MarketingEvent"("expiresAt");
ALTER TABLE "ExecutiveApplication" ADD COLUMN "leadId" TEXT, ADD COLUMN "attribution" JSONB,
 ADD COLUMN "privacyVersion" TEXT, ADD COLUMN "consentAt" TIMESTAMP(3);
ALTER TABLE "ExecutiveApplication" ADD CONSTRAINT "ExecutiveApplication_leadId_fkey"
 FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
