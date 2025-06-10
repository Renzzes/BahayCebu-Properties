import React from 'react';
import { PropertyType } from '@/data/properties';
import { MapPin, Bed, Bath, Home, Calendar, Ruler, Car, CheckCircle2, Star, Building2, Shield, Timer, Sparkles, Users, Plug, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PropertyDetailsProps {
  property: PropertyType;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  // Create a safe container for the embed code
  const createMarkup = (videoUrl: string) => {
    // Remove any extra whitespace and ensure the code is clean
    const cleanedUrl = videoUrl.trim();
    
    // Check if the code is a URL
    if (cleanedUrl.startsWith('http')) {
      // Convert URL to embed code
      if (cleanedUrl.includes('youtube.com') || cleanedUrl.includes('youtu.be')) {
        // Extract video ID from YouTube URL
        const videoId = cleanedUrl.includes('youtu.be') 
          ? cleanedUrl.split('/').pop() 
          : cleanedUrl.split('v=')[1]?.split('&')[0];
        if (videoId) {
          return { __html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` };
        }
      } else if (cleanedUrl.includes('vimeo.com')) {
        // Extract video ID from Vimeo URL
        const videoId = cleanedUrl.split('/').pop();
        if (videoId) {
          return { __html: `<iframe width="100%" height="100%" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>` };
        }
      }
    }
    
    return { __html: '' };
  };

  // Debug log for property
  console.log('Property data in PropertyDetails:', property);

  // Enhanced property features with categories
  const details = {
    yearBuilt: '2023',
    lotSize: '300 m²',
    garage: '2 Cars',
    features: {
      interior: property.residentialFeatures || [
        'Modern Kitchen',
        'Master Bedroom with En-suite',
        'Walk-in Closets',
        'High Ceilings'
      ],
      exterior: property.buildingFeatures || [
        'Swimming Pool',
        'Garden/Landscaping',
        'Balcony/Terrace',
        'Outdoor Dining Area'
      ],
      amenities: property.amenities || [
        '24/7 Security',
        'CCTV Surveillance',
        'Gym/Fitness Center',
        'Playground'
      ],
      utilities: property.provisions || [
        'High-Speed Internet Ready',
        'Cable TV Ready',
        'Water Heater',
        'Backup Generator'
      ]
    }
  };

  const nearbyPlaces = [
    'Adventist Hospital: Comprehensive healthcare services',
    'University of San Carlos: Prestigious academic institution',
    'Cebu City Medical Center: Major hospital for diverse care',
    'Gaisano Capital South: Shopping and dining options',
    'SM Seaside: Premier shopping and entertainment hub'
  ];

  return (
    <div className="space-y-10">
      {/* Overview Section */}
      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-5 w-5 text-bahayCebu-green" />
          <h2 className="text-2xl font-serif font-semibold text-bahayCebu-darkGray">
            Property Overview
          </h2>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-bahayCebu-green" />
              </div>
              <div>
                <h3 className="font-medium text-bahayCebu-darkGray mb-2">Mixed-Use Development</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ARC Towers combines residential, office, and hotel components into a cohesive community, 
                  enhancing urban living and convenience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-bahayCebu-green" />
              </div>
              <div>
                <h3 className="font-medium text-bahayCebu-darkGray mb-2">1-YEAR MONEY BACK GUARANTEE</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  With The ARC Towers Cebu 1-year money-back guarantee, you can put all your questions to rest. 
                  Move in and experience the quality of life you've always wanted.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center flex-shrink-0">
                <Timer className="h-5 w-5 text-bahayCebu-green" />
              </div>
              <div>
                <h3 className="font-medium text-bahayCebu-darkGray mb-2">Prime Location</h3>
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Located at:
                    <span className="block font-medium mt-1 text-bahayCebu-darkGray">
                      N. Bacalso Ave, cor V Rama Ave
                      <br />
                      Cebu City, 6000 Cebu, PH
                    </span>
                  </p>
                  
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Walking distance to:</p>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-bahayCebu-green/80" />
                        <span className="text-gray-600 text-sm">Robinsons Cybergate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-bahayCebu-green/80" />
                        <span className="text-gray-600 text-sm">Chong Hua Hospital</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-bahayCebu-green/80" />
                        <span className="text-gray-600 text-sm">Vicente Sotto Hospitals</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-bahayCebu-green/80" />
                        <span className="text-gray-600 text-sm">Cebu Institute of Technology-University</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-bahayCebu-green/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-bahayCebu-green" />
              </div>
              <div>
                <h3 className="font-medium text-bahayCebu-darkGray mb-2">Flexible Payment Options</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Choose from spot cash, bank financing, Pag-IBIG Fund, or rent-to-own schemes. Our team will guide 
                  you through Pag-IBIG condo loan applications.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-bahayCebu-darkGray mb-3">Nearby Establishments</h3>
              <div className="space-y-2">
                {nearbyPlaces.map((place, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-bahayCebu-green/60" />
                    <span className="text-gray-600 text-sm">{place}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed">
            Looking for a condo in Cebu City? Check out ARC Towers, now available for sale! Choose from our 
            various unit types including Studio Units and Studio Units with Balcony, perfect for those seeking a cozy 
            living space in the city. Experience the quality of life you've always wanted with our innovative Mixed-Use Design, 
            sustainable architecture, and robust safety measures including 24-hour security and backup power supply.
          </p>
        </div>
      </Card>

      {/* Video Section */}
      {property.videoUrl && (
        <Card className="p-6 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Video className="h-5 w-5 text-bahayCebu-green" />
            <h2 className="text-2xl font-serif font-semibold text-bahayCebu-darkGray">
              Property Video Tour
            </h2>
          </div>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <div 
              className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg"
              dangerouslySetInnerHTML={createMarkup(property.videoUrl)} 
            />
          </div>
        </Card>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            title: 'Interior Features',
            icon: Home,
            items: details.features.interior,
            color: 'from-emerald-50 to-transparent'
          },
          { 
            title: 'Exterior Features',
            icon: Building2,
            items: details.features.exterior,
            color: 'from-sky-50 to-transparent'
          },
          { 
            title: 'Community Amenities',
            icon: Users,
            items: details.features.amenities,
            color: 'from-amber-50 to-transparent'
          },
          { 
            title: 'Utilities & Provisions',
            icon: Plug,
            items: details.features.utilities,
            color: 'from-violet-50 to-transparent'
          }
        ].map((section, index) => (
          <Card 
            key={index} 
            className="overflow-hidden transition-all duration-300 hover:shadow-lg group"
          >
            <div className={`p-6 bg-gradient-to-br ${section.color}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <section.icon className="h-5 w-5 text-bahayCebu-green" />
                </div>
                <h3 className="text-lg font-semibold text-bahayCebu-darkGray">
                  {section.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {section.items.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-bahayCebu-green/60" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyDetails;
