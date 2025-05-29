export interface AdminProperty {
  id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  price: number;
  units: number;
  occupancyRate: number;
  status: 'Active' | 'Off Market' | 'Sold';
  propertyType: 'Condo' | 'House and Lot' | 'Land';
  listingType: 'For Sale' | 'For Rent' | 'Resale';
  lastUpdated: string;
  featured?: boolean;
  stats: {
    views: number;
    leads: number;
    applications: number;
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
  featured?: boolean;
  type: 'House' | 'Condo' | 'Villa' | 'Land';
  description?: string;
  images?: string[];
}

// Global property store (simulating database)
const globalProperties: AdminProperty[] = [
  {
    id: '1',
    name: 'Prawira Valley',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    description: 'Luxurious residential complex featuring modern amenities and stunning views of the surrounding landscape. Perfect for families seeking comfort and convenience.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&crop=center',
    price: 500000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'House and Lot',
    listingType: 'For Sale',
    lastUpdated: 'Oct. 12',
    featured: true,
    stats: { views: 3233, leads: 67, applications: 8 }
  },
  {
    id: '2',
    name: 'Skyline Retreat',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    description: 'Contemporary high-rise living with panoramic city views and premium facilities. Experience urban lifestyle at its finest.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop&crop=center',
    price: 450000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Condo',
    listingType: 'For Sale',
    lastUpdated: 'Nov. 22',
    featured: true,
    stats: { views: 7239, leads: 38, applications: 5 }
  },
  {
    id: '3',
    name: 'Harmony Haven',
    address: '3825 E Prawirotaman Ave, Jogja',
    description: 'Serene residential community designed for peaceful living with lush gardens and family-friendly amenities.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
    price: 350000,
    units: 86,
    occupancyRate: 78,
    status: 'Off Market',
    propertyType: 'House and Lot',
    listingType: 'For Rent',
    lastUpdated: 'Dec. 16',
    featured: false,
    stats: { views: 7899, leads: 318, applications: 0 }
  },
  {
    id: '4',
    name: 'Greenview Estates',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    description: 'Eco-friendly development surrounded by nature, offering sustainable living without compromising on modern comforts.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop&crop=center',
    price: 400000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'House and Lot',
    listingType: 'Resale',
    lastUpdated: 'Oct. 12',
    featured: true,
    stats: { views: 3233, leads: 67, applications: 8 }
  },
  {
    id: '5',
    name: 'Sapphire Suites',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    description: 'Premium apartment complex with world-class facilities and sophisticated design for discerning residents.',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=250&fit=crop&crop=center',
    price: 600000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Condo',
    listingType: 'For Sale',
    lastUpdated: 'Nov. 22',
    featured: true,
    stats: { views: 7239, leads: 38, applications: 5 }
  },
  {
    id: '6',
    name: 'Urban Nest',
    address: '3825 E Prawirotaman Ave, Jogja',
    description: 'Compact yet comfortable living spaces perfect for young professionals and small families in the heart of the city.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop&crop=center',
    price: 300000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Land',
    listingType: 'For Sale',
    lastUpdated: 'Dec. 16',
    featured: false,
    stats: { views: 7899, leads: 318, applications: 0 }
  }
];

// Property management functions
export const getAllProperties = (): AdminProperty[] => {
  return [...globalProperties];
};

export const getActiveProperties = (): AdminProperty[] => {
  return globalProperties.filter(p => p.status === 'Active');
};

export const getFeaturedProperties = (): AdminProperty[] => {
  return globalProperties.filter(p => p.featured && p.status === 'Active');
};

export const addProperty = (property: Omit<AdminProperty, 'id' | 'lastUpdated' | 'stats'>): AdminProperty => {
  const newProperty: AdminProperty = {
    ...property,
    id: (globalProperties.length + 1).toString(),
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stats: { views: 0, leads: 0, applications: 0 }
  };
  
  globalProperties.push(newProperty);
  return newProperty;
};

export const updateProperty = (id: string, updates: Partial<AdminProperty>): AdminProperty | null => {
  const index = globalProperties.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  globalProperties[index] = {
    ...globalProperties[index],
    ...updates,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  };
  
  return globalProperties[index];
};

export const deleteProperty = (id: string): boolean => {
  const index = globalProperties.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  globalProperties.splice(index, 1);
  return true;
};

export const getPropertyById = (id: string): AdminProperty | null => {
  return globalProperties.find(p => p.id === id) || null;
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
    bedrooms: Math.floor(adminProperty.units / 10) || 2, // Estimate bedrooms based on units
    bathrooms: Math.floor(adminProperty.units / 15) || 1, // Estimate bathrooms
    area: adminProperty.units * 50, // Estimate area based on units
    image: adminProperty.image,
    type: propertyType,
    description: adminProperty.description,
    images: [adminProperty.image],
    featured: adminProperty.featured
  };
};

// Get all properties as PropertyType for client-side display
export const getAllPropertiesAsPropertyType = (): PropertyType[] => {
  return globalProperties
    .filter(p => p.status === 'Active')
    .map(convertAdminPropertyToPropertyType);
};

// Get featured properties as PropertyType for homepage
export const getFeaturedPropertiesAsPropertyType = (): PropertyType[] => {
  return globalProperties
    .filter(p => p.featured && p.status === 'Active')
    .map(convertAdminPropertyToPropertyType);
};

// Initial admin properties data (for backward compatibility)
export const initialAdminProperties: AdminProperty[] = getAllProperties();

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
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80',
    featured: true,
    type: 'Villa',
    images: [
      'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80'
    ]
  },
  '2': {
    id: '2',
    title: 'Luxury Downtown Condo',
    price: 8500000,
    location: 'Cebu Business Park',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
    featured: true,
    type: 'Condo',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80'
    ]
  },
  '3': {
    id: '3',
    title: 'Mountain View Estate',
    price: 12000000,
    location: 'Busay, Cebu',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
    featured: true,
    type: 'House',
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80'
    ]
  },
  '4': {
    id: '4',
    title: 'Waterfront Property with Private Dock',
    price: 18000000,
    location: 'Liloan, Cebu',
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80',
    type: 'House',
    images: [
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80'
    ]
  },
  '5': {
    id: '5',
    title: 'Modern Studio Apartment',
    price: 3500000,
    location: 'IT Park, Cebu',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80',
    type: 'Condo',
    images: [
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80'
    ]
  },
  '6': {
    id: '6',
    title: 'Commercial Lot in Prime Location',
    price: 25000000,
    location: 'Mandaue City, Cebu',
    bedrooms: 0,
    bathrooms: 0,
    area: 1000,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
    type: 'Land',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80'
    ]
  }
}; 