import React, { useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageOptimizer } from '@/utils/imageOptimization';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const onImageLoaded = (img: HTMLImageElement) => {
    setImageRef(img);
    return false;
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const getCroppedImg = async () => {
    if (!imageRef) return;

    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;
      canvas.width = crop.width!;
      canvas.height = crop.height!;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        imageRef,
        crop.x! * scaleX,
        crop.y! * scaleY,
        crop.width! * scaleX,
        crop.height! * scaleY,
        0,
        0,
        crop.width!,
        crop.height!
      );

      // Use optimized compression for better quality and smaller size
      const base64Image = canvas.toDataURL('image/jpeg', 0.9);
      onCropComplete(base64Image);
      onClose();
    } catch (error) {
      console.error('Error processing cropped image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Crop Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          <div className="max-h-[60vh] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              circularCrop
            >
              <img src={imageSrc} onLoad={(e) => onImageLoaded(e.currentTarget)} />
            </ReactCrop>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 border-bahayCebu-darkGray/20 text-bahayCebu-darkGray hover:bg-bahayCebu-darkGray/5"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={getCroppedImg}
              className="px-6 py-2 bg-bahayCebu-green hover:bg-bahayCebu-green/90 text-white shadow-lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Apply'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;