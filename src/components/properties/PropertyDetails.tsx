
import React from 'react';
import { PropertyType } from './PropertyCard';
import { MapPin, Bed, Bath, Home } from 'lucide-react';

interface PropertyDetailsProps {
  property: PropertyType;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  // Additional details we'd have in a real application
  const details = {
    yearBuilt: '2020',
    lotSize: '300 m²',
    garage: '2 Cars',
    features: [
      'Swimming Pool', 
      'Garden', 
      'Security', 
      'Air Conditioning', 
      'Modern Kitchen',
      'Master Bedroom with En-suite',
      'Balcony/Terrace',
      '24/7 Security'
    ]
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
          This stunning {property.type.toLowerCase()} offers a perfect blend of luxury and comfort. 
          Located in {property.location}, it provides easy access to local amenities while offering a 
          peaceful living environment. The property features spacious rooms with modern finishes, 
          high ceilings, and an abundance of natural light.
          <br /><br />
          The open-concept living area flows seamlessly into the dining room and kitchen, 
          making it ideal for entertaining. The {property.bedrooms} bedrooms are well-proportioned, 
          with the master bedroom offering an en-suite bathroom and walk-in closet. 
          Outside, you'll find a beautifully landscaped garden with a private swimming pool.
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
        <h2 className="text-xl font-serif font-semibold mb-3 text-bahayCebu-darkGray">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-2">
          {details.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-bahayCebu-green mr-2"></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
