import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilter, { FilterValues } from '@/components/properties/PropertyFilter';
import { getAllPropertiesAsPropertyType, PropertyType } from '@/data/properties';

const Properties: React.FC = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: typeParam || '',
    bedrooms: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch properties from centralized property management system
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Get all active properties from the centralized property management system
        const allProperties = await getAllPropertiesAsPropertyType();
        setProperties(allProperties);
        setFilteredProperties(allProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    if (typeParam && properties.length > 0) {
      setActiveFilters(prev => ({
        ...prev,
        propertyType: typeParam,
      }));
      const filtered = properties.filter(property => property.type === typeParam);
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
    // eslint-disable-next-line
  }, [typeParam, properties]);

  const handleFilter = (filters: FilterValues) => {
    setActiveFilters(filters);
    let filtered = [...properties];
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.propertyType && filters.propertyType !== 'all') {
      filtered = filtered.filter(property => 
        property.type === filters.propertyType
      );
    }
    if (filters.bedrooms && filters.bedrooms !== 'any') {
      const minBedrooms = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => 
        property.bedrooms >= minBedrooms
      );
    }
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      filtered = filtered.filter(property => 
        property.price >= minPrice
      );
    }
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      filtered = filtered.filter(property => 
        property.price <= maxPrice
      );
    }
    setFilteredProperties(filtered);
  };

  // Get unique property types for filter
  const propertyTypes = Array.from(new Set(properties.map(property => property.type)));

  return (
    <div className="min-h-screen bg-bahayCebu-beige py-12">
      <div className="container-custom">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-bahayCebu-darkGray">
            Property Listings
          </h1>
          <p className="text-gray-600">
            Discover our extensive range of properties across Cebu to find your perfect home.
          </p>
        </div>
        {/* Property Type Quick Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilter({...activeFilters, propertyType: ''})}
            className={`px-4 py-2 rounded-md transition ${
              activeFilters.propertyType === '' 
                ? 'bg-bahayCebu-darkGray text-white' 
                : 'bg-white text-bahayCebu-darkGray border border-bahayCebu-darkGray'
            }`}
          >
            All Types
          </button>
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleFilter({...activeFilters, propertyType: type})}
              className={`px-4 py-2 rounded-md transition ${
                activeFilters.propertyType === type 
                  ? 'bg-bahayCebu-green text-white' 
                  : 'bg-white text-bahayCebu-green border border-bahayCebu-green'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <PropertyFilter onFilter={handleFilter} initialValues={activeFilters} />
        <div className="mt-8">
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
              Loading...
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No listing properties</h3>
              <p className="text-gray-600">
                There are currently no properties listed. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
