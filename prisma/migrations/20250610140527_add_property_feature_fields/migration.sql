-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "buildingFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "provisions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "residentialFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "unitTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];
