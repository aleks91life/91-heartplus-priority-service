/*
  Warnings:

  - Added the required column `type` to the `Rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rules" ADD COLUMN     "type" TEXT NOT NULL;
