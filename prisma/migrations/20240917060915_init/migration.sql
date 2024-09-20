-- CreateTable
CREATE TABLE "PriorityRule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "patientSpecific" BOOLEAN,
    "priority" INTEGER NOT NULL,
    "patientRules" JSONB NOT NULL,
    "interrogationRules" JSONB NOT NULL,
    "rules" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "cloneId" TEXT,
    "tags" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IPCalculation" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "transsmitionId" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IPCalculation.ruleId_index" ON "IPCalculation"("ruleId");

-- AddForeignKey
ALTER TABLE "PriorityRule" ADD FOREIGN KEY ("cloneId") REFERENCES "PriorityRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IPCalculation" ADD FOREIGN KEY ("ruleId") REFERENCES "PriorityRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
