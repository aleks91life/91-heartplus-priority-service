-- CreateTable
CREATE TABLE "Interrogation" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "overriddenPriority" DOUBLE PRECISION,
    "overrideReason" TEXT,
    "priorityDetails" JSONB,
    "priority" DOUBLE PRECISION,
    "calculatedPriority" BOOLEAN NOT NULL DEFAULT false,
    "calculatedAt" TIMESTAMP(3),

    CONSTRAINT "Interrogation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rules" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rules_hospitalId_key" ON "Rules"("hospitalId");
