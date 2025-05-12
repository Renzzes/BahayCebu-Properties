
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AgentProfile: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center text-bahayCebu-darkGray">
          Meet Our Agent
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <div className="bg-bahayCebu-beige p-1 rounded-lg shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80"
                alt="Maria Santos"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-2 text-bahayCebu-darkGray">Maria Santos</h3>
            <p className="text-bahayCebu-green font-medium mb-4">Senior Property Consultant</p>
            
            <p className="text-gray-600 mb-6">
              With over 10 years of experience in Cebu's real estate market, Maria has helped hundreds of clients 
              find their perfect homes. Her extensive knowledge of the local property market, combined with her 
              dedication to personalized service, makes her one of the most sought-after agents in the region.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-bahayCebu-green mr-3" />
                <span>+63 912 345 6789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-bahayCebu-green mr-3" />
                <span>maria@bahaycebuhomes.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-bahayCebu-green mr-3" />
                <span>Cebu Business Park, Cebu City</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-bahayCebu-green hover:bg-bahayCebu-green/90">
                Schedule a Call
              </Button>
              <Button variant="outline" className="border-bahayCebu-green text-bahayCebu-green hover:bg-bahayCebu-green/10">
                View All Listings
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-bahayCebu-beige/30 rounded-lg border border-bahayCebu-beige">
              <p className="italic text-gray-600">
                "My goal is to help you find not just a house, but a home that perfectly matches your lifestyle 
                and preferences in the beautiful island of Cebu."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentProfile;
