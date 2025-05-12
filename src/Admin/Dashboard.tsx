import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PropertyType } from '../components/properties/PropertyCard';
import PropertyCard from '../components/properties/PropertyCard';

const Dashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleDeleteProperty = async (id: string) => {
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    setProperties(properties.filter(property => property.id !== id));
  };

  const handleEditProperty = (id: string) => {
    navigate(`/admin/property/edit/${id}`);
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-bahayCebu-green">Admin Panel</h1>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          <Link
            to="/admin"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Home size={20} />
            {!isSidebarCollapsed && <span className="ml-3">Dashboard</span>}
          </Link>
          
          <Link
            to="/admin/properties/new"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <PlusCircle size={20} />
            {!isSidebarCollapsed && <span className="ml-3">Add Property</span>}
          </Link>
          
          <Link
            to="/admin/settings"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings size={20} />
            {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
          </Link>
          
          <button
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => {/* Handle logout */}}
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-bahayCebu-darkGray">Property Management</h1>
            <Button
              className="bg-bahayCebu-green hover:bg-bahayCebu-green/90"
              onClick={() => navigate('/admin/properties/new')}
            >
              <PlusCircle className="mr-2" size={20} />
              Add New Property
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white hover:bg-gray-100"
                      onClick={() => handleEditProperty(property.id)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-white hover:bg-red-100 text-red-500"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
