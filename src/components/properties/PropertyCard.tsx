
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

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
}

interface PropertyCardProps {
  property: PropertyType;
  hideViewDetails?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, hideViewDetails = false }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (hideViewDetails) {
      // Navigate to properties page with type filter
      navigate(`/properties?type=${property.type}`);
    } else {
      // Navigate to property detail page
      navigate(`/property/${property.id}`);
    }
  };

  const handleTypeClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/properties?type=${type}`);
  };

  return (
    <Card 
      className="overflow-hidden group property-card border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      {/* Property Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {property.featured && (
          <div className="absolute top-3 right-3 bg-bahayCebu-terracotta text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20"></div>
      </div>

      {/* Property Details */}
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-lg font-semibold text-bahayCebu-darkGray line-clamp-1">
            {property.title}
          </h3>
          <p className="font-semibold text-bahayCebu-green">
            ₱{property.price.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center mt-1 text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex flex-col">
        <div className="w-full flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3 mb-3">
          <div>{property.bedrooms} Beds</div>
          <div>{property.bathrooms} Baths</div>
          <div>{property.area} m²</div>
          <div 
            className="text-bahayCebu-darkGray font-medium hover:text-bahayCebu-green"
            onClick={(e) => handleTypeClick(e, property.type)}
          >
            {property.type}
          </div>
        </div>
        
        {!hideViewDetails && (
          <Button 
            asChild 
            className="w-full bg-bahayCebu-green hover:bg-bahayCebu-green/90"
            onClick={(e) => e.stopPropagation()} // Prevent triggering the card click
          >
            <Link to={`/property/${property.id}`}>
              View Details
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
