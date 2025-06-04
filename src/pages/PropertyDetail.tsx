import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, UserPlus } from 'lucide-react';
import PropertyGallery from '@/components/ui/PropertyGallery';
import PropertyDetails from '@/components/properties/PropertyDetails';
import ContactForm from '@/components/ui/ContactForm';
import FloatingMessage from '@/components/ui/FloatingMessage';
import LoanCalculator from '@/components/LoanCalculator';
import { PropertyType, staticProperties, getPropertyById, convertAdminPropertyToPropertyType } from '@/data/properties';
import { Agent, getAgent } from '@/data/agents';

// Sample property data - in a real application, this would be fetched from an API
const properties: Record<string, PropertyType & { description?: string, images?: string[] }> = {
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

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  
  // First check if it's an admin property
  const adminProperty = getPropertyById(id || '');
  let property: PropertyType | null = null;
  
  if (adminProperty) {
    // Convert admin property to PropertyType
    property = convertAdminPropertyToPropertyType(adminProperty);
  } else {
    // Check static properties
    property = id ? staticProperties[id] : null;
  }

  // Fetch agent data
  useEffect(() => {
    const loadAgent = async () => {
      const agentData = await getAgent();
      setAgent(agentData);
    };
    loadAgent();
  }, []);
  
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bahayCebu-beige">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Button asChild className="bg-bahayCebu-green hover:bg-bahayCebu-green/90">
            <a href="/properties">Browse All Properties</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bahayCebu-beige py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery images={property.images || [property.image]} />
            <PropertyDetails property={property} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-serif text-3xl font-bold text-bahayCebu-green mb-1">
                ₱{property.price.toLocaleString()}
              </h2>
              <p className="text-gray-600 mb-4">
                {property.type} in {property.location}
              </p>
            </div>

            {/* Loan Calculator */}
            <div className="bg-white rounded-lg shadow-sm">
              <LoanCalculator propertyPrice={property.price} />
            </div>

            {/* Agent Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {agent ? (
                <>
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    {agent.image ? (
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-bahayCebu-darkGray">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.title}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{agent.phone}</span>
                    </Button>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{agent.email}</span>
                    </Button>
                  </div>
                  
                  <div className="bg-bahayCebu-beige p-4 rounded-lg">
                    <h4 className="font-semibold text-bahayCebu-darkGray mb-2">
                      About {agent.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {agent.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-bahayCebu-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-bahayCebu-green" />
                  </div>
                  <p className="text-gray-500 font-medium">No Agent Added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Message */}
      <FloatingMessage />
    </div>
  );
};

export default PropertyDetail;
