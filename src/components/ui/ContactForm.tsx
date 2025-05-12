
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface ContactFormProps {
  className?: string;
  propertyId?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className, propertyId }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: propertyId 
      ? `I'm interested in property #${propertyId}. Please contact me with more information.`
      : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormData({
        ...formData,
        message: propertyId 
          ? `I'm interested in property #${propertyId}. Please contact me with more information.`
          : '',
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className || ''}`}>
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border-gray-300 focus:border-bahayCebu-green focus:ring-bahayCebu-green"
        />
      </div>
      
      <div>
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border-gray-300 focus:border-bahayCebu-green focus:ring-bahayCebu-green"
        />
      </div>
      
      <div>
        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border-gray-300 focus:border-bahayCebu-green focus:ring-bahayCebu-green"
        />
      </div>
      
      <div>
        <Textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="border-gray-300 focus:border-bahayCebu-green focus:ring-bahayCebu-green"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-bahayCebu-green hover:bg-bahayCebu-green/90"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;
