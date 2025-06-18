-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "additionalInformation" TEXT,
ADD COLUMN     "communityAmenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuresAndAmenities" TEXT,
ADD COLUMN     "interiorFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lifestyleAndCommunity" TEXT,
ADD COLUMN     "locationAndAccessibility" TEXT,
ADD COLUMN     "utilitiesAndProvisions" TEXT[] DEFAULT ARRAY[]::TEXT[];
