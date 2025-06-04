import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { getAgent } from '@/data/agents';
import type { Agent } from '@/data/agents';

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
    position: "center 30%"
  },
  {
    url: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80",
    position: "center"
  },
  {
    url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
    position: "center"
  }
];

const taglines = [
  "Find Your Dream Home in Cebu",
  "Discover Beachfront Paradise",
  "Luxury Living in the Islands",
  "Your Perfect Cebu Sanctuary",
  "Invest in Cebu, Live in Comfort",
  "Build Your Future in Cebu's Finest Homes",
  "From City Heights to Seaside Views",
  "Experience the Life Living in your dream Home"
];

const Hero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [agent, setAgent] = useState<Agent | null>(null);



  useEffect(() => {
    const currentTagline = taglines[taglineIndex];
    
    const typeWriter = () => {
      if (isDeleting) {
        // Deleting text
        setDisplayText(prev => prev.substring(0, prev.length - 1));
        setTypingSpeed(50); // Faster when deleting
        
        // When empty, switch to typing mode and move to next tagline
        if (displayText === '') {
          setIsDeleting(false);
          setTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
          setTypingSpeed(100);
        }
      } else {
        // Typing text
        setDisplayText(currentTagline.substring(0, displayText.length + 1));
        setTypingSpeed(100);
        
        // When completed typing current tagline, pause before deleting
        if (displayText === currentTagline) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 2000); // Wait 2 seconds before starting to delete
          return;
        }
      }
    };

    const timer = setTimeout(typeWriter, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, taglineIndex, isDeleting, typingSpeed]);

  return (
    <section className="relative bg-gray-900 h-[85vh] flex items-center overflow-hidden">
      <Carousel className="w-full h-full absolute inset-0" opts={{ loop: true, duration: 40 }}>
        <CarouselContent className="h-full">
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000" 
                style={{ 
                  backgroundImage: `url('${image.url}')`,
                  backgroundPosition: image.position
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 animate-fade-in min-h-[80px]">
            {displayText}
            <span className="inline-block w-1 bg-white ml-1 animate-pulse">|</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Discover stunning properties in the heart of the Philippines. 
            From luxurious condos to spacious family homes with breathtaking views.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button 
              asChild 
              className="bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 text-white py-6 px-8 rounded-md text-lg"
            >
              <Link to="/properties">
                Browse Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10 py-6 px-8 rounded-md text-lg"
            >
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>

        {/* Agent Section */}
        {agent && 
         agent.name && 
         agent.title && 
         agent.email && 
         agent.phone && 
         agent.description && (
          <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-md animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden">
                {agent.image ? (
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-bahayCebu-terracotta to-bahayCebu-green flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {agent.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-bahayCebu-darkGray">{agent.name}</h3>
                <p className="text-bahayCebu-green font-medium">{agent.title}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-bahayCebu-darkGray/70">{agent.phone}</p>
                  <p className="text-sm text-bahayCebu-darkGray/70">{agent.email}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-bahayCebu-darkGray/80 line-clamp-2">{agent.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
