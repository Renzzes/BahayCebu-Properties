import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PropertyUpdateInput, UnitTypeDetail } from '@/types/api';

interface JsonUnitTypeDetail {
  type?: string;
  floorArea?: string;
  priceRange?: string;
  layoutImage?: string;
  reservationFee?: string;
  monthlyPayment?: {
    percentage?: number;
    amount?: string;
    terms?: string;
  };
  balancePayment?: {
    percentage?: number;
    amount?: string;
    terms?: string;
  };
  description?: string;
}

interface LocationAccessibility {
  nearbyLandmarks: string[];
  publicTransport: string[];
  mainRoads: string[];
  travelTimes: Array<{ destination: string; duration: string }>;
}

interface FeaturesAmenities {
  propertyHighlights: string[];
  smartHomeFeatures: string[];
  securityFeatures: string[];
  sustainabilityFeatures: string[];
}

interface LifestyleCommunity {
  neighborhoodType: string;
  localAmenities: string[];
  communityFeatures: string[];
  nearbyEstablishments: string[];
}

interface AdditionalInformation {
  propertyHistory: string;
  legalInformation: string;
  developmentPlans: string;
  specialNotes: string;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id }
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Parse JSON fields
    const locationAccessibility = property.locationAccessibility ? JSON.parse(JSON.stringify(property.locationAccessibility)) : {
      nearbyLandmarks: [],
      publicTransport: [],
      mainRoads: [],
      travelTimes: []
    };
    const featuresAmenities = property.featuresAmenities ? JSON.parse(JSON.stringify(property.featuresAmenities)) : {
      propertyHighlights: [],
      smartHomeFeatures: [],
      securityFeatures: [],
      sustainabilityFeatures: []
    };
    const lifestyleCommunity = property.lifestyleCommunity ? JSON.parse(JSON.stringify(property.lifestyleCommunity)) : {
      neighborhoodType: '',
      localAmenities: [],
      communityFeatures: [],
      nearbyEstablishments: []
    };
    const additionalInformation = property.additionalInformation ? JSON.parse(JSON.stringify(property.additionalInformation)) : {
      propertyHistory: '',
      legalInformation: '',
      developmentPlans: '',
      specialNotes: ''
    };

    // Return the property with parsed JSON fields
    return NextResponse.json({
      ...property,
      locationAccessibility,
      featuresAmenities,
      lifestyleCommunity,
      additionalInformation
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json() as PropertyUpdateInput;

    // Parse JSON fields
    const locationAccessibility = data.locationAccessibility ? JSON.parse(JSON.stringify(data.locationAccessibility)) : {
      nearbyLandmarks: [],
      publicTransport: [],
      mainRoads: [],
      travelTimes: []
    };
    const featuresAmenities = data.featuresAmenities ? JSON.parse(JSON.stringify(data.featuresAmenities)) : {
      propertyHighlights: [],
      smartHomeFeatures: [],
      securityFeatures: [],
      sustainabilityFeatures: []
    };
    const lifestyleCommunity = data.lifestyleCommunity ? JSON.parse(JSON.stringify(data.lifestyleCommunity)) : {
      neighborhoodType: '',
      localAmenities: [],
      communityFeatures: [],
      nearbyEstablishments: []
    };
    const additionalInformation = data.additionalInformation ? JSON.parse(JSON.stringify(data.additionalInformation)) : {
      propertyHistory: '',
      legalInformation: '',
      developmentPlans: '',
      specialNotes: ''
    };

    // Ensure proper data types and handle JSON fields
    const propertyData = {
      title: data.title,
      location: data.location,
      description: data.description,
      price: data.price ? parseFloat(data.price.toString()) : undefined,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms.toString()) : undefined,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms.toString()) : undefined,
      area: data.area ? parseFloat(data.area.toString()) : undefined,
      type: data.type,
      featured: data.featured,
      images: data.images,
      videoUrl: data.videoUrl,
      thumbnail: data.thumbnail,
      unitTypes: data.unitTypes,
      unitTypeDetails: data.unitTypeDetails,
      amenities: data.amenities,
      residentialFeatures: data.residentialFeatures,
      provisions: data.provisions,
      buildingFeatures: data.buildingFeatures,
      units: data.units ? parseInt(data.units.toString()) : undefined,
      occupancyRate: data.occupancyRate ? parseFloat(data.occupancyRate.toString()) : undefined,
      locationAccessibility,
      featuresAmenities,
      lifestyleCommunity,
      additionalInformation
    };

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: propertyData
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.property.delete({
      where: { id: params.id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
} 