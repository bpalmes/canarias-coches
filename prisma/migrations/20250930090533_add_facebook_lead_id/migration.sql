-- CreateIndex
-- Add facebookLeadId column to Lead table
ALTER TABLE "Lead" ADD COLUMN "facebookLeadId" TEXT;

-- Create unique index on facebookLeadId
CREATE UNIQUE INDEX "Lead_facebookLeadId_key" ON "Lead"("facebookLeadId");


