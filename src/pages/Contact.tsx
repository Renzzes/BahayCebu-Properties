
import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-bahayCebu-beige">
      {/* Contact Header */}
      <section className="bg-bahayCebu-darkGray py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help you find your perfect property in Cebu.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-serif font-semibold mb-6 text-bahayCebu-darkGray">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
            
            {/* Contact Details */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                <h3 className="text-xl font-serif font-semibold mb-6 text-bahayCebu-darkGray">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-bahayCebu-green mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-bahayCebu-darkGray">Address</h4>
                      <p className="text-gray-600">123 Real Estate St., Cebu Business Park, Cebu City, Philippines</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-bahayCebu-green mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-bahayCebu-darkGray">Phone</h4>
                      <p className="text-gray-600">+63 912 345 6789</p>
                      <p className="text-gray-600">+63 932 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-bahayCebu-green mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-bahayCebu-darkGray">Email</h4>
                      <p className="text-gray-600">info@bahaycebuhomes.com</p>
                      <p className="text-gray-600">sales@bahaycebuhomes.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-bahayCebu-green mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-bahayCebu-darkGray">Office Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-serif font-semibold mb-4 text-bahayCebu-darkGray">Follow Us</h3>
                <p className="text-gray-600 mb-4">
                  Stay updated with the latest properties and news from BahayCebu Properties.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-bahayCebu-green/10 hover:bg-bahayCebu-green/20 text-bahayCebu-green p-2 rounded-full transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-bahayCebu-green/10 hover:bg-bahayCebu-green/20 text-bahayCebu-green p-2 rounded-full transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-bahayCebu-green/10 hover:bg-bahayCebu-green/20 text-bahayCebu-green p-2 rounded-full transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-16">
        <div className="container-custom">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="aspect-video w-full bg-gray-200 rounded">
              {/* In a real application, this would be a Google Map */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Google Map would be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
