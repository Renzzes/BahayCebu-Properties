
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterProps {
  onFilter: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

export interface FilterValues {
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  bedrooms: string;
}

const PropertyFilter: React.FC<FilterProps> = ({ onFilter, initialValues }) => {
  const [filters, setFilters] = useState<FilterValues>({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: ''
  });

  // Apply initial values if provided
  useEffect(() => {
    if (initialValues) {
      setFilters(initialValues);
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | 
    { name: string, value: string }
  ) => {
    const { name, value } = 'target' in e ? e.target : e;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };
  
  const handleReset = () => {
    const resetFilters = {
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: ''
    };
    
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Any Location"
            value={filters.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select 
            value={filters.propertyType} 
            onValueChange={(value) => handleSelectChange(value, 'propertyType')}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Type</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select 
            value={filters.bedrooms}
            onValueChange={(value) => handleSelectChange(value, 'bedrooms')}
          >
            <SelectTrigger id="bedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price (₱)</Label>
          <Input
            id="minPrice"
            name="minPrice"
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price (₱)</Label>
          <Input
            id="maxPrice"
            name="maxPrice"
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button 
          type="submit" 
          className="flex-1 bg-bahayCebu-green hover:bg-bahayCebu-green/90"
        >
          Search Properties
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={handleReset} 
          className="border-bahayCebu-terracotta text-bahayCebu-terracotta hover:bg-bahayCebu-terracotta hover:text-white"
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

PropertyFilter.defaultProps = {
  initialValues: {
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: ''
  }
};

export default PropertyFilter;
