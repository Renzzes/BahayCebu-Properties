import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AdminProperty } from "@/types/admin"
import type { PropertyType } from "@/components/properties/PropertyCard"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAdminPropertyToPropertyType(property: AdminProperty): PropertyType {
  return {
    id: property.id,
    title: property.name,
    price: property.price,
    location: property.location,
    bedrooms: 0, // These need to be added to AdminProperty type if needed
    bathrooms: 0,
    area: 0,
    image: property.image,
    featured: property.featured,
    type: property.propertyType === 'House and Lot' ? 'House' : property.propertyType
  };
}
