import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-bahayCebu-darkGray py-20">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            About BahayCebu Properties
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property in Cebu's most desirable locations
          </p>
        </div>
      </section>

      {/* My Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-4 text-bahayCebu-darkGray">My Story</h2>
              <p className="text-gray-600 mb-4">
                BahayCebu Properties was founded in 2011 with a clear and heartfelt mission: to help individuals and families 
                find their ideal home within Cebu's vibrant and scenic communities. What began as a modest family-run venture 
                has since grown into one of the most respected and trusted real estate agencies in the region.
              </p>
              <p className="text-gray-600 mb-4">
                As the founder, I saw the early potential of Cebu's rapidly growing real estate market and made it my goal 
                to provide clients with a personalized, honest, and knowledgeable service. I carefully built a team of 
                like-minded professionals who share my dedication to integrity, local expertise, and genuine care for each 
                client's needs.
              </p>
              <p className="text-gray-600 mb-4">
                With nearly two decades of hands-on experience, I take pride in the lasting relationships I've built and 
                the many successful transactions I've guided. My in-depth understanding of Cebu's neighborhoods, market trends, 
                and investment opportunities allows me to offer insights and solutions that go beyond listings.
              </p>
              <p className="text-gray-600">
                Today, BahayCebu Properties remains deeply committed to delivering quality service, honest advice, and real 
                value—helping clients not just find a property, but a place to truly call home.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/LOGO/1.png" 
                alt="BahayCebu Properties Logo" 
                className="w-full h-[600px] object-contain transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-bahayCebu-beige">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-bahayCebu-darkGray">Core Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At BahayCebu Properties, these fundamental values guide every interaction and decision, 
              ensuring we deliver the best possible service to our clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
              <div className="w-12 h-12 bg-bahayCebu-green/10 flex items-center justify-center rounded-full mb-4">
                <Check className="h-6 w-6 text-bahayCebu-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-bahayCebu-darkGray">Personal Touch</h3>
              <p className="text-gray-600">
                Providing personalized, attentive service that addresses each client's unique needs and aspirations for their ideal home.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
              <div className="w-12 h-12 bg-bahayCebu-green/10 flex items-center justify-center rounded-full mb-4">
                <Check className="h-6 w-6 text-bahayCebu-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-bahayCebu-darkGray">Local Expertise</h3>
              <p className="text-gray-600">
                Deep understanding of Cebu's neighborhoods, market trends, and investment opportunities that goes beyond basic listings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
              <div className="w-12 h-12 bg-bahayCebu-green/10 flex items-center justify-center rounded-full mb-4">
                <Check className="h-6 w-6 text-bahayCebu-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-bahayCebu-darkGray">Integrity</h3>
              <p className="text-gray-600">
                Commitment to honest advice and transparent service, building lasting relationships based on trust and reliability.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
              <div className="w-12 h-12 bg-bahayCebu-green/10 flex items-center justify-center rounded-full mb-4">
                <Check className="h-6 w-6 text-bahayCebu-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-bahayCebu-darkGray">Genuine Care</h3>
              <p className="text-gray-600">
                Dedicated to helping clients find not just a property, but a true home, with genuine care for their long-term satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
