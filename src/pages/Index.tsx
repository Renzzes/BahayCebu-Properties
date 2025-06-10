import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AboutSection from '@/components/home/About';
import FloatingMessage from '@/components/ui/FloatingMessage';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProperties />
      <AboutSection />
      
      {/* Floating Message Icon */}
      <FloatingMessage />
    </div>
  );
};

export default Index;
