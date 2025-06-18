import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ZoomableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={`cursor-zoom-in transition-transform hover:scale-105 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg object-cover"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-full">
            <img
              src={src}
              alt={alt}
              style={{ width: '100%', height: 'auto', maxHeight: '90vh' }}
              className="rounded-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ZoomableImage; 