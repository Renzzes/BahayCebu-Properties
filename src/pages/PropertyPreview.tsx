import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Home, Phone, Mail, UserPlus, Star, 
  Building2, Tag, Calendar, Clock, Info, Users, CheckCircle2, Sparkles, Shield, Leaf, Coffee, Building,
  ChevronDown, ChevronUp, Play, Eye, Edit3, Trash2
} from 'lucide-react';
import { AdminProperty, getPropertyById, convertAdminPropertyToPropertyType, PropertyType } from '@/data/properties';
import { Agent, getAgent } from '@/data/agents';
import PropertyGallery from '@/components/ui/PropertyGallery';
import PropertyDetails from '@/components/properties/PropertyDetails';
import LoanCalculator from '@/components/LoanCalculator';
import ZoomableImage from '@/components/ZoomableImage';

// Add styles for the mask effect only
const styles = `
  .mask-bottom {
    mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Default values for property arrays
const DEFAULT_AMENITIES = ['24/7 Security', 'CCTV Surveillance', 'Parking'];
const DEFAULT_RESIDENTIAL_FEATURES = ['Modern Kitchen', 'Quality Fixtures', 'Good Ventilation'];
const DEFAULT_BUILDING_FEATURES = ['Well-maintained', 'Professional Management', 'Clean Environment'];
const DEFAULT_PROVISIONS = ['Individual Electric Meter', 'Water Connection', 'Internet Ready'];
const DEFAULT_UNIT_TYPES = ['Standard Unit'];

const PropertyPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [convertedProperty, setConvertedProperty] = useState<PropertyType | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError('Property ID not found');
        setLoading(false);
        return;
      }

      try {
        const propertyData = await getPropertyById(id);
        if (!propertyData) {
          setError('Property not found');
          setLoading(false);
          return;
        }

        // Parse JSON fields if they are strings
        const processedProperty = {
          ...propertyData,
          locationAccessibility: typeof propertyData.locationAccessibility === 'string'
            ? JSON.parse(propertyData.locationAccessibility)
            : propertyData.locationAccessibility || {
                nearbyLandmarks: [],
                publicTransport: [],
                mainRoads: [],
                travelTimes: []
              },
          featuresAmenities: typeof propertyData.featuresAmenities === 'string'
            ? JSON.parse(propertyData.featuresAmenities)
            : propertyData.featuresAmenities || {
                propertyHighlights: [],
                smartHomeFeatures: [],
                securityFeatures: [],
                sustainabilityFeatures: []
              },
          lifestyleCommunity: typeof propertyData.lifestyleCommunity === 'string'
            ? JSON.parse(propertyData.lifestyleCommunity)
            : propertyData.lifestyleCommunity || {
                neighborhoodType: '',
                localAmenities: [],
                communityFeatures: [],
                nearbyEstablishments: []
              },
          additionalInformation: typeof propertyData.additionalInformation === 'string'
            ? JSON.parse(propertyData.additionalInformation)
            : propertyData.additionalInformation || {
                propertyHistory: '',
                legalInformation: '',
                developmentPlans: '',
                specialNotes: ''
              }
        };

        setProperty(processedProperty);
        const converted = convertAdminPropertyToPropertyType(processedProperty);
        console.log('Converted property:', converted);
        setConvertedProperty(converted);
        setLoading(false);
      } catch (error) {
        console.error('Error loading property:', error);
        setError('Failed to load property');
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleWhatsAppClick = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/ecneralc.aromaj', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bahayCebu-beige to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-bahayCebu-green rounded-full mx-auto" />
          <p className="text-bahayCebu-darkGray">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property || !convertedProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bahayCebu-beige to-white">
        <div className="text-center space-y-4 p-8 max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="w-16 h-16 mx-auto text-bahayCebu-red">
            <Info className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-medium text-bahayCebu-darkGray">
            {error || 'Property not found'}
          </h2>
          <p className="text-gray-600">
            We couldn't find the property you're looking for. Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Property Preview</h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="container py-8">
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-lg bg-muted" />
            <div className="h-64 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
              <Info className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">{error}</p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      ) : property && convertedProperty ? (
        <div className="container pb-8">
          {/* Property Gallery */}
          <div className="my-6">
            <PropertyGallery images={property.images || []} />
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{property.title}</h2>
                        <div className="mt-1 flex items-center text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>{property.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₱{property.price.toLocaleString()}</div>
                        {property.pricePerSqm && (
                          <div className="text-sm text-muted-foreground">
                            ₱{property.pricePerSqm.toLocaleString()}/sqm
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {property.bedrooms && (
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-2">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                      )}
                      {property.floorArea && (
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4" />
                          <span>{property.floorArea} sqm</span>
                        </div>
                      )}
                      {property.propertyType && (
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>{property.propertyType}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {property.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold">Description</h3>
                  <div
                    className={`relative ${
                      !isDescriptionExpanded ? "mask-bottom max-h-40" : ""
                    } overflow-hidden`}
                  >
                    <div className="prose max-w-none">
                      {property.description?.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-2 w-full"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Show Less
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read More
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Property Details */}
              <PropertyDetails property={convertedProperty} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Agent Card */}
              {agent && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                        <img
                          src={agent.image || '/placeholder-agent.jpg'}
                          alt={agent.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.title}</p>
                      <div className="mt-4 space-y-2">
                        <Button className="w-full" variant="default">
                          <Phone className="mr-2 h-4 w-4" />
                          Call Agent
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Agent
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loan Calculator */}
              <LoanCalculator propertyPrice={property.price} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PropertyPreview; 