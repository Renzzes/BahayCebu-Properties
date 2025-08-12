/**
 * Image optimization utilities for better performance
 * Handles compression, resizing, and format conversion
 */

import { VALIDATION_RULES } from '@/config/imageOptimization';

// Legacy compression settings (kept for backward compatibility)
// const COMPRESSION_SETTINGS = {
//   property: { quality: 0.8, maxWidth: 1200, maxHeight: 800 },
//   agent: { quality: 0.85, maxWidth: 400, maxHeight: 400 },
//   gallery: { quality: 0.75, maxWidth: 1000, maxHeight: 700 },
//   thumbnail: { quality: 0.7, maxWidth: 300, maxHeight: 200 }
// };

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

/**
 * Compresses an image file to reduce its size
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<string> - Base64 encoded compressed image
 */
export const compressImage = async (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<string> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height);
      
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                      format === 'webp' ? 'image/webp' : 'image/png';
      
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compresses multiple images in parallel
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @returns Promise<string[]> - Array of compressed base64 images
 */
export const compressMultipleImages = async (
  files: File[],
  options: ImageCompressionOptions = {}
): Promise<string[]> => {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
};

/**
 * Creates a thumbnail from an image
 * @param file - The image file
 * @param size - Thumbnail size (width and height)
 * @returns Promise<string> - Base64 encoded thumbnail
 */
export const createThumbnail = async (
  file: File,
  size: number = 300
): Promise<string> => {
  return compressImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    format: 'jpeg'
  });
};

/**
 * Optimizes images for different use cases
 */
export const ImageOptimizer = {
  // For property main images
  property: (file: File) => compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    format: 'jpeg'
  }),

  // For property thumbnails
  propertyThumbnail: (file: File) => compressImage(file, {
    maxWidth: 400,
    maxHeight: 300,
    quality: 0.8,
    format: 'jpeg'
  }),

  // For agent profile images
  agent: (file: File) => compressImage(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.9,
    format: 'jpeg'
  }),

  // For gallery images
  gallery: (file: File) => compressImage(file, {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.8,
    format: 'jpeg'
  })
};

/**
 * Validates if a file is a valid image using production rules
 */
export const isValidImage = (file: File): boolean => {
  return (
    VALIDATION_RULES.allowedTypes.includes(file.type) && 
    file.size <= VALIDATION_RULES.maxOriginalSize
  );
};

/**
 * Enhanced validation with detailed error messages
 */
export const validateImageWithDetails = (file: File): { isValid: boolean; error?: string } => {
  if (!VALIDATION_RULES.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${VALIDATION_RULES.allowedTypes.join(', ')}`
    };
  }
  
  if (file.size > VALIDATION_RULES.maxOriginalSize) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${formatFileSize(VALIDATION_RULES.maxOriginalSize)}`
    };
  }
  
  return { isValid: true };
};

/**
 * Gets the file size in a human-readable format
 * @param bytes - File size in bytes
 * @returns string - Formatted file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};