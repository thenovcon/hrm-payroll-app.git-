-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_courseId_fkey";

-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "credentialUrl" TEXT,
ADD COLUMN     "issuer" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "TrainingCourse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
