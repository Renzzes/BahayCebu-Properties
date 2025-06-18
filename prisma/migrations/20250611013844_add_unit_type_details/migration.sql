/*
  Warnings:

  - You are about to drop the column `embedCode` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "embedCode",
ADD COLUMN     "unitTypeDetails" JSONB[] DEFAULT ARRAY[]::JSONB[];
