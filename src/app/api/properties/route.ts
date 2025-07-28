import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PropertyCreateInput, PropertyUpdateInput } from '@/types/api';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }

    const properties = await prisma.property.findMany();
    
    if (!properties) {
      return NextResponse.json({ error: 'No properties found' }, { status: 404, headers });
    }

    // Ensure all fields are properly initialized for each property
    const response = properties.map(property => ({
      ...property,
      description: property.description || '',
      images: property.images || [],
      videoUrl: property.videoUrl || '',
      thumbnail: property.thumbnail || '',
      unitTypes: property.unitTypes || [],
      unitTypeDetails: Array.isArray(property.unitTypeDetails) ? (property.unitTypeDetails as JsonUnitTypeDetail[]).map(detail => ({
        type: detail?.type || '',
        floorArea: detail?.floorArea || '',
        priceRange: detail?.priceRange || '',
        layoutImage: detail?.layoutImage || '',
        reservationFee: detail?.reservationFee || '',
        monthlyPayment: {
          percentage: detail?.monthlyPayment?.percentage || 15,
          amount: detail?.monthlyPayment?.amount || '',
          terms: detail?.monthlyPayment?.terms || '6 months'
        },
        balancePayment: {
          percentage: detail?.balancePayment?.percentage || 85,
          amount: detail?.balancePayment?.amount || '',
          terms: detail?.balancePayment?.terms || 'bank/cash'
        },
        description: detail?.description || ''
      })) : [],
      amenities: property.amenities || [],
      residentialFeatures: property.residentialFeatures || [],
      provisions: property.provisions || [],
      buildingFeatures: property.buildingFeatures || [],
      units: property.units || 0,
      occupancyRate: property.occupancyRate || 0,
      locationAccessibility: property.locationAccessibility || {
        nearbyLandmarks: [],
        publicTransport: [],
        mainRoads: [],
        travelTimes: []
      },
      featuresAmenities: property.featuresAmenities || {
        propertyHighlights: [],
        smartHomeFeatures: [],
        securityFeatures: [],
        sustainabilityFeatures: []
      },
      lifestyleCommunity: property.lifestyleCommunity || {
        neighborhoodType: '',
        localAmenities: [],
        communityFeatures: [],
        nearbyEstablishments: []
      },
      additionalInformation: property.additionalInformation || {
        propertyHistory: '',
        legalInformation: '',
        developmentPlans: '',
        specialNotes: ''
      }
    }));

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as PropertyCreateInput;

    // Validate required fields
    if (!data.title || !data.location || !data.description) {
      return NextResponse.json({
        error: 'Missing required fields: title, location, or description'
      }, { status: 400 });
    }

    // Ensure proper data types and handle unitTypeDetails
    const propertyData = {
      title: data.title,
      location: data.location,
      description: data.description,
      price: parseFloat(data.price?.toString() || '0'),
      bedrooms: parseInt(data.bedrooms?.toString() || '0'),
      bathrooms: parseInt(data.bathrooms?.toString() || '0'),
      area: parseFloat(data.area?.toString() || '0'),
      type: data.type || 'Condo',
      featured: data.featured || false,
      images: data.images || [],
      videoUrl: data.videoUrl || '',
      thumbnail: data.thumbnail || '',
      unitTypes: data.unitTypes || [],
      unitTypeDetails: Array.isArray(data.unitTypeDetails) ? data.unitTypeDetails : [],
      amenities: data.amenities || [],
      residentialFeatures: data.residentialFeatures || [],
      provisions: data.provisions || [],
      buildingFeatures: data.buildingFeatures || [],
      units: parseInt(data.units?.toString() || '0'),
      occupancyRate: parseFloat(data.occupancyRate?.toString() || '0'),
      listingType: data.listingType || 'For Sale',
      locationAccessibility: data.locationAccessibility || {
        nearbyLandmarks: [],
        publicTransport: [],
        mainRoads: [],
        travelTimes: []
      },
      featuresAmenities: data.featuresAmenities || {
        propertyHighlights: [],
        smartHomeFeatures: [],
        securityFeatures: [],
        sustainabilityFeatures: []
      },
      lifestyleCommunity: data.lifestyleCommunity || {
        neighborhoodType: '',
        localAmenities: [],
        communityFeatures: [],
        nearbyEstablishments: []
      },
      additionalInformation: data.additionalInformation || {
        propertyHistory: '',
        legalInformation: '',
        developmentPlans: '',
        specialNotes: ''
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const property = await prisma.property.create({
      data: propertyData
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json() as PropertyUpdateInput;
    
    if (!data.id) {
      return NextResponse.json({
        error: 'Property ID is required'
      }, { status: 400 });
    }

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
      images: data.images || [],
      videoUrl: data.videoUrl || '',
      thumbnail: data.thumbnail || '',
      unitTypes: data.unitTypes || [],
      unitTypeDetails: Array.isArray(data.unitTypeDetails) ? data.unitTypeDetails : [],
      amenities: data.amenities || [],
      residentialFeatures: data.residentialFeatures || [],
      provisions: data.provisions || [],
      buildingFeatures: data.buildingFeatures || [],
      units: data.units ? parseInt(data.units.toString()) : undefined,
      occupancyRate: data.occupancyRate ? parseFloat(data.occupancyRate.toString()) : undefined,
      listingType: data.listingType || 'For Sale',
      locationAccessibility: data.locationAccessibility || {
        nearbyLandmarks: [],
        publicTransport: [],
        mainRoads: [],
        travelTimes: []
      },
      featuresAmenities: data.featuresAmenities || {
        propertyHighlights: [],
        smartHomeFeatures: [],
        securityFeatures: [],
        sustainabilityFeatures: []
      },
      lifestyleCommunity: data.lifestyleCommunity || {
        neighborhoodType: '',
        localAmenities: [],
        communityFeatures: [],
        nearbyEstablishments: []
      },
      additionalInformation: data.additionalInformation || {
        propertyHistory: '',
        legalInformation: '',
        developmentPlans: '',
        specialNotes: ''
      },
      updatedAt: new Date()
    };

    const property = await prisma.property.update({
      where: { id: data.id },
      data: propertyData
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
} 