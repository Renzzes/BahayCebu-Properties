import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import PropertyCard, { PropertyType } from '../properties/PropertyCard';

const FeaturedProperties: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setFeaturedProperties(data.filter((p: PropertyType) => p.featured));
      } catch (err) {
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="section-padding bg-bahayCebu-beige">
      <div className="container-custom">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-bahayCebu-darkGray">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-md">
              Explore our handpicked selection of stunning properties in the most desirable locations in Cebu.
            </p>
          </div>
          <Button 
            variant="outline" 
            asChild
            className="mt-4 md:mt-0 border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green hover:text-white transition-colors"
          >
            <Link to="/properties">View All Properties</Link>
          </Button>
        </div>
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
            Loading...
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                hideViewDetails={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No listing properties</h3>
            <p className="text-gray-600">
              There are currently no featured properties. Please check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
