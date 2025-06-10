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
              src="/LOGO/1.png" 
              alt="BahayCebu Properties Logo" 
              className="w-full h-[600px] object-contain transition-transform duration-300 hover:scale-110"
            />
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-bahayCebu-darkGray">
              Welcome to BahayCebu Properties
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Since 2011, I've been dedicated to helping individuals and families find their perfect homes in 
              Cebu's vibrant communities. With deep local knowledge and a genuine commitment to personalized service, 
              I guide clients through every step of their real estate journey.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start transition-all duration-300 hover:-translate-x-2 hover:bg-gray-50 p-3 rounded-lg">
                <div className="mt-1 mr-3 bg-bahayCebu-green/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-bahayCebu-green" />
                </div>
                <p className="text-gray-700">Expert guidance with nearly two decades of Cebu real estate experience</p>
              </div>
              <div className="flex items-start transition-all duration-300 hover:-translate-x-2 hover:bg-gray-50 p-3 rounded-lg">
                <div className="mt-1 mr-3 bg-bahayCebu-green/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-bahayCebu-green" />
                </div>
                <p className="text-gray-700">In-depth knowledge of neighborhoods, market trends, and investment opportunities</p>
              </div>
              <div className="flex items-start transition-all duration-300 hover:-translate-x-2 hover:bg-gray-50 p-3 rounded-lg">
                <div className="mt-1 mr-3 bg-bahayCebu-green/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-bahayCebu-green" />
                </div>
                <p className="text-gray-700">Personalized, honest service focused on finding your true home</p>
              </div>
            </div>
            
            <Button 
              asChild 
              className="bg-bahayCebu-green hover:bg-bahayCebu-green/90"
            >
              <Link to="/about">Learn More About My Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
