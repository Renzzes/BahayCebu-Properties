/*
  Warnings:

  - You are about to drop the column `communityAmenities` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `featuresAndAmenities` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `interiorFeatures` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `lifestyleAndCommunity` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `locationAndAccessibility` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `utilitiesAndProvisions` on the `Property` table. All the data in the column will be lost.
  - The `additionalInformation` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "communityAmenities",
DROP COLUMN "featuresAndAmenities",
DROP COLUMN "interiorFeatures",
DROP COLUMN "lifestyleAndCommunity",
DROP COLUMN "locationAndAccessibility",
DROP COLUMN "utilitiesAndProvisions",
ADD COLUMN     "featuresAmenities" JSONB NOT NULL DEFAULT '{ "propertyHighlights": [], "smartHomeFeatures": [], "securityFeatures": [], "sustainabilityFeatures": [] }',
ADD COLUMN     "lifestyleCommunity" JSONB NOT NULL DEFAULT '{ "neighborhoodType": "", "localAmenities": [], "communityFeatures": [], "nearbyEstablishments": [] }',
ADD COLUMN     "listingType" TEXT NOT NULL DEFAULT 'For Sale',
ADD COLUMN     "locationAccessibility" JSONB NOT NULL DEFAULT '{ "nearbyLandmarks": [], "publicTransport": [], "mainRoads": [], "travelTimes": [] }',
ADD COLUMN     "occupancyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "units" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "additionalInformation",
ADD COLUMN     "additionalInformation" JSONB NOT NULL DEFAULT '{ "propertyHistory": "", "legalInformation": "", "developmentPlans": "", "specialNotes": "" }';
