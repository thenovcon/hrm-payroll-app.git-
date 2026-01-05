-- AlterTable
ALTER TABLE "PerformanceGoal" ADD COLUMN     "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "reviewerComment" TEXT;
