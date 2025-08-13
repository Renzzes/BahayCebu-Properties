import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ContactModal from '@/components/ui/ContactModal';



const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePropertiesClick = () => {
    navigate('/properties');
    setIsMenuOpen(false);
  };









  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-serif font-bold text-bahayCebu-darkGray">
            <span className="text-orange-800">Bahay</span><span className="text-bahayCebu-green">Cebu</span>
            <span className="ml-3">Properties</span>
          </h1>
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            Home
          </Link>
          <button onClick={handlePropertiesClick} className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            Properties
          </button>
          <Link to="/about" className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            About
          </Link>
          <Link to="/contact" className="text-bahayCebu-darkGray hover:text-bahayCebu-green font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-bahayCebu-green after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            Agent
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggleMenu} className="lg:hidden text-bahayCebu-darkGray p-2 focus:outline-none">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 p-5 lg:hidden">
          <nav className="flex flex-col space-y-4 text-lg">
            <Link to="/" onClick={toggleMenu} className="text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              Home
            </Link>
            <button onClick={handlePropertiesClick} className="text-left text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              Properties
            </button>
            <Link to="/about" onClick={toggleMenu} className="text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              About
            </Link>
            <Link to="/contact" onClick={toggleMenu} className="text-bahayCebu-darkGray hover:text-bahayCebu-green py-2 font-medium border-b border-gray-100 transition-colors relative">
              Agent
            </Link>
          </nav>
        </div>
      )}

      <ContactModal isOpen={isModalOpen} onClose={closeModal} />


    </header>
  );
};

export default Navbar;