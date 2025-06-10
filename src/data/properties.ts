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
  name: string;
  address: string;
  location: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  units: number;
  occupancyRate: number;
  status: 'Active' | 'Off Market' | 'Sold';
  propertyType: 'Condo' | 'House and Lot' | 'Land';
  listingType: 'For Sale' | 'For Rent' | 'Resale';
  lastUpdated: string;
  createdAt: string;
  featured?: boolean;
  videoUrl?: string;
  thumbnail?: string;
  unitTypes: string[];
  amenities: string[];
  residentialFeatures: string[];
  provisions: string[];
  buildingFeatures: string[];
  stats: {
    views: number;
    leads: number;
    applications: number;
  };
}

export interface PropertyType {
  id: string;
  title: string;
  description?: string;
  type: 'Condo' | 'Land' | 'House' | 'Villa';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  thumbnail?: string;
  unitTypes?: string[];
  amenities?: string[];
  residentialFeatures?: string[];
  provisions?: string[];
  buildingFeatures?: string[];
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
}

// Global property store (simulating database)
const globalProperties: AdminProperty[] = [
  {
    id: '1',
    name: 'Prawira Valley',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    location: 'Jogja, Indonesia',
    description: 'Luxurious residential complex featuring modern amenities and stunning views of the surrounding landscape. Perfect for families seeking comfort and convenience.',
    image: '',
    images: [],
    price: 500000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'House and Lot',
    listingType: 'For Sale',
    lastUpdated: 'Oct. 12',
    createdAt: '2024-01-12T10:00:00Z',
    featured: true,
    videoUrl: '',
    thumbnail: '',
    unitTypes: [],
    amenities: [],
    residentialFeatures: [],
    provisions: [],
    buildingFeatures: [],
    stats: { views: 3233, leads: 67, applications: 8 }
  },
  {
    id: '2',
    name: 'Skyline Retreat',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    location: 'Jogja, Indonesia',
    description: 'Contemporary high-rise living with panoramic city views and premium facilities. Experience urban lifestyle at its finest.',
    image: '',
    images: [],
    price: 450000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Condo',
    listingType: 'For Sale',
    lastUpdated: 'Nov. 22',
    createdAt: '2024-02-15T14:30:00Z',
    featured: true,
    videoUrl: '',
    thumbnail: '',
    unitTypes: [],
    amenities: [],
    residentialFeatures: [],
    provisions: [],
    buildingFeatures: [],
    stats: { views: 7239, leads: 38, applications: 5 }
  },
  {
    id: '3',
    name: 'Harmony Haven',
    address: '3825 E Prawirotaman Ave, Jogja',
    location: 'Jogja, Indonesia',
    description: 'Serene residential community designed for peaceful living with lush gardens and family-friendly amenities.',
    image: '',
    images: [],
    price: 350000,
    units: 86,
    occupancyRate: 78,
    status: 'Off Market',
    propertyType: 'House and Lot',
    listingType: 'For Rent',
    lastUpdated: 'Dec. 16',
    createdAt: '2024-03-01T09:15:00Z',
    featured: false,
    videoUrl: '',
    thumbnail: '',
    unitTypes: [],
    amenities: [],
    residentialFeatures: [],
    provisions: [],
    buildingFeatures: [],
    stats: { views: 7899, leads: 318, applications: 0 }
  },
  {
    id: '4',
    name: 'Greenview Estates',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    location: 'Jogja, Indonesia',
    description: 'Eco-friendly development surrounded by nature, offering sustainable living without compromising on modern comforts.',
    image: '',
    images: [],
    price: 400000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'House and Lot',
    listingType: 'Resale',
    lastUpdated: 'Oct. 12',
    createdAt: '2024-01-20T16:45:00Z',
    featured: true,
    videoUrl: '',
    thumbnail: '',
    unitTypes: [],
    amenities: [],
    residentialFeatures: [],
    provisions: [],
    buildingFeatures: [],
    stats: { views: 3233, leads: 67, applications: 8 }
  },
  {
    id: '5',
    name: 'Sapphire Suites',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    location: 'Jogja, Indonesia',
    description: 'Premium apartment complex with world-class facilities and sophisticated design for discerning residents.',
    image: '',
    images: [],
    price: 600000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Condo',
    listingType: 'For Sale',
    lastUpdated: 'Nov. 22',
    createdAt: '2024-02-28T11:20:00Z',
    featured: true,
    videoUrl: '',
    thumbnail: '',
    unitTypes: [],
    amenities: [],
    residentialFeatures: [],
    provisions: [],
    buildingFeatures: [],
    stats: { views: 7239, leads: 38, applications: 5 }
  },
  {
    id: '6',
    name: 'Urban Nest',
    address: '3825 E Prawirotaman Ave, Jogja',
    location: 'Jogja, Indonesia',
    description: 'Compact yet comfortable living spaces perfect for young professionals and small families in the heart of the city.',
    image: '',
    images: [],
    price: 300000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Land',
    listingType: 'For Sale',
    lastUpdated: 'Dec. 16',
    createdAt: '2024-03-10T13:50:00Z',
    featured: false,
    videoUrl: '',
    thumbnail: '',
    unitTypes: [],
    amenities: [],
    residentialFeatures: [],
    provisions: [],
    buildingFeatures: [],
    stats: { views: 7899, leads: 318, applications: 0 }
  }
];

// Property management functions
export const getAllProperties = async (): Promise<AdminProperty[]> => {
  try {
    const response = await fetch('/api/properties');
    if (!response.ok) throw new Error('Failed to fetch properties');
    const data = await response.json();
    
    return data.map((property: PropertyApiResponse) => ({
      id: property.id,
      name: property.title,
      address: property.location,
      location: property.location.split(',')[0].trim(),
      description: property.description || '',
      image: property.images?.[0] || '',
      images: property.images || [],
      price: property.price,
      units: property.bedrooms,
      occupancyRate: 0,
      status: 'Active',
      propertyType: property.type as AdminProperty['propertyType'],
      listingType: 'For Sale',
      lastUpdated: new Date(property.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdAt: property.updatedAt,
      featured: property.featured,
      videoUrl: property.videoUrl || '',
      thumbnail: property.thumbnail || '',
      unitTypes: [],
      amenities: [],
      residentialFeatures: [],
      provisions: [],
      buildingFeatures: [],
      stats: { views: 0, leads: 0, applications: 0 }
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return globalProperties;
  }
};

export const getActiveProperties = async (): Promise<AdminProperty[]> => {
  const properties = await getAllProperties();
  return properties.filter(p => p.status === 'Active');
};

export const getFeaturedProperties = async (): Promise<AdminProperty[]> => {
  const properties = await getAllProperties();
  return properties.filter(p => p.featured && p.status === 'Active');
};

export const addProperty = async (property: Omit<AdminProperty, 'id' | 'lastUpdated' | 'stats'>): Promise<AdminProperty | null> => {
  try {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: property.name,
        price: property.price,
        location: property.address,
        bedrooms: property.units,
        bathrooms: Math.ceil(property.units / 2), // Estimate bathrooms based on units
        area: property.units * 50, // Estimate area based on units
        type: property.propertyType,
        featured: property.featured,
        description: property.description,
        images: property.images,
        videoUrl: property.videoUrl,
        thumbnail: property.thumbnail,
        unitTypes: property.unitTypes,
        amenities: property.amenities,
        residentialFeatures: property.residentialFeatures,
        provisions: property.provisions,
        buildingFeatures: property.buildingFeatures
      })
    });

    if (!response.ok) throw new Error('Failed to add property');
    const data = await response.json();

    // Convert API response to AdminProperty format
    return {
      id: data.id,
      name: data.title,
      address: data.location,
      location: data.location.split(',')[0].trim(),
      description: data.description || '',
      image: data.images?.[0] || '',
      images: data.images,
      price: data.price,
      units: data.bedrooms,
      occupancyRate: 0,
      status: 'Active',
      propertyType: data.type as AdminProperty['propertyType'],
      listingType: 'For Sale',
      lastUpdated: new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdAt: data.updatedAt,
      featured: data.featured,
      videoUrl: data.videoUrl || '',
      thumbnail: data.thumbnail || '',
      unitTypes: data.unitTypes || [],
      amenities: data.amenities || [],
      residentialFeatures: data.residentialFeatures || [],
      provisions: data.provisions || [],
      buildingFeatures: data.buildingFeatures || [],
      stats: { views: 0, leads: 0, applications: 0 }
    };
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
        title: updates.name,
        price: updates.price,
        location: updates.address,
        bedrooms: updates.units,
        bathrooms: Math.ceil(updates.units ? updates.units / 2 : 0),
        area: updates.units ? updates.units * 50 : 0,
        type: updates.propertyType,
        featured: updates.featured,
        description: updates.description,
        images: updates.images,
        videoUrl: updates.videoUrl,
        thumbnail: updates.thumbnail,
        unitTypes: updates.unitTypes,
        amenities: updates.amenities,
        residentialFeatures: updates.residentialFeatures,
        provisions: updates.provisions,
        buildingFeatures: updates.buildingFeatures
      })
    });
    
    if (!response.ok) throw new Error('Failed to update property');
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.title,
      address: data.location,
      location: data.location.split(',')[0].trim(),
      description: data.description || '',
      image: data.images?.[0] || '',
      images: data.images,
      price: data.price,
      units: data.bedrooms,
      occupancyRate: updates.occupancyRate || 0,
      status: updates.status || 'Active',
      propertyType: data.type as AdminProperty['propertyType'],
      listingType: updates.listingType || 'For Sale',
      lastUpdated: new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdAt: data.updatedAt,
      featured: data.featured,
      videoUrl: data.videoUrl || '',
      thumbnail: data.thumbnail || '',
      unitTypes: data.unitTypes || [],
      amenities: data.amenities || [],
      residentialFeatures: data.residentialFeatures || [],
      provisions: data.provisions || [],
      buildingFeatures: data.buildingFeatures || [],
      stats: { views: 0, leads: 0, applications: 0 }
    };
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

export const getPropertyById = async (id: string): Promise<AdminProperty | null> => {
  try {
    const response = await fetch(`/api/properties/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Property not found:', id);
        return null;
      }
      throw new Error('Failed to fetch property');
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.title,
      address: data.location,
      location: data.location.split(',')[0].trim(),
      description: data.description || '',
      image: data.images?.[0] || '',
      images: data.images || [],
      price: data.price,
      units: data.bedrooms,
      occupancyRate: 0,
      status: 'Active',
      propertyType: data.type as AdminProperty['propertyType'],
      listingType: 'For Sale',
      lastUpdated: new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdAt: data.updatedAt,
      featured: data.featured,
      videoUrl: data.videoUrl || '',
      thumbnail: data.thumbnail || '',
      unitTypes: data.unitTypes || [],
      amenities: data.amenities || [],
      residentialFeatures: data.residentialFeatures || [],
      provisions: data.provisions || [],
      buildingFeatures: data.buildingFeatures || [],
      stats: { views: 0, leads: 0, applications: 0 }
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

// Convert admin property to PropertyType for detail view
export const convertAdminPropertyToPropertyType = (adminProperty: AdminProperty): PropertyType => {
  // Determine property type based on units or name
  let propertyType: 'House' | 'Condo' | 'Villa' | 'Land' = 'House';
  const name = adminProperty.name.toLowerCase();
  if (name.includes('suite') || name.includes('condo') || name.includes('apartment')) {
    propertyType = 'Condo';
  } else if (name.includes('villa') || name.includes('estate')) {
    propertyType = 'Villa';
  } else if (name.includes('lot') || name.includes('land')) {
    propertyType = 'Land';
  }

  return {
    id: adminProperty.id,
    title: adminProperty.name,
    price: adminProperty.price,
    location: adminProperty.address,
    bedrooms: Math.floor(adminProperty.units / 10) || 2,
    bathrooms: Math.floor(adminProperty.units / 15) || 1,
    area: adminProperty.units * 50,
    image: adminProperty.image,
    type: propertyType,
    description: adminProperty.description,
    images: adminProperty.images,
    featured: adminProperty.featured,
    videoUrl: adminProperty.videoUrl,
    thumbnail: adminProperty.thumbnail
  };
};

// Get all properties as PropertyType for client-side display
export const getAllPropertiesAsPropertyType = async (): Promise<PropertyType[]> => {
  const properties = await getAllProperties();
  return properties
    .filter(p => p.status === 'Active')
    .map(convertAdminPropertyToPropertyType);
};

// Get featured properties as PropertyType for homepage
export const getFeaturedPropertiesAsPropertyType = async (): Promise<PropertyType[]> => {
  const properties = await getAllProperties();
  return properties
    .filter(p => p.featured && p.status === 'Active')
    .map(convertAdminPropertyToPropertyType);
};

// Initial admin properties data (for backward compatibility)
export const initialAdminProperties = globalProperties;

// Static properties for the main website (keeping existing ones for fallback)
export const staticProperties: Record<string, PropertyType & { description?: string, images?: string[] }> = {
  '1': {
    id: '1',
    title: 'Modern Beachfront Villa',
    price: 15000000,
    location: 'Mactan, Cebu',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: '',
    type: 'Villa',
    images: []
  },
  '2': {
    id: '2',
    title: 'Luxury Downtown Condo',
    price: 8500000,
    location: 'Cebu Business Park',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: '',
    type: 'Condo',
    images: []
  },
  '3': {
    id: '3',
    title: 'Mountain View Estate',
    price: 12000000,
    location: 'Busay, Cebu',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    image: '',
    type: 'House',
    images: []
  },
  '4': {
    id: '4',
    title: 'Waterfront Property with Private Dock',
    price: 18000000,
    location: 'Liloan, Cebu',
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    image: '',
    type: 'House',
    images: []
  },
  '5': {
    id: '5',
    title: 'Modern Studio Apartment',
    price: 3500000,
    location: 'IT Park, Cebu',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    image: '',
    type: 'Condo',
    images: []
  },
  '6': {
    id: '6',
    title: 'Commercial Lot in Prime Location',
    price: 25000000,
    location: 'Mandaue City, Cebu',
    bedrooms: 0,
    bathrooms: 0,
    area: 1000,
    image: '',
    type: 'Land',
    images: []
  }
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
  'Package Delivery Lockers',
  'Landscaped Courtyard with Seating Areas',
  'Outdoor Fitness Stations',
  'Community Kitchen for Events',
  'Library or Reading Nook',
  'Rooftop Cinema or Outdoor Movie Area',
  'Guest Suites for Visitors',
  'Smart Home Integration in Common Areas',
  'Motion-Activated Lighting in Hallways',
  'Rainwater Harvesting System',
  'Solar Panels for Energy Efficiency',
  'On-Site Recycling and Composting Stations',
  'Indoor Climbing Wall',
  'Virtual Reality Gaming Room',
  'Co-Working Business Lounge with Private Booths',
  'Rooftop Jogging Track',
  'Hydrotherapy Pool or Hot Tub',
  'Art Studio or Creative Workshop Space',
  'Music Practice Rooms with Soundproofing',
  'On-Site Daycare or Childcare Center',
  'Community Garden with Raised Planting Beds',
  'Outdoor Amphitheater for Events',
  'Shuttle Service to Nearby Transit Hubs',
  'On-Site Café or Juice Bar',
  'Dog Washing and Grooming Station',
  'Multi-Sport Court',
  'Resident Event Space with Stage',
  'Smart Lockers for Dry Cleaning or Laundry Services',
  'On-Site Bike-Sharing Program',
  'Zen Water Feature or Reflection Pond',
  'Outdoor Chess or Board Game Area',
  'High-Tech Fitness Studio with Virtual Classes',
  'Rooftop Fire Pits with Seating',
  'Sensory Room for Relaxation',
  'Dedicated Delivery Drop-Off Zone',
  'Smart Thermostats in Common Areas',
  'Green Wall or Vertical Garden',
  'Indoor Aquaponics or Herb Garden',
  'Private Dining Rooms for Resident Events',
  'On-Site Fitness Trainers or Classes',
  'Rooftop Stargazing Area with Telescopes',
  'Automated Parking System for Efficiency',
  'Indoor Golf Simulator',
  'Karaoke Lounge',
  'Craft Beer or Wine Tasting Room',
  'Rooftop Herb and Vegetable Garden',
  'Outdoor Yoga Lawn',
  'Interactive Digital Art Installation',
  'Skateboard or Rollerblade Mini-Park',
  'On-Site Car Rental Service',
  'Smart Mirrors in Fitness Areas',
  'Resident Art Gallery or Exhibition Space',
  'Soundproof Podcast Recording Studio',
  'Outdoor Putting Green',
  'Rooftop Infinity Pool',
  'Community Book Exchange Station',
  'Meditation Garden with Waterfall',
  'On-Site Tailoring or Alteration Service',
  'Virtual Concierge for 24/7 Assistance',
  'Outdoor Sculpture Garden',
  'High-Tech Laundry Rooms with App Notifications',
  'Resident Carpool or Ride-Sharing Program',
  'Indoor Zen Rock Garden',
  'Outdoor Pet Agility Course',
  'Smart Vending Machines for Snacks and Essentials',
  'Rooftop Beehives for Local Honey Production',
  'Interactive Kids\' Science Lab',
  'On-Site Farmers\' Market Space',
  'Rooftop Observatory with Astronomy Classes',
  'Smart Irrigation System for Gardens',
  'Resident Volunteer Program Hub',
  'Multi-Faith Prayer or Meditation Room'
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