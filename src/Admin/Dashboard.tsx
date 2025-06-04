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
import { Upload, Plus, Home, MessageSquare, Building, User, Eye, Users, FileText, Edit3, Trash2, LogOut, Camera, EyeOff } from 'lucide-react';
import { AdminProperty, getAllProperties, addProperty, updateProperty, deleteProperty } from '../data/properties';
import { AdminUser, getCurrentUser, updateUserProfile, updateUserPassword, updateUserPreferences, verifyCurrentPassword } from '../data/userData';
import { Agent, getAllAgents, createAgent, updateAgent, deleteAgent } from '../data/agents';

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('Properties');
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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    description: '',
    image: '',
    price: '',
    units: '',
    occupancyRate: '',
    status: 'Active' as AdminProperty['status'],
    propertyType: 'Condo' as AdminProperty['propertyType'],
    listingType: 'For Sale' as AdminProperty['listingType'],
    featured: false,
    thumbnail: '',
    videoUrl: ''
  });

  const [editProperty, setEditProperty] = useState({
    name: '',
    address: '',
    description: '',
    image: '',
    price: '',
    units: '',
    occupancyRate: '',
    status: 'Active' as AdminProperty['status'],
    propertyType: 'Condo' as AdminProperty['propertyType'],
    listingType: 'For Sale' as AdminProperty['listingType'],
    featured: false,
    videoUrl: '',
    thumbnail: ''
  });

  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isEditAgentOpen, setIsEditAgentOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    image: ''
  });

  // Load agents on mount
  useEffect(() => {
    const loadAgents = async () => {
      const agentData = await getAllAgents();
      setAgents(agentData);
    };
    loadAgents();
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

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log('Signing out...');
    // You can add logout API call or redirect logic here
    alert('Signed out successfully!');
    navigate('/');
  };

  // Profile management handlers
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileForm(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    if (profileForm.name && profileForm.email) {
      const updatedUser = updateUserProfile({
        name: profileForm.name,
        email: profileForm.email,
        profilePicture: profileForm.profilePicture
      });
      setCurrentUser(updatedUser);
      setIsEditProfileOpen(false);
      alert('Profile updated successfully!');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Please fill in all password fields.');
      return;
    }

    if (!verifyCurrentPassword(passwordForm.currentPassword)) {
      alert('Current password is incorrect.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }

    const success = updateUserPassword(passwordForm.newPassword);
    if (success) {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangePasswordOpen(false);
      alert('Password changed successfully!');
    } else {
      alert('Failed to update password. Please try again.');
    }
  };

  const openEditProfileDialog = () => {
    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      profilePicture: currentUser.profilePicture || ''
    });
    setIsEditProfileOpen(true);
  };

  const openChangePasswordDialog = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangePasswordOpen(true);
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEdit) {
          setEditProperty(prev => ({ ...prev, image: e.target?.result as string }));
        } else {
          setNewProperty(prev => ({ ...prev, image: e.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProperty = async () => {
    if (newProperty.name && newProperty.address && newProperty.units && newProperty.description) {
      try {
        const addedProperty = await addProperty({
          name: newProperty.name,
          address: newProperty.address,
          description: newProperty.description,
          image: newProperty.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&crop=center',
          price: parseInt(newProperty.price) || 0,
          units: parseInt(newProperty.units),
          occupancyRate: parseInt(newProperty.occupancyRate) || 0,
          status: newProperty.status,
          propertyType: newProperty.propertyType,
          listingType: newProperty.listingType,
          featured: newProperty.featured,
          videoUrl: newProperty.videoUrl || '',
          thumbnail: newProperty.thumbnail || ''
        });
        
        // Update the properties state with the new data
        const updatedProperties = await getAllProperties();
        setProperties(updatedProperties);
        setFilteredProperties(updatedProperties);
        
        // Reset the form
        setNewProperty({
          name: '',
          address: '',
          description: '',
          image: '',
          price: '',
          units: '',
          occupancyRate: '',
          status: 'Active',
          propertyType: 'Condo',
          listingType: 'For Sale',
          featured: false,
          thumbnail: '',
          videoUrl: ''
        });
        
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
    if (editingProperty && editProperty.name && editProperty.address && editProperty.units && editProperty.description) {
      try {
        const updates = {
          name: editProperty.name,
          address: editProperty.address,
          description: editProperty.description,
          image: editProperty.image || editingProperty.image,
          price: parseInt(editProperty.price) || editingProperty.price,
          units: parseInt(editProperty.units),
          occupancyRate: parseInt(editProperty.occupancyRate),
          status: editProperty.status,
          propertyType: editProperty.propertyType,
          listingType: editProperty.listingType,
          featured: editProperty.featured,
          videoUrl: editProperty.videoUrl || '',
          thumbnail: editProperty.thumbnail || ''
        };
        
        await updateProperty(editingProperty.id, updates);
        const updatedProperties = await getAllProperties();
        setProperties(updatedProperties);
        setFilteredProperties(updatedProperties);
        
        setEditingProperty(null);
        setEditProperty({
          name: '',
          address: '',
          description: '',
          image: '',
          price: '',
          units: '',
          occupancyRate: '',
          status: 'Active',
          propertyType: 'Condo',
          listingType: 'For Sale',
          featured: false,
          videoUrl: '',
          thumbnail: ''
        });
        setIsEditPropertyOpen(false);
      } catch (error) {
        console.error('Error updating property:', error);
        alert('Failed to update property. Please try again.');
      }
    } else {
      alert('Please fill in all required fields.');
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
      description: property.description,
      image: property.image,
      price: property.price.toString(),
      units: property.units.toString(),
      occupancyRate: property.occupancyRate.toString(),
      status: property.status,
      propertyType: property.propertyType,
      listingType: property.listingType,
      featured: property.featured || false,
      videoUrl: property.videoUrl || '',
      thumbnail: property.thumbnail || ''
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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newAgent.email.trim())) {
        alert('Please enter a valid email address');
        return;
      }

      const agentData = {
        ...newAgent,
        // Trim all string fields
        name: newAgent.name.trim(),
        title: newAgent.title.trim(),
        email: newAgent.email.trim(),
        phone: newAgent.phone.trim(),
        location: newAgent.location.trim(),
        description: newAgent.description.trim()
      };
      
      await createAgent(agentData);
      const updatedAgents = await getAllAgents();
      setAgents(updatedAgents);
      
      setNewAgent({
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        description: '',
        image: ''
      });
      setIsAddAgentOpen(false);
    } catch (error) {
      console.error('Error adding agent:', error);
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        alert('An agent with this email already exists. Please use a different email address.');
      } else {
        alert('Failed to add agent. Please try again.');
      }
    }
  };

  const handleEditAgent = async () => {
    if (!editingAgent) return;

    try {
      await updateAgent(editingAgent.id, editingAgent);
      const updatedAgents = await getAllAgents();
      setAgents(updatedAgents);
      setIsEditAgentOpen(false);
      setEditingAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('Failed to update agent. Please try again.');
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
                onClick={() => {
                  if (isSignOut) {
                    handleSignOut();
                  } else {
                    setSelectedMenu(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSignOut
                    ? 'text-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/10 hover:text-bahayCebu-terracotta'
                    : isActive 
                      ? 'bg-bahayCebu-green text-white shadow-md shadow-bahayCebu-green/25' 
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
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Property Image</h3>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        {editProperty.image ? (
                          <div className="space-y-6">
                            <img src={editProperty.image} alt="Preview" className="max-h-64 mx-auto rounded-2xl shadow-lg object-cover" />
                            <Button 
                              variant="outline" 
                              onClick={() => setEditProperty(prev => ({ ...prev, image: '' }))}
                              className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                            >
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <Upload className="mx-auto h-16 w-16 text-gray-400" />
                            <div>
                              <Label htmlFor="edit-image-upload" className="cursor-pointer">
                                <span className="text-lg font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Upload Property Image</span>
                                <Input
                                  id="edit-image-upload"
                                  type="file"
                                  accept="image/*"
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
                            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                          <p className="text-sm text-gray-500">Paste a YouTube or Vimeo video URL</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProperties.map((property) => (
                      <Card key={property.id} className="overflow-hidden border-0 shadow-md bg-white rounded-2xl">
                        <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&crop=center';
                            }}
                          />
                          
                          {/* Price Badge on Image */}
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl shadow-lg">
                            <div className="text-lg font-bold text-bahayCebu-green">₱{property.price.toLocaleString()}</div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-10 w-10 p-0 bg-white/95 hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl backdrop-blur-md border-0 rounded-xl"
                              onClick={() => openEditDialog(property)}
                            >
                              <Edit3 className="h-4 w-4 text-bahayCebu-green" />
                            </Button>
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-10 w-10 p-0 bg-bahayCebu-terracotta/95 hover:bg-bahayCebu-terracotta hover:scale-110 transition-all duration-300 shadow-xl backdrop-blur-md border-0 rounded-xl"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
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
                                    onClick={() => {
                                      handleDeleteProperty(property.id);
                                      setIsDeleteDialogOpen(false);
                                    }}
                                    className="px-6 py-2 bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 text-white shadow-lg rounded-xl"
                                  >
                                    Delete Property
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <CardHeader className="p-6 pb-4">
                          <div className="space-y-4">
                            {/* Property Name */}
                            <div>
                              <h3 className="font-serif font-bold text-xl text-bahayCebu-darkGray mb-2 line-clamp-1">{property.name}</h3>
                            </div>

                            {/* Category Badges */}
                            <div className="flex items-center gap-2">
                              <Badge className="bg-bahayCebu-green/10 text-bahayCebu-green border-bahayCebu-green/20 font-medium px-3 py-1 text-xs rounded-full">
                                {property.propertyType}
                              </Badge>
                              <Badge className="bg-blue-50 text-blue-600 border-blue-200 font-medium px-3 py-1 text-xs rounded-full">
                                {property.listingType}
                              </Badge>
                            </div>

                            {/* Status Badge */}
                            <div className="flex justify-between items-center">
                              <Badge className={`${getStatusColor(property.status)} font-medium px-3 py-1 rounded-full border text-xs`}>
                                {property.status}
                              </Badge>
                              <span className="text-gray-400 text-xs">Updated {property.lastUpdated}</span>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                              <p className="text-bahayCebu-darkGray/70 text-sm line-clamp-1">{property.address}</p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                              <div className="text-bahayCebu-darkGray/60 text-xs leading-relaxed">
                                <p>
                                  {expandedDescriptions.has(property.id) 
                                    ? property.description 
                                    : truncateDescription(property.description, 80)}
                                </p>
                                {property.description.length > 80 && (
                                  <button
                                    onClick={() => toggleDescription(property.id)}
                                    className="text-bahayCebu-green hover:text-bahayCebu-green/80 font-medium mt-1 transition-colors"
                                  >
                                    {expandedDescriptions.has(property.id) ? 'Show less' : 'Read more'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-6 pb-6 space-y-4">
                          {/* Property Stats */}
                          <div className="flex items-center justify-between text-sm bg-gray-50 rounded-xl p-3">
                            <div className="text-center">
                              <div className="font-bold text-bahayCebu-darkGray">{property.units}</div>
                              <div className="text-gray-500 text-xs">Units</div>
                            </div>
                            <div className="w-px h-6 bg-gray-200"></div>
                            <div className="text-center">
                              <div className="font-bold text-bahayCebu-green">{property.occupancyRate}%</div>
                              <div className="text-gray-500 text-xs">Occupied</div>
                            </div>
                          </div>
                          
                          {/* View Listing Button */}
                          <Button 
                            variant="outline" 
                            className="w-full border-2 border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green hover:text-white transition-all duration-300 rounded-xl h-10 font-medium text-sm"
                            onClick={() => navigate(`/property/${property.id}`)}
                          >
                            View Listing Details
                          </Button>
                          
                          {/* Performance Stats */}
                          <div className="border-t border-gray-100 pt-4">
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
                        </CardContent>
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
                      <h3 className="text-lg font-medium text-bahayCebu-darkGray border-l-4 border-purple-500 pl-4">Property Image</h3>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        {newProperty.image ? (
                          <div className="space-y-6">
                            <img src={newProperty.image} alt="Preview" className="max-h-64 mx-auto rounded-2xl shadow-lg object-cover" />
                            <Button 
                              variant="outline" 
                              onClick={() => setNewProperty(prev => ({ ...prev, image: '' }))}
                              className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                            >
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <Upload className="mx-auto h-16 w-16 text-gray-400" />
                            <div>
                              <Label htmlFor="image-upload" className="cursor-pointer">
                                <span className="text-lg font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Upload Property Image</span>
                                <Input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
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
                          <Label htmlFor="video-url" className="text-bahayCebu-darkGray font-medium text-sm">Video URL</Label>
                          <Input
                            id="video-url"
                            type="url"
                            value={newProperty.videoUrl || ''}
                            onChange={(e) => setNewProperty(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl h-12"
                          />
                          <p className="text-sm text-gray-500">Paste a YouTube or Vimeo video URL</p>
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
                      {currentUser.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-bahayCebu-green/20"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      )}
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-serif font-light text-bahayCebu-darkGray mb-2">Agent Management</h1>
                  <p className="text-bahayCebu-darkGray/60 text-lg">Manage your real estate agent information</p>
                </div>
                {agents.length === 0 && (
                  <Button 
                    onClick={() => setIsAddAgentOpen(true)}
                    className="flex items-center space-x-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add Agent</span>
                  </Button>
                )}
              </div>

              {agents.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 bg-bahayCebu-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="h-10 w-10 text-bahayCebu-green" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-bahayCebu-darkGray mb-4">No Agent Added Yet</h3>
                    <p className="text-bahayCebu-darkGray/60 max-w-md mx-auto leading-relaxed">
                      Add your real estate agent information to display on the website.
                    </p>
                    <Button 
                      onClick={() => setIsAddAgentOpen(true)}
                      className="mt-6 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white px-6 py-2"
                    >
                      Add Agent
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="overflow-hidden border-0 shadow-md bg-white rounded-2xl">
                      <div className="flex items-start space-x-6 p-6">
                        <div className="w-48 h-48 relative rounded-xl overflow-hidden">
                          {agent.image ? (
                            <img
                              src={agent.image}
                              alt={agent.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green flex items-center justify-center">
                              <User className="h-16 w-16 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-2xl font-serif font-bold text-bahayCebu-darkGray">{agent.name}</h3>
                              <p className="text-bahayCebu-green font-medium">{agent.title}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="h-10 w-10 p-0 bg-white hover:bg-gray-50 transition-all duration-300 shadow-xl border-gray-200 rounded-xl"
                                onClick={() => {
                                  setEditingAgent(agent);
                                  setIsEditAgentOpen(true);
                                }}
                              >
                                <Edit3 className="h-4 w-4 text-bahayCebu-green" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-10 w-10 p-0 bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 transition-all duration-300 shadow-xl border-0 rounded-xl"
                                onClick={() => handleDeleteAgent(agent.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-bahayCebu-darkGray/60">Email</p>
                              <p className="text-bahayCebu-darkGray">{agent.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-bahayCebu-darkGray/60">Phone</p>
                              <p className="text-bahayCebu-darkGray">{agent.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-bahayCebu-darkGray/60">Location</p>
                              <p className="text-bahayCebu-darkGray">{agent.location}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-bahayCebu-darkGray/60">About</p>
                            <p className="text-bahayCebu-darkGray">{agent.description}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add Agent Dialog */}
              <Dialog 
                open={isAddAgentOpen} 
                onOpenChange={(open) => {
                  setIsAddAgentOpen(open);
                  if (!open) {
                    setNewAgent({
                      name: '',
                      title: '',
                      email: '',
                      phone: '',
                      location: '',
                      description: '',
                      image: ''
                    });
                  }
                }}
              >
                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
                  <DialogHeader className="pb-6 border-b border-gray-100">
                    <DialogTitle className="text-3xl font-serif font-light text-bahayCebu-darkGray">Add New Agent</DialogTitle>
                    <p className="text-bahayCebu-darkGray/60 mt-2">Fill in the agent details to create their profile</p>
                  </DialogHeader>
                  <div className="space-y-8 pt-6">
                    {/* Agent Image Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-8 bg-bahayCebu-green rounded-full"></div>
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray">Profile Photo</h3>
                      </div>
                      <div className="border-2 border-dashed border-bahayCebu-green/30 rounded-2xl p-8 text-center bg-gradient-to-br from-bahayCebu-beige/30 to-bahayCebu-green/5 hover:bg-gradient-to-br hover:from-bahayCebu-beige/40 hover:to-bahayCebu-green/10 transition-all duration-300">
                        {newAgent.image ? (
                          <div className="space-y-6">
                            <div className="relative w-48 h-48 mx-auto">
                              <img 
                                src={newAgent.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-2xl shadow-lg"
                              />
                              <Button 
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90"
                                onClick={() => setNewAgent(prev => ({ ...prev, image: '' }))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-bahayCebu-darkGray/60">
                              Click the button below to change the photo
                            </p>
                            <Label 
                              htmlFor="agent-image-upload" 
                              className="inline-flex items-center space-x-2 cursor-pointer bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <Camera className="h-5 w-5 text-bahayCebu-green" />
                              <span className="text-sm font-medium text-bahayCebu-darkGray">Change Photo</span>
                              <Input
                                id="agent-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleAgentImageUpload(e, false)}
                                className="hidden"
                              />
                            </Label>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="w-48 h-48 mx-auto bg-white rounded-2xl shadow-md flex flex-col items-center justify-center border-2 border-dashed border-bahayCebu-green/20">
                              <Camera className="h-12 w-12 text-bahayCebu-green/40 mb-4" />
                              <Label htmlFor="agent-image-upload" className="cursor-pointer">
                                <div className="text-center">
                                  <span className="inline-flex items-center space-x-2 bg-bahayCebu-green/10 px-4 py-2 rounded-xl text-bahayCebu-green hover:bg-bahayCebu-green/20 transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span className="font-medium">Upload Photo</span>
                                  </span>
                                  <Input
                                    id="agent-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleAgentImageUpload(e, false)}
                                    className="hidden"
                                  />
                                  <p className="text-xs text-bahayCebu-darkGray/60 mt-2">
                                    PNG, JPG or GIF (max. 10MB)
                                  </p>
                                </div>
                              </Label>
                            </div>
                            <p className="text-sm text-bahayCebu-darkGray/60">
                              Upload a professional photo to enhance the agent's profile
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-8 bg-bahayCebu-terracotta rounded-full"></div>
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-bahayCebu-beige/30 to-white p-6 rounded-2xl">
                        <div className="space-y-2">
                          <Label htmlFor="agent-name" className="text-sm font-medium text-bahayCebu-darkGray">
                            Full Name <span className="text-bahayCebu-terracotta">*</span>
                          </Label>
                          <Input
                            id="agent-name"
                            value={newAgent.name}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter agent's full name"
                            className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="agent-title" className="text-sm font-medium text-bahayCebu-darkGray">
                            Job Title <span className="text-bahayCebu-terracotta">*</span>
                          </Label>
                          <Input
                            id="agent-title"
                            value={newAgent.title}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Senior Property Consultant"
                            className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray">Contact Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl">
                        <div className="space-y-2">
                          <Label htmlFor="agent-email" className="text-sm font-medium text-bahayCebu-darkGray">
                            Email Address <span className="text-bahayCebu-terracotta">*</span>
                          </Label>
                          <Input
                            id="agent-email"
                            type="email"
                            value={newAgent.email}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                            className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="agent-phone" className="text-sm font-medium text-bahayCebu-darkGray">
                            Phone Number <span className="text-bahayCebu-terracotta">*</span>
                          </Label>
                          <Input
                            id="agent-phone"
                            value={newAgent.phone}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter phone number"
                            className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="agent-location" className="text-sm font-medium text-bahayCebu-darkGray">
                            Office Location <span className="text-bahayCebu-terracotta">*</span>
                          </Label>
                          <Input
                            id="agent-location"
                            value={newAgent.location}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter office location"
                            className="h-12 border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                        <h3 className="text-lg font-medium text-bahayCebu-darkGray">About</h3>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50/50 to-white p-6 rounded-2xl">
                        <div className="space-y-2">
                          <Label htmlFor="agent-description" className="text-sm font-medium text-bahayCebu-darkGray">
                            Professional Bio <span className="text-bahayCebu-terracotta">*</span>
                          </Label>
                          <Textarea
                            id="agent-description"
                            value={newAgent.description}
                            onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Write a brief description about the agent's experience, specialties, and achievements..."
                            rows={4}
                            className="border-gray-200 focus:border-bahayCebu-green focus:ring-bahayCebu-green/20 rounded-xl resize-none bg-white"
                          />
                          <p className="text-xs text-bahayCebu-darkGray/60">
                            This bio will be displayed on the homepage and agent's profile.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddAgentOpen(false)}
                        className="px-8 py-3 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddAgent}
                        className="px-8 py-3 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg rounded-xl"
                      >
                        Add Agent
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Agent Dialog */}
              <Dialog 
                open={isEditAgentOpen} 
                onOpenChange={(open) => {
                  setIsEditAgentOpen(open);
                  if (!open) {
                    setEditingAgent(null);
                  }
                }}
              >
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-bahayCebu-darkGray">Edit Agent</DialogTitle>
                  </DialogHeader>
                  {editingAgent && (
                    <div className="space-y-6">
                      {/* Agent Image Upload */}
                      <div className="space-y-2">
                        <Label className="text-bahayCebu-darkGray font-medium">Agent Photo</Label>
                        <div className="border-2 border-dashed border-bahayCebu-green/30 rounded-xl p-6 text-center bg-bahayCebu-green/5 hover:bg-bahayCebu-green/10 transition-colors">
                          {editingAgent.image ? (
                            <div className="space-y-6">
                              <img src={editingAgent.image} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-lg object-cover" />
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingAgent(prev => ({ ...prev!, image: '' }))}
                                className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl"
                              >
                                Remove Image
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <Upload className="mx-auto h-16 w-16 text-gray-400" />
                              <div>
                                <Label htmlFor="edit-agent-image-upload" className="cursor-pointer">
                                  <span className="text-lg font-medium text-bahayCebu-green hover:text-bahayCebu-green/80 transition-colors">Upload Agent Photo</span>
                                  <Input
                                    id="edit-agent-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleAgentImageUpload(e, true)}
                                    className="hidden"
                                  />
                                </Label>
                                <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Agent Details */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="edit-agent-name" className="text-bahayCebu-darkGray font-medium">Full Name</Label>
                          <Input
                            id="edit-agent-name"
                            value={editingAgent.name}
                            onChange={(e) => setEditingAgent(prev => ({ ...prev!, name: e.target.value }))}
                            className="border-bahayCebu-green/20 focus:border-bahayCebu-green"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-agent-title" className="text-bahayCebu-darkGray font-medium">Title</Label>
                          <Input
                            id="edit-agent-title"
                            value={editingAgent.title}
                            onChange={(e) => setEditingAgent(prev => ({ ...prev!, title: e.target.value }))}
                            className="border-bahayCebu-green/20 focus:border-bahayCebu-green"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-agent-email" className="text-bahayCebu-darkGray font-medium">Email</Label>
                          <Input
                            id="edit-agent-email"
                            type="email"
                            value={editingAgent.email}
                            onChange={(e) => setEditingAgent(prev => ({ ...prev!, email: e.target.value }))}
                            className="border-bahayCebu-green/20 focus:border-bahayCebu-green"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-agent-phone" className="text-bahayCebu-darkGray font-medium">Phone</Label>
                          <Input
                            id="edit-agent-phone"
                            value={editingAgent.phone}
                            onChange={(e) => setEditingAgent(prev => ({ ...prev!, phone: e.target.value }))}
                            className="border-bahayCebu-green/20 focus:border-bahayCebu-green"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-agent-location" className="text-bahayCebu-darkGray font-medium">Location</Label>
                        <Input
                          id="edit-agent-location"
                          value={editingAgent.location}
                          onChange={(e) => setEditingAgent(prev => ({ ...prev!, location: e.target.value }))}
                          className="border-bahayCebu-green/20 focus:border-bahayCebu-green"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-agent-description" className="text-bahayCebu-darkGray font-medium">Description</Label>
                        <Textarea
                          id="edit-agent-description"
                          value={editingAgent.description}
                          onChange={(e) => setEditingAgent(prev => ({ ...prev!, description: e.target.value }))}
                          rows={4}
                          className="border-bahayCebu-green/20 focus:border-bahayCebu-green resize-none"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-4 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditAgentOpen(false)}
                          className="px-6 py-2 border-bahayCebu-darkGray/20 text-bahayCebu-darkGray hover:bg-bahayCebu-darkGray/5"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleEditAgent}
                          className="px-6 py-2 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
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
                {profileForm.profilePicture ? (
                  <img 
                    src={profileForm.profilePicture} 
                    alt="Profile Preview" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-bahayCebu-green/20"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
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
    </div>
  );
};

export default AdminDashboard;
