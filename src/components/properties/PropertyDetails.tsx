import React from 'react';
import { PropertyType } from '../../data/properties';
import { MapPin, Bed, Bath, Home } from 'lucide-react';

interface PropertyDetailsProps {
  property: PropertyType;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  // Enhanced property features with categories
  const details = {
    yearBuilt: '2020',
    lotSize: '300 m²',
    garage: '2 Cars',
    features: {
      interior: [
        'Air Conditioning',
        'Modern Kitchen',
        'Master Bedroom with En-suite',
        'Walk-in Closets',
        'Hardwood Flooring',
        'High Ceilings',
        'Built-in Storage',
        'Laundry Room'
      ],
      exterior: [
        'Swimming Pool',
        'Garden/Landscaping',
        'Balcony/Terrace',
        'Outdoor Dining Area',
        'Parking Garage',
        'Covered Patio',
        'Outdoor Lighting',
        'Irrigation System'
      ],
      amenities: [
        '24/7 Security',
        'CCTV Surveillance',
        'Gym/Fitness Center',
        'Playground',
        'Community Center',
        'Visitor Parking',
        'Maintenance Service',
        'Concierge Service'
      ],
      utilities: [
        'High-Speed Internet Ready',
        'Cable TV Ready',
        'Water Heater',
        'Backup Generator',
        'Solar Panels',
        'Smart Home Features',
        'Intercom System',
        'Fire Safety System'
      ]
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Property Info */}
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-bahayCebu-darkGray mb-2">
          {property.title}
        </h1>
        
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="h-5 w-5 mr-1" />
          <span>{property.location}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-gray-700">
          <div className="flex items-center">
            <Bed className="h-5 w-5 mr-2 text-bahayCebu-green" />
            <span>{property.bedrooms} Bedrooms</span>
          </div>
          
          <div className="flex items-center">
            <Bath className="h-5 w-5 mr-2 text-bahayCebu-green" />
            <span>{property.bathrooms} Bathrooms</span>
          </div>
          
          <div className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-bahayCebu-green" />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
      
      {/* Property Description */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-3 text-bahayCebu-darkGray">Description</h2>
        <p className="text-gray-700 leading-relaxed">
          {property.description || (
            <>
              This stunning {property.type.toLowerCase()} offers a perfect blend of luxury and comfort. 
              Located in {property.location}, it provides easy access to local amenities while offering a 
              peaceful living environment. The property features spacious rooms with modern finishes, 
              high ceilings, and an abundance of natural light.
              <br /><br />
              The open-concept living area flows seamlessly into the dining room and kitchen, 
              making it ideal for entertaining. The {property.bedrooms} bedrooms are well-proportioned, 
              with the master bedroom offering an en-suite bathroom and walk-in closet. 
              Outside, you'll find a beautifully landscaped garden with a private swimming pool.
            </>
          )}
        </p>
      </div>
      
      {/* Property Details */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-3 text-bahayCebu-darkGray">Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Property Type</p>
            <p className="font-medium text-bahayCebu-darkGray">{property.type}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Year Built</p>
            <p className="font-medium text-bahayCebu-darkGray">{details.yearBuilt}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Lot Size</p>
            <p className="font-medium text-bahayCebu-darkGray">{details.lotSize}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Garage</p>
            <p className="font-medium text-bahayCebu-darkGray">{details.garage}</p>
          </div>
        </div>
      </div>
      
      {/* Property Features */}
      <div>
        <h2 className="text-xl font-serif font-semibold mb-6 text-bahayCebu-darkGray">Features & Amenities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Interior Features */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-bahayCebu-green mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Interior Features
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {details.features.interior.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-bahayCebu-green mr-3"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exterior Features */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-bahayCebu-green mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Exterior Features
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {details.features.exterior.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-bahayCebu-green mr-3"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Amenities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-bahayCebu-green mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Community Amenities
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {details.features.amenities.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-bahayCebu-green mr-3"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Utilities & Technology */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-bahayCebu-green mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Utilities & Technology
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {details.features.utilities.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-bahayCebu-green mr-3"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
