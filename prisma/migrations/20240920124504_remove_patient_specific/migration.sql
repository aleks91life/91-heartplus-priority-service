/*
  Warnings:

  - You are about to drop the column `patientSpecific` on the `PriorityRule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PriorityRule" DROP COLUMN "patientSpecific",
ALTER COLUMN "status" SET DEFAULT E'active',
ALTER COLUMN "user" DROP NOT NULL;
