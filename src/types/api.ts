export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  featured: boolean;
  description: string | null;
  images: string[];
  videoUrl: string | null;
  thumbnail: string | null;
  unitTypes: string[];
  unitTypeDetails: UnitTypeDetail[];
  amenities: string[];
  residentialFeatures: string[];
  provisions: string[];
  buildingFeatures: string[];
  units?: number;
  occupancyRate?: number;
  locationAccessibility: LocationAccessibility;
  featuresAmenities: FeaturesAmenities;
  lifestyleCommunity: LifestyleCommunity;
  additionalInformation: AdditionalInformation;
  updatedAt: Date;
}

export interface UnitTypeDetail {
  [key: string]: string | number | { percentage: number; amount: string; terms: string; } | undefined;
  type: string;
  floorArea: string;
  priceRange: string;
  layoutImage: string;
  reservationFee: string;
  monthlyPayment: {
    percentage: number;
    amount: string;
    terms: string;
  };
  balancePayment: {
    percentage: number;
    amount: string;
    terms: string;
  };
  description: string;
}

export interface LocationAccessibility {
  nearbyLandmarks: string[];
  publicTransport: string[];
  mainRoads: string[];
  travelTimes: string[];
}

export interface FeaturesAmenities {
  propertyHighlights: string[];
  smartHomeFeatures: string[];
  securityFeatures: string[];
  sustainabilityFeatures: string[];
}

export interface LifestyleCommunity {
  neighborhoodType: string;
  localAmenities: string[];
  communityFeatures: string[];
  nearbyEstablishments: string[];
}

export interface AdditionalInformation {
  propertyHistory: string;
  legalInformation: string;
  developmentPlans: string;
  specialNotes: string;
}

export interface PropertyCreateInput {
  title: string;
  location: string;
  description: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  featured?: boolean;
  images?: string[];
  videoUrl?: string;
  thumbnail?: string;
  unitTypes?: string[];
  unitTypeDetails?: UnitTypeDetail[];
  amenities?: string[];
  residentialFeatures?: string[];
  provisions?: string[];
  buildingFeatures?: string[];
  units?: number;
  occupancyRate?: number;
  listingType?: string;
  locationAccessibility?: {
    nearbyLandmarks: string[];
    publicTransport: string[];
    mainRoads: string[];
    travelTimes: string[];
  };
  featuresAmenities?: {
    propertyHighlights: string[];
    smartHomeFeatures: string[];
    securityFeatures: string[];
    sustainabilityFeatures: string[];
  };
  lifestyleCommunity?: {
    neighborhoodType: string;
    localAmenities: string[];
    communityFeatures: string[];
    nearbyEstablishments: string[];
  };
  additionalInformation?: {
    propertyHistory: string;
    legalInformation: string;
    developmentPlans: string;
    specialNotes: string;
  };
}

export interface PropertyUpdateInput {
  id: string;
  title?: string;
  location?: string;
  description?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  featured?: boolean;
  images?: string[];
  videoUrl?: string;
  thumbnail?: string;
  unitTypes?: string[];
  unitTypeDetails?: Array<{
    type: string;
    floorArea: string;
    priceRange: string;
    layoutImage: string;
    reservationFee: string;
    monthlyPayment: {
      percentage: number;
      amount: string;
      terms: string;
    };
    balancePayment: {
      percentage: number;
      amount: string;
      terms: string;
    };
    description: string;
  }>;
  amenities?: string[];
  residentialFeatures?: string[];
  provisions?: string[];
  buildingFeatures?: string[];
  units?: number;
  occupancyRate?: number;
  listingType?: 'For Sale' | 'For Rent' | 'Resale';
  locationAccessibility?: {
    nearbyLandmarks: string[];
    publicTransport: string[];
    mainRoads: string[];
    travelTimes: Array<{ destination: string; duration: string }>;
  };
  featuresAmenities?: {
    propertyHighlights: string[];
    smartHomeFeatures: string[];
    securityFeatures: string[];
    sustainabilityFeatures: string[];
  };
  lifestyleCommunity?: {
    neighborhoodType: string;
    localAmenities: string[];
    communityFeatures: string[];
    nearbyEstablishments: string[];
  };
  additionalInformation?: {
    propertyHistory: string;
    legalInformation: string;
    developmentPlans: string;
    specialNotes: string;
  };
}

export interface UserSignupInput {
  email: string;
  password: string;
  name: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AgentCreateInput {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  image?: string;
}

export interface AgentUpdateInput extends Partial<AgentCreateInput> {
  id: string;
} 