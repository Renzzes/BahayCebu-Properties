
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface GalleryProps {
  images: string[];
  className?: string;
}

const PropertyGallery: React.FC<GalleryProps> = ({ images, className }) => {
  const [currentImage, setCurrentImage] = useState(0);

  // If no images provided, show placeholder
  if (!images.length) {
    return (
      <div className={cn("bg-gray-200 rounded-lg flex items-center justify-center", className)}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
        <img
          src={images[currentImage]}
          alt={`Property view ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button 
              key={index}
              className={cn(
                "h-16 md:h-20 rounded-md overflow-hidden transition-all",
                currentImage === index ? "ring-2 ring-bahayCebu-green" : "ring-1 ring-transparent opacity-70 hover:opacity-100"
              )}
              onClick={() => setCurrentImage(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
