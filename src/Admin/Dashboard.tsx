import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Upload, Plus, Home, MessageSquare, Building, User, Eye, Users, FileText, Edit3, Trash2, LogOut, Camera, EyeOff, Mail, Phone, Facebook, Instagram, Linkedin, Pencil, AlertCircle, MapPin } from 'lucide-react';
import { AdminProperty, getAllProperties, addProperty, updateProperty, deleteProperty } from '../data/properties';
import { AdminUser, getCurrentUser, updateUserProfile, updateUserPassword, updateUserPreferences, verifyCurrentPassword } from '../data/userData';
import { Agent, getAllAgents, createAgent, updateAgent, deleteAgent } from '../data/agents';
import { showSuccessAlert, showErrorAlert, showConfirmationDialog, showLoadingAlert } from '@/utils/sweetAlert';
import Swal from 'sweetalert2';
import ImageCropper from '../components/ImageCropper';
import PropertyGallery from '@/components/ui/PropertyGallery';
import { cn } from '../lib/utils';
import SearchableMultiSelect from '../components/ui/SearchableMultiSelect';
import { 
  UnitType, 
  BuildingAmenity, 
  ResidentialFeature, 
  PropertyProvision, 
  BuildingFeature,
  UNIT_TYPES,
  BUILDING_AMENITIES,
  RESIDENTIAL_FEATURES,
  PROPERTY_PROVISIONS,
  BUILDING_FEATURES
} from '../data/properties';

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
  name: string;
  address: string;
  location: string;
  description: string;
  image: string;
  images: string[];
  price: string;
  units: string;
  occupancyRate: string;
  status: AdminProperty['status'];
  propertyType: AdminProperty['propertyType'];
  listingType: AdminProperty['listingType'];
  featured: boolean;
  videoUrl: string;
  thumbnail: string;
  unitTypes: string[];
  amenities: string[];
  residentialFeatures: string[];
  provisions: string[];
  buildingFeatures: string[];
  createdAt: string;
}

const defaultFormData: PropertyFormData = {
  name: '',
  address: '',
  location: '',
  description: '',
  image: '',
  images: [],
  price: '',
  units: '',
  occupancyRate: '',
  status: 'Active',
  propertyType: 'Condo',
  listingType: 'For Sale',
  featured: false,
  videoUrl: '',
  thumbnail: '',
  unitTypes: [],
  amenities: [],
  residentialFeatures: [],
  provisions: [],
  buildingFeatures: [],
  createdAt: new Date().toISOString()
};

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState(() => {
    // Get the saved menu from localStorage or default to 'Properties'
    return localStorage.getItem('selectedMenu') || 'Properties';
  });
  
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
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<string>('all');

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
    { id: 'Dashboard', icon: Home, label: 'Dashboard' },
    { id: 'Message', icon: MessageSquare, label: 'Message' },
    { id: 'Properties', icon: Building, label: 'Properties' },
    { id: 'Agent', icon: User, label: 'Agent' },
    { id: 'Profile', icon: User, label: 'Profile' },
    { id: 'SignOut', icon: LogOut, label: 'Sign Out' }
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
      const updatedUser = updateUserProfile({
        name: profileForm.name,
        email: profileForm.email,
        profilePicture: profileForm.profilePicture
      });
      setCurrentUser(updatedUser);
      setIsEditProfileOpen(false);
      showSuccessAlert('Profile Updated', 'Your profile has been updated successfully.');
    } catch (error) {
      showErrorAlert('Update Failed', 'Failed to update profile. Please try again.');
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
    let filtered = [...properties];
    
    if (propertyTypeFilter !== 'all') {
      filtered = filtered.filter(property => property.propertyType === propertyTypeFilter);
    }
    
    if (listingTypeFilter !== 'all') {
      filtered = filtered.filter(property => property.listingType === listingTypeFilter);
    }
    
    setFilteredProperties(filtered);
  }, [properties, propertyTypeFilter, listingTypeFilter]);

  const handlePropertyTypeFilter = (type: string) => {
    setPropertyTypeFilter(type);
  };

  const handleListingTypeFilter = (type: string) => {
    setListingTypeFilter(type);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (isEdit) {
            setEditProperty(prev => ({
              ...prev,
              image: e.target?.result as string, // Keep for backward compatibility
              images: [...(prev.images || []), e.target?.result as string]
            }));
          } else {
            setNewProperty(prev => ({
              ...prev,
              image: e.target?.result as string, // Keep for backward compatibility
              images: [...(prev.images || []), e.target?.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddProperty = async () => {
    if (newProperty.name && newProperty.address && newProperty.units && newProperty.description) {
      try {
        const propertyData: Omit<AdminProperty, 'id' | 'lastUpdated' | 'stats'> = {
          ...newProperty,
          price: parseInt(newProperty.price) || 0,
          units: parseInt(newProperty.units) || 0,
          occupancyRate: parseInt(newProperty.occupancyRate) || 0
        };

        await addProperty(propertyData);
        
        // Update the properties state with the new data
        const updatedProperties = await getAllProperties();
        setProperties(updatedProperties);
        setFilteredProperties(updatedProperties);
        
        // Reset the form
        setNewProperty(defaultFormData);
        
        // Close the dialog and show success message
        setIsAddPropertyOpen(false);
        alert('Property added successfully!');
      } catch (error) {
        console.error('Error adding property:', error);
        alert('Failed to add property. Please try again.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleEditProperty = async () => {
    if (editProperty.name && editProperty.address && editProperty.units && editProperty.description && editingProperty) {
      try {
        showLoadingAlert('Updating property...');
        
        const propertyData: Omit<AdminProperty, 'id' | 'lastUpdated' | 'stats'> = {
          ...editProperty,
          price: parseInt(editProperty.price) || 0,
          units: parseInt(editProperty.units) || 0,
          occupancyRate: parseInt(editProperty.occupancyRate) || 0,
          videoUrl: editProperty.videoUrl || '' // Ensure videoUrl is included
        };

        await updateProperty(editingProperty.id, propertyData);
        
        // Update the properties state with the new data
        const updatedProperties = await getAllProperties();
        setProperties(updatedProperties);
        setFilteredProperties(updatedProperties);
        
        // Reset the form and close dialog
        setEditProperty(defaultFormData);
        setIsEditPropertyOpen(false);

        // Show success message
        showSuccessAlert('Success!', 'Property has been updated successfully');
      } catch (error) {
        console.error('Error updating property:', error);
        showErrorAlert('Error!', 'Failed to update property. Please try again.');
      }
    } else {
      showErrorAlert('Warning!', 'Please fill in all required fields.');
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
    setEditingProperty(property);
    setEditProperty({
      name: property.name,
      address: property.address,
      location: property.location,
      description: property.description,
      image: property.image,
      images: property.images || [],
      price: property.price.toString(),
      units: property.units.toString(),
      occupancyRate: property.occupancyRate.toString(),
      status: property.status,
      propertyType: property.propertyType,
      listingType: property.listingType,
      featured: property.featured || false,
      videoUrl: property.videoUrl || '',
      thumbnail: property.thumbnail || '',
      unitTypes: property.unitTypes || [],
      amenities: property.amenities || [],
      residentialFeatures: property.residentialFeatures || [],
      provisions: property.provisions || [],
      buildingFeatures: property.buildingFeatures || [],
      createdAt: property.createdAt
    });
    setIsEditPropertyOpen(true);
  };

  const getStatusColor = (status: AdminProperty['status']) => {
    switch (status) {
      case 'Active': return 'bg-bahayCebu-green/10 text-bahayCebu-green border-bahayCebu-green/20';
      case 'Off Market': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Sold': return 'bg-bahayCebu-terracotta/10 text-bahayCebu-terracotta border-bahayCebu-terracotta/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAgentImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEdit && editingAgent) {
          setEditingAgent(prev => ({ ...prev!, image: e.target?.result as string }));
        } else {
          setNewAgent(prev => ({ ...prev, image: e.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAgent = async () => {
    try {
      // Validate required fields
      if (!newAgent.name.trim()) {
        alert('Please enter the agent\'s name');
        return;
      }
      if (!newAgent.title.trim()) {
        alert('Please enter the agent\'s title');
        return;
      }
      if (!newAgent.email.trim()) {
        alert('Please enter the agent\'s email');
        return;
      }
      if (!newAgent.phone.trim()) {
        alert('Please enter the agent\'s phone number');
        return;
      }
      if (!newAgent.location.trim()) {
        alert('Please enter the agent\'s location');
        return;
      }
      if (!newAgent.description.trim()) {
        alert('Please enter the agent\'s description');
        return;
      }
      if (!newAgent.specializations.length) {
        alert('Please select at least one specialization');
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

      // Create the agent
      await createAgent(agentData);
      
      // Reload the entire agents list to ensure we have the latest data
      const updatedAgents = await getAllAgents();
      setAgents(updatedAgents);
      
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
      
      alert('Agent added successfully!');
    } catch (error) {
      console.error('Error adding agent:', error);
      if (error instanceof Error && error.message.includes('email already exists')) {
        alert('An agent with this email address already exists. Please use a different email.');
      } else {
        alert('Failed to add agent. Please try again.');
      }
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await deleteAgent(agentId);
      const updatedAgents = await getAllAgents();
      setAgents(updatedAgents);
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent. Please try again.');
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
    if (menuId === 'SignOut') {
      handleSignOut();
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
      setIsLoadingAgents(true);
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

      // Update the agent
      await updateAgent(editingAgent.id, updateData);
      
      // Reload the agents list
      await loadAgents();
      
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
    } finally {
      setIsLoadingAgents(false);
    }
  };

  return (
    <div className="min-h-screen bg-bahayCebu-beige flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg border-r border-bahayCebu-green/10">
        <div className="p-6 border-b border-bahayCebu-green/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg font-serif">BC</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-bahayCebu-darkGray text-lg">
                  <span className="text-orange-800">Bahay</span><span className="text-bahayCebu-green">Cebu</span>
                </h1>
                <p className="text-sm text-bahayCebu-darkGray/70 font-medium">Properties</p>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedMenu === item.id;
            const isSignOut = item.id === 'SignOut';
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSignOut
                    ? 'text-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/10'
                    : isActive 
                    ? 'bg-bahayCebu-green text-white'
                      : 'text-bahayCebu-darkGray hover:bg-bahayCebu-green/5 hover:text-bahayCebu-green'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-bahayCebu-green/10 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-bahayCebu-darkGray">
                {selectedMenu}
              </h2>
              <p className="text-bahayCebu-darkGray/60 mt-1">
                {selectedMenu === 'Properties' ? 'Manage your property listings' :
                 selectedMenu === 'Dashboard' ? 'Overview of your property portfolio' :
                 selectedMenu === 'Message' ? 'Customer inquiries and communications' :
                 selectedMenu === 'Profile' ? 'Account settings and preferences' :
                 selectedMenu === 'Agent' ? 'Agent Management' : ''}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-bahayCebu-beige rounded-lg">
                <span className="text-sm font-medium text-bahayCebu-darkGray">📍 Cebu, Philippines</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          {selectedMenu === 'Properties' && (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-serif font-light text-bahayCebu-darkGray mb-2">Property Portfolio</h1>
                  <p className="text-bahayCebu-darkGray/60 text-lg">Manage and monitor your property listings</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="flex items-center space-x-3 bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                        disabled={properties.length === 0}
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-medium">Delete All Properties</span>
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
                      <Button className="flex items-center space-x-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add Property</span>
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>

              {/* Edit Property Dialog */}
              <Dialog open={isEditPropertyOpen} onOpenChange={setIsEditPropertyOpen}>
                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                  <DialogHeader className="pb-6 border-b border-gray-100">
                    <DialogTitle className="text-3xl font-serif font-light text-bahayCebu-darkGray">Edit Property</DialogTitle>
                    <p className="text-bahayCebu-darkGray/60 mt-2">Update the property details</p>
                  </DialogHeader>
                  <div className="space-y-8 pt-6">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-bahayCebu-green pl-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="edit-name" className="text-bahayCebu-darkGray font-medium text-sm">Property Name</Label>
                          <Input
                            id="edit-name"
                            value={editProperty.name}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter property name"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="edit-status" className="text-bahayCebu-darkGray font-medium text-sm">Status</Label>
                          <Select value={editProperty.status} onValueChange={(value: AdminProperty['status']) => setEditProperty(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="border-gray-200 focus:border-bahayCebu-green rounded-xl h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Off Market">Off Market</SelectItem>
                              <SelectItem value="Sold">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-bahayCebu-terracotta pl-4">Categories</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="edit-propertyType" className="text-bahayCebu-darkGray font-medium text-sm">Property Type</Label>
                          <Select value={editProperty.propertyType} onValueChange={(value: AdminProperty['propertyType']) => setEditProperty(prev => ({ ...prev, propertyType: value }))}>
                            <SelectTrigger className="border-gray-200 focus:border-bahayCebu-green rounded-xl h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Condo">Condo</SelectItem>
                              <SelectItem value="House and Lot">House and Lot</SelectItem>
                              <SelectItem value="Land">Land</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="edit-listingType" className="text-bahayCebu-darkGray font-medium text-sm">Listing Type</Label>
                          <Select value={editProperty.listingType} onValueChange={(value: AdminProperty['listingType']) => setEditProperty(prev => ({ ...prev, listingType: value }))}>
                            <SelectTrigger className="border-gray-200 focus:border-bahayCebu-green rounded-xl h-12">
                              <SelectValue />
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
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-blue-500 pl-4">Location & Description</h3>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="edit-address" className="text-bahayCebu-darkGray font-medium text-sm">Address</Label>
                          <Textarea
                            id="edit-address"
                            value={editProperty.address}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Enter full address"
                            rows={2}
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl resize-none"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="edit-description" className="text-bahayCebu-darkGray font-medium text-sm">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={editProperty.description}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter property description"
                            rows={4}
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl resize-none"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Pricing & Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-yellow-500 pl-4">Pricing & Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="edit-price" className="text-bahayCebu-darkGray font-medium text-sm">Price (₱)</Label>
                          <Input
                            id="edit-price"
                            type="number"
                            value={editProperty.price}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="0"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="edit-units" className="text-bahayCebu-darkGray font-medium text-sm">Number of Units</Label>
                          <Input
                            id="edit-units"
                            type="number"
                            value={editProperty.units}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, units: e.target.value }))}
                            placeholder="0"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="edit-occupancy" className="text-bahayCebu-darkGray font-medium text-sm">Occupancy Rate (%)</Label>
                          <Input
                            id="edit-occupancy"
                            type="number"
                            max="100"
                            value={editProperty.occupancyRate}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, occupancyRate: e.target.value }))}
                            placeholder="0"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Featured Property */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-bahayCebu-beige/30 to-bahayCebu-green/5 rounded-2xl border border-bahayCebu-green/10">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="edit-featured"
                            checked={editProperty.featured}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-5 h-5 text-bahayCebu-green bg-white border-gray-300 rounded focus:ring-bahayCebu-green focus:ring-2"
                          />
                          <Label htmlFor="edit-featured" className="text-bahayCebu-darkGray font-medium cursor-pointer">
                            Feature this property on homepage
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Property Image */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Property Images</h3>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        {(editProperty.images?.length ?? 0) > 0 ? (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {editProperty.images?.map((img, index) => (
                                <div key={index} className="relative group">
                                  <img src={img} alt={`Preview ${index + 1}`} className="h-40 w-full object-cover rounded-lg shadow-md" />
                                  <button 
                                    onClick={() => setEditProperty(prev => ({
                                      ...prev,
                                      images: prev.images?.filter((_, i) => i !== index) || [],
                                      image: index === 0 ? prev.images?.[1] || '' : prev.image
                                    }))}
                                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div>
                              <Label htmlFor="edit-image-upload" className="cursor-pointer">
                                <span className="text-lg font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Add More Images</span>
                                <Input
                                  id="edit-image-upload"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(e, true)}
                                  className="hidden"
                                />
                              </Label>
                              <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <Upload className="mx-auto h-16 w-16 text-gray-400" />
                            <div>
                              <Label htmlFor="edit-image-upload" className="cursor-pointer">
                                <span className="text-lg font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Upload Property Images</span>
                                <Input
                                  id="edit-image-upload"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(e, true)}
                                  className="hidden"
                                />
                              </Label>
                              <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Video Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-indigo-500 pl-4">Video Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="edit-video-url" className="text-bahayCebu-darkGray font-medium text-sm">Video URL</Label>
                          <Input
                            id="edit-video-url"
                            type="url"
                            value={editProperty.videoUrl || ''}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="Enter YouTube or Vimeo video URL"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                          <p className="text-sm text-gray-500">Add a video URL from YouTube or Vimeo</p>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="edit-thumbnail" className="text-bahayCebu-darkGray font-medium text-sm">Video Thumbnail URL</Label>
                          <Input
                            id="edit-thumbnail"
                            type="url"
                            value={editProperty.thumbnail || ''}
                            onChange={(e) => setEditProperty(prev => ({ ...prev, thumbnail: e.target.value }))}
                            placeholder="Enter thumbnail URL"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                          <p className="text-sm text-gray-500">URL for video thumbnail image</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unit Types */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Unit Types</h3>
                      <SearchableMultiSelect
                        options={UNIT_TYPES}
                        selectedValues={editProperty.unitTypes}
                        onChange={(values) => {
                          setEditProperty(prev => ({ ...prev, unitTypes: values as UnitType[] }));
                        }}
                        placeholder="Select unit types..."
                      />
                    </div>

                    {/* Building Amenities */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Amenities</h3>
                      <SearchableMultiSelect
                        options={BUILDING_AMENITIES}
                        selectedValues={editProperty.amenities}
                        onChange={(values) => {
                          setEditProperty(prev => ({ ...prev, amenities: values as BuildingAmenity[] }));
                        }}
                        placeholder="Select amenities..."
                      />
                    </div>

                    {/* Residential Features */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Residential Features</h3>
                      <SearchableMultiSelect
                        options={RESIDENTIAL_FEATURES}
                        selectedValues={editProperty.residentialFeatures}
                        onChange={(values) => {
                          setEditProperty(prev => ({ ...prev, residentialFeatures: values as ResidentialFeature[] }));
                        }}
                        placeholder="Select residential features..."
                      />
                    </div>

                    {/* Provisions */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Provisions</h3>
                      <SearchableMultiSelect
                        options={PROPERTY_PROVISIONS}
                        selectedValues={editProperty.provisions}
                        onChange={(values) => {
                          setEditProperty(prev => ({ ...prev, provisions: values as PropertyProvision[] }));
                        }}
                        placeholder="Select provisions..."
                      />
                    </div>

                    {/* Building Features */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Features</h3>
                      <SearchableMultiSelect
                        options={BUILDING_FEATURES}
                        selectedValues={editProperty.buildingFeatures}
                        onChange={(values) => {
                          setEditProperty(prev => ({ ...prev, buildingFeatures: values as BuildingFeature[] }));
                        }}
                        placeholder="Select building features..."
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditPropertyOpen(false)}
                        className="px-8 py-3 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleEditProperty}
                        className="px-8 py-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg rounded-xl"
                      >
                        Update Property
                      </Button>
                    </div>
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

                      <div className="space-y-2">
                        <Label className="text-sm text-bahayCebu-darkGray/70">Listing Type</Label>
                        <Select value={listingTypeFilter} onValueChange={handleListingTypeFilter}>
                          <SelectTrigger className="w-full border-gray-200 focus:border-bahayCebu-terracotta rounded-xl h-12 bg-white">
                            <SelectValue placeholder="Select listing type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Listings</SelectItem>
                            <SelectItem value="For Sale">For Sale</SelectItem>
                            <SelectItem value="For Rent">For Rent</SelectItem>
                            <SelectItem value="Resale">Resale</SelectItem>
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
                    {(propertyTypeFilter !== 'all' || listingTypeFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setPropertyTypeFilter('all');
                          setListingTypeFilter('all');
                        }}
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
                      <Card key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          {/* Property Image - Left Side */}
                          <div className="relative w-full md:w-1/3">
                            <PropertyGallery 
                              images={property.images?.length ? property.images : [property.image]} 
                              className="h-full object-cover"
                            />
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium",
                                getStatusColor(property.status)
                              )}
                            >
                              {property.status}
                            </Badge>
                            {property.featured && (
                              <Badge 
                                variant="outline" 
                                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-bahayCebu-terracotta/10 text-bahayCebu-terracotta border-bahayCebu-terracotta/20"
                              >
                                Featured
                              </Badge>
                            )}
                          </div>

                          {/* Property Content - Right Side */}
                          <div className="flex-1 md:max-h-[600px] md:overflow-y-auto">
                            <CardContent className="p-6 space-y-6">
                              <div className="space-y-4">
                                {/* Property Name and Status */}
                                <div>
                                  <h3 className="font-serif font-bold text-xl text-bahayCebu-darkGray mb-2">{property.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-bahayCebu-green/10 text-bahayCebu-green border-bahayCebu-green/20 font-medium px-3 py-1 text-xs rounded-full">
                                      {property.propertyType}
                                    </Badge>
                                    <Badge className="bg-blue-50 text-blue-600 border-blue-200 font-medium px-3 py-1 text-xs rounded-full">
                                      {property.listingType}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Location and Address */}
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-bahayCebu-green mt-1" />
                                    <div>
                                      <p className="text-bahayCebu-darkGray font-medium">{property.location}</p>
                                      <p className="text-bahayCebu-darkGray/70 text-sm">{property.address}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Description */}
                                <div className="text-bahayCebu-darkGray/60 text-sm leading-relaxed">
                                  <p>
                                    {expandedDescriptions.has(property.id) 
                                      ? property.description 
                                      : truncateDescription(property.description, 100)}
                                  </p>
                                  {property.description.length > 100 && (
                                    <button
                                      onClick={() => toggleDescription(property.id)}
                                      className="text-bahayCebu-green hover:text-bahayCebu-green/80 font-medium mt-1 transition-colors"
                                    >
                                      {expandedDescriptions.has(property.id) ? 'Show less' : 'Read more'}
                                    </button>
                                  )}
                                </div>

                                {/* Property Details */}
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-xs text-gray-500">Price</p>
                                      <p className="font-bold text-bahayCebu-green">₱{parseInt(property.price.toString()).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Total Units</p>
                                      <p className="font-bold text-bahayCebu-darkGray">{property.units}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Occupancy Rate</p>
                                      <p className="font-bold text-bahayCebu-darkGray">{property.occupancyRate}%</p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-xs text-gray-500">Created</p>
                                      <p className="font-medium text-bahayCebu-darkGray">{new Date(property.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Last Updated</p>
                                      <p className="font-medium text-bahayCebu-darkGray">{property.lastUpdated}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Features and Amenities */}
                                <div className="space-y-3">
                                  {property.unitTypes && property.unitTypes.length > 0 && (
                                    <div>
                                      <p className="text-xs text-gray-500 mb-2">Unit Types</p>
                                      <div className="flex flex-wrap gap-2">
                                        {property.unitTypes.map((type, index) => (
                                          <Badge key={index} variant="outline" className="bg-gray-50">
                                            {type}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {property.amenities && property.amenities.length > 0 && (
                                    <div>
                                      <p className="text-xs text-gray-500 mb-2">Amenities</p>
                                      <div className="flex flex-wrap gap-2">
                                        {property.amenities.map((amenity, index) => (
                                          <Badge key={index} variant="outline" className="bg-gray-50">
                                            {amenity}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {property.residentialFeatures && property.residentialFeatures.length > 0 && (
                                    <div>
                                      <p className="text-xs text-gray-500 mb-2">Residential Features</p>
                                      <div className="flex flex-wrap gap-2">
                                        {property.residentialFeatures.map((feature, index) => (
                                          <Badge key={index} variant="outline" className="bg-gray-50">
                                            {feature}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {property.buildingFeatures && property.buildingFeatures.length > 0 && (
                                    <div>
                                      <p className="text-xs text-gray-500 mb-2">Building Features</p>
                                      <div className="flex flex-wrap gap-2">
                                        {property.buildingFeatures.map((feature, index) => (
                                          <Badge key={index} variant="outline" className="bg-gray-50">
                                            {feature}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {property.provisions && property.provisions.length > 0 && (
                                    <div>
                                      <p className="text-xs text-gray-500 mb-2">Provisions</p>
                                      <div className="flex flex-wrap gap-2">
                                        {property.provisions.map((provision, index) => (
                                          <Badge key={index} variant="outline" className="bg-gray-50">
                                            {provision}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Performance Stats */}
                                <div>
                                  <div className="text-center mb-3">
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">30-Day Performance</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="space-y-1">
                                      <div className="text-xs text-gray-500">Views</div>
                                      <div className="font-bold text-bahayCebu-darkGray text-sm">{property.stats.views.toLocaleString()}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-gray-500">Leads</div>
                                      <div className="font-bold text-bahayCebu-darkGray text-sm">{property.stats.leads}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-gray-500">Applications</div>
                                      <div className="font-bold text-bahayCebu-darkGray text-sm">{property.stats.applications}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Card Actions */}
                              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
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

              {/* Add Property Dialog */}
              <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                  <DialogHeader className="pb-6 border-b border-gray-100">
                    <DialogTitle className="text-3xl font-serif font-light text-bahayCebu-darkGray">Add New Property</DialogTitle>
                    <p className="text-bahayCebu-darkGray/60 mt-2">Fill in the details to create a new property listing</p>
                  </DialogHeader>
                  <div className="space-y-8 pt-6">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-bahayCebu-green pl-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="name" className="text-bahayCebu-darkGray font-medium text-sm">Property Name</Label>
                          <Input
                            id="name"
                            value={newProperty.name}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter property name"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="status" className="text-bahayCebu-darkGray font-medium text-sm">Status</Label>
                          <Select value={newProperty.status} onValueChange={(value: AdminProperty['status']) => setNewProperty(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="border-gray-200 focus:border-bahayCebu-green rounded-xl h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Off Market">Off Market</SelectItem>
                              <SelectItem value="Sold">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-bahayCebu-terracotta pl-4">Categories</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="propertyType" className="text-bahayCebu-darkGray font-medium text-sm">Property Type</Label>
                          <Select value={newProperty.propertyType} onValueChange={(value: AdminProperty['propertyType']) => setNewProperty(prev => ({ ...prev, propertyType: value }))}>
                            <SelectTrigger className="border-gray-200 focus:border-bahayCebu-green rounded-xl h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Condo">Condo</SelectItem>
                              <SelectItem value="House and Lot">House and Lot</SelectItem>
                              <SelectItem value="Land">Land</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="listingType" className="text-bahayCebu-darkGray font-medium text-sm">Listing Type</Label>
                          <Select value={newProperty.listingType} onValueChange={(value: AdminProperty['listingType']) => setNewProperty(prev => ({ ...prev, listingType: value }))}>
                            <SelectTrigger className="border-gray-200 focus:border-bahayCebu-green rounded-xl h-12">
                              <SelectValue />
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
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-blue-500 pl-4">Location & Description</h3>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="address" className="text-bahayCebu-darkGray font-medium text-sm">Address</Label>
                          <Textarea
                            id="address"
                            value={newProperty.address}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Enter full address"
                            rows={2}
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl resize-none"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="description" className="text-bahayCebu-darkGray font-medium text-sm">Description</Label>
                          <Textarea
                            id="description"
                            value={newProperty.description}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter property description"
                            rows={4}
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl resize-none"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Pricing & Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-yellow-500 pl-4">Pricing & Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="price" className="text-bahayCebu-darkGray font-medium text-sm">Price (₱)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProperty.price}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="0"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="units" className="text-bahayCebu-darkGray font-medium text-sm">Number of Units</Label>
                          <Input
                            id="units"
                            type="number"
                            value={newProperty.units}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, units: e.target.value }))}
                            placeholder="0"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="occupancy" className="text-bahayCebu-darkGray font-medium text-sm">Occupancy Rate (%)</Label>
                          <Input
                            id="occupancy"
                            type="number"
                            max="100"
                            value={newProperty.occupancyRate}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, occupancyRate: e.target.value }))}
                            placeholder="0"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Featured Property */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-bahayCebu-beige/30 to-bahayCebu-green/5 rounded-2xl border border-bahayCebu-green/10">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={newProperty.featured}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-5 h-5 text-bahayCebu-green bg-white border-gray-300 rounded focus:ring-bahayCebu-green focus:ring-2"
                          />
                          <Label htmlFor="featured" className="text-bahayCebu-darkGray font-medium cursor-pointer">
                            Feature this property on homepage
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Property Image */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Property Images</h3>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        {(newProperty.images?.length ?? 0) > 0 ? (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {newProperty.images?.map((img, index) => (
                                <div key={index} className="relative group">
                                  <img src={img} alt={`Preview ${index + 1}`} className="h-40 w-full object-cover rounded-lg shadow-md" />
                                  <button 
                                    onClick={() => setNewProperty(prev => ({
                                      ...prev,
                                      images: prev.images?.filter((_, i) => i !== index) || [],
                                      image: index === 0 ? prev.images?.[1] || '' : prev.image
                                    }))}
                                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div>
                              <Label htmlFor="image-upload" className="cursor-pointer">
                                <span className="text-lg font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Add More Images</span>
                                <Input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(e, false)}
                                  className="hidden"
                                />
                              </Label>
                              <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <Upload className="mx-auto h-16 w-16 text-gray-400" />
                            <div>
                              <Label htmlFor="image-upload" className="cursor-pointer">
                                <span className="text-lg font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Upload Property Images</span>
                                <Input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(e, false)}
                                  className="hidden"
                                />
                              </Label>
                              <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Video Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-indigo-500 pl-4">Video Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="add-video-url" className="text-bahayCebu-darkGray font-medium text-sm">Video URL</Label>
                          <Input
                            id="add-video-url"
                            type="url"
                            value={newProperty.videoUrl || ''}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="Enter YouTube or Vimeo video URL"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                          <p className="text-sm text-gray-500">Add a video URL from YouTube or Vimeo</p>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="thumbnail" className="text-bahayCebu-darkGray font-medium text-sm">Video Thumbnail URL</Label>
                          <Input
                            id="thumbnail"
                            type="url"
                            value={newProperty.thumbnail || ''}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, thumbnail: e.target.value }))}
                            placeholder="Enter thumbnail URL"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                          <p className="text-sm text-gray-500">URL for video thumbnail image</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unit Types */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Unit Types</h3>
                      <SearchableMultiSelect
                        options={UNIT_TYPES}
                        selectedValues={newProperty.unitTypes}
                        onChange={(values) => {
                          setNewProperty(prev => ({ ...prev, unitTypes: values as UnitType[] }));
                        }}
                        placeholder="Select unit types..."
                      />
                    </div>

                    {/* Building Amenities */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Amenities</h3>
                      <SearchableMultiSelect
                        options={BUILDING_AMENITIES}
                        selectedValues={newProperty.amenities}
                        onChange={(values) => {
                          setNewProperty(prev => ({ ...prev, amenities: values as BuildingAmenity[] }));
                        }}
                        placeholder="Select amenities..."
                      />
                    </div>

                    {/* Residential Features */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Residential Features</h3>
                      <SearchableMultiSelect
                        options={RESIDENTIAL_FEATURES}
                        selectedValues={newProperty.residentialFeatures}
                        onChange={(values) => {
                          setNewProperty(prev => ({ ...prev, residentialFeatures: values as ResidentialFeature[] }));
                        }}
                        placeholder="Select residential features..."
                      />
                    </div>

                    {/* Provisions */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Provisions</h3>
                      <SearchableMultiSelect
                        options={PROPERTY_PROVISIONS}
                        selectedValues={newProperty.provisions}
                        onChange={(values) => {
                          setNewProperty(prev => ({ ...prev, provisions: values as PropertyProvision[] }));
                        }}
                        placeholder="Select provisions..."
                      />
                    </div>

                    {/* Building Features */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Building Features</h3>
                      <SearchableMultiSelect
                        options={BUILDING_FEATURES}
                        selectedValues={newProperty.buildingFeatures}
                        onChange={(values) => {
                          setNewProperty(prev => ({ ...prev, buildingFeatures: values as BuildingFeature[] }));
                        }}
                        placeholder="Select building features..."
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddPropertyOpen(false)}
                        className="px-8 py-3 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddProperty}
                        className="px-8 py-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg rounded-xl"
                      >
                        Add Property
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {selectedMenu === 'Dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-bahayCebu-darkGray">Portfolio Overview</h1>
                <p className="text-bahayCebu-darkGray/60 mt-2">Key metrics and insights for your property portfolio</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="text-sm font-medium opacity-90">Total Views</div>
                    <Eye className="h-6 w-6 opacity-80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {properties.reduce((sum, p) => sum + p.stats.views, 0).toLocaleString()}
                    </div>
                    <p className="text-xs opacity-80 mt-1">Past 30 days</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-bahayCebu-darkGray">Total Leads</div>
                    <Users className="h-6 w-6 text-bahayCebu-green" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-bahayCebu-darkGray">
                      {properties.reduce((sum, p) => sum + p.stats.leads, 0)}
                    </div>
                    <p className="text-xs text-bahayCebu-darkGray/60 mt-1">Past 30 days</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-bahayCebu-darkGray">Applications</div>
                    <FileText className="h-6 w-6 text-bahayCebu-terracotta" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-bahayCebu-darkGray">
                      {properties.reduce((sum, p) => sum + p.stats.applications, 0)}
                    </div>
                    <p className="text-xs text-bahayCebu-darkGray/60 mt-1">Past 30 days</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <h3 className="text-xl font-serif font-bold text-bahayCebu-darkGray">Recent Properties</h3>
                    <p className="text-bahayCebu-darkGray/60">Latest additions to your portfolio</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {properties.slice(0, 3).map((property) => (
                      <div key={property.id} className="flex items-center space-x-4 p-3 rounded-lg bg-bahayCebu-beige/50">
                        <img 
                          src={property.image} 
                          alt={property.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-bahayCebu-darkGray">{property.name}</h4>
                          <p className="text-sm text-bahayCebu-darkGray/60">{property.units} units</p>
                        </div>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <h3 className="text-xl font-serif font-bold text-bahayCebu-darkGray">Performance Summary</h3>
                    <p className="text-bahayCebu-darkGray/60">Your portfolio insights</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-bahayCebu-darkGray/70">Average Occupancy</span>
                        <span className="font-medium text-bahayCebu-green">
                          {Math.round(properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-bahayCebu-darkGray/70">Active Properties</span>
                        <span className="font-medium text-bahayCebu-darkGray">
                          {properties.filter(p => p.status === 'Active').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-bahayCebu-darkGray/70">Total Units</span>
                        <span className="font-medium text-bahayCebu-darkGray">
                          {properties.reduce((sum, p) => sum + p.units, 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedMenu === 'Message' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-bahayCebu-darkGray">Messages</h1>
                <p className="text-bahayCebu-darkGray/60 mt-2">Customer inquiries and communications</p>
              </div>
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-bahayCebu-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-10 w-10 text-bahayCebu-green" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-bahayCebu-darkGray mb-4">No messages yet</h3>
                  <p className="text-bahayCebu-darkGray/60 max-w-md mx-auto leading-relaxed">
                    Messages from potential buyers and tenants will appear here. Stay connected with your prospects and customers.
                  </p>
                  <Button className="mt-6 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white px-6 py-2">
                    Set Up Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedMenu === 'Profile' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-bahayCebu-darkGray">Profile Settings</h1>
                <p className="text-bahayCebu-darkGray/60 mt-2">Manage your account settings and preferences</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <h3 className="text-xl font-serif font-bold text-bahayCebu-darkGray">Account Information</h3>
                    <p className="text-bahayCebu-darkGray/60">Update your personal details</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {currentUser.profilePicture ? (
                          <img 
                            src={currentUser.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-bahayCebu-darkGray">{currentUser.name}</h4>
                        <p className="text-sm text-bahayCebu-darkGray/60">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green hover:text-white"
                        onClick={openEditProfileDialog}
                      >
                        Edit Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-bahayCebu-terracotta text-bahayCebu-terracotta hover:bg-bahayCebu-terracotta hover:text-white"
                        onClick={openChangePasswordDialog}
                      >
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <h3 className="text-xl font-serif font-bold text-bahayCebu-darkGray">Preferences</h3>
                    <p className="text-bahayCebu-darkGray/60">Customize your dashboard experience</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-bahayCebu-beige/50 rounded-lg">
                        <span className="text-bahayCebu-darkGray">Email Notifications</span>
                        <input 
                          type="checkbox" 
                          className="accent-bahayCebu-green" 
                          checked={currentUser.preferences.emailNotifications}
                          onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                        />
                      </div>
                      <div className="flex justify-between items-center p-3 bg-bahayCebu-beige/50 rounded-lg">
                        <span className="text-bahayCebu-darkGray">SMS Alerts</span>
                        <input 
                          type="checkbox" 
                          className="accent-bahayCebu-green" 
                          checked={currentUser.preferences.smsAlerts}
                          onChange={(e) => handlePreferenceChange('smsAlerts', e.target.checked)}
                        />
                      </div>
                      <div className="flex justify-between items-center p-3 bg-bahayCebu-beige/50 rounded-lg">
                        <span className="text-bahayCebu-darkGray">Weekly Reports</span>
                        <input 
                          type="checkbox" 
                          className="accent-bahayCebu-green" 
                          checked={currentUser.preferences.weeklyReports}
                          onChange={(e) => handlePreferenceChange('weeklyReports', e.target.checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                    <div key={agent?.id || 'temp-key'} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                      <div className="p-6 space-y-6">
                        {/* Header - Image and Basic Info */}
                        <div className="flex items-start space-x-4">
                          <div className="relative w-32 h-32 flex-shrink-0">
                            {agent?.image ? (
                              <img
                                src={agent.image}
                                alt={agent?.name || 'Agent'}
                                className="w-32 h-32 rounded-full object-cover border-4 border-bahayCebu-green/20 object-center"
                                style={{ objectPosition: '50% 25%' }}
                              />
                            ) : (
                              <div className="w-32 h-32 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center">
                                <User className="h-12 w-12 text-white" />
                              </div>
                            )}
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
                          <p className="text-sm text-gray-600 line-clamp-3">{agent?.description || 'No description available'}</p>
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
            <div className="space-y-2">
              <Label className="text-bahayCebu-darkGray font-medium">Profile Picture</Label>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profileForm.profilePicture ? (
                    <img 
                      src={profileForm.profilePicture} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="border-2 border-dashed border-bahayCebu-green/30 rounded-xl p-6 text-center bg-bahayCebu-green/5 hover:bg-bahayCebu-green/10 transition-colors">
                    {profileForm.profilePicture ? (
                      <div className="space-y-3">
                        <Camera className="mx-auto h-8 w-8 text-bahayCebu-green/60" />
                        <div>
                          <Label htmlFor="profile-picture-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Change Picture</span>
                            <Input
                              id="profile-picture-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureUpload}
                              className="hidden"
                            />
                          </Label>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setProfileForm(prev => ({ ...prev, profilePicture: '' }))}
                          className="border-bahayCebu-terracotta text-bahayCebu-terracotta hover:bg-bahayCebu-terracotta hover:text-white"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Camera className="mx-auto h-8 w-8 text-bahayCebu-green/60" />
                        <div>
                          <Label htmlFor="profile-picture-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Upload Picture</span>
                            <Input
                              id="profile-picture-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureUpload}
                              className="hidden"
                            />
                          </Label>
                          <p className="text-xs text-bahayCebu-darkGray/60 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                      {editingAgent.image ? (
                        <img 
                          src={editingAgent.image} 
                          alt="Agent Preview" 
                          className="w-40 h-40 rounded-full object-cover border-4 border-bahayCebu-green/20 object-center"
                          style={{ objectPosition: '50% 25%' }}
                        />
                      ) : (
                        <div className="w-40 h-40 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center">
                          <User className="h-16 w-16 text-white" />
                        </div>
                      )}
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
                  {newAgent.image ? (
                    <img 
                      src={newAgent.image} 
                      alt="Agent Preview" 
                      className="w-40 h-40 rounded-full object-cover border-4 border-bahayCebu-green/20 object-center"
                      style={{ objectPosition: '50% 25%' }}
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
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
    </div>
  );
};

export default AdminDashboard;
