/**
 * Optimized Image Service for Production Performance
 * Handles image compression, validation, and storage optimization
 */

import { ImageOptimizer, isValidImage, formatFileSize } from '@/utils/imageOptimization';

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  originalSize?: string;
  compressedSize?: string;
  compressionRatio?: string;
}

export interface BatchImageUploadResult {
  success: boolean;
  imageUrls?: string[];
  errors?: string[];
  totalOriginalSize?: string;
  totalCompressedSize?: string;
  overallCompressionRatio?: string;
}

/**
 * Uploads and optimizes a single image
 * @param file - The image file to upload
 * @param type - The type of image (property, agent, thumbnail)
 * @returns Promise<ImageUploadResult>
 */
export const uploadOptimizedImage = async (
  file: File,
  type: 'property' | 'agent' | 'thumbnail' | 'gallery' = 'property'
): Promise<ImageUploadResult> => {
  const startTime = ImagePerformanceMonitor.startTimer();
  
  try {
    // Validate the image
    if (!isValidImage(file)) {
      return {
        success: false,
        error: 'Invalid image file. Please use JPEG, PNG, or WebP format (max 10MB)'
      };
    }

    const originalSize = file.size;
    const originalSizeFormatted = formatFileSize(originalSize);

    // Optimize based on type
    let optimizedImage: string;
    switch (type) {
      case 'agent':
        optimizedImage = await ImageOptimizer.agent(file);
        break;
      case 'thumbnail':
        optimizedImage = await ImageOptimizer.propertyThumbnail(file);
        break;
      case 'gallery':
        optimizedImage = await ImageOptimizer.gallery(file);
        break;
      default:
        optimizedImage = await ImageOptimizer.property(file);
    }

    // Calculate compression statistics
    const compressedSize = Math.round((optimizedImage.length * 3) / 4); // Approximate base64 to bytes
    const compressedSizeFormatted = formatFileSize(compressedSize);
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    // Record performance statistics
    const processingTime = ImagePerformanceMonitor.endTimer(startTime, `${type} optimization`);
    ImagePerformanceMonitor.recordOperation(originalSize, compressedSize, processingTime, type);

    return {
      success: true,
      imageUrl: optimizedImage,
      originalSize: originalSizeFormatted,
      compressedSize: compressedSizeFormatted,
      compressionRatio: `${compressionRatio}%`
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    return {
      success: false,
      error: 'Failed to process image. Please try again.'
    };
  }
};

/**
 * Uploads and optimizes multiple images in batch
 * @param files - Array of image files to upload
 * @param type - The type of images
 * @param onProgress - Progress callback function
 * @returns Promise<BatchImageUploadResult>
 */
export const uploadOptimizedImages = async (
  files: File[],
  type: 'property' | 'agent' | 'thumbnail' | 'gallery' = 'property',
  onProgress?: (current: number, total: number, currentFile: string) => void
): Promise<BatchImageUploadResult> => {
  try {
    const results: ImageUploadResult[] = [];
    const imageUrls: string[] = [];
    const errors: string[] = [];
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Call progress callback
      if (onProgress) {
        onProgress(i + 1, files.length, file.name);
      }

      const result = await uploadOptimizedImage(file, type);
      results.push(result);

      if (result.success && result.imageUrl) {
        imageUrls.push(result.imageUrl);
        
        // Calculate sizes for statistics
        totalOriginalSize += file.size;
        const compressedSize = Math.round((result.imageUrl.length * 3) / 4);
        totalCompressedSize += compressedSize;
      } else if (result.error) {
        errors.push(`${file.name}: ${result.error}`);
      }
    }

    const overallCompressionRatio = totalOriginalSize > 0 
      ? ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)
      : '0';

    return {
      success: imageUrls.length > 0,
      imageUrls,
      errors: errors.length > 0 ? errors : undefined,
      totalOriginalSize: formatFileSize(totalOriginalSize),
      totalCompressedSize: formatFileSize(totalCompressedSize),
      overallCompressionRatio: `${overallCompressionRatio}%`
    };
  } catch (error) {
    console.error('Error in batch image upload:', error);
    return {
      success: false,
      errors: ['Failed to process images. Please try again.']
    };
  }
};

/**
 * Creates an optimized thumbnail from an image
 * @param file - The image file
 * @param size - Thumbnail size (default: 300px)
 * @returns Promise<ImageUploadResult>
 */
export const createOptimizedThumbnail = async (
  file: File
): Promise<ImageUploadResult> => {
  const startTime = ImagePerformanceMonitor.startTimer();
  
  try {
    if (!isValidImage(file)) {
      return {
        success: false,
        error: 'Invalid image file for thumbnail creation'
      };
    }

    const originalSize = file.size;
    const thumbnail = await ImageOptimizer.propertyThumbnail(file);
    const compressedSize = Math.round((thumbnail.length * 3) / 4);
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    // Record performance statistics
    const processingTime = ImagePerformanceMonitor.endTimer(startTime, 'thumbnail creation');
    ImagePerformanceMonitor.recordOperation(originalSize, compressedSize, processingTime, 'thumbnail');

    return {
      success: true,
      imageUrl: thumbnail,
      originalSize: formatFileSize(originalSize),
      compressedSize: formatFileSize(compressedSize),
      compressionRatio: `${compressionRatio}%`
    };
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return {
      success: false,
      error: 'Failed to create thumbnail'
    };
  }
};

/**
 * Validates and prepares images for upload
 * @param files - FileList or File array
 * @returns Object with valid files and validation results
 */
export const validateImages = (files: FileList | File[]) => {
  const fileArray = Array.from(files);
  const validFiles: File[] = [];
  const invalidFiles: { file: File; reason: string }[] = [];
  let totalSize = 0;

  fileArray.forEach(file => {
    if (!isValidImage(file)) {
      invalidFiles.push({
        file,
        reason: 'Invalid file type or size too large (max 10MB)'
      });
    } else {
      validFiles.push(file);
      totalSize += file.size;
    }
  });

  return {
    validFiles,
    invalidFiles,
    totalSize: formatFileSize(totalSize),
    isValid: validFiles.length > 0,
    hasInvalidFiles: invalidFiles.length > 0
  };
};

/**
 * Performance monitoring for image operations
 */
export const ImagePerformanceMonitor = {
  stats: {
    totalImages: 0,
    totalSizeBefore: 0,
    totalSizeAfter: 0,
    totalProcessingTime: 0,
    operations: [] as Array<{
      timestamp: number;
      sizeBefore: number;
      sizeAfter: number;
      processingTime: number;
      operation: string;
    }>
  },

  startTimer: () => performance.now(),
  
  endTimer: (startTime: number, operation: string) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Image ${operation} completed in ${duration.toFixed(2)}ms`);
    return duration;
  },
  
  logCompressionStats: (originalSize: number, compressedSize: number, operation: string) => {
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    console.log(`${operation}: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${ratio}% reduction)`);
  },

  recordOperation: (sizeBefore: number, sizeAfter: number, processingTime: number, operation: string = 'optimization') => {
    ImagePerformanceMonitor.stats.totalImages++;
    ImagePerformanceMonitor.stats.totalSizeBefore += sizeBefore;
    ImagePerformanceMonitor.stats.totalSizeAfter += sizeAfter;
    ImagePerformanceMonitor.stats.totalProcessingTime += processingTime;
    
    ImagePerformanceMonitor.stats.operations.push({
      timestamp: Date.now(),
      sizeBefore,
      sizeAfter,
      processingTime,
      operation
    });

    // Keep only last 100 operations to prevent memory issues
    if (ImagePerformanceMonitor.stats.operations.length > 100) {
      ImagePerformanceMonitor.stats.operations = ImagePerformanceMonitor.stats.operations.slice(-100);
    }
  },

  getStats: () => {
    const stats = ImagePerformanceMonitor.stats;
    return {
      totalImages: stats.totalImages,
      totalSizeBefore: stats.totalSizeBefore,
      totalSizeAfter: stats.totalSizeAfter,
      averageCompressionRatio: stats.totalSizeBefore > 0 
        ? (stats.totalSizeAfter / stats.totalSizeBefore)
        : 0,
      averageProcessingTime: stats.totalImages > 0 
        ? (stats.totalProcessingTime / stats.totalImages)
        : 0,
      recentOperations: stats.operations.slice(-10)
    };
  },

  reset: () => {
    ImagePerformanceMonitor.stats = {
      totalImages: 0,
      totalSizeBefore: 0,
      totalSizeAfter: 0,
      totalProcessingTime: 0,
      operations: []
    };
  }
};

export default {
  uploadOptimizedImage,
  uploadOptimizedImages,
  createOptimizedThumbnail,
  validateImages,
  ImagePerformanceMonitor
};