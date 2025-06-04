import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80" 
              alt="Luxury Home in Cebu" 
              className="rounded-lg shadow-lg w-full h-auto object-cover max-h-[500px]"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 shadow-lg rounded-lg hidden md:block">
              <p className="font-serif text-3xl font-bold text-bahayCebu-green">15+</p>
              <p className="text-sm text-gray-600">Years of Experience</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-bahayCebu-darkGray">
              About BahayCebu Properties
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              BahayCebu Properties is Cebu's premier real estate agency, specializing in helping clients 
              find their dream homes in this tropical paradise. Our personalized approach and extensive 
              market knowledge ensure that every client finds their perfect property.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-bahayCebu-green/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-bahayCebu-green" />
                </div>
                <p className="text-gray-700">Personalized property recommendations based on your preferences</p>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-bahayCebu-green/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-bahayCebu-green" />
                </div>
                <p className="text-gray-700">Comprehensive knowledge of Cebu's neighborhoods and market trends</p>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-bahayCebu-green/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-bahayCebu-green" />
                </div>
                <p className="text-gray-700">End-to-end support from property viewing to paperwork completion</p>
              </div>
            </div>
            
            <Button 
              asChild 
              className="bg-bahayCebu-green hover:bg-bahayCebu-green/90"
            >
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
