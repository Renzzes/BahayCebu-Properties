import { UnitTypeDetail } from '@/types/admin';

// Unit type enum
export type UnitType = 
  | 'Studio'
  | 'Studio With Balcony'
  | 'One-Bedroom'
  | 'One-Bedroom With Balcony'
  | 'One-Bedroom With Study'
  | 'Two-Bedroom'
  | 'Two-Bedroom With Balcony'
  | 'Three-Bedroom'
  | 'Three-Bedroom With Terrace'
  | 'Loft Studio'
  | 'One-Bedroom Loft'
  | 'Two-Bedroom With Den'
  | 'Penthouse'
  | 'Junior One-Bedroom'
  | 'Duplex Two-Bedroom';

// Building amenities
export type BuildingAmenity = 
  | '4 Levels of Podium Parking'
  | '4 High-Speed Elevators'
  | 'Elevator Key Card Access'
  | 'Fire Alarm System & Sprinklers'
  | '24-Hour Security System'
  | 'Building Management System'
  | 'Main Lobby with Reception Area'
  | 'Individual Mailboxes'
  | 'Workspace and Study Rooms'
  | 'Conference/Function Room'
  | 'Fitness Gym'
  | '25-Meter Swimming Pool and Sundeck'
  | 'Kiddie Pool'
  | 'Sky Garden'
  | 'Viewing Deck'
  | 'Concierge Services'
  | 'High-Speed Wi-Fi in Common Areas'
  | 'Bicycle Storage and Repair Station'
  | 'Pet-Friendly Facilities with Pet Park'
  | 'Children\'s Indoor Play Area'
  | 'Outdoor BBQ and Picnic Area'
  | 'Yoga and Meditation Space'
  | 'Sauna and Spa Room'
  | 'Game Room with Billiards and Table Tennis'
  | 'Rooftop Lounge with Bar Area'
  | 'Electric Vehicle Charging Stations'
  | 'Car Wash Bay'
  | 'Resident Mobile App for Building Services'
  | 'Package Delivery Lockers'
  | 'Landscaped Courtyard with Seating Areas'
  | 'Outdoor Fitness Stations'
  | 'Community Kitchen for Events'
  | 'Library or Reading Nook'
  | 'Rooftop Cinema or Outdoor Movie Area'
  | 'Guest Suites for Visitors'
  | 'Smart Home Integration in Common Areas'
  | 'Motion-Activated Lighting in Hallways'
  | 'Rainwater Harvesting System'
  | 'Solar Panels for Energy Efficiency'
  | 'On-Site Recycling and Composting Stations'
  | 'Indoor Climbing Wall'
  | 'Virtual Reality Gaming Room'
  | 'Co-Working Business Lounge with Private Booths'
  | 'Rooftop Jogging Track'
  | 'Hydrotherapy Pool or Hot Tub'
  | 'Art Studio or Creative Workshop Space'
  | 'Music Practice Rooms with Soundproofing'
  | 'On-Site Daycare or Childcare Center'
  | 'Community Garden with Raised Planting Beds'
  | 'Outdoor Amphitheater for Events'
  | 'Shuttle Service to Nearby Transit Hubs'
  | 'On-Site Café or Juice Bar'
  | 'Dog Washing and Grooming Station'
  | 'Multi-Sport Court'
  | 'Resident Event Space with Stage'
  | 'Smart Lockers for Dry Cleaning or Laundry Services'
  | 'On-Site Bike-Sharing Program'
  | 'Zen Water Feature or Reflection Pond'
  | 'Outdoor Chess or Board Game Area'
  | 'High-Tech Fitness Studio with Virtual Classes'
  | 'Rooftop Fire Pits with Seating'
  | 'Sensory Room for Relaxation'
  | 'Dedicated Delivery Drop-Off Zone'
  | 'Smart Thermostats in Common Areas'
  | 'Green Wall or Vertical Garden'
  | 'Indoor Aquaponics or Herb Garden'
  | 'Private Dining Rooms for Resident Events'
  | 'On-Site Fitness Trainers or Classes'
  | 'Rooftop Stargazing Area with Telescopes'
  | 'Automated Parking System for Efficiency'
  | 'Indoor Golf Simulator'
  | 'Karaoke Lounge'
  | 'Craft Beer or Wine Tasting Room'
  | 'Rooftop Herb and Vegetable Garden'
  | 'Outdoor Yoga Lawn'
  | 'Interactive Digital Art Installation'
  | 'Skateboard or Rollerblade Mini-Park'
  | 'On-Site Car Rental Service'
  | 'Smart Mirrors in Fitness Areas'
  | 'Resident Art Gallery or Exhibition Space'
  | 'Soundproof Podcast Recording Studio'
  | 'Outdoor Putting Green'
  | 'Rooftop Infinity Pool'
  | 'Community Book Exchange Station'
  | 'Meditation Garden with Waterfall'
  | 'On-Site Tailoring or Alteration Service'
  | 'Virtual Concierge for 24/7 Assistance'
  | 'Outdoor Sculpture Garden'
  | 'High-Tech Laundry Rooms with App Notifications'
  | 'Resident Carpool or Ride-Sharing Program'
  | 'Indoor Zen Rock Garden'
  | 'Outdoor Pet Agility Course'
  | 'Smart Vending Machines for Snacks and Essentials'
  | 'Rooftop Beehives for Local Honey Production'
  | 'Interactive Kids\' Science Lab'
  | 'On-Site Farmers\' Market Space'
  | 'Rooftop Observatory with Astronomy Classes'
  | 'Smart Irrigation System for Gardens'
  | 'Resident Volunteer Program Hub'
  | 'Multi-Faith Prayer or Meditation Room';

// Residential features
export type ResidentialFeature =
  | 'Porcelain Tiles in the Dwelling Area'
  | 'Painted Walls and Ceilings'
  | 'Universal Type Convenience Outlet'
  | 'Grease Trap'
  | 'Kitchen Countertop (Quartz or Granite)'
  | 'Upper and Lower Kitchen Cabinets'
  | 'Engineered Wood Flooring in Bedrooms'
  | 'LED Recessed Lighting'
  | 'Built-In Wardrobes with Sliding Doors'
  | 'High-Quality Stainless Steel Kitchen Sink'
  | 'Modern Bathroom Fixtures'
  | 'Ceramic Tiles in Bathrooms'
  | 'Glass Shower Enclosures'
  | 'Smart Home Lighting Controls'
  | 'Soundproofed Interior Walls'
  | 'Anti-Slip Tiles on Balconies'
  | 'Frosted Glass Partitions for Privacy'
  | 'Built-In Shoe Racks at Entryways'
  | 'Natural Stone Accent Walls in Living Areas'
  | 'Energy-Efficient Windows with UV Protection'
  | 'Customizable Wall Shelving Units'
  | 'Integrated USB Charging Ports in Outlets'
  | 'High-Gloss Kitchen Backsplash'
  | 'Smart Thermostat for Climate Control'
  | 'Vinyl Flooring in Utility Areas';

// Provisions
export type PropertyProvision =
  | 'Individual Electric and Water Meter'
  | 'Provision for Cable TV, Telephone, and Internet Line'
  | 'Provision for Induction Cooktop and Microwave'
  | 'Ventilation for Kitchen and Toilets'
  | 'Window-Type Air Conditioner Provision in All Units'
  | 'Provision for Water Heater in Toilet'
  | 'Washer/Dryer Provision for Each Unit'
  | 'Smart Lock System Provision'
  | 'Provision for Home Security System'
  | 'Fiber-Optic Internet Wiring'
  | 'Provision for Ceiling Fans in Living Areas'
  | 'Hot and Cold Water Lines in Bathrooms'
  | 'Provision for Smart Home Automation Hub'
  | 'Dedicated Outlet for Electric Vehicle Charger'
  | 'Provision for Wall-Mounted TV in Living Room'
  | 'Exhaust Fan Provision in Laundry Area'
  | 'Provision for Dishwasher in Larger Units'
  | 'Pre-Wired Surround Sound System'
  | 'Provision for Under-Cabinet Kitchen Lighting'
  | 'Backup Battery Provision for Emergency Lighting';

// Building features
export type BuildingFeature =
  | '4 Levels of Podium Parking'
  | '4 High-Speed Elevators'
  | 'Elevator Key Card Access'
  | '100% Backup Power'
  | 'Fire Alarm System & Sprinklers'
  | '24-Hour Security System'
  | 'Designed by LPPA and Master Planned by Broadway Malyan'
  | 'Building Management System'
  | 'Wi-Fi at Selected Amenity Areas'
  | 'Material Recovery Facility'
  | 'Complete Information Directory'
  | '2 Fire Exit Stairs'
  | 'Landscaped Areas'
  | '5-Storey Commercial Space'
  | 'Automated Parking Guidance System'
  | 'CCTV Surveillance in Common Areas'
  | 'Solar-Powered Common Area Lighting'
  | 'Rainwater Harvesting System'
  | 'Centralized Waste Management System'
  | 'Smart Building Access Control'
  | 'Energy-Efficient HVAC Systems'
  | 'Green Roof with Native Plants'
  | 'Electric Vehicle Charging Stations'
  | 'Bicycle Parking with Repair Station'
  | 'Resident Mobile App for Building Services'
  | 'High-Efficiency Elevators with Regenerative Drives'
  | 'Acoustic Insulation for Noise Reduction'
  | 'On-Site Property Management Office'
  | 'Package Delivery Lockers'
  | 'Seismic-Resilient Structural Design';

export interface AdminProperty {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  pricePerSqm?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floorArea?: number;
  propertyType?: string;
  type: 'Condo' | 'House and Lot' | 'Land';
  featured: boolean;
  videoUrl?: string;
  thumbnail?: string;
  lastUpdated: string;
  createdAt: string;
  unitTypes: string[];
  unitTypeDetails?: UnitTypeDetail[];
  amenities: string[];
  residentialFeatures: string[];
  provisions: string[];
  buildingFeatures: string[];
  stats: {
    views: number;
    leads: number;
    applications: number;
  };
  listingType: 'For Sale' | 'For Rent' | 'Resale';
  units: number;
  occupancyRate: number;
  tags?: string[];
  features?: string[];
  // New Property Overview fields
  locationAccessibility?: {
    nearbyLandmarks: string[];
    publicTransport: string[];
    mainRoads: string[];
    travelTimes: { destination: string; duration: string }[];
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

export interface PropertyType {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];
  featured?: boolean;
  type: 'House' | 'Condo' | 'Villa' | 'Land';
  description?: string;
  videoUrl?: string;
  thumbnail?: string;
  unitTypes?: string[];
  unitTypeDetails?: UnitTypeDetail[];
  residentialFeatures?: string[];
  buildingFeatures?: string[];
  amenities?: string[];
  provisions?: string[];
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

// Add type definition for API response
interface PropertyApiResponse {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  featured: boolean;
  description?: string;
  images?: string[];
  videoUrl?: string;
  thumbnail?: string;
  updatedAt: string;
  unitTypes?: string[];
  unitTypeDetails?: Array<{
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
  }>;
  amenities?: string[];
  residentialFeatures?: string[];
  provisions?: string[];
  buildingFeatures?: string[];
  listingType?: string;
  units?: number;
  occupancyRate?: number;
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

// Property management functions
export const getAllProperties = async (): Promise<AdminProperty[]> => {
  try {
    const baseUrl = import.meta.env.MODE === 'production' 
      ? 'https://bahaycebu-properties.com'
      : 'http://localhost:8081';

    const response = await fetch(`${baseUrl}/api/properties`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Invalid content type:', contentType, 'Response:', text);
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();
    
    return data.map((property: PropertyApiResponse) => ({
      id: property.id,
      title: property.title,
      location: property.location,
      description: property.description || '',
      image: property.images?.[0] || '',
      images: property.images || [],
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      type: property.type as AdminProperty['type'],
      featured: property.featured || false,
      videoUrl: property.videoUrl || '',
      thumbnail: property.thumbnail || '',
      lastUpdated: new Date(property.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdAt: property.updatedAt,
      unitTypes: property.unitTypes || [],
      unitTypeDetails: Array.isArray(property.unitTypeDetails) ? property.unitTypeDetails.map(detail => ({
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
      stats: {
        views: Math.floor(Math.random() * 1000),
        leads: Math.floor(Math.random() * 50),
        applications: Math.floor(Math.random() * 20)
      },
      listingType: property.listingType || 'For Sale',
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
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

export const getPropertyById = async (id: string): Promise<AdminProperty | null> => {
  try {
    const response = await fetch(`/api/properties/${id}`);
    if (!response.ok) throw new Error('Failed to fetch property');
    return await response.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const getActiveProperties = async (): Promise<AdminProperty[]> => {
  const properties = await getAllProperties();
  return properties;
};

export const getFeaturedProperties = async (): Promise<AdminProperty[]> => {
  const properties = await getAllProperties();
  return properties.filter(p => p.featured);
};

export const addProperty = async (property: Omit<AdminProperty, 'id' | 'lastUpdated' | 'stats'>): Promise<AdminProperty | null> => {
  try {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: property.title,
        price: parseFloat(property.price.toString()),
        location: property.location,
        bedrooms: parseInt(property.bedrooms.toString()),
        bathrooms: parseInt(property.bathrooms.toString()),
        area: parseFloat(property.area.toString()),
        type: property.type,
        featured: property.featured,
        description: property.description,
        images: property.images,
        videoUrl: property.videoUrl,
        thumbnail: property.thumbnail,
        unitTypes: property.unitTypes,
        unitTypeDetails: property.unitTypeDetails,
        amenities: property.amenities,
        residentialFeatures: property.residentialFeatures,
        provisions: property.provisions,
        buildingFeatures: property.buildingFeatures,
        listingType: property.listingType,
        units: property.units,
        occupancyRate: property.occupancyRate,
        // New Property Overview fields
        locationAccessibility: property.locationAccessibility,
        featuresAmenities: property.featuresAmenities,
        lifestyleCommunity: property.lifestyleCommunity,
        additionalInformation: property.additionalInformation,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || 'Failed to add property');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding property:', error);
    return null;
  }
};

export const updateProperty = async (id: string, updates: Partial<AdminProperty>): Promise<AdminProperty | null> => {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updates.title,
        price: updates.price,
        location: updates.location,
        bedrooms: updates.bedrooms,
        bathrooms: updates.bathrooms,
        area: updates.area,
        type: updates.type,
        featured: updates.featured,
        description: updates.description,
        images: updates.images,
        videoUrl: updates.videoUrl,
        thumbnail: updates.thumbnail,
        unitTypes: updates.unitTypes,
        unitTypeDetails: updates.unitTypeDetails,
        amenities: updates.amenities,
        residentialFeatures: updates.residentialFeatures,
        provisions: updates.provisions,
        buildingFeatures: updates.buildingFeatures,
        listingType: updates.listingType,
        units: updates.units,
        occupancyRate: updates.occupancyRate,
        // New Property Overview fields
        locationAccessibility: updates.locationAccessibility,
        featuresAmenities: updates.featuresAmenities,
        lifestyleCommunity: updates.lifestyleCommunity,
        additionalInformation: updates.additionalInformation,
      })
    });
    
    if (!response.ok) throw new Error('Failed to update property');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating property:', error);
    return null;
  }
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting property:', error);
    return false;
  }
};

// Helper function to convert AdminProperty to PropertyType
export const convertAdminPropertyToPropertyType = (adminProperty: AdminProperty | null): PropertyType | null => {
  if (!adminProperty) {
    return null;
  }

  let propertyType: PropertyType['type'] = 'House';
  const title = adminProperty.title?.toLowerCase() || '';
  if (title.includes('suite') || title.includes('condo') || title.includes('apartment')) {
    propertyType = 'Condo';
  } else if (title.includes('villa') || title.includes('estate')) {
    propertyType = 'Villa';
  } else if (title.includes('lot') || title.includes('land')) {
    propertyType = 'Land';
  }

  // Default values for arrays
  const defaultAmenities = ['24/7 Security', 'CCTV Surveillance', 'Parking'];
  const defaultResidentialFeatures = ['Modern Kitchen', 'Quality Fixtures', 'Good Ventilation'];
  const defaultBuildingFeatures = ['Well-maintained', 'Professional Management', 'Clean Environment'];
  const defaultProvisions = ['Individual Electric Meter', 'Water Connection', 'Internet Ready'];

  // Ensure unitTypeDetails is properly initialized and validated
  const unitTypeDetails = Array.isArray(adminProperty.unitTypeDetails) 
    ? adminProperty.unitTypeDetails
        .filter(detail => detail && typeof detail === 'object')
        .map(detail => ({
          type: detail.type || '',
          floorArea: detail.floorArea || '',
          priceRange: detail.priceRange || '',
          layoutImage: detail.layoutImage || '',
          reservationFee: detail.reservationFee || '',
          monthlyPayment: {
            percentage: detail.monthlyPayment?.percentage || 0,
            amount: detail.monthlyPayment?.amount || '',
            terms: detail.monthlyPayment?.terms || ''
          },
          balancePayment: {
            percentage: detail.balancePayment?.percentage || 0,
            amount: detail.balancePayment?.amount || '',
            terms: detail.balancePayment?.terms || ''
          },
          description: detail.description || ''
        }))
    : [];

  // Parse JSON fields
  const locationAccessibility = typeof adminProperty.locationAccessibility === 'string'
    ? JSON.parse(adminProperty.locationAccessibility)
    : adminProperty.locationAccessibility || {
        nearbyLandmarks: [],
        publicTransport: [],
        mainRoads: [],
        travelTimes: []
      };

  const featuresAmenities = typeof adminProperty.featuresAmenities === 'string'
    ? JSON.parse(adminProperty.featuresAmenities)
    : adminProperty.featuresAmenities || {
        propertyHighlights: [],
        smartHomeFeatures: [],
        securityFeatures: [],
        sustainabilityFeatures: []
      };

  const lifestyleCommunity = typeof adminProperty.lifestyleCommunity === 'string'
    ? JSON.parse(adminProperty.lifestyleCommunity)
    : adminProperty.lifestyleCommunity || {
        neighborhoodType: '',
        localAmenities: [],
        communityFeatures: [],
        nearbyEstablishments: []
      };

  const additionalInformation = typeof adminProperty.additionalInformation === 'string'
    ? JSON.parse(adminProperty.additionalInformation)
    : adminProperty.additionalInformation || {
        propertyHistory: '',
        legalInformation: '',
        developmentPlans: '',
        specialNotes: ''
      };

  return {
    id: adminProperty.id,
    title: adminProperty.title,
    price: adminProperty.price,
    location: adminProperty.location,
    bedrooms: adminProperty.bedrooms || 0,
    bathrooms: adminProperty.bathrooms || 0,
    area: adminProperty.area,
    image: adminProperty.image || '',
    type: propertyType,
    description: adminProperty.description || '',
    images: adminProperty.images?.length ? adminProperty.images : [adminProperty.image],
    featured: adminProperty.featured,
    videoUrl: adminProperty.videoUrl,
    thumbnail: adminProperty.thumbnail,
    unitTypes: adminProperty.unitTypes?.length ? adminProperty.unitTypes : ['Standard Unit'],
    unitTypeDetails: unitTypeDetails,
    amenities: adminProperty.amenities?.length ? adminProperty.amenities : defaultAmenities,
    residentialFeatures: adminProperty.residentialFeatures?.length ? adminProperty.residentialFeatures : defaultResidentialFeatures,
    provisions: adminProperty.provisions?.length ? adminProperty.provisions : defaultProvisions,
    buildingFeatures: adminProperty.buildingFeatures?.length ? adminProperty.buildingFeatures : defaultBuildingFeatures,
    locationAccessibility,
    featuresAmenities,
    lifestyleCommunity,
    additionalInformation
  };
};

// Get all properties as PropertyType for client-side display
export const getAllPropertiesAsPropertyType = async (): Promise<PropertyType[]> => {
  const properties = await getAllProperties();
  return properties
    .map(convertAdminPropertyToPropertyType)
    .filter((p): p is PropertyType => p !== null);
};

// Get featured properties as PropertyType for homepage
export const getFeaturedPropertiesAsPropertyType = async (): Promise<PropertyType[]> => {
  const properties = await getAllProperties();
  return properties
    .filter(p => p.featured)
    .map(convertAdminPropertyToPropertyType)
    .filter((p): p is PropertyType => p !== null);
};

// Available options arrays
export const UNIT_TYPES: UnitType[] = [
  'Studio',
  'Studio With Balcony',
  'One-Bedroom',
  'One-Bedroom With Balcony',
  'One-Bedroom With Study',
  'Two-Bedroom',
  'Two-Bedroom With Balcony',
  'Three-Bedroom',
  'Three-Bedroom With Terrace',
  'Loft Studio',
  'One-Bedroom Loft',
  'Two-Bedroom With Den',
  'Penthouse',
  'Junior One-Bedroom',
  'Duplex Two-Bedroom'
];

export const BUILDING_AMENITIES: BuildingAmenity[] = [
  '4 Levels of Podium Parking',
  '4 High-Speed Elevators',
  'Elevator Key Card Access',
  'Fire Alarm System & Sprinklers',
  '24-Hour Security System',
  'Building Management System',
  'Main Lobby with Reception Area',
  'Individual Mailboxes',
  'Workspace and Study Rooms',
  'Conference/Function Room',
  'Fitness Gym',
  '25-Meter Swimming Pool and Sundeck',
  'Kiddie Pool',
  'Sky Garden',
  'Viewing Deck',
  'Concierge Services',
  'High-Speed Wi-Fi in Common Areas',
  'Bicycle Storage and Repair Station',
  'Pet-Friendly Facilities with Pet Park',
  'Children\'s Indoor Play Area',
  'Outdoor BBQ and Picnic Area',
  'Yoga and Meditation Space',
  'Sauna and Spa Room',
  'Game Room with Billiards and Table Tennis',
  'Rooftop Lounge with Bar Area',
  'Electric Vehicle Charging Stations',
  'Car Wash Bay',
  'Resident Mobile App for Building Services',
  'Package Delivery Lockers'
];

export const RESIDENTIAL_FEATURES: ResidentialFeature[] = [
  'Porcelain Tiles in the Dwelling Area',
  'Painted Walls and Ceilings',
  'Universal Type Convenience Outlet',
  'Grease Trap',
  'Kitchen Countertop (Quartz or Granite)',
  'Upper and Lower Kitchen Cabinets',
  'Engineered Wood Flooring in Bedrooms',
  'LED Recessed Lighting',
  'Built-In Wardrobes with Sliding Doors',
  'High-Quality Stainless Steel Kitchen Sink',
  'Modern Bathroom Fixtures',
  'Ceramic Tiles in Bathrooms',
  'Glass Shower Enclosures',
  'Smart Home Lighting Controls',
  'Soundproofed Interior Walls',
  'Anti-Slip Tiles on Balconies',
  'Frosted Glass Partitions for Privacy',
  'Built-In Shoe Racks at Entryways',
  'Natural Stone Accent Walls in Living Areas',
  'Energy-Efficient Windows with UV Protection',
  'Customizable Wall Shelving Units',
  'Integrated USB Charging Ports in Outlets',
  'High-Gloss Kitchen Backsplash',
  'Smart Thermostat for Climate Control',
  'Vinyl Flooring in Utility Areas'
];

export const PROPERTY_PROVISIONS: PropertyProvision[] = [
  'Individual Electric and Water Meter',
  'Provision for Cable TV, Telephone, and Internet Line',
  'Provision for Induction Cooktop and Microwave',
  'Ventilation for Kitchen and Toilets',
  'Window-Type Air Conditioner Provision in All Units',
  'Provision for Water Heater in Toilet',
  'Washer/Dryer Provision for Each Unit',
  'Smart Lock System Provision',
  'Provision for Home Security System',
  'Fiber-Optic Internet Wiring',
  'Provision for Ceiling Fans in Living Areas',
  'Hot and Cold Water Lines in Bathrooms',
  'Provision for Smart Home Automation Hub',
  'Dedicated Outlet for Electric Vehicle Charger',
  'Provision for Wall-Mounted TV in Living Room',
  'Exhaust Fan Provision in Laundry Area',
  'Provision for Dishwasher in Larger Units',
  'Pre-Wired Surround Sound System',
  'Provision for Under-Cabinet Kitchen Lighting',
  'Backup Battery Provision for Emergency Lighting'
];

export const BUILDING_FEATURES: BuildingFeature[] = [
  '4 Levels of Podium Parking',
  '4 High-Speed Elevators',
  'Elevator Key Card Access',
  '100% Backup Power',
  'Fire Alarm System & Sprinklers',
  '24-Hour Security System',
  'Designed by LPPA and Master Planned by Broadway Malyan',
  'Building Management System',
  'Wi-Fi at Selected Amenity Areas',
  'Material Recovery Facility',
  'Complete Information Directory',
  '2 Fire Exit Stairs',
  'Landscaped Areas',
  '5-Storey Commercial Space',
  'Automated Parking Guidance System',
  'CCTV Surveillance in Common Areas',
  'Solar-Powered Common Area Lighting',
  'Rainwater Harvesting System',
  'Centralized Waste Management System',
  'Smart Building Access Control',
  'Energy-Efficient HVAC Systems',
  'Green Roof with Native Plants',
  'Electric Vehicle Charging Stations',
  'Bicycle Parking with Repair Station',
  'Resident Mobile App for Building Services',
  'High-Efficiency Elevators with Regenerative Drives',
  'Acoustic Insulation for Noise Reduction',
  'On-Site Property Management Office',
  'Package Delivery Lockers',
  'Seismic-Resilient Structural Design'
]; 