-- AlterTable
ALTER TABLE "Rules" ADD COLUMN     "patientId" TEXT,
ADD COLUMN     "patientSpecific" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RulesDetails" ADD COLUMN     "reason" TEXT;
