-- CreateTable
CREATE TABLE "RulesDetails" (
    "id" SERIAL NOT NULL,
    "ruleId" TEXT NOT NULL,
    "interrogationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RulesDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RulesDetails" ADD CONSTRAINT "RulesDetails_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesDetails" ADD CONSTRAINT "RulesDetails_interrogationId_fkey" FOREIGN KEY ("interrogationId") REFERENCES "Interrogation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
