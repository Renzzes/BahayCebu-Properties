export interface AdminProperty {
  id: string;
  name: string;
  address: string;
  location: string;
  description: string;
  image: string;
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
  videoUrl?: string;
  thumbnail?: string;
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
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&crop=center',
    price: 500000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'House and Lot',
    listingType: 'For Sale',
    lastUpdated: 'Oct. 12',
    createdAt: '2024-01-12T10:00:00Z',
    featured: true,
    videoUrl: 'https://example.com/video1.mp4',
    thumbnail: 'https://example.com/thumbnail1.jpg',
    stats: { views: 3233, leads: 67, applications: 8 }
  },
  {
    id: '2',
    name: 'Skyline Retreat',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    location: 'Jogja, Indonesia',
    description: 'Contemporary high-rise living with panoramic city views and premium facilities. Experience urban lifestyle at its finest.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop&crop=center',
    price: 450000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Condo',
    listingType: 'For Sale',
    lastUpdated: 'Nov. 22',
    createdAt: '2024-02-15T14:30:00Z',
    featured: true,
    videoUrl: 'https://example.com/video2.mp4',
    thumbnail: 'https://example.com/thumbnail2.jpg',
    stats: { views: 7239, leads: 38, applications: 5 }
  },
  {
    id: '3',
    name: 'Harmony Haven',
    address: '3825 E Prawirotaman Ave, Jogja',
    location: 'Jogja, Indonesia',
    description: 'Serene residential community designed for peaceful living with lush gardens and family-friendly amenities.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
    price: 350000,
    units: 86,
    occupancyRate: 78,
    status: 'Off Market',
    propertyType: 'House and Lot',
    listingType: 'For Rent',
    lastUpdated: 'Dec. 16',
    createdAt: '2024-03-01T09:15:00Z',
    featured: false,
    videoUrl: 'https://example.com/video3.mp4',
    thumbnail: 'https://example.com/thumbnail3.jpg',
    stats: { views: 7899, leads: 318, applications: 0 }
  },
  {
    id: '4',
    name: 'Greenview Estates',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    location: 'Jogja, Indonesia',
    description: 'Eco-friendly development surrounded by nature, offering sustainable living without compromising on modern comforts.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop&crop=center',
    price: 400000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'House and Lot',
    listingType: 'Resale',
    lastUpdated: 'Oct. 12',
    createdAt: '2024-01-20T16:45:00Z',
    featured: true,
    videoUrl: 'https://example.com/video4.mp4',
    thumbnail: 'https://example.com/thumbnail4.jpg',
    stats: { views: 3233, leads: 67, applications: 8 }
  },
  {
    id: '5',
    name: 'Sapphire Suites',
    address: '3825 E Prawirotaman Ave, Jogja 85018',
    location: 'Jogja, Indonesia',
    description: 'Premium apartment complex with world-class facilities and sophisticated design for discerning residents.',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=250&fit=crop&crop=center',
    price: 600000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Condo',
    listingType: 'For Sale',
    lastUpdated: 'Nov. 22',
    createdAt: '2024-02-28T11:20:00Z',
    featured: true,
    videoUrl: 'https://example.com/video5.mp4',
    thumbnail: 'https://example.com/thumbnail5.jpg',
    stats: { views: 7239, leads: 38, applications: 5 }
  },
  {
    id: '6',
    name: 'Urban Nest',
    address: '3825 E Prawirotaman Ave, Jogja',
    location: 'Jogja, Indonesia',
    description: 'Compact yet comfortable living spaces perfect for young professionals and small families in the heart of the city.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop&crop=center',
    price: 300000,
    units: 86,
    occupancyRate: 78,
    status: 'Active',
    propertyType: 'Land',
    listingType: 'For Sale',
    lastUpdated: 'Dec. 16',
    createdAt: '2024-03-10T13:50:00Z',
    featured: false,
    videoUrl: 'https://example.com/video6.mp4',
    thumbnail: 'https://example.com/thumbnail6.jpg',
    stats: { views: 7899, leads: 318, applications: 0 }
  }
];

// Property management functions
export const getAllProperties = async (): Promise<AdminProperty[]> => {
  try {
    const response = await fetch('/api/properties');
    if (!response.ok) throw new Error('Failed to fetch properties');
    const data = await response.json();
    
    // Convert API data to AdminProperty format
    return data.map((property: PropertyApiResponse) => ({
      id: property.id,
      name: property.title,
      address: property.location,
      location: property.location.split(',')[0].trim(),
      description: property.description || '',
      image: property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&crop=center',
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
      stats: { views: 0, leads: 0, applications: 0 }
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return globalProperties; // Return mock data if API fails
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
        images: [property.image],
        videoUrl: property.videoUrl,
        thumbnail: property.thumbnail
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
        images: updates.image ? [updates.image] : undefined,
        videoUrl: updates.videoUrl,
        thumbnail: updates.thumbnail
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
    if (!response.ok) throw new Error('Failed to fetch property');
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.title,
      address: data.location,
      location: data.location.split(',')[0].trim(),
      description: data.description || '',
      image: data.images?.[0] || '',
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
    images: [adminProperty.image],
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