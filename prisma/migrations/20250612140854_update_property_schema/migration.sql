/*
  Warnings:

  - You are about to drop the column `listingType` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "listingType",
ALTER COLUMN "featuresAmenities" DROP NOT NULL,
ALTER COLUMN "featuresAmenities" DROP DEFAULT,
ALTER COLUMN "lifestyleCommunity" DROP NOT NULL,
ALTER COLUMN "lifestyleCommunity" DROP DEFAULT,
ALTER COLUMN "locationAccessibility" DROP NOT NULL,
ALTER COLUMN "locationAccessibility" DROP DEFAULT,
ALTER COLUMN "occupancyRate" DROP NOT NULL,
ALTER COLUMN "occupancyRate" DROP DEFAULT,
ALTER COLUMN "units" DROP NOT NULL,
ALTER COLUMN "units" DROP DEFAULT,
ALTER COLUMN "additionalInformation" DROP NOT NULL,
ALTER COLUMN "additionalInformation" DROP DEFAULT;
