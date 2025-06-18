export interface UnitTypeDetail {
  type: string;
  floorArea: string;
  priceRange: string;
  layoutImage: string;
  reservationFee: string;
  monthlyPayment: {
    percentage: number;
    amount: string;
    terms: string;
  };
  balancePayment: {
    percentage: number;
    amount: string;
    terms: string;
  };
  description: string;
}

export type PaymentDetail = {
  percentage: number;
  amount: string;
  terms: string;
};

export interface AdminProperty {
  id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  price: number;
  units: number;
  occupancyRate: number;
  status: 'Active' | 'Off Market' | 'Sold';
  propertyType: 'Condo' | 'House and Lot' | 'Land';
  listingType: 'For Sale' | 'For Rent' | 'Resale';
  featured: boolean;
  videoUrl?: string;
  thumbnail?: string;
  lastUpdated: string;
  createdAt: string;
  location: string;
  unitTypeDetails?: UnitTypeDetail[];
  stats: {
    views: number;
    leads: number;
    applications: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  preferences: {
    emailNotifications: boolean;
    smsAlerts: boolean;
    weeklyReports: boolean;
  };
} 