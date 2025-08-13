import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { Phone, Mail, MapPin, UserPlus, Home, Bath, Bed, Square } from 'lucide-react';
import PropertyGallery from '@/components/ui/PropertyGallery';
import PropertyDetails from '@/components/properties/PropertyDetails';
import LoanCalculator from '@/components/LoanCalculator';
import { PropertyType, getPropertyById, convertAdminPropertyToPropertyType } from '@/data/properties';
import { Agent, getAgent } from '@/data/agents';
import { Card, CardContent } from '@/components/ui/card';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError('No property ID provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const adminProperty = await getPropertyById(id);
        console.log('Admin property from API:', adminProperty);
        
        if (adminProperty) {
          const convertedProperty = convertAdminPropertyToPropertyType(adminProperty);
          console.log('Converted property:', convertedProperty);
          
          if (convertedProperty) {
            setProperty(convertedProperty);
          } else {
            setError('Failed to convert property data');
          }
        } else {
          setError('Property not found');
        }
      } catch (error) {
        console.error('Error loading property:', error);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  // Fetch agent data
  useEffect(() => {
    const loadAgent = async () => {
      try {
        const agentData = await getAgent();
        setAgent(agentData);
      } catch (error) {
        console.error('Error loading agent:', error);
      }
    };
    loadAgent();
  }, []);

  const handleWhatsAppClick = (phone: string) => {
    // Remove any non-numeric characters from phone number
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/ecneralc.aromaj', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bahayCebu-beige">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bahayCebu-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bahayCebu-beige">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {error || 'Property Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Button asChild className="bg-bahayCebu-green hover:bg-bahayCebu-green/90">
            <Link to="/properties">Browse All Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bahayCebu-beige py-12">
      <div className="container-custom">
        {/* Property Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-bahayCebu-darkGray mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2 text-bahayCebu-green" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <PropertyGallery images={property.images || [property.image]} />
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
                <Bed className="h-5 w-5 text-bahayCebu-green" />
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-semibold text-bahayCebu-darkGray">{property.bedrooms}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
                <Bath className="h-5 w-5 text-bahayCebu-green" />
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-semibold text-bahayCebu-darkGray">{property.bathrooms}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
                <Square className="h-5 w-5 text-bahayCebu-green" />
                <div>
                  <p className="text-sm text-gray-500">Floor Area</p>
                  <p className="font-semibold text-bahayCebu-darkGray">{property.area} m²</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
                <Home className="h-5 w-5 text-bahayCebu-green" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-semibold text-bahayCebu-darkGray">{property.type}</p>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <PropertyDetails property={property} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <div className="absolute -top-1 -right-1 z-10 transform rotate-6">
                <div className="bg-emerald-400 text-white px-5 py-1 rounded-full shadow-md">
                  <span className="text-sm font-medium whitespace-nowrap">Best Deal!</span>
                </div>
              </div>
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
            <Card className="bg-white relative">
              <div className="absolute -top-1 -right-1 z-10 transform rotate-6">
                <div className="bg-emerald-400 text-white px-5 py-1 rounded-full shadow-md">
                  <span className="text-sm font-medium whitespace-nowrap">Inquire Now!</span>
                </div>
              </div>
              <CardContent className="p-6">
                {agent ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-medium text-bahayCebu-darkGray text-lg">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.title}</p>
                    </div>
                    
                    <div className="space-y-4">

                      {/* Contact Buttons */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => handleMessengerClick()}
                        >
                          <svg className="h-5 w-5 text-[#0084FF]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.726 7.21V22l3.405-1.869c.909.252 1.871.388 2.869.388 5.523 0 10-4.145 10-9.259C22 6.145 17.523 2 12 2zm1.008 12.461l-2.545-2.719-4.97 2.719 5.467-5.819 2.608 2.719 4.906-2.719-5.466 5.819z"/>
                          </svg>
                          <span>Messenger</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => handleWhatsAppClick(agent.phone)}
                        >
                          <svg className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </Button>
                      </div>

                      {/* Traditional Contact Methods */}
                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Phone className="h-4 w-4 text-bahayCebu-green" />
                          <span>{agent.phone}</span>
                        </Button>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Mail className="h-4 w-4 text-bahayCebu-green" />
                          <span>{agent.email}</span>
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-bahayCebu-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="h-8 w-8 text-bahayCebu-green" />
                    </div>
                    <p className="text-gray-500 font-medium">No Agent Assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = `
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(12deg);
    }
    50% {
      transform: translateY(-10px) rotate(12deg);
    }
    100% {
      transform: translateY(0px) rotate(12deg);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PropertyDetail;
