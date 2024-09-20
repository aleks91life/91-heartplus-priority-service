-- CreateTable
CREATE TABLE "PriorityRule" (
    "id" TEXT NOT NULL,
    "patientRules" JSONB,
    "interrogationRules" JSONB,
    "rules" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priority" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterrogationPriorityCalculation" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "transmissionId" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);
