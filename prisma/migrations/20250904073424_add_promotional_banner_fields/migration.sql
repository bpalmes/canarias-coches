-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "bannerSize" TEXT DEFAULT 'medium',
ADD COLUMN     "bannerSubtitle" TEXT,
ADD COLUMN     "bannerTitle" TEXT,
ADD COLUMN     "hasPromotionalBanner" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "carId" INTEGER,
    "carMake" TEXT,
    "carModel" TEXT,
    "carYear" INTEGER,
    "carLicensePlate" TEXT,
    "carStockNumber" TEXT,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "walcuLeadId" TEXT,
    "walcuStatus" TEXT NOT NULL DEFAULT 'pending',
    "walcuError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_walcuStatus_idx" ON "Lead"("walcuStatus");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;
