import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, Home, LogOut, User, Plus, MessageSquare, Eye, Users, FileText, Edit3, Trash2, Camera, EyeOff, Mail, Phone, Facebook, Instagram, Linkedin, Pencil, AlertCircle, MapPin, X, Key, Star, Search, BarChart2, Settings, Bell, Menu } from 'lucide-react';
import { AdminProperty, getAllProperties, addProperty, updateProperty, deleteProperty, BUILDING_AMENITIES, RESIDENTIAL_FEATURES, PROPERTY_PROVISIONS, BUILDING_FEATURES } from '@/data/properties';
import { AdminUser, getCurrentUser, updateUserProfile, updateUserPassword, updateUserPreferences, verifyCurrentPassword } from '../data/userData';
import { Agent, getAllAgents, createAgent, updateAgent, deleteAgent } from '../data/agents';
import { showSuccessAlert, showErrorAlert, showConfirmationDialog, showLoadingAlert } from '@/utils/sweetAlert';
import Swal from 'sweetalert2';
import ImageCropper from '../components/ImageCropper';
import PropertyGallery from '@/components/ui/PropertyGallery';
import { cn } from '../lib/utils';
import SearchableMultiSelect from '../components/ui/SearchableMultiSelect';
import { UnitTypeDetail } from '@/types/admin';
import UnitTypeManager from '../components/UnitTypeManager';
import ZoomableImage from '../components/ZoomableImage';
import UnitTypeSection from '../components/UnitTypeSection';
import ImageUploader from '@/components/ImageUploader';
import TagInput from '@/components/TagInput';
import TravelTimesInput from '@/components/TravelTimesInput';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ImageOptimizer, isValidImage } from '@/utils/imageOptimization';

const SPECIALIZATIONS = [
  'Residential Sales',
  'Commercial Property Sales',
  'Property Leasing & Rentals',
  'Buyer & Seller Representation',
  'Real Estate Marketing & Advertising',
  'Property Valuation & Pricing Strategy',
  'Real Estate Negotiation',
  'Local Market Analysis',
  'Investment Property Sales',
  'Open House Management',
  'Real Estate Social Media Marketing',
  'Contract Preparation & Documentation',
  'Lead Generation & Client Prospecting',
  'First-Time Homebuyer Guidance',
  'Client Relationship Management',
  'Property Staging Consultation',
  'Real Estate Legal Compliance',
  'CRM & Listing Platform Proficiency',
  'Real Estate Financing Basics',
  'Real Estate Team Collaboration & Mentorship'
] as const;

interface PropertyFormData {
  title: string;
  location: string;
  description: string;
  image: string;
  images: string[];
  price: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  type: AdminProperty['type'];
  featured: boolean;
  videoUrl: string;
  thumbnail: string;
  unitTypes: string[];
  unitTypeDetails: UnitTypeDetail[];
  amenities: string[];
  residentialFeatures: string[];
  provisions: string[];
  buildingFeatures: string[];
  createdAt: string;
  listingType: AdminProperty['listingType'];
  units: string;
  occupancyRate: string;
  locationAccessibility: {
    nearbyLandmarks: string[];
    publicTransport: string[];
    mainRoads: string[];
    travelTimes: Array<{ destination: string; duration: string }>;
  };
  featuresAmenities: {
    propertyHighlights: string[];
    smartHomeFeatures: string[];
    securityFeatures: string[];
    sustainabilityFeatures: string[];
  };
  lifestyleCommunity: {
    neighborhoodType: string;
    localAmenities: string[];
    communityFeatures: string[];
    nearbyEstablishments: string[];
  };
  additionalInformation: {
    propertyHistory: string;
    legalInformation: string;
    developmentPlans: string;
    specialNotes: string;
  };
}

// Default form data
const defaultFormData: PropertyFormData = {
  title: '',
  location: '',
  description: '',
  image: '',
  images: [],
  price: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  type: 'Condo',
  featured: false,
  videoUrl: '',
  thumbnail: '',
  unitTypes: [],
  unitTypeDetails: [],
  amenities: [],
  residentialFeatures: [],
  provisions: [],
  buildingFeatures: [],
  createdAt: new Date().toISOString(),
  listingType: 'For Sale',
  units: '0',
  occupancyRate: '0',
  locationAccessibility: {
    nearbyLandmarks: [],
    publicTransport: [],
    mainRoads: [],
    travelTimes: [],
  },
  featuresAmenities: {
    propertyHighlights: [],
    smartHomeFeatures: [],
    securityFeatures: [],
    sustainabilityFeatures: [],
  },
  lifestyleCommunity: {
    neighborhoodType: '',
    localAmenities: [],
    communityFeatures: [],
    nearbyEstablishments: [],
  },
  additionalInformation: {
    propertyHistory: '',
    legalInformation: '',
    developmentPlans: '',
    specialNotes: '',
  },
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(() => {
    return localStorage.getItem('selectedMenu') || 'Properties';
  });
  
  // Add hook for tracking screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Save selectedMenu to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedMenu', selectedMenu);
  }, [selectedMenu]);

  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<AdminProperty | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [expandedAgentDescriptions, setExpandedAgentDescriptions] = useState<Set<string>>(new Set());
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<AdminProperty[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  // Calculate pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Load properties on mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const propertyData = await getAllProperties();
        setProperties(propertyData);
        setFilteredProperties(propertyData); // Initialize filtered properties with all properties
      } catch (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
        setFilteredProperties([]);
      }
    };
    loadProperties();
  }, []);

  // User profile management state
  const [currentUser, setCurrentUser] = useState<AdminUser>(getCurrentUser());
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');

  // Load user data when component mounts and when profile menu is selected
  useEffect(() => {
    const loadUserData = () => {
      const userData = getCurrentUser();
      setCurrentUser(userData);
      // Update profile form with current user data
      setProfileForm({
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture || ''
      });
      // Update password form with current password
      setPasswordForm(prev => ({
        ...prev,
        currentPassword: userData.password
      }));
    };

    loadUserData();
  }, [selectedMenu]);

  // Property filtering state
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');

  // Profile form data
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    profilePicture: currentUser.profilePicture || ''
  });

  // Password form data
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: currentUser.password,
    newPassword: '',
    confirmPassword: ''
  });

  const [newProperty, setNewProperty] = useState<PropertyFormData>(defaultFormData);
  const [editProperty, setEditProperty] = useState<PropertyFormData>(defaultFormData);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isEditAgentOpen, setIsEditAgentOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    title: 'Senior Real Estate Consultant',
    description: '',
    email: '',
    phone: '',
    location: 'Cebu City, Philippines',
    specializations: [] as string[],
    listings: 0,
    deals: 0,
    rating: 0,
    image: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (selectedMenu === 'Properties') {
          await loadProperties();
        } else if (selectedMenu === 'Agent') {
          setIsLoadingAgents(true);
          const agentData = await getAllAgents();
          setAgents(agentData || []);
          setIsLoadingAgents(false);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setAgents([]);
        setIsLoadingAgents(false);
      }
    };
    loadInitialData();
  }, [selectedMenu]);

  // Load agents on mount
  useEffect(() => {
    const loadInitialAgents = async () => {
      try {
        setIsLoadingAgents(true);
        const agentData = await getAllAgents();
        setAgents(agentData || []);
      } catch (error) {
        console.error('Error loading agents:', error);
        setAgents([]);
      } finally {
        setIsLoadingAgents(false);
      }
    };
    loadInitialAgents();
  }, []);

  const menuItems = [
    { id: 'Dashboard', icon: BarChart2, label: 'Overview' },
    { id: 'Properties', icon: Building, label: 'Properties' },
    { id: 'Agent', icon: Users, label: 'Agents' },
    { id: 'Profile', icon: User, label: 'Settings' }
  ];

  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await showConfirmationDialog('Sign Out', 'Are you sure you want to sign out?');
    
    if (result.isConfirmed) {
      // Handle sign out logic here
      console.log('Signing out...');
      await showSuccessAlert('Goodbye!', 'You have been signed out successfully.');
      navigate('/');
    }
  };

  // Profile management handlers
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempImageSrc(e.target?.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setProfileForm(prev => ({ ...prev, profilePicture: croppedImageUrl }));
  };

  const handleEditProfile = async () => {
    if (!profileForm.name || !profileForm.email) {
      showErrorAlert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      // Update user profile
      const updatedUser = updateUserProfile({
        name: profileForm.name,
        email: profileForm.email,
        profilePicture: profileForm.profilePicture
      });

      // Update current user state
      setCurrentUser(updatedUser);
      
      // Close dialog
      setIsEditProfileOpen(false);
      
      await showSuccessAlert('Profile Updated', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      await showErrorAlert('Update Failed', 'Failed to update profile. Please try again.');
    }
  };

  const openChangePasswordDialog = () => {
    const userData = getCurrentUser(); // Get latest user data
    setPasswordForm({
      currentPassword: userData.password,
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangePasswordOpen(true);
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showErrorAlert('Validation Error', 'Please fill in all password fields.');
      return;
    }

    if (!verifyCurrentPassword(passwordForm.currentPassword)) {
      showErrorAlert('Invalid Password', 'Current password is incorrect.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorAlert('Password Mismatch', 'New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showErrorAlert('Invalid Password', 'New password must be at least 8 characters long.');
      return;
    }

    await showLoadingAlert('Updating password...');
    try {
      const success = updateUserPassword(passwordForm.newPassword);
      if (success) {
        setCurrentUser(getCurrentUser()); // Update the current user state
        setPasswordForm({
          currentPassword: passwordForm.newPassword, // Update current password to the new one
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangePasswordOpen(false);
        await Swal.close();
        await showSuccessAlert('Password Updated', 'Your password has been changed successfully.');
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      await Swal.close();
      showErrorAlert('Update Failed', 'Failed to update password. Please try again.');
    }
  };

  const openEditProfileDialog = () => {
    const userData = getCurrentUser(); // Get latest user data
    setProfileForm({
      name: userData.name,
      email: userData.email,
      profilePicture: userData.profilePicture || ''
    });
    setIsEditProfileOpen(true);
  };

  const handlePreferenceChange = (key: keyof AdminUser['preferences'], value: boolean) => {
    const updatedUser = updateUserPreferences({ [key]: value });
    setCurrentUser(updatedUser);
  };

  // Property filtering logic
  useEffect(() => {
    if (properties) {
      setFilteredProperties(
        properties.filter(p =>
          (!propertyTypeFilter || p.type === propertyTypeFilter) &&
          (!searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }
  }, [properties, propertyTypeFilter, searchQuery]);

  // Update property type filter handler
  const handlePropertyTypeFilter = (type: AdminProperty['type']) => {
    setPropertyTypeFilter(type);
  };

  const toggleDescription = (propertyId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const truncateDescription = (description: string, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleImageUpload = async (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>, isEdit = false): Promise<string> => {
    try {
      const file = fileOrEvent instanceof File ? fileOrEvent : fileOrEvent.target.files?.[0];
      if (!file) return '';

      // Validate image
      if (!isValidImage(file)) {
        showErrorAlert('Invalid Image', 'Please select a valid image file (JPEG, PNG, WebP).');
        return '';
      }

      // Optimize image for properties
      const optimizedFile = await ImageOptimizer.property(file);
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (isEdit) {
            setEditProperty(prev => ({
              ...prev,
              image: imageUrl,
              images: [...(prev.images || []), imageUrl]
            }));
          } else {
            setNewProperty(prev => ({
              ...prev,
              image: imageUrl,
              images: [...(prev.images || []), imageUrl]
            }));
          }
          resolve(imageUrl);
        };
        reader.readAsDataURL(optimizedFile);
      });
    } catch (error) {
      console.error('Error optimizing image:', error);
      showErrorAlert('Image Processing Error', 'Failed to process the image. Please try again.');
      return '';
    }
  };

  const handleAddProperty = async () => {
    if (newProperty.title && newProperty.location && newProperty.description) {
      try {
        showLoadingAlert('Adding property...');
        
        // Format unit type details
        const formattedUnitTypeDetails = newProperty.unitTypeDetails.map(detail => ({
          type: detail.type,
          floorArea: detail.floorArea,
          priceRange: detail.priceRange,
          layoutImage: detail.layoutImage,
          reservationFee: detail.reservationFee,
          monthlyPayment: {
            percentage: parseInt(String(detail.monthlyPayment.percentage)) || 0,
            amount: detail.monthlyPayment.amount,
            terms: detail.monthlyPayment.terms
          },
          balancePayment: {
            percentage: parseInt(String(detail.balancePayment.percentage)) || 0,
            amount: detail.balancePayment.amount,
            terms: detail.balancePayment.terms
          },
          description: detail.description
        }));
        
        const propertyData: Omit<AdminProperty, 'id' | 'lastUpdated' | 'stats'> = {
          title: newProperty.title.trim(),
          location: newProperty.location.trim(),
          description: newProperty.description.trim(),
          image: newProperty.image || '',
          images: newProperty.images || [],
          price: parseInt(newProperty.price) || 0,
          bedrooms: parseInt(newProperty.bedrooms) || 0,
          bathrooms: parseInt(newProperty.bathrooms) || 0,
          area: parseInt(newProperty.area) || 0,
          type: newProperty.type || 'Condo',
          featured: newProperty.featured || false,
          videoUrl: newProperty.videoUrl || '',
          thumbnail: newProperty.thumbnail || '',
          unitTypes: newProperty.unitTypes || [],
          unitTypeDetails: formattedUnitTypeDetails,
          amenities: newProperty.amenities || [],
          residentialFeatures: newProperty.residentialFeatures || [],
          provisions: newProperty.provisions || [],
          buildingFeatures: newProperty.buildingFeatures || [],
          createdAt: newProperty.createdAt || new Date().toISOString(),
          listingType: newProperty.listingType || 'For Sale',
          units: parseInt(newProperty.units) || 0,
          occupancyRate: parseInt(newProperty.occupancyRate) || 0,
          locationAccessibility: newProperty.locationAccessibility || {
            nearbyLandmarks: [],
            publicTransport: [],
            mainRoads: [],
            travelTimes: []
          },
          featuresAmenities: newProperty.featuresAmenities || {
            propertyHighlights: [],
            smartHomeFeatures: [],
            securityFeatures: [],
            sustainabilityFeatures: []
          },
          lifestyleCommunity: newProperty.lifestyleCommunity || {
            neighborhoodType: '',
            localAmenities: [],
            communityFeatures: [],
            nearbyEstablishments: []
          },
          additionalInformation: newProperty.additionalInformation || {
            propertyHistory: '',
            legalInformation: '',
            developmentPlans: '',
            specialNotes: ''
          }
        };

        const addedProperty = await addProperty(propertyData);
        
        if (addedProperty) {
          // Update the properties state with the new data
          const updatedProperties = await getAllProperties();
          setProperties(updatedProperties);
          setFilteredProperties(updatedProperties);
          
          // Reset the form
          setNewProperty(defaultFormData);
          
          // Close the dialog
          setIsAddPropertyOpen(false);

          // Show success message with property details
          await Swal.fire({
            title: 'Property Added Successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#22c55e'
          });
        } else {
          throw new Error('Failed to add property');
        }
      } catch (error) {
        console.error('Error adding property:', error);
        showErrorAlert('Failed to add property', 'Please try again.');
      }
    } else {
      showErrorAlert('Missing Information', 'Please fill in all required fields (Title, Location, and Description).');
    }
  };

  const handleEditProperty = async () => {
    if (editProperty.title && editProperty.location && editProperty.description && editingProperty) {
      try {
        console.log('Editing property data:', JSON.stringify(editProperty, null, 2));
        showLoadingAlert('Updating property...');
        
        const propertyData: Omit<AdminProperty, 'id' | 'lastUpdated' | 'stats'> = {
          title: editProperty.title,
          location: editProperty.location,
          description: editProperty.description,
          image: editProperty.image,
          images: editProperty.images,
          price: parseInt(editProperty.price) || 0,
          bedrooms: parseInt(editProperty.bedrooms) || 0,
          bathrooms: parseInt(editProperty.bathrooms) || 0,
          area: parseInt(editProperty.area) || 0,
          type: editProperty.type,
          featured: editProperty.featured,
          videoUrl: editProperty.videoUrl,
          thumbnail: editProperty.thumbnail,
          unitTypes: editProperty.unitTypes,
          unitTypeDetails: editProperty.unitTypeDetails,
          amenities: editProperty.amenities,
          residentialFeatures: editProperty.residentialFeatures,
          provisions: editProperty.provisions,
          buildingFeatures: editProperty.buildingFeatures,
          createdAt: editProperty.createdAt,
          listingType: editProperty.listingType,
          units: parseInt(editProperty.units) || 0,
          occupancyRate: parseInt(editProperty.occupancyRate) || 0,
          locationAccessibility: {
            nearbyLandmarks: editProperty.locationAccessibility?.nearbyLandmarks || [],
            publicTransport: editProperty.locationAccessibility?.publicTransport || [],
            mainRoads: editProperty.locationAccessibility?.mainRoads || [],
            travelTimes: editProperty.locationAccessibility?.travelTimes || []
          },
          featuresAmenities: {
            propertyHighlights: editProperty.featuresAmenities?.propertyHighlights || [],
            smartHomeFeatures: editProperty.featuresAmenities?.smartHomeFeatures || [],
            securityFeatures: editProperty.featuresAmenities?.securityFeatures || [],
            sustainabilityFeatures: editProperty.featuresAmenities?.sustainabilityFeatures || []
          },
          lifestyleCommunity: {
            neighborhoodType: editProperty.lifestyleCommunity?.neighborhoodType || '',
            localAmenities: editProperty.lifestyleCommunity?.localAmenities || [],
            communityFeatures: editProperty.lifestyleCommunity?.communityFeatures || [],
            nearbyEstablishments: editProperty.lifestyleCommunity?.nearbyEstablishments || []
          },
          additionalInformation: {
            propertyHistory: editProperty.additionalInformation?.propertyHistory || '',
            legalInformation: editProperty.additionalInformation?.legalInformation || '',
            developmentPlans: editProperty.additionalInformation?.developmentPlans || '',
            specialNotes: editProperty.additionalInformation?.specialNotes || ''
          }
        };

        console.log('Sending property data to API:', JSON.stringify(propertyData, null, 2));
        await updateProperty(editingProperty.id, propertyData);
        
        // Update the properties state with the new data
        const updatedProperties = await getAllProperties();
        setProperties(updatedProperties);
        setFilteredProperties(updatedProperties);
        
        // Reset the form and close dialog
        setEditProperty(defaultFormData);
        setIsEditPropertyOpen(false);
        
        await Swal.close();
        await showSuccessAlert('Success', 'Property updated successfully.');
      } catch (error) {
        console.error('Error updating property:', error);
        showErrorAlert('Failed to update property', 'Please try again.');
      }
    } else {
      showErrorAlert('Missing Information', 'Please fill in all required fields (Title, Location, and Description).');
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      const updatedProperties = await getAllProperties();
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  const openEditDialog = (property: AdminProperty) => {
    console.log('Opening edit dialog for property:', JSON.stringify(property, null, 2));
    setEditingProperty(property);
    const formData: PropertyFormData = {
      title: property.title || '',
      location: property.location || '',
      description: property.description || '',
      image: property.image || '',
      images: property.images || [],
      price: property.price?.toString() || '0',
      bedrooms: property.bedrooms?.toString() || '0',
      bathrooms: property.bathrooms?.toString() || '0',
      area: property.area?.toString() || '0',
      type: property.type,
      featured: property.featured || false,
      videoUrl: property.videoUrl || '',
      thumbnail: property.thumbnail || '',
      unitTypes: property.unitTypes || [],
      unitTypeDetails: property.unitTypeDetails || [],
      amenities: property.amenities || [],
      residentialFeatures: property.residentialFeatures || [],
      provisions: property.provisions || [],
      buildingFeatures: property.buildingFeatures || [],
      createdAt: property.createdAt || new Date().toISOString(),
      listingType: property.listingType || 'For Sale',
      units: property.units?.toString() || '0',
      occupancyRate: property.occupancyRate?.toString() || '0',
      locationAccessibility: {
        nearbyLandmarks: property.locationAccessibility?.nearbyLandmarks || [],
        publicTransport: property.locationAccessibility?.publicTransport || [],
        mainRoads: property.locationAccessibility?.mainRoads || [],
        travelTimes: property.locationAccessibility?.travelTimes || []
      },
      featuresAmenities: {
        propertyHighlights: property.featuresAmenities?.propertyHighlights || [],
        smartHomeFeatures: property.featuresAmenities?.smartHomeFeatures || [],
        securityFeatures: property.featuresAmenities?.securityFeatures || [],
        sustainabilityFeatures: property.featuresAmenities?.sustainabilityFeatures || []
      },
      lifestyleCommunity: {
        neighborhoodType: property.lifestyleCommunity?.neighborhoodType || '',
        localAmenities: property.lifestyleCommunity?.localAmenities || [],
        communityFeatures: property.lifestyleCommunity?.communityFeatures || [],
        nearbyEstablishments: property.lifestyleCommunity?.nearbyEstablishments || []
      },
      additionalInformation: {
        propertyHistory: property.additionalInformation?.propertyHistory || '',
        legalInformation: property.additionalInformation?.legalInformation || '',
        developmentPlans: property.additionalInformation?.developmentPlans || '',
        specialNotes: property.additionalInformation?.specialNotes || ''
      }
    };
    setEditProperty(formData);
    setIsEditPropertyOpen(true);
  };

  // Property type options
  const propertyTypes: AdminProperty['type'][] = ['Condo', 'House and Lot', 'Land'];

  const [isAgentCropperOpen, setIsAgentCropperOpen] = useState(false);
  const [tempAgentImageSrc, setTempAgentImageSrc] = useState<string>('');
  const [isEditingAgentImage, setIsEditingAgentImage] = useState(false);

  const handleAgentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate the image file
      if (!isValidImage(file)) {
        showErrorAlert('Invalid File', 'Please select a valid image file (JPEG, PNG, WebP, max 10MB)');
        return;
      }

      try {
        // Optimize the image before cropping for better performance
        const optimizedImage = await ImageOptimizer.agent(file);
        setTempAgentImageSrc(optimizedImage);
        setIsAgentCropperOpen(true);
        setIsEditingAgentImage(isEdit);
      } catch (error) {
        console.error('Error optimizing image:', error);
        showErrorAlert('Image Processing Error', 'Failed to process the image. Please try again.');
      }
    }
  };

  const handleAgentCropComplete = (croppedImageUrl: string) => {
    if (isEditingAgentImage && editingAgent) {
      setEditingAgent(prev => ({ ...prev!, image: croppedImageUrl }));
    } else {
      setNewAgent(prev => ({ ...prev, image: croppedImageUrl }));
    }
    setIsAgentCropperOpen(false);
  };

  const handleAddAgent = async () => {
    try {
      // Validate required fields
      if (!newAgent.name.trim()) {
        showErrorAlert('Validation Error', 'Please enter the agent\'s name');
        return;
      }
      if (!newAgent.title.trim()) {
        showErrorAlert('Validation Error', 'Please enter the agent\'s title');
        return;
      }
      if (!newAgent.email.trim()) {
        showErrorAlert('Validation Error', 'Please enter the agent\'s email');
        return;
      }
      if (!newAgent.phone.trim()) {
        showErrorAlert('Validation Error', 'Please enter the agent\'s phone number');
        return;
      }
      if (!newAgent.location.trim()) {
        showErrorAlert('Validation Error', 'Please enter the agent\'s location');
        return;
      }
      if (!newAgent.description.trim()) {
        showErrorAlert('Validation Error', 'Please enter the agent\'s description');
        return;
      }
      if (!newAgent.specializations.length) {
        showErrorAlert('Validation Error', 'Please select at least one specialization');
        return;
      }

      // Prepare the agent data
      const agentData = {
        name: newAgent.name.trim(),
        title: newAgent.title.trim(),
        email: newAgent.email.trim(),
        phone: newAgent.phone.trim(),
        location: newAgent.location.trim(),
        description: newAgent.description.trim(),
        specializations: newAgent.specializations,
        listings: typeof newAgent.listings === 'number' ? newAgent.listings : 0,
        deals: typeof newAgent.deals === 'number' ? newAgent.deals : 0,
        rating: typeof newAgent.rating === 'number' ? newAgent.rating : 0,
        image: newAgent.image || null,
        socialMedia: {
          facebook: newAgent.socialMedia?.facebook || '',
          instagram: newAgent.socialMedia?.instagram || '',
          linkedin: newAgent.socialMedia?.linkedin || ''
        }
      };

      // Create the agent and get the created agent data
      const createdAgent = await createAgent(agentData);
      
      // Add the new agent to the local state immediately for better UX
      setAgents(prevAgents => [...prevAgents, createdAgent]);
      
      // Reset form and close dialog
      setNewAgent({
        name: '',
        title: 'Senior Real Estate Consultant',
        description: '',
        email: '',
        phone: '',
        location: 'Cebu City, Philippines',
        specializations: [],
        listings: 0,
        deals: 0,
        rating: 0,
        image: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          linkedin: ''
        }
      });
      setIsAddAgentOpen(false);
      
      await showSuccessAlert('Agent Added Successfully', 'The new agent has been added to your team!');
    } catch (error) {
      console.error('Error adding agent:', error);
      if (error instanceof Error && error.message.includes('email already exists')) {
        showErrorAlert('Email Already Exists', 'An agent with this email address already exists. Please use a different email.');
      } else {
        showErrorAlert('Failed to Add Agent', 'Failed to add agent. Please try again.');
      }
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const result = await showConfirmationDialog(
        'Delete Agent',
        'Are you sure you want to delete this agent? This action cannot be undone.'
      );
      
      if (result.isConfirmed) {
        // Show a quick loading state without SweetAlert
        const agentElement = document.querySelector(`[data-agent-id="${agentId}"]`);
        if (agentElement) {
          agentElement.classList.add('opacity-50', 'pointer-events-none');
        }
        
        await deleteAgent(agentId);
        // Remove the agent from local state immediately
        setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
        await showSuccessAlert('Agent Deleted', 'The agent has been successfully removed.');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      // Remove loading state on error
      const agentElement = document.querySelector(`[data-agent-id="${agentId}"]`);
      if (agentElement) {
        agentElement.classList.remove('opacity-50', 'pointer-events-none');
      }
      showErrorAlert('Delete Failed', 'Failed to delete agent. Please try again.');
    }
  };

  const handleDeleteAllProperties = async () => {
    try {
      // Delete all properties one by one
      await Promise.all(properties.map(property => deleteProperty(property.id)));
      const updatedProperties = await getAllProperties();
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      setIsDeleteAllDialogOpen(false);
    } catch (error) {
      console.error('Error deleting all properties:', error);
      alert('Failed to delete all properties. Please try again.');
    }
  };

  // Reset all dialog states when component unmounts or route changes
  useEffect(() => {
    return () => {
      setIsAddAgentOpen(false);
      setIsEditAgentOpen(false);
      setIsAddPropertyOpen(false);
      setIsEditPropertyOpen(false);
      setIsDeleteDialogOpen(false);
      setIsDeleteAllDialogOpen(false);
      setIsEditProfileOpen(false);
      setIsChangePasswordOpen(false);
    };
  }, []);

  // Reset dialog states when menu changes
  useEffect(() => {
    setIsAddAgentOpen(false);
    setIsEditAgentOpen(false);
    setIsAddPropertyOpen(false);
    setIsEditPropertyOpen(false);
    setIsDeleteDialogOpen(false);
    setIsDeleteAllDialogOpen(false);
  }, [selectedMenu]);

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'Profile') {
      setIsProfileOpen(true);
      return;
    }
    
    setSelectedMenu(menuId);
    setCurrentPage(1);

    // Load data based on selected menu
    if (menuId === 'Properties') {
      loadProperties();
    } else if (menuId === 'Agent') {
      loadAgents();
    }
  };

  const loadProperties = async () => {
    try {
      const propertyData = await getAllProperties();
      setProperties(propertyData);
      setFilteredProperties(propertyData);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
      setFilteredProperties([]);
    }
  };

  const loadAgents = async () => {
    try {
      setIsLoadingAgents(true);
      const agentData = await getAllAgents();
      setAgents(agentData || []);
    } catch (error) {
      console.error('Error loading agents:', error);
      setAgents([]);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const handleEditAgent = async () => {
    if (!editingAgent) {
      showErrorAlert('Error', 'No agent selected for editing');
      return;
    }

    try {
      await showLoadingAlert('Updating agent...');

      // Prepare update data
      const updateData = {
        name: editingAgent.name,
        email: editingAgent.email,
        phone: editingAgent.phone,
        title: editingAgent.title,
        location: editingAgent.location,
        description: editingAgent.description,
        specializations: editingAgent.specializations,
        image: editingAgent.image,
        socialMedia: editingAgent.socialMedia
      };

      // Update the agent and get the updated data
      const updatedAgent = await updateAgent(editingAgent.id, updateData);
      
      // Update local state immediately with the updated agent data
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === updatedAgent.id ? updatedAgent : agent
        )
      );
      
      // Close the dialog and reset state
      setIsEditAgentOpen(false);
      setEditingAgent(null);
      
      await Swal.close();
      await showSuccessAlert('Agent Updated', 'Agent information has been updated successfully.');
    } catch (error) {
      console.error('Error updating agent:', error);
      await Swal.close();
      if (error instanceof Error) {
        if (error.message.includes('email already exists')) {
          showErrorAlert('Update Failed', 'An agent with this email address already exists. Please use a different email.');
        } else {
          showErrorAlert('Update Failed', `Failed to update agent: ${error.message}`);
        }
      } else {
        showErrorAlert('Update Failed', 'Failed to update agent. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex relative">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-72 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0" // Always show on desktop
      )}>
        {/* Mobile Close Button */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img 
                src="/LOGO/1.png" 
                alt="BahayCebu Properties Logo" 
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin Dashboard</p>
              <p className="text-xs text-gray-500 mt-0.5">Management Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleMenuClick(item.id);
                if (isMobile) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200",
                selectedMenu === item.id && "bg-[#E8F5E9] text-[#2E7D32] font-medium"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sticky bottom-0 w-full p-4 border-t border-gray-200 bg-white mt-auto">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full flex items-center justify-center sm:justify-start gap-3 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 mt-16 md:mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800">
                  {selectedMenu === 'Dashboard' ? 'Overview' :
                   selectedMenu === 'Properties' ? 'Property Management' :
                   selectedMenu === 'Agent' ? 'Agent Management' :
                   'Settings'}
                </h2>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  {selectedMenu === 'Properties' ? 'Manage and monitor your property listings' :
                   selectedMenu === 'Dashboard' ? 'Key metrics and insights' :
                   selectedMenu === 'Agent' ? 'Manage your real estate agents' : 
                   'Manage your account settings'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Search Bar */}
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-full md:w-64 bg-gray-50 border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Profile Menu */}
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green p-[1px]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {currentUser.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-bahayCebu-green font-medium">
                          {currentUser.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {selectedMenu === 'Dashboard' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-bahayCebu-green to-bahayCebu-green/80 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium opacity-90">Total Properties</div>
                    <Building className="h-6 w-6 opacity-80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{properties.length}</div>
                    <p className="text-xs opacity-80 mt-1">Active listings</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-terracotta/80 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium opacity-90">For Sale</div>
                    <FileText className="h-6 w-6 opacity-80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {properties.filter(p => p.listingType === 'For Sale').length}
                    </div>
                    <p className="text-xs opacity-80 mt-1">Properties listed for sale</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-gray-600">For Rent</div>
                    <Key className="h-6 w-6 text-bahayCebu-green" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800">
                      {properties.filter(p => p.listingType === 'For Rent').length}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Properties for rent</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-gray-600">Featured</div>
                    <Star className="h-6 w-6 text-bahayCebu-terracotta" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800">
                      {properties.filter(p => p.featured).length}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Featured properties</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">Recent Properties</h3>
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {properties.length === 0 ? (
                      <div className="text-center py-6">
                        <Building className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No properties added yet</p>
                      </div>
                    ) : (
                      properties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <img 
                            src={property.image || '/placeholder.svg'} 
                            alt={property.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{property.title}</h4>
                            <p className="text-sm text-gray-500">{property.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="bg-gray-100">
                                {property.type}
                              </Badge>
                              <Badge variant="secondary" className="bg-gray-100">
                                ₱{property.price.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">Performance Summary</h3>
                      <Select defaultValue="7days">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">Last 7 days</SelectItem>
                          <SelectItem value="30days">Last 30 days</SelectItem>
                          <SelectItem value="3months">Last 3 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Properties</span>
                          <span className="font-medium text-gray-900">{properties.length}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-bahayCebu-green h-2 rounded-full" 
                            style={{ width: `${(properties.length / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Featured Properties</span>
                          <span className="font-medium text-gray-900">
                            {properties.filter(p => p.featured).length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-bahayCebu-terracotta h-2 rounded-full" 
                            style={{ width: `${(properties.filter(p => p.featured).length / properties.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Average Price</span>
                          <span className="font-medium text-gray-900">
                            {properties.length > 0 
                              ? `₱${Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toLocaleString()}`
                              : '₱0'}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="pt-4">
                        <h4 className="text-sm font-medium text-gray-800 mb-3">Property Types Distribution</h4>
                        <div className="space-y-2">
                          {['Condo', 'House and Lot', 'Land'].map(type => {
                            const count = properties.filter(p => p.type === type).length;
                            const percentage = properties.length > 0 ? (count / properties.length) * 100 : 0;
                            return (
                              <div key={type} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">{type}</span>
                                  <span className="text-gray-900">{count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div 
                                    className="bg-bahayCebu-green h-1.5 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedMenu === 'Properties' && (
            <div className="space-y-6 md:space-y-8">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-serif font-light text-bahayCebu-darkGray mb-2">
                    Property Portfolio
                  </h1>
                  <p className="text-base md:text-lg text-bahayCebu-darkGray/60">
                    Manage and monitor your property listings
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="flex items-center justify-center space-x-3 bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 text-white px-4 md:px-8 py-3 md:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 w-full sm:w-auto"
                        disabled={properties.length === 0}
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-medium">Delete All</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-serif text-bahayCebu-darkGray">Delete All Properties</DialogTitle>
                        <p className="text-bahayCebu-darkGray/60 mt-2">Are you sure you want to delete all properties? This action cannot be undone.</p>
                      </DialogHeader>
                      <div className="flex justify-end space-x-4 pt-6">
                        <Button 
                          variant="outline" 
                          className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                          onClick={() => setIsDeleteAllDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleDeleteAllProperties}
                          className="px-6 py-2 bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 text-white shadow-lg rounded-xl"
                        >
                          Delete All
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                                <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center justify-center space-x-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white px-4 md:px-8 py-3 md:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 w-full sm:w-auto">
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add Property</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[95vh] bg-white/95 backdrop-blur-xl border-0 shadow-2xl flex flex-col overflow-hidden">
                    <DialogHeader className="pb-6 flex-shrink-0">
                      <DialogTitle className="text-xl md:text-2xl font-medium">Add New Property</DialogTitle>
                      <p className="text-sm md:text-base text-gray-600 mt-2">Fill in the details to create a new property listing</p>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto px-4 md:px-6">
                      <div className="space-y-6 md:space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-base md:text-lg font-medium">Basic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                              <Label htmlFor="title">Property Name</Label>
                              <Input
                                id="title"
                                value={newProperty.title}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter property name"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Property Type</Label>
                              <Select value={newProperty.type} onValueChange={(value: AdminProperty['type']) => setNewProperty(prev => ({ ...prev, type: value }))}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Condo">Condo</SelectItem>
                                  <SelectItem value="House and Lot">House and Lot</SelectItem>
                                  <SelectItem value="Land">Land</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Categories</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Property Type</Label>
                              <Select value={newProperty.type} onValueChange={(value: AdminProperty['type']) => setNewProperty(prev => ({ ...prev, type: value }))}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Condo">Condo</SelectItem>
                                  <SelectItem value="House and Lot">House and Lot</SelectItem>
                                  <SelectItem value="Land">Land</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Listing Type</Label>
                              <Select 
                                value={newProperty.listingType} 
                                onValueChange={(value: AdminProperty['listingType']) => {
                                  const updatedProperty: PropertyFormData = {
                                    ...newProperty,
                                    listingType: value
                                  };
                                  setNewProperty(updatedProperty);
                                }}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select listing type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="For Sale">For Sale</SelectItem>
                                  <SelectItem value="For Rent">For Rent</SelectItem>
                                  <SelectItem value="Resale">Resale</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Location & Description */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Location & Description</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="address">Address</Label>
                              <Textarea
                                id="address"
                                value={newProperty.location}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Enter full address"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={newProperty.description}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter property description"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Pricing & Details</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="price">Price (₱)</Label>
                              <Input
                                id="price"
                                type="number"
                                value={newProperty.price}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
                                placeholder="0"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bedrooms">Bedrooms</Label>
                              <Input
                                id="bedrooms"
                                type="number"
                                value={newProperty.bedrooms}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, bedrooms: e.target.value }))}
                                placeholder="0"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bathrooms">Bathrooms</Label>
                              <Input
                                id="bathrooms"
                                type="number"
                                value={newProperty.bathrooms}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, bathrooms: e.target.value }))}
                                placeholder="0"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="area">Floor Area (sqm)</Label>
                              <Input
                                id="area"
                                type="number"
                                value={newProperty.area}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, area: e.target.value }))}
                                placeholder="0"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="units">Number of Units</Label>
                              <Input
                                id="units"
                                type="number"
                                value={newProperty.units}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, units: e.target.value }))}
                                placeholder="0"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="occupancy">Occupancy Rate (%)</Label>
                              <Input
                                id="occupancy"
                                type="number"
                                value={newProperty.occupancyRate}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, occupancyRate: e.target.value }))}
                                placeholder="0"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Feature on Homepage */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="featured"
                              checked={newProperty.featured}
                              onCheckedChange={(checked) => setNewProperty(prev => ({ ...prev, featured: checked as boolean }))}
                            />
                            <Label htmlFor="featured">Feature this property on homepage</Label>
                          </div>
                        </div>

                        {/* Property Images */}
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-orange-500 pl-4">Property Images</h3>
                          <ImageUploader
                            images={newProperty.images}
                            onImagesChange={(newImages) => {
                              setNewProperty(prev => ({
                                ...prev,
                                images: newImages
                              }));
                            }}
                            onImageUpload={(file) => handleImageUpload(file, false)}
                          />
                        </div>

                        {/* Video Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Video Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="videoUrl">Video URL</Label>
                              <Input
                                id="videoUrl"
                                value={newProperty.videoUrl}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, videoUrl: e.target.value }))}
                                placeholder="Enter YouTube or Vimeo video URL"
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">Add a video URL from YouTube or Vimeo</p>
                            </div>
                            <div>
                              <Label htmlFor="thumbnailUrl">Video Thumbnail URL</Label>
                              <Input
                                id="thumbnailUrl"
                                value={newProperty.thumbnail}
                                onChange={(e) => setNewProperty(prev => ({ ...prev, thumbnail: e.target.value }))}
                                placeholder="Enter thumbnail URL"
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">URL for video thumbnail image</p>
                            </div>
                          </div>
                        </div>

                        {/* Unit Types */}
                        <UnitTypeSection
                          unitTypes={newProperty.unitTypeDetails}
                          onUnitTypesChange={(newUnitTypes) => {
                            setNewProperty(prev => ({ ...prev, unitTypeDetails: newUnitTypes }));
                          }}
                          onImageUpload={(file) => handleImageUpload(file, false)}
                        />

                        {/* Building Amenities */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Amenities</h3>
                          <SearchableMultiSelect
                            options={BUILDING_AMENITIES}
                            selectedValues={newProperty.amenities}
                            onChange={(values) => {
                              setNewProperty(prev => ({ ...prev, amenities: values }));
                            }}
                            placeholder="Select amenities..."
                          />
                        </div>

                        {/* Residential Features */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Residential Features</h3>
                          <SearchableMultiSelect
                            options={RESIDENTIAL_FEATURES}
                            selectedValues={newProperty.residentialFeatures}
                            onChange={(values) => {
                              setNewProperty(prev => ({ ...prev, residentialFeatures: values }));
                            }}
                            placeholder="Select residential features..."
                          />
                        </div>

                        {/* Provisions */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Provisions</h3>
                          <SearchableMultiSelect
                            options={PROPERTY_PROVISIONS}
                            selectedValues={newProperty.provisions}
                            onChange={(values) => {
                              setNewProperty(prev => ({ ...prev, provisions: values }));
                            }}
                            placeholder="Select provisions..."
                          />
                        </div>

                        {/* Building Features */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Features</h3>
                          <SearchableMultiSelect
                            options={BUILDING_FEATURES}
                            selectedValues={newProperty.buildingFeatures}
                            onChange={(values) => {
                              setNewProperty(prev => ({ ...prev, buildingFeatures: values }));
                            }}
                            placeholder="Select building features..."
                          />
                        </div>

                        {/* Property Overview Sections */}
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-orange-500 pl-4">Property Overview</h3>
                          
                          {/* Location & Accessibility */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Location & Accessibility</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label>Nearby Landmarks</Label>
                                <TagInput
                                  tags={newProperty.locationAccessibility?.nearbyLandmarks || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    locationAccessibility: {
                                      ...prev.locationAccessibility,
                                      nearbyLandmarks: tags
                                    }
                                  }))}
                                  placeholder="Add landmark and press Enter"
                                />
                              </div>
                              <div>
                                <Label>Public Transport</Label>
                                <TagInput
                                  tags={newProperty.locationAccessibility?.publicTransport || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    locationAccessibility: {
                                      ...prev.locationAccessibility,
                                      publicTransport: tags
                                    }
                                  }))}
                                  placeholder="Add transport option and press Enter"
                                />
                              </div>
                              <div>
                                <Label>Main Roads</Label>
                                <TagInput
                                  tags={newProperty.locationAccessibility.mainRoads}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    locationAccessibility: {
                                      ...prev.locationAccessibility,
                                      mainRoads: tags
                                    }
                                  }))}
                                  placeholder="Add main road and press Enter"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Features & Amenities */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Features & Amenities</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label>Property Highlights</Label>
                                <TagInput
                                  tags={newProperty.featuresAmenities?.propertyHighlights || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    featuresAmenities: {
                                      ...prev.featuresAmenities,
                                      propertyHighlights: tags
                                    }
                                  }))}
                                  placeholder="Add highlight and press Enter"
                                />
                              </div>
                              <div>
                                <Label>Smart Home Features</Label>
                                <TagInput
                                  tags={newProperty.featuresAmenities?.smartHomeFeatures || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    featuresAmenities: {
                                      ...prev.featuresAmenities,
                                      smartHomeFeatures: tags
                                    }
                                  }))}
                                  placeholder="Add smart feature and press Enter"
                                />
                              </div>
                              <div>
                                <Label>Security Features</Label>
                                <TagInput
                                  tags={newProperty.featuresAmenities?.securityFeatures || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    featuresAmenities: {
                                      ...prev.featuresAmenities,
                                      securityFeatures: tags
                                    }
                                  }))}
                                  placeholder="Add security feature and press Enter"
                                />
                              </div>
                              <div>
                                <Label>Sustainability Features</Label>
                                <TagInput
                                  tags={newProperty.featuresAmenities?.sustainabilityFeatures || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    featuresAmenities: {
                                      ...prev.featuresAmenities,
                                      sustainabilityFeatures: tags
                                    }
                                  }))}
                                  placeholder="Add sustainability feature and press Enter"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Lifestyle & Community */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Lifestyle & Community</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label>Neighborhood Type</Label>
                                <Input
                                  value={newProperty.lifestyleCommunity?.neighborhoodType || ''}
                                  onChange={(e) => setNewProperty(prev => ({
                                    ...prev,
                                    lifestyleCommunity: {
                                      ...prev.lifestyleCommunity,
                                      neighborhoodType: e.target.value
                                    }
                                  }))}
                                  placeholder="e.g., Residential, Mixed-use, etc."
                                />
                              </div>
                              <div>
                                <Label>Local Amenities</Label>
                                <TagInput
                                  tags={newProperty.lifestyleCommunity?.localAmenities || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    lifestyleCommunity: {
                                      ...prev.lifestyleCommunity,
                                      localAmenities: tags
                                    }
                                  }))}
                                  placeholder="Add local amenity and press Enter"
                                />
                              </div>
                              <div>
                                <Label>Community Features</Label>
                                <TagInput
                                  tags={newProperty.lifestyleCommunity?.communityFeatures || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    lifestyleCommunity: {
                                      ...prev.lifestyleCommunity,
                                      communityFeatures: tags
                                    }
                                  }))}
                                  placeholder="Add community feature and press Enter"
                                />
                              </div>
                              <div>
                                <Label>Nearby Establishments</Label>
                                <TagInput
                                  tags={newProperty.lifestyleCommunity?.nearbyEstablishments || []}
                                  onTagsChange={(tags) => setNewProperty(prev => ({
                                    ...prev,
                                    lifestyleCommunity: {
                                      ...prev.lifestyleCommunity,
                                      nearbyEstablishments: tags
                                    }
                                  }))}
                                  placeholder="Add nearby establishment and press Enter"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Additional Information */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Additional Information</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label>Property History</Label>
                                <Textarea
                                  value={newProperty.additionalInformation?.propertyHistory || ''}
                                  onChange={(e) => setNewProperty(prev => ({
                                    ...prev,
                                    additionalInformation: {
                                      ...prev.additionalInformation,
                                      propertyHistory: e.target.value
                                    }
                                  }))}
                                  placeholder="Enter property history"
                                />
                              </div>
                              <div>
                                <Label>Legal Information</Label>
                                <Textarea
                                  value={newProperty.additionalInformation?.legalInformation || ''}
                                  onChange={(e) => setNewProperty(prev => ({
                                    ...prev,
                                    additionalInformation: {
                                      ...prev.additionalInformation,
                                      legalInformation: e.target.value
                                    }
                                  }))}
                                  placeholder="Enter legal information"
                                />
                              </div>
                              <div>
                                <Label>Development Plans</Label>
                                <Textarea
                                  value={newProperty.additionalInformation?.developmentPlans || ''}
                                  onChange={(e) => setNewProperty(prev => ({
                                    ...prev,
                                    additionalInformation: {
                                      ...prev.additionalInformation,
                                      developmentPlans: e.target.value
                                    }
                                  }))}
                                  placeholder="Enter development plans"
                                />
                              </div>
                              <div>
                                <Label>Special Notes</Label>
                                <Textarea
                                  value={newProperty.additionalInformation?.specialNotes || ''}
                                  onChange={(e) => setNewProperty(prev => ({
                                    ...prev,
                                    additionalInformation: {
                                      ...prev.additionalInformation,
                                      specialNotes: e.target.value
                                    }
                                  }))}
                                  placeholder="Enter special notes"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 pb-2 px-4 md:px-6 border-t border-gray-100 mt-8 flex-shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddPropertyOpen(false)}
                        className="w-full sm:w-auto px-4 md:px-8 py-2 md:py-3 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddProperty}
                        className="w-full sm:w-auto px-4 md:px-8 py-2 md:py-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg rounded-xl"
                      >
                        Add Property
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                </div>
              </div>

              {/* Edit Property Dialog */}
              <Dialog open={isEditPropertyOpen} onOpenChange={setIsEditPropertyOpen}>
                <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[95vh] bg-white/95 backdrop-blur-xl border-0 shadow-2xl flex flex-col overflow-hidden">
                  <DialogHeader className="pb-6 flex-shrink-0">
                    <DialogTitle className="text-xl md:text-2xl font-medium">Edit Property</DialogTitle>
                    <p className="text-sm md:text-base text-gray-600 mt-2">Update the property details</p>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-4 md:px-6">
                    <div className="space-y-6 md:space-y-8">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-base md:text-lg font-medium">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <Label htmlFor="edit-title">Property Name</Label>
                            <Input
                              id="edit-title"
                              value={editProperty.title}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Enter property name"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Select value={editProperty.type} onValueChange={(value: AdminProperty['type']) => setEditProperty(prev => ({ ...prev, type: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Active" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Location & Description */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Location & Description</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-location">Address</Label>
                            <Textarea
                              id="edit-location"
                              value={editProperty.location}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Enter full address"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              value={editProperty.description}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Enter property description"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Pricing & Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="edit-price">Price (₱)</Label>
                            <Input
                              id="edit-price"
                              type="number"
                              value={editProperty.price}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, price: e.target.value }))}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                            <Input
                              id="edit-bedrooms"
                              type="number"
                              value={editProperty.bedrooms}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, bedrooms: e.target.value }))}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                            <Input
                              id="edit-bathrooms"
                              type="number"
                              value={editProperty.bathrooms}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, bathrooms: e.target.value }))}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-area">Floor Area (sqm)</Label>
                            <Input
                              id="edit-area"
                              type="number"
                              value={editProperty.area}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, area: e.target.value }))}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-units">Number of Units</Label>
                            <Input
                              id="edit-units"
                              type="number"
                              value={editProperty.units}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, units: e.target.value }))}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-occupancy">Occupancy Rate (%)</Label>
                            <Input
                              id="edit-occupancy"
                              type="number"
                              value={editProperty.occupancyRate}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, occupancyRate: e.target.value }))}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Unit Types */}
                      <UnitTypeSection
                        unitTypes={editProperty.unitTypeDetails}
                        onUnitTypesChange={(newUnitTypes) => {
                          console.log('New unit types:', newUnitTypes);
                          setEditProperty(prev => {
                            const updated = { ...prev, unitTypeDetails: newUnitTypes };
                            console.log('Updated edit property:', updated);
                            return updated;
                          });
                        }}
                        onImageUpload={(file) => handleImageUpload(file, true)}
                      />

                      {/* Building Amenities */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Amenities</h3>
                        <SearchableMultiSelect
                          options={BUILDING_AMENITIES}
                          selectedValues={editProperty.amenities}
                          onChange={(values) => {
                            setEditProperty(prev => ({ ...prev, amenities: values }));
                          }}
                          placeholder="Select amenities..."
                        />
                      </div>

                      {/* Residential Features */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Residential Features</h3>
                        <SearchableMultiSelect
                          options={RESIDENTIAL_FEATURES}
                          selectedValues={editProperty.residentialFeatures}
                          onChange={(values) => {
                            setEditProperty(prev => ({ ...prev, residentialFeatures: values }));
                          }}
                          placeholder="Select residential features..."
                        />
                      </div>

                      {/* Provisions */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Provisions</h3>
                        <SearchableMultiSelect
                          options={PROPERTY_PROVISIONS}
                          selectedValues={editProperty.provisions}
                          onChange={(values) => {
                            setEditProperty(prev => ({ ...prev, provisions: values }));
                          }}
                          placeholder="Select provisions..."
                        />
                      </div>

                      {/* Building Features */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Features</h3>
                        <SearchableMultiSelect
                          options={BUILDING_FEATURES}
                          selectedValues={editProperty.buildingFeatures}
                          onChange={(values) => {
                            setEditProperty(prev => ({ ...prev, buildingFeatures: values }));
                          }}
                          placeholder="Select building features..."
                        />
                      </div>

                      {/* Property Overview Sections */}
                      <div className="space-y-8">
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-blue-500 pl-4">Property Overview</h3>
                        
                        {/* Location & Accessibility */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Location & Accessibility</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label>Nearby Landmarks</Label>
                              <TagInput
                                tags={editProperty.locationAccessibility.nearbyLandmarks}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  locationAccessibility: {
                                    ...prev.locationAccessibility,
                                    nearbyLandmarks: tags
                                  }
                                }))}
                                placeholder="Add landmark and press Enter"
                              />
                            </div>
                            <div>
                              <Label>Public Transport</Label>
                              <TagInput
                                tags={editProperty.locationAccessibility.publicTransport}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  locationAccessibility: {
                                    ...prev.locationAccessibility,
                                    publicTransport: tags
                                  }
                                }))}
                                placeholder="Add transport option and press Enter"
                              />
                            </div>
                            <div>
                              <Label>Main Roads</Label>
                              <TagInput
                                tags={editProperty.locationAccessibility.mainRoads}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  locationAccessibility: {
                                    ...prev.locationAccessibility,
                                    mainRoads: tags
                                  }
                                }))}
                                placeholder="Add main road and press Enter"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Features & Amenities */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Features & Amenities</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label>Property Highlights</Label>
                              <TagInput
                                tags={editProperty.featuresAmenities.propertyHighlights}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  featuresAmenities: {
                                    ...prev.featuresAmenities,
                                    propertyHighlights: tags
                                  }
                                }))}
                                placeholder="Add property highlight and press Enter"
                              />
                            </div>
                            <div>
                              <Label>Smart Home Features</Label>
                              <TagInput
                                tags={editProperty.featuresAmenities.smartHomeFeatures}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  featuresAmenities: {
                                    ...prev.featuresAmenities,
                                    smartHomeFeatures: tags
                                  }
                                }))}
                                placeholder="Add smart home feature and press Enter"
                              />
                            </div>
                            <div>
                              <Label>Security Features</Label>
                              <TagInput
                                tags={editProperty.featuresAmenities.securityFeatures}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  featuresAmenities: {
                                    ...prev.featuresAmenities,
                                    securityFeatures: tags
                                  }
                                }))}
                                placeholder="Add security feature and press Enter"
                              />
                            </div>
                            <div>
                              <Label>Sustainability Features</Label>
                              <TagInput
                                tags={editProperty.featuresAmenities.sustainabilityFeatures}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  featuresAmenities: {
                                    ...prev.featuresAmenities,
                                    sustainabilityFeatures: tags
                                  }
                                }))}
                                placeholder="Add sustainability feature and press Enter"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Lifestyle & Community */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Lifestyle & Community</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label>Neighborhood Type</Label>
                              <Input
                                value={editProperty.lifestyleCommunity.neighborhoodType}
                                onChange={(e) => setEditProperty(prev => ({
                                  ...prev,
                                  lifestyleCommunity: {
                                    ...prev.lifestyleCommunity,
                                    neighborhoodType: e.target.value
                                  }
                                }))}
                                placeholder="e.g., Residential, Mixed-use, etc."
                              />
                            </div>
                            <div>
                              <Label>Local Amenities</Label>
                              <TagInput
                                tags={editProperty.lifestyleCommunity.localAmenities}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  lifestyleCommunity: {
                                    ...prev.lifestyleCommunity,
                                    localAmenities: tags
                                  }
                                }))}
                                placeholder="Add local amenity and press Enter"
                              />
                            </div>
                            <div>
                              <Label>Community Features</Label>
                              <TagInput
                                tags={editProperty.lifestyleCommunity.communityFeatures}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  lifestyleCommunity: {
                                    ...prev.lifestyleCommunity,
                                    communityFeatures: tags
                                  }
                                }))}
                                placeholder="Add community feature and press Enter"
                              />
                            </div>
                            <div>
                              <Label>Nearby Establishments</Label>
                              <TagInput
                                tags={editProperty.lifestyleCommunity.nearbyEstablishments}
                                onTagsChange={(tags) => setEditProperty(prev => ({
                                  ...prev,
                                  lifestyleCommunity: {
                                    ...prev.lifestyleCommunity,
                                    nearbyEstablishments: tags
                                  }
                                }))}
                                placeholder="Add nearby establishment and press Enter"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Additional Information</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label>Property History</Label>
                              <Textarea
                                value={editProperty.additionalInformation.propertyHistory}
                                onChange={(e) => setEditProperty(prev => ({
                                  ...prev,
                                  additionalInformation: {
                                    ...prev.additionalInformation,
                                    propertyHistory: e.target.value
                                  }
                                }))}
                                placeholder="Enter property history"
                              />
                            </div>
                            <div>
                              <Label>Legal Information</Label>
                              <Textarea
                                value={editProperty.additionalInformation.legalInformation}
                                onChange={(e) => setEditProperty(prev => ({
                                  ...prev,
                                  additionalInformation: {
                                    ...prev.additionalInformation,
                                    legalInformation: e.target.value
                                  }
                                }))}
                                placeholder="Enter legal information"
                              />
                            </div>
                            <div>
                              <Label>Development Plans</Label>
                              <Textarea
                                value={editProperty.additionalInformation.developmentPlans}
                                onChange={(e) => setEditProperty(prev => ({
                                  ...prev,
                                  additionalInformation: {
                                    ...prev.additionalInformation,
                                    developmentPlans: e.target.value
                                  }
                                }))}
                                placeholder="Enter development plans"
                              />
                            </div>
                            <div>
                              <Label>Special Notes</Label>
                              <Textarea
                                value={editProperty.additionalInformation.specialNotes}
                                onChange={(e) => setEditProperty(prev => ({
                                  ...prev,
                                  additionalInformation: {
                                    ...prev.additionalInformation,
                                    specialNotes: e.target.value
                                  }
                                }))}
                                placeholder="Enter special notes"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Feature on Homepage */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="edit-featured"
                            checked={editProperty.featured}
                            onCheckedChange={(checked) => setEditProperty(prev => ({ ...prev, featured: checked as boolean }))}
                          />
                          <Label htmlFor="edit-featured">Feature this property on homepage</Label>
                        </div>
                      </div>

                      {/* Property Images */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-orange-500 pl-4">Property Images</h3>
                        <ImageUploader
                          images={editProperty.images}
                          onImagesChange={(newImages) => {
                            setEditProperty(prev => ({
                              ...prev,
                              images: newImages
                            }));
                          }}
                          onImageUpload={(file) => handleImageUpload(file, true)}
                        />
                      </div>

                      {/* Video Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-red-500 pl-4">Video Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-videoUrl">Video URL</Label>
                            <Input
                              id="edit-videoUrl"
                              type="text"
                              value={editProperty.videoUrl}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, videoUrl: e.target.value }))}
                              placeholder="Enter video URL (e.g., YouTube link)"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                            <Input
                              id="edit-thumbnail"
                              type="text"
                              value={editProperty.thumbnail}
                              onChange={(e) => setEditProperty(prev => ({ ...prev, thumbnail: e.target.value }))}
                              placeholder="Enter thumbnail URL"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 pb-2 px-4 md:px-6 border-t border-gray-100 mt-8 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditPropertyOpen(false)}
                      className="w-full sm:w-auto px-4 md:px-8 py-2 md:py-3 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleEditProperty}
                      className="w-full sm:w-auto px-4 md:px-8 py-2 md:py-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg rounded-xl"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete Property Dialog */}
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-bahayCebu-darkGray">Delete Property</DialogTitle>
                    <p className="text-bahayCebu-darkGray/60 mt-2">Are you sure you want to delete this property? This action cannot be undone.</p>
                  </DialogHeader>
                  <div className="flex justify-end space-x-4 pt-6">
                    <Button 
                      variant="outline" 
                      className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => editingProperty && handleDeleteProperty(editingProperty.id)}
                      className="px-6 py-2 bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 text-white shadow-lg rounded-xl"
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Property Filters */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="space-y-8">
                  {/* Filters Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-bahayCebu-green rounded-full"></div>
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray">Filters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm text-bahayCebu-darkGray/70">Property Type</Label>
                        <Select value={propertyTypeFilter} onValueChange={handlePropertyTypeFilter}>
                          <SelectTrigger className="w-full border-gray-200 focus:border-bahayCebu-green rounded-xl h-12 bg-white">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Condo">Condo</SelectItem>
                            <SelectItem value="House and Lot">House and Lot</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      
                    </div>
                  </div>

                  {/* Filter Summary */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Showing {filteredProperties.length} of {properties.length} properties
                    </div>
                                         {propertyTypeFilter && (
                      <button
                                                    onClick={() => setPropertyTypeFilter('')}
                        className="text-sm text-bahayCebu-green hover:text-bahayCebu-green/80 font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              {properties.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 bg-bahayCebu-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Building className="h-10 w-10 text-bahayCebu-green" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-bahayCebu-darkGray mb-4">No property listed or added</h3>
                    <p className="text-bahayCebu-darkGray/60 max-w-md mx-auto leading-relaxed">
                      Start adding properties to your portfolio to showcase them to potential buyers and renters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {currentProperties.map((property) => (
                      <Card key={property.id} className="group overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          {/* Property Image Section */}
                          <div className="md:col-span-4 relative aspect-[4/3] overflow-hidden rounded-tl-2xl">
                            <img
                              src={property.image || '/placeholder-property.jpg'}
                              alt={property.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-bahayCebu-darkGray">
                                {property.type}
                              </Badge>
                              {property.featured && (
                                <Badge className="bg-bahayCebu-green/90 backdrop-blur-sm text-white">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Property Details Section */}
                          <div className="md:col-span-8 p-6">
                            <CardContent className="p-0 space-y-6">
                              {/* Header Section */}
                              <div>
                                <div className="flex items-start justify-between gap-4">
                                  <h3 className="text-2xl font-serif text-bahayCebu-darkGray">
                                    {property.title}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-bahayCebu-green text-bahayCebu-green">
                                      {property.listingType}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{property.location}</span>
                                </div>
                              </div>

                              {/* Property Stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                                <div>
                                  <p className="text-gray-500 text-sm">Price</p>
                                  <p className="text-lg font-medium text-bahayCebu-darkGray">₱{property.price.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 text-sm">Bedrooms</p>
                                  <p className="text-lg font-medium text-bahayCebu-darkGray">{property.bedrooms}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 text-sm">Bathrooms</p>
                                  <p className="text-lg font-medium text-bahayCebu-darkGray">{property.bathrooms}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 text-sm">Floor Area</p>
                                  <p className="text-lg font-medium text-bahayCebu-darkGray">{property.area} sqm</p>
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <p className="text-gray-600 line-clamp-2">
                                  {property.description}
                                </p>
                                {property.description.length > 150 && (
                                  <button
                                    onClick={() => toggleDescription(property.id)}
                                    className="text-bahayCebu-green hover:text-bahayCebu-green/80 text-sm font-medium mt-2"
                                  >
                                    {expandedDescriptions.has(property.id) ? 'Show Less' : 'Read More'}
                                  </button>
                                )}
                              </div>

                              {/* Performance Stats */}
                              <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                                <div className="text-center">
                                  <p className="text-gray-500 text-sm">Views</p>
                                  <p className="text-lg font-medium text-bahayCebu-darkGray">{property.stats?.views || 0}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 text-sm">Leads</p>
                                  <p className="text-lg font-medium text-bahayCebu-darkGray">{property.stats?.leads || 0}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-gray-500 text-sm">Applications</p>
                                  <p className="text-lg font-medium text-bahayCebu-darkGray">{property.stats?.applications || 0}</p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  className="flex-1 flex items-center justify-center gap-2 border-bahayCebu-blue text-bahayCebu-blue hover:bg-bahayCebu-blue/10"
                                  onClick={() => {
                                    navigate(`/admin/properties/${property.id}/preview`);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Preview</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 flex items-center justify-center gap-2 border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green/10"
                                  onClick={() => openEditDialog(property)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                  <span>Edit</span>
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1 flex items-center justify-center gap-2 bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90"
                                  onClick={() => {
                                    setEditingProperty(property);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </Button>
                              </div>

                              {/* Timestamps */}
                              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                <div>Created: {new Date(property.createdAt).toLocaleDateString()}</div>
                                {property.lastUpdated && (
                                  <div>Last Updated: {new Date(property.lastUpdated).toLocaleDateString()}</div>
                                )}
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === currentPage ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 text-sm rounded-xl ${
                            pageNumber === currentPage
                              ? "bg-bahayCebu-green text-white"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {selectedMenu === 'Agent' && (
            <div className="space-y-8">
              {/* Header Section */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-serif text-bahayCebu-darkGray">Agent Management</h1>
                    <p className="text-gray-500 mt-1">Manage your real estate agents</p>
                  </div>
                  <Button 
                    onClick={() => setIsAddAgentOpen(true)}
                    className="flex items-center gap-2 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white px-4 py-2 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Agent
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingAgents && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bahayCebu-green"></div>
                </div>
              )}

              {/* Error State */}
              {!isLoadingAgents && !agents && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-bahayCebu-terracotta mb-2">
                    <AlertCircle className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-bahayCebu-darkGray">Failed to load agents</h3>
                  <p className="text-gray-500 mt-1">Please try refreshing the page</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoadingAgents && agents && agents.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-bahayCebu-green mb-2">
                    <Users className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium text-bahayCebu-darkGray">No agents found</h3>
                  <p className="text-gray-500 mt-1">Click the "Add Agent" button to add your first agent</p>
                </div>
              )}

              {/* Agents Grid */}
              {!isLoadingAgents && agents && agents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agents.map((agent) => (
                    <div key={agent?.id || 'temp-key'} data-agent-id={agent?.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-opacity duration-200">
                      <div className="p-6 space-y-6">
                        {/* Header - Image and Basic Info */}
                        <div className="flex items-start space-x-4">
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green p-[2px]">
                              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                {agent?.image && agent.image.trim() !== '' ? (
                                  <img
                                    src={agent.image}
                                    alt={agent?.name || 'Agent'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <User className={`h-12 w-12 text-gray-400 ${agent?.image && agent.image.trim() !== '' ? 'hidden' : ''}`} />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-bahayCebu-darkGray truncate">{agent?.name || 'Unnamed Agent'}</h3>
                            <p className="text-sm text-gray-500">{agent?.title || 'Real Estate Agent'}</p>
                            <p className="text-sm text-gray-500 mt-1">{agent?.location || 'Location not specified'}</p>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{agent?.email || 'Email not provided'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{agent?.phone || 'Phone not provided'}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-medium text-bahayCebu-darkGray mb-2">About</h4>
                          <div className="text-sm text-gray-600">
                            {(() => {
                              const description = agent?.description || 'No description available';
                              const isExpanded = expandedAgentDescriptions.has(agent.id);
                              const shouldTruncate = description.length > 300;
                              
                              if (!shouldTruncate) {
                                return <p>{description}</p>;
                              }
                              
                              return (
                                <div>
                                  <p className={isExpanded ? '' : 'line-clamp-3'}>
                                    {isExpanded ? description : `${description.substring(0, 300)}...`}
                                  </p>
                                  <button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedAgentDescriptions);
                                      if (isExpanded) {
                                        newExpanded.delete(agent.id);
                                      } else {
                                        newExpanded.add(agent.id);
                                      }
                                      setExpandedAgentDescriptions(newExpanded);
                                    }}
                                    className="text-bahayCebu-green hover:text-bahayCebu-green/80 text-xs font-medium mt-1 transition-colors"
                                  >
                                    {isExpanded ? 'Show less' : 'View more'}
                                  </button>
                                </div>
                              );
                            })()} 
                          </div>
                        </div>

                        {/* Specializations */}
                        <div>
                          <h4 className="text-sm font-medium text-bahayCebu-darkGray mb-2">Specializations</h4>
                          <div className="flex flex-wrap gap-2">
                            {(agent?.specializations || []).map((specialization) => (
                              <span
                                key={specialization}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bahayCebu-green/10 text-bahayCebu-green"
                              >
                                {specialization}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div>
                          <h4 className="text-sm font-medium text-bahayCebu-darkGray mb-3">Performance Metrics</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-semibold text-bahayCebu-darkGray">{agent?.listings || 0}</div>
                              <div className="text-xs text-gray-500">Active Listings</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-semibold text-bahayCebu-darkGray">{agent?.deals || 0}</div>
                              <div className="text-xs text-gray-500">Closed Deals</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-semibold text-bahayCebu-darkGray">{(agent?.rating || 0).toFixed(1)}</div>
                              <div className="text-xs text-gray-500">Rating</div>
                            </div>
                          </div>
                        </div>

                        {/* Social Media Links */}
                        <div>
                          <h4 className="text-sm font-medium text-bahayCebu-darkGray mb-3">Social Media</h4>
                          <div className="flex space-x-4">
                            {agent?.socialMedia?.facebook && (
                              <a
                                href={agent.socialMedia.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-300 transform hover:scale-110"
                                title="Facebook Profile"
                              >
                                <Facebook className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                  Facebook
                                </span>
                              </a>
                            )}
                            {agent?.socialMedia?.instagram && (
                              <a
                                href={agent.socialMedia.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 transition-all duration-300 transform hover:scale-110"
                                title="Instagram Profile"
                              >
                                <Instagram className="h-5 w-5 text-pink-600 group-hover:text-pink-700" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                  Instagram
                                </span>
                              </a>
                            )}
                            {agent?.socialMedia?.linkedin && (
                              <a
                                href={agent.socialMedia.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 transition-all duration-300 transform hover:scale-110"
                                title="LinkedIn Profile"
                              >
                                <Linkedin className="h-5 w-5 text-blue-700 group-hover:text-blue-800" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                  LinkedIn
                                </span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                          <Button
                            onClick={() => {
                              setEditingAgent({
                                ...agent,
                                name: agent.name || '',
                                title: agent.title || 'Senior Real Estate Consultant',
                                email: agent.email || '',
                                phone: agent.phone || '',
                                location: agent.location || 'Cebu City, Philippines',
                                description: agent.description || '',
                                specializations: agent.specializations || [],
                                listings: agent.listings || 0,
                                deals: agent.deals || 0,
                                rating: agent.rating || 0,
                                image: agent.image || null,
                                socialMedia: {
                                  facebook: agent.socialMedia?.facebook || '',
                                  instagram: agent.socialMedia?.instagram || '',
                                  linkedin: agent.socialMedia?.linkedin || ''
                                }
                              });
                              setIsEditAgentOpen(true);
                            }}
                            variant="outline"
                            className="text-bahayCebu-green border-bahayCebu-green hover:bg-bahayCebu-green/10"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteAgent(agent.id)}
                            variant="destructive"
                            className="bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-bahayCebu-darkGray">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <Label className="text-gray-700 font-medium">Profile Picture</Label>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-bahayCebu-green/10 to-bahayCebu-terracotta/10 p-1">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {profileForm.profilePicture ? (
                          <img 
                            src={profileForm.profilePicture} 
                            alt="Profile Preview" 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <User className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <Label
                    htmlFor="profile-picture-upload"
                    className="absolute bottom-0 right-0 cursor-pointer bg-bahayCebu-green text-white p-2 rounded-full shadow-lg hover:bg-bahayCebu-green/90 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <Input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </Label>
                </div>
                {profileForm.profilePicture && (
                  <button
                    type="button"
                    onClick={() => setProfileForm(prev => ({ ...prev, profilePicture: '' }))}
                    className="text-sm text-bahayCebu-terracotta hover:text-bahayCebu-terracotta/90 transition-colors duration-200"
                  >
                    Remove photo
                  </button>
                )}
                <p className="text-sm text-gray-500">Click to upload a new profile picture</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {/* Name and Email Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-bahayCebu-darkGray font-medium">Full Name</Label>
                <Input
                  id="profile-name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="border-bahayCebu-green/20 focus:border-bahayCebu-green"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email" className="text-bahayCebu-darkGray font-medium">Email Address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="border-bahayCebu-green/20 focus:border-bahayCebu-green"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditProfileOpen(false)}
                className="px-6 py-2 border-bahayCebu-darkGray/20 text-bahayCebu-darkGray hover:bg-bahayCebu-darkGray/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditProfile}
                className="px-6 py-2 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agent Image Cropper Dialog */}
      <Dialog open={isAgentCropperOpen} onOpenChange={setIsAgentCropperOpen}>
        <DialogContent className="max-w-[800px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-serif text-bahayCebu-darkGray">Crop Agent Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <ImageCropper
              isOpen={isAgentCropperOpen}
              onClose={() => setIsAgentCropperOpen(false)}
              imageSrc={tempAgentImageSrc}
              onCropComplete={handleAgentCropComplete}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-bahayCebu-darkGray">Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-bahayCebu-darkGray font-medium">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="border-bahayCebu-green/20 focus:border-bahayCebu-green pr-10"
                  readOnly
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-bahayCebu-darkGray font-medium">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="border-bahayCebu-green/20 focus:border-bahayCebu-green pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-bahayCebu-darkGray font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Enter confirm password"
                  className="border-bahayCebu-green/20 focus:border-bahayCebu-green pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsChangePasswordOpen(false)}
                className="px-6 py-2 border-bahayCebu-darkGray/20 text-bahayCebu-darkGray hover:bg-bahayCebu-darkGray/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleChangePassword}
                className="px-6 py-2 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg"
              >
                Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditAgentOpen} onOpenChange={setIsEditAgentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Edit Agent</DialogTitle>
          </DialogHeader>
          {editingAgent && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Left Column - Basic Info & Image */}
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative w-40 h-40">
                      {editingAgent.image && editingAgent.image.trim() !== '' ? (
                        <img 
                          src={editingAgent.image} 
                          alt="Agent Preview" 
                          className="w-40 h-40 rounded-full object-cover border-4 border-bahayCebu-green/20 object-center"
                          style={{ objectPosition: '50% 25%' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-40 h-40 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center ${editingAgent.image && editingAgent.image.trim() !== '' ? 'hidden' : ''}`}>
                        <User className="h-16 w-16 text-white" />
                      </div>
                      <Label 
                        htmlFor="agent-image-upload-edit" 
                        className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-5 h-5 text-bahayCebu-green" />
                        <Input
                          id="agent-image-upload-edit"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAgentImageUpload(e, true)}
                          className="hidden"
                        />
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-agent-name" className="text-sm font-medium text-bahayCebu-darkGray">
                        Name <span className="text-bahayCebu-terracotta">*</span>
                      </Label>
                      <Input
                        id="edit-agent-name"
                        value={editingAgent.name}
                        onChange={(e) => setEditingAgent(prev => ({ ...prev!, name: e.target.value }))}
                        placeholder="e.g. Maria Santos"
                        className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-agent-title" className="text-sm font-medium text-bahayCebu-darkGray">
                        Title <span className="text-bahayCebu-terracotta">*</span>
                      </Label>
                      <Input
                        id="edit-agent-title"
                        value={editingAgent.title}
                        onChange={(e) => setEditingAgent(prev => ({ ...prev!, title: e.target.value }))}
                        placeholder="e.g. Senior Real Estate Consultant"
                        className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-agent-description" className="text-sm font-medium text-bahayCebu-darkGray">
                        Description <span className="text-bahayCebu-terracotta">*</span>
                      </Label>
                      <Textarea
                        id="edit-agent-description"
                        value={editingAgent.description}
                        onChange={(e) => setEditingAgent(prev => ({ ...prev!, description: e.target.value }))}
                        placeholder="Enter agent description"
                        className="min-h-[100px] border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  {/* Agent Stats */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-bahayCebu-darkGray">Performance Metrics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-agent-listings" className="text-sm font-medium text-bahayCebu-darkGray">
                          Active Listings
                        </Label>
                        <Input
                          id="edit-agent-listings"
                          type="number"
                          min="0"
                          value={editingAgent.listings}
                          onChange={(e) => setEditingAgent(prev => ({ ...prev!, listings: parseInt(e.target.value) || 0 }))}
                          className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-agent-deals" className="text-sm font-medium text-bahayCebu-darkGray">
                          Closed Deals
                        </Label>
                        <Input
                          id="edit-agent-deals"
                          type="number"
                          min="0"
                          value={editingAgent.deals}
                          onChange={(e) => setEditingAgent(prev => ({ ...prev!, deals: parseInt(e.target.value) || 0 }))}
                          className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-agent-rating" className="text-sm font-medium text-bahayCebu-darkGray">
                          Rating (0-5)
                        </Label>
                        <Input
                          id="edit-agent-rating"
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editingAgent.rating}
                          onChange={(e) => setEditingAgent(prev => ({ ...prev!, rating: parseFloat(e.target.value) || 0 }))}
                          className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact & Specializations */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-agent-email" className="text-sm font-medium text-bahayCebu-darkGray">
                        Email <span className="text-bahayCebu-terracotta">*</span>
                      </Label>
                      <Input
                        id="edit-agent-email"
                        type="email"
                        value={editingAgent.email}
                        onChange={(e) => setEditingAgent(prev => ({ ...prev!, email: e.target.value }))}
                        placeholder="e.g. agent@example.com"
                        className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-agent-phone" className="text-sm font-medium text-bahayCebu-darkGray">
                        Phone <span className="text-bahayCebu-terracotta">*</span>
                      </Label>
                      <Input
                        id="edit-agent-phone"
                        value={editingAgent.phone}
                        onChange={(e) => setEditingAgent(prev => ({ ...prev!, phone: e.target.value }))}
                        placeholder="e.g. +63 123 456 7890"
                        className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-agent-location" className="text-sm font-medium text-bahayCebu-darkGray">
                        Location <span className="text-bahayCebu-terracotta">*</span>
                      </Label>
                      <Input
                        id="edit-agent-location"
                        value={editingAgent.location}
                        onChange={(e) => setEditingAgent(prev => ({ ...prev!, location: e.target.value }))}
                        placeholder="e.g. Cebu City"
                        className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-bahayCebu-darkGray">
                      Specializations <span className="text-bahayCebu-terracotta">*</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-3 border rounded-xl p-4 max-h-[300px] overflow-y-auto bg-white">
                      {SPECIALIZATIONS.map((specialization) => (
                        <div key={specialization} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <Checkbox
                            id={`edit-${specialization}`}
                            checked={editingAgent.specializations.includes(specialization)}
                            onCheckedChange={(checked) => {
                              setEditingAgent(prev => ({
                                ...prev!,
                                specializations: checked
                                  ? [...prev!.specializations, specialization]
                                  : prev!.specializations.filter(s => s !== specialization)
                              }));
                            }}
                            className="border-2 border-bahayCebu-green/30 data-[state=checked]:bg-bahayCebu-green data-[state=checked]:border-bahayCebu-green"
                          />
                          <Label htmlFor={`edit-${specialization}`} className="text-sm cursor-pointer flex-1">
                            {specialization}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-bahayCebu-darkGray">
                      Social Media Links
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <Input
                          placeholder="Facebook Profile URL"
                          value={editingAgent.socialMedia.facebook}
                          onChange={(e) => setEditingAgent(prev => ({
                            ...prev!,
                            socialMedia: { ...prev!.socialMedia, facebook: e.target.value }
                          }))}
                          className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <Input
                          placeholder="Instagram Profile URL"
                          value={editingAgent.socialMedia.instagram}
                          onChange={(e) => setEditingAgent(prev => ({
                            ...prev!,
                            socialMedia: { ...prev!.socialMedia, instagram: e.target.value }
                          }))}
                          className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-5 h-5 text-blue-700" />
                        <Input
                          placeholder="LinkedIn Profile URL"
                          value={editingAgent.socialMedia.linkedin}
                          onChange={(e) => setEditingAgent(prev => ({
                            ...prev!,
                            socialMedia: { ...prev!.socialMedia, linkedin: e.target.value }
                          }))}
                          className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditAgentOpen(false)}
                  className="h-12 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditAgent();
                  }}
                  className="h-12 px-8 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Agent Dialog */}
      <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Add New Agent</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left Column - Basic Info & Image */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  {newAgent.image && newAgent.image.trim() !== '' ? (
                    <img 
                      src={newAgent.image} 
                      alt="Agent Preview" 
                      className="w-40 h-40 rounded-full object-cover border-4 border-bahayCebu-green/20 object-center"
                      style={{ objectPosition: '50% 25%' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-40 h-40 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center ${newAgent.image && newAgent.image.trim() !== '' ? 'hidden' : ''}`}>
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <Label 
                    htmlFor="agent-image-upload" 
                    className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-bahayCebu-green" />
                    <Input
                      id="agent-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAgentImageUpload(e, false)}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent-name" className="text-sm font-medium text-bahayCebu-darkGray">
                    Name <span className="text-bahayCebu-terracotta">*</span>
                  </Label>
                  <Input
                    id="agent-name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Maria Santos"
                    className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="agent-title" className="text-sm font-medium text-bahayCebu-darkGray">
                    Title <span className="text-bahayCebu-terracotta">*</span>
                  </Label>
                  <Input
                    id="agent-title"
                    value={newAgent.title}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Real Estate Consultant"
                    className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="agent-description" className="text-sm font-medium text-bahayCebu-darkGray">
                    Description <span className="text-bahayCebu-terracotta">*</span>
                  </Label>
                  <Textarea
                    id="agent-description"
                    value={newAgent.description}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter agent description"
                    className="min-h-[100px] border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Agent Stats */}
              <div className="space-y-4">
                <h3 className="font-medium text-bahayCebu-darkGray">Performance Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="agent-listings" className="text-sm font-medium text-bahayCebu-darkGray">
                      Active Listings
                    </Label>
                    <Input
                      id="agent-listings"
                      type="number"
                      min="0"
                      value={newAgent.listings}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, listings: parseInt(e.target.value) || 0 }))}
                      className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agent-deals" className="text-sm font-medium text-bahayCebu-darkGray">
                      Closed Deals
                    </Label>
                    <Input
                      id="agent-deals"
                      type="number"
                      min="0"
                      value={newAgent.deals}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, deals: parseInt(e.target.value) || 0 }))}
                      className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agent-rating" className="text-sm font-medium text-bahayCebu-darkGray">
                      Rating (0-5)
                    </Label>
                    <Input
                      id="agent-rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newAgent.rating}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                      className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Specializations */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent-email" className="text-sm font-medium text-bahayCebu-darkGray">
                    Email <span className="text-bahayCebu-terracotta">*</span>
                  </Label>
                  <Input
                    id="agent-email"
                    type="email"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. agent@example.com"
                    className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="agent-phone" className="text-sm font-medium text-bahayCebu-darkGray">
                    Phone <span className="text-bahayCebu-terracotta">*</span>
                  </Label>
                  <Input
                    id="agent-phone"
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +63 123 456 7890"
                    className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="agent-location" className="text-sm font-medium text-bahayCebu-darkGray">
                    Location <span className="text-bahayCebu-terracotta">*</span>
                  </Label>
                  <Input
                    id="agent-location"
                    value={newAgent.location}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Cebu City"
                    className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-bahayCebu-darkGray">
                  Specializations <span className="text-bahayCebu-terracotta">*</span>
                </Label>
                <div className="grid grid-cols-1 gap-3 border rounded-xl p-4 max-h-[300px] overflow-y-auto bg-white">
                  {SPECIALIZATIONS.map((specialization) => (
                    <div key={specialization} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Checkbox
                        id={`add-${specialization}`}
                        checked={newAgent.specializations.includes(specialization)}
                        onCheckedChange={(checked) => {
                          setNewAgent(prev => ({
                            ...prev,
                            specializations: checked
                              ? [...prev.specializations, specialization]
                              : prev.specializations.filter(s => s !== specialization)
                          }));
                        }}
                        className="border-2 border-bahayCebu-green/30 data-[state=checked]:bg-bahayCebu-green data-[state=checked]:border-bahayCebu-green"
                      />
                      <Label htmlFor={`add-${specialization}`} className="text-sm cursor-pointer flex-1">
                        {specialization}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="font-medium text-bahayCebu-darkGray">Social Media Links</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <Input
                      placeholder="Facebook Profile URL"
                      value={newAgent.socialMedia.facebook}
                      onChange={(e) => setNewAgent(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                      }))}
                      className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <Input
                      placeholder="Instagram Profile URL"
                      value={newAgent.socialMedia.instagram}
                      onChange={(e) => setNewAgent(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                      }))}
                      className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <Input
                      placeholder="LinkedIn Profile URL"
                      value={newAgent.socialMedia.linkedin}
                      onChange={(e) => setNewAgent(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                      }))}
                      className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddAgentOpen(false)}
              className="h-12 px-6 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddAgent}
              className="h-12 px-8 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white"
            >
              Add Agent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ImageCropper
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={tempImageSrc}
        onCropComplete={handleCropComplete}
      />
      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl md:text-2xl font-medium">Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green p-[2px]">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {currentUser.profilePicture ? (
                    <img 
                      src={currentUser.profilePicture} 
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-bahayCebu-green font-medium">
                      {currentUser.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-medium text-gray-900">{currentUser.name}</h3>
                <p className="text-gray-500">{currentUser.email}</p>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                  <Button
                    onClick={openEditProfileDialog}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    onClick={openChangePasswordDialog}
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2"
                  >
                    <Key className="h-4 w-4" />
                    <span>Change Password</span>
                  </Button>
                </div>
              </div>
            </div>


          </div>
        </DialogContent>
      </Dialog>

      {/* Backdrop for mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

