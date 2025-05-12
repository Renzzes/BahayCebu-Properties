
import React from 'react';
import { Check } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Maria Santos',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80',
    },
    {
      name: 'Juan Reyes',
      role: 'Senior Property Agent',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
    },
    {
      name: 'Ana Garcia',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80',
    },
    {
      name: 'Pedro Lim',
      role: 'Property Consultant',
      image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80',
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-bahayCebu-darkGray py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80')" }}
        ></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            About BahayCebu Properties
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property in Cebu's most desirable locations
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-4 text-bahayCebu-darkGray">Our Story</h2>
              <p className="text-gray-600 mb-4">
                BahayCebu Properties was founded in 2005 with a simple mission: to help people find their perfect 
                home in Cebu's beautiful landscape. What started as a small family business has grown into one of the 
                most trusted real estate agencies in the region.
              </p>
              <p className="text-gray-600 mb-4">
                Our founder, Maria Santos, recognized the potential of Cebu's real estate market early on and 
                assembled a team of passionate professionals who share her vision of personalized service and 
                in-depth local knowledge.
              </p>
              <p className="text-gray-600">
                Today, we pride ourselves on our continued commitment to excellence, integrity, and customer 
                satisfaction. Our deep understanding of the local market enables us to offer insights and 
                opportunities that other agencies might miss.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80" 
                alt="BahayCebu Office" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-bahayCebu-green text-white p-4 px-6 rounded-lg text-center hidden md:block">
                <p className="font-serif text-3xl font-bold">15+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-bahayCebu-beige">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-bahayCebu-darkGray">Our Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At BahayCebu Properties, our core values guide everything we do. They define how we work with 
              our clients, partners, and each other.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-bahayCebu-green/10 flex items-center justify-center rounded-full mb-4">
                <Check className="h-6 w-6 text-bahayCebu-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-bahayCebu-darkGray">Integrity</h3>
              <p className="text-gray-600">
                We conduct our business with honesty, transparency, and ethical standards that build lasting trust.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-bahayCebu-green/10 flex items-center justify-center rounded-full mb-4">
                <Check className="h-6 w-6 text-bahayCebu-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-bahayCebu-darkGray">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service, from property selection to client communication.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-bahayCebu-green/10 flex items-center justify-center rounded-full mb-4">
                <Check className="h-6 w-6 text-bahayCebu-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-bahayCebu-darkGray">Client Focus</h3>
              <p className="text-gray-600">
                Understanding our clients' needs is our priority. We listen, advise, and work tirelessly to deliver results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-bahayCebu-darkGray">Meet Our Team</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our experienced professionals are dedicated to helping you find the perfect property in Cebu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-bahayCebu-beige rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-4 text-center">
                  <h3 className="font-serif text-lg font-semibold text-bahayCebu-darkGray">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
