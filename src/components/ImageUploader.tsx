import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Plus, ChevronLeft, ChevronRight, Trash2, Upload } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { cn } from '@/lib/utils';
import { ImageOptimizer, isValidImage, formatFileSize } from '@/utils/imageOptimization';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onImageUpload: (file: File) => Promise<string>;
}

export default function ImageUploader({ images, onImagesChange, onImageUpload }: ImageUploaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress('Validating files...');

    try {
      // Validate files
      const validFiles = Array.from(files).filter(file => {
        if (!isValidImage(file)) {
          console.warn(`Invalid file: ${file.name}`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        alert('Please select valid image files (JPEG, PNG, WebP, max 10MB)');
        return;
      }

      setUploadProgress(`Optimizing ${validFiles.length} image(s)...`);

      // Optimize images for better performance
      const optimizedImages: string[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(`Optimizing image ${i + 1} of ${validFiles.length}...`);
        
        // Use property optimizer for better compression
        const optimizedImage = await ImageOptimizer.property(file);
        optimizedImages.push(optimizedImage);
      }

      setUploadProgress('Finalizing...');
      onImagesChange([...images, ...optimizedImages]);
      
      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomImage = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Property Images</h3>

      {images.length > 0 ? (
        <Card className="overflow-hidden max-h-[600px]">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative flex-shrink-0">
              {/* Main Image Display */}
              <div className="relative aspect-video max-h-[400px]">
                <img
                  src={images[currentImageIndex]}
                  alt={`Property image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => handleZoomImage(images[currentImageIndex])}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-white/20"
                  onClick={() => removeImage(currentImageIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 p-4 overflow-x-auto flex-shrink-0 border-t border-gray-100">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2",
                    currentImageIndex === index ? "border-bahayCebu-green" : "border-transparent"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <label className={cn(
          "block cursor-pointer",
          isUploading && "pointer-events-none opacity-50"
        )}>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors hover:border-gray-400">
            <div className="flex flex-col items-center justify-center text-center">
              {isUploading ? (
                <>
                  <Upload className="w-12 h-12 text-bahayCebu-green mb-4 animate-pulse" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-bahayCebu-green">{uploadProgress}</p>
                    <p className="text-xs text-gray-500">Please wait...</p>
                  </div>
                </>
              ) : (
                <>
                  <Plus className="w-12 h-12 text-gray-400 mb-4" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No images uploaded</p>
                    <p className="text-sm text-gray-500">
                      Click here to upload images
                    </p>
                    <p className="text-xs text-gray-400">
                      Supports JPEG, PNG, WebP (max 10MB each)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </label>
      )}

      {images.length > 0 && (
        <label className={cn(
          "block cursor-pointer",
          isUploading && "pointer-events-none"
        )}>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button 
            className={cn(
              "w-full bg-bahayCebu-green hover:bg-bahayCebu-green/90",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                {uploadProgress}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add More Images
              </>
            )}
          </Button>
        </label>
      )}

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative h-[80vh]">
            <img
              src={zoomedImage}
              alt="Zoomed floor plan"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}