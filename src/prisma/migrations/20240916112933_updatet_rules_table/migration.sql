/*
  Warnings:

  - You are about to drop the column `data` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `patientSpecific` on the `Rules` table. All the data in the column will be lost.
  - Added the required column `interrogationRules` to the `Rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientRules` to the `Rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rules` to the `Rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rules" DROP COLUMN "data",
DROP COLUMN "hospitalId",
DROP COLUMN "patientSpecific",
ADD COLUMN     "interrogationRules" JSONB NOT NULL,
ADD COLUMN     "patientRules" JSONB NOT NULL,
ADD COLUMN     "rules" JSONB NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "RulesDetails" ADD COLUMN     "episodeId" TEXT;
