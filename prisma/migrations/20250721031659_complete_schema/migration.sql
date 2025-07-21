-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "images" TEXT[],
    "videoUrl" TEXT,
    "thumbnail" TEXT,
    "unitTypes" TEXT[],
    "unitTypeDetails" JSONB[],
    "amenities" TEXT[],
    "residentialFeatures" TEXT[],
    "provisions" TEXT[],
    "buildingFeatures" TEXT[],
    "units" INTEGER,
    "occupancyRate" DOUBLE PRECISION,
    "locationAccessibility" JSONB DEFAULT '{ "nearbyLandmarks": [], "publicTransport": [], "mainRoads": [], "travelTimes": [] }',
    "featuresAmenities" JSONB DEFAULT '{ "propertyHighlights": [], "smartHomeFeatures": [], "securityFeatures": [], "sustainabilityFeatures": [] }',
    "lifestyleCommunity" JSONB DEFAULT '{ "neighborhoodType": "", "localAmenities": [], "communityFeatures": [], "nearbyEstablishments": [] }',
    "additionalInformation" JSONB DEFAULT '{ "propertyHistory": "", "legalInformation": "", "developmentPlans": "", "specialNotes": "" }',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "specializations" TEXT[],
    "listings" INTEGER NOT NULL DEFAULT 0,
    "deals" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "socialMedia" JSONB NOT NULL DEFAULT '{ "facebook": "", "instagram": "", "linkedin": "" }',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");
