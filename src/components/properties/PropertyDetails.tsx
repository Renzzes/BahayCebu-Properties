import React, { useState } from 'react';
import { PropertyType } from '@/data/properties';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Ruler, 
  CheckCircle2, 
  Star, 
  Building2, 
  Video,
  ChevronDown,
  ChevronUp,
  Home,
  Lightbulb,
  Users,
  Wrench,
  Shield,
  Coffee,
  Leaf,
  Info,
  Navigation,
  Bus,
  Clock,
  Sparkles,
  Cpu,
  Lock,
  Building,
  History,
  FileText,
  AlertCircle,
  ZoomIn
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PropertyDetailsProps {
  property: PropertyType;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const organizeDescription = (description: string) => {
  const categories = {
    location: ['located', 'situated', 'intersection', 'heart of', 'access to', 'proximity'],
    features: ['features', 'amenities', 'facility', 'facilities', 'equipped'],
    lifestyle: ['lifestyle', 'living', 'community', 'experience', 'residents', 'life'],
    security: ['security', 'safety', 'surveillance', 'monitoring', '24-hour', 'backup'],
    sustainability: ['sustainable', 'eco-friendly', 'energy', 'efficient', 'green']
  };

  const sentences = description.split(/[.!?]+/).filter(Boolean).map(s => s.trim());
  
  const organizedContent = {
    location: [] as string[],
    features: [] as string[],
    lifestyle: [] as string[],
    security: [] as string[],
    sustainability: [] as string[],
    other: [] as string[]
  };

  sentences.forEach(sentence => {
    let categorized = false;
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => sentence.toLowerCase().includes(keyword.toLowerCase()))) {
        organizedContent[category as keyof typeof organizedContent].push(sentence);
        categorized = true;
        break;
      }
    }
    if (!categorized) {
      organizedContent.other.push(sentence);
    }
  });

  return organizedContent;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-100 last:border-b-0 py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <h3 className="font-medium text-bahayCebu-darkGray">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      <div
        className={cn(
          "mt-4 pl-13 transition-all duration-200 ease-in-out",
          isExpanded ? "block opacity-100" : "hidden opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const FeatureTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Badge 
    variant="outline" 
    className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-default"
  >
    {children}
  </Badge>
);

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');

  const handleZoomImage = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
  };

  const organizedDescription = property.description ? organizeDescription(property.description) : null;

  // Create a safe container for the embed code
  const createMarkup = (videoUrl: string) => {
    if (!videoUrl) return { __html: '' };
    
    const cleanedUrl = videoUrl.trim();
    
    if (cleanedUrl.startsWith('http')) {
      if (cleanedUrl.includes('youtube.com') || cleanedUrl.includes('youtu.be')) {
        const videoId = cleanedUrl.includes('youtu.be') 
          ? cleanedUrl.split('/').pop() 
          : cleanedUrl.split('v=')[1]?.split('&')[0];
        if (videoId) {
          return { 
            __html: `<iframe 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
              src="https://www.youtube.com/embed/${videoId}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>` 
          };
        }
      } else if (cleanedUrl.includes('vimeo.com')) {
        const videoId = cleanedUrl.split('/').pop();
        if (videoId) {
          return { 
            __html: `<iframe 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
              src="https://player.vimeo.com/video/${videoId}"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>` 
          };
        }
      }
    }
    
    return { __html: '' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'location':
        return <MapPin className="h-5 w-5 text-bahayCebu-green" />;
      case 'features':
        return <Building2 className="h-5 w-5 text-bahayCebu-green" />;
      case 'lifestyle':
        return <Coffee className="h-5 w-5 text-bahayCebu-green" />;
      case 'security':
        return <Shield className="h-5 w-5 text-bahayCebu-green" />;
      case 'sustainability':
        return <Leaf className="h-5 w-5 text-bahayCebu-green" />;
      default:
        return <Info className="h-5 w-5 text-bahayCebu-green" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'location':
        return 'Location & Accessibility';
      case 'features':
        return 'Features & Amenities';
      case 'lifestyle':
        return 'Lifestyle & Community';
      case 'security':
        return 'Security & Safety';
      case 'sustainability':
        return 'Sustainability & Technology';
      default:
        return 'Additional Information';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <Card className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-bahayCebu-green" />
            <h2 className="text-2xl font-serif font-semibold text-bahayCebu-darkGray">
              Property Overview
            </h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Detailed breakdown of this listing's unique features and amenities.
          </p>
        </div>

        {/* Location & Accessibility */}
        <div className="p-6">
          <CollapsibleSection
            title="Location & Accessibility"
            icon={<Navigation className="h-5 w-5 text-bahayCebu-green" />}
          >
            <div className="space-y-6">
              {property.locationAccessibility?.nearbyLandmarks && property.locationAccessibility.nearbyLandmarks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Nearby Landmarks</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.locationAccessibility.nearbyLandmarks.map((landmark: string, index: number) => (
                      <FeatureTag key={index}>{landmark}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.locationAccessibility?.publicTransport && property.locationAccessibility.publicTransport.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Public Transport</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.locationAccessibility.publicTransport.map((transport: string, index: number) => (
                      <FeatureTag key={index}>{transport}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.locationAccessibility?.mainRoads && property.locationAccessibility.mainRoads.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Main Roads</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.locationAccessibility.mainRoads.map((road: string, index: number) => (
                      <FeatureTag key={index}>{road}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.locationAccessibility?.travelTimes && property.locationAccessibility.travelTimes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Travel Times</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.locationAccessibility.travelTimes.map((time: { destination: string; duration: string }, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{time.destination}: {time.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Features & Amenities */}
          <CollapsibleSection
            title="Features & Amenities"
            icon={<Sparkles className="h-5 w-5 text-bahayCebu-green" />}
          >
            <div className="space-y-6">
              {property.featuresAmenities?.propertyHighlights && property.featuresAmenities.propertyHighlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Property Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.featuresAmenities.propertyHighlights.map((highlight: string, index: number) => (
                      <FeatureTag key={index}>{highlight}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.featuresAmenities?.smartHomeFeatures && property.featuresAmenities.smartHomeFeatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Smart Home Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.featuresAmenities.smartHomeFeatures.map((feature: string, index: number) => (
                      <FeatureTag key={index}>{feature}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.featuresAmenities?.securityFeatures && property.featuresAmenities.securityFeatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Security Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.featuresAmenities.securityFeatures.map((feature: string, index: number) => (
                      <FeatureTag key={index}>{feature}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.featuresAmenities?.sustainabilityFeatures && property.featuresAmenities.sustainabilityFeatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Sustainability Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.featuresAmenities.sustainabilityFeatures.map((feature: string, index: number) => (
                      <FeatureTag key={index}>{feature}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Lifestyle & Community */}
          <CollapsibleSection
            title="Lifestyle & Community"
            icon={<Users className="h-5 w-5 text-bahayCebu-green" />}
          >
            <div className="space-y-6">
              {property.lifestyleCommunity?.neighborhoodType && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Neighborhood Type</h4>
                  <p className="text-gray-600">{property.lifestyleCommunity.neighborhoodType}</p>
                </div>
              )}

              {property.lifestyleCommunity?.localAmenities && property.lifestyleCommunity.localAmenities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Local Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.lifestyleCommunity.localAmenities.map((amenity: string, index: number) => (
                      <FeatureTag key={index}>{amenity}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.lifestyleCommunity?.communityFeatures && property.lifestyleCommunity.communityFeatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Community Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.lifestyleCommunity.communityFeatures.map((feature: string, index: number) => (
                      <FeatureTag key={index}>{feature}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}

              {property.lifestyleCommunity?.nearbyEstablishments && property.lifestyleCommunity.nearbyEstablishments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Nearby Establishments</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.lifestyleCommunity.nearbyEstablishments.map((establishment: string, index: number) => (
                      <FeatureTag key={index}>{establishment}</FeatureTag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Additional Information */}
          <CollapsibleSection
            title="Additional Information"
            icon={<Info className="h-5 w-5 text-bahayCebu-green" />}
          >
            <div className="space-y-6">
              {property.additionalInformation?.propertyHistory && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Property History</h4>
                  <p className="text-gray-600">{property.additionalInformation.propertyHistory}</p>
                </div>
              )}

              {property.additionalInformation?.legalInformation && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Legal Information</h4>
                  <p className="text-gray-600">{property.additionalInformation.legalInformation}</p>
                </div>
              )}

              {property.additionalInformation?.developmentPlans && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Development Plans</h4>
                  <p className="text-gray-600">{property.additionalInformation.developmentPlans}</p>
                </div>
              )}

              {property.additionalInformation?.specialNotes && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Special Notes</h4>
                  <p className="text-gray-600">{property.additionalInformation.specialNotes}</p>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Basic Features */}
          <CollapsibleSection
            title="Basic Features"
            icon={<Building2 className="h-5 w-5 text-bahayCebu-green" />}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Bed className="h-4 w-4 text-bahayCebu-green" />
                  <span className="text-sm font-medium text-gray-600">Bedrooms</span>
                </div>
                <p className="text-lg font-semibold text-bahayCebu-darkGray">{property.bedrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Bath className="h-4 w-4 text-bahayCebu-green" />
                  <span className="text-sm font-medium text-gray-600">Bathrooms</span>
                </div>
                <p className="text-lg font-semibold text-bahayCebu-darkGray">{property.bathrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Ruler className="h-4 w-4 text-bahayCebu-green" />
                  <span className="text-sm font-medium text-gray-600">Floor Area</span>
                </div>
                <p className="text-lg font-semibold text-bahayCebu-darkGray">{property.area} m²</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="h-4 w-4 text-bahayCebu-green" />
                  <span className="text-sm font-medium text-gray-600">Type</span>
                </div>
                <p className="text-lg font-semibold text-bahayCebu-darkGray">{property.type}</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Unit Types */}
          {property.unitTypeDetails && property.unitTypeDetails.length > 0 && (
            <CollapsibleSection
              title="Available Unit Types"
              icon={<Building className="h-5 w-5 text-bahayCebu-green" />}
            >
              <div className="space-y-8">
                {property.unitTypeDetails.map((unitType, index) => (
                  <div key={`${unitType.type}-${index}`} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-bahayCebu-green" />
                        <h4 className="font-medium text-bahayCebu-darkGray">{unitType.type || 'Unit Type'}</h4>
                      </div>
                      {unitType.floorArea && (
                        <Badge variant="outline" className="text-bahayCebu-darkGray">
                          {unitType.floorArea} SQM
                        </Badge>
                      )}
                    </div>

                    {/* Price and Payment Details */}
                    <div className="space-y-2 mt-4">
                      {unitType.priceRange && (
                        <p className="text-bahayCebu-blue font-medium">Price Range: {unitType.priceRange}</p>
                      )}
                      {unitType.reservationFee && (
                        <p className="text-gray-600">Reservation Fee: {unitType.reservationFee}</p>
                      )}
                      {unitType.monthlyPayment && unitType.monthlyPayment.amount && (
                        <p className="text-gray-600">
                          {unitType.monthlyPayment.percentage}% Monthly: {unitType.monthlyPayment.amount} ({unitType.monthlyPayment.terms})
                        </p>
                      )}
                      {unitType.balancePayment && unitType.balancePayment.amount && (
                        <p className="text-gray-600">
                          {unitType.balancePayment.percentage}% Balance: {unitType.balancePayment.amount} ({unitType.balancePayment.terms})
                        </p>
                      )}
                    </div>

                    {/* Floor Plan */}
                    {unitType.layoutImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Floor Plan</p>
                        <div className="flex justify-center bg-gray-200 rounded-lg p-4">
                          <div 
                            className="relative group cursor-pointer rounded-lg overflow-hidden inline-block"
                            onClick={() => handleZoomImage(unitType.layoutImage)}
                          >
                            <img
                              src={unitType.layoutImage}
                              alt={`Floor plan for ${unitType.type || 'Unit'}`}
                              className="max-h-[300px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <ZoomIn className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {unitType.description && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">{unitType.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Image Zoom Dialog */}
          <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
            <DialogContent className="max-w-4xl p-0">
              <div className="relative h-[80vh]">
                <img
                  src={zoomedImage}
                  alt="Zoomed floor plan"
                  className="object-contain w-full h-full"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Interior Features */}
          {property.residentialFeatures && property.residentialFeatures.length > 0 && (
            <CollapsibleSection
              title="Interior Features"
              icon={<Lightbulb className="h-5 w-5 text-bahayCebu-green" />}
            >
              <div className="flex flex-wrap gap-2">
                {property.residentialFeatures.map((feature: string, index: number) => (
                  <FeatureTag key={index}>{feature}</FeatureTag>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Building Features */}
          {property.buildingFeatures && property.buildingFeatures.length > 0 && (
            <CollapsibleSection
              title="Building Features"
              icon={<Building2 className="h-5 w-5 text-bahayCebu-green" />}
            >
              <div className="flex flex-wrap gap-2">
                {property.buildingFeatures.map((feature: string, index: number) => (
                  <FeatureTag key={index}>{feature}</FeatureTag>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Community Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <CollapsibleSection
              title="Community Amenities"
              icon={<Users className="h-5 w-5 text-bahayCebu-green" />}
            >
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity: string, index: number) => (
                  <FeatureTag key={index}>{amenity}</FeatureTag>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Utilities & Provisions */}
          {property.provisions && property.provisions.length > 0 && (
            <CollapsibleSection
              title="Utilities & Provisions"
              icon={<Wrench className="h-5 w-5 text-bahayCebu-green" />}
            >
              <div className="flex flex-wrap gap-2">
                {property.provisions.map((provision: string, index: number) => (
                  <FeatureTag key={index}>{provision}</FeatureTag>
                ))}
              </div>
            </CollapsibleSection>
          )}
        </div>

        {/* Video Section */}
        {property.videoUrl && (
          <div className="p-6">
            <CollapsibleSection
              title="Property Video"
              icon={<Video className="h-5 w-5 text-bahayCebu-green" />}
            >
              <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100">
                  <div dangerouslySetInnerHTML={createMarkup(property.videoUrl)} />
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PropertyDetails;
