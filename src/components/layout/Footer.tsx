import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useAgent } from '@/contexts/AgentContext';

const Footer: React.FC = () => {
  const { agent } = useAgent();

  return (
    <footer className="bg-bahayCebu-darkGray text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">
              <span className="text-bahayCebu-terracotta">Bahay</span>Cebu
            </h3>
            <p className="text-gray-300 mb-6 pr-4">
              Your trusted partner for finding the perfect property in Cebu. 
              We provide a personalized approach to match you with your dream home.
            </p>
            <div className="flex space-x-4">
              {agent?.socialMedia?.facebook && (
                <a href={agent.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-bahayCebu-terracotta transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {agent?.socialMedia?.instagram && (
                <a href={agent.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-bahayCebu-terracotta transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {agent?.socialMedia?.linkedin && (
                <a href={agent.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white hover:text-bahayCebu-terracotta transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">Properties</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Agent</Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-lg font-bold mb-4">Property Types</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">Houses</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">Condominiums</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">Land</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">Commercial</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-bahayCebu-terracotta mr-2" />
                <span className="text-gray-300">{agent?.location || 'Loading...'}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-bahayCebu-terracotta mr-2" />
                <a href={`tel:${agent?.phone}`} className="text-gray-300 hover:text-white transition-colors">
                  {agent?.phone || 'Loading...'}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-bahayCebu-terracotta mr-2" />
                <a href={`mailto:${agent?.email}`} className="text-gray-300 hover:text-white transition-colors">
                  {agent?.email || 'Loading...'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BahayCebu Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
