import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

// Define image paths directly
const heroImages = [
  {
    url: "/carousel/arc-tower-cebu-city.jpg",
    position: "center",
    title: "Arc Tower Cebu City"
  },
  {
    url: "/carousel/City Clou.jpg",
    position: "center",
    title: "City Cloud"
  },
  {
    url: "/carousel/Mandani-Bay-at-Night.jpg",
    position: "center",
    title: "Mandani Bay"
  },
  {
    url: "/carousel/Shang Residences.jpg",
    position: "center",
    title: "Shang Residences"
  },
  {
    url: "/carousel/vertex central.jpg",
    position: "center",
    title: "Vertex Central"
  },
  {
    url: "/carousel/vertex coast.jpg",
    position: "center",
    title: "Vertex Coast"
  },
  {
    url: "/carousel/west jones.jpg",
    position: "center",
    title: "West Jones"
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
  
  const [emblaRef] = useEmblaCarousel({ 
    loop: true,
    align: "center",
    skipSnaps: false,
  }, [
    Autoplay({ 
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  ]);

  useEffect(() => {
    const currentTagline = taglines[taglineIndex];
    
    const typeWriter = () => {
      if (isDeleting) {
        setDisplayText(prev => prev.substring(0, prev.length - 1));
        setTypingSpeed(50);
        
        if (displayText === '') {
          setIsDeleting(false);
          setTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
          setTypingSpeed(100);
        }
      } else {
        setDisplayText(currentTagline.substring(0, displayText.length + 1));
        setTypingSpeed(100);
        
        if (displayText === currentTagline) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
          return;
        }
      }
    };

    const timer = setTimeout(typeWriter, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, taglineIndex, isDeleting, typingSpeed]);

  return (
    <section className="relative bg-gray-900 h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img 
                src={image.url}
                alt={image.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-8 left-8 text-white z-10">
                <h3 className="text-2xl font-bold font-serif">
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 min-h-[80px]">
            {displayText}
            <span className="inline-block w-1 bg-white ml-1 animate-pulse">|</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Discover stunning properties in the heart of the Philippines. 
            From luxurious condos to spacious family homes with breathtaking views.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              asChild 
              className="bg-bahayCebu-terracotta hover:bg-bahayCebu-terracotta/90 text-white py-6 px-8 rounded-md text-lg"
            >
              <Link to="/properties">
                Browse Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;