
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AboutSection from '@/components/home/About';
import ContactForm from '@/components/ui/ContactForm';
import AgentProfile from '@/components/home/AgentProfile';
import FloatingMessage from '@/components/ui/FloatingMessage';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProperties />
      <AboutSection />
      <AgentProfile />
      
      {/* Contact Section */}
      <section className="section-padding bg-bahayCebu-lightGray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-bahayCebu-darkGray">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6">
                Have questions about a property or need assistance finding your dream home in Cebu?
                Our team of experienced agents is here to help you. Fill out the form, and we'll
                get back to you as soon as possible.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <ContactForm />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <img 
                src="https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80"
                alt="Luxury Home in Cebu"
                className="rounded-lg shadow-md w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating Message Icon */}
      <FloatingMessage />
    </div>
  );
};

export default Index;
