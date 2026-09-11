-- CreateEnum
CREATE TYPE "ContactRequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'QUALIFIED', 'CLOSED');

-- CreateEnum
CREATE TYPE "QuoteRequestStatus" AS ENUM ('NEW', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST');

-- AlterTable
ALTER TABLE "ContactRequest" ADD COLUMN     "status" "ContactRequestStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN     "status" "QuoteRequestStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
