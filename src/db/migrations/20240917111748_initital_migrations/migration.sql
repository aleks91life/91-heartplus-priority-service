-- CreateTable
CREATE TABLE "PriorityRules" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rules" JSONB NOT NULL,
    "patientRules" JSONB NOT NULL,
    "interrogationRules" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "patientSpecific" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "PriorityRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interrogation" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL,

    CONSTRAINT "Interrogation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriorityCalculations" (
    "id" SERIAL NOT NULL,
    "ruleId" TEXT NOT NULL,
    "interrogationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "PriorityCalculations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriorityRules" ADD CONSTRAINT "PriorityRules_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PriorityRules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityCalculations" ADD CONSTRAINT "PriorityCalculations_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "PriorityRules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityCalculations" ADD CONSTRAINT "PriorityCalculations_interrogationId_fkey" FOREIGN KEY ("interrogationId") REFERENCES "Interrogation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
