// Production-ready image optimization configuration
// Optimized for BahayCebu Properties with multiple property images

export const PRODUCTION_IMAGE_CONFIG = {
  // Property images - High quality for showcasing properties
  property: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85, // High quality for property showcase
    format: 'webp' as const,
    enableProgressive: true,
    maxFileSize: 800 * 1024, // 800KB max
  },
  
  // Property thumbnails - Optimized for fast loading
  propertyThumbnail: {
    maxWidth: 400,
    maxHeight: 300,
    quality: 0.75,
    format: 'webp' as const,
    enableProgressive: false,
    maxFileSize: 100 * 1024, // 100KB max
  },
  
  // Gallery images - Balanced quality and performance
  gallery: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.80,
    format: 'webp' as const,
    enableProgressive: true,
    maxFileSize: 400 * 1024, // 400KB max
  },
  
  // Agent profile images
  agent: {
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.80,
    format: 'webp' as const,
    enableProgressive: false,
    maxFileSize: 150 * 1024, // 150KB max
  },
  
  // Hero/banner images
  hero: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.90, // Highest quality for hero images
    format: 'webp' as const,
    enableProgressive: true,
    maxFileSize: 1024 * 1024, // 1MB max
  }
};

// Validation rules for different image types
export const VALIDATION_RULES = {
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSizeBytes: 10 * 1024 * 1024, // 10MB absolute max
  minDimensions: { width: 100, height: 100 },
  maxDimensions: { width: 4000, height: 4000 }
};

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  compressionTime: 3000, // 3 seconds
  uploadTime: 10000, // 10 seconds
  imageSize: 500 * 1024, // 500KB
  batchSize: 5 // Max images in batch
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_FORMAT: 'Please upload a valid image file (JPEG, PNG, or WebP)',
  FILE_TOO_LARGE: 'Image file is too large. Please choose a smaller file.',
  COMPRESSION_FAILED: 'Failed to optimize image. Please try again.',
  UPLOAD_FAILED: 'Failed to upload image. Please check your connection.',
  INVALID_DIMENSIONS: 'Image dimensions are not supported.'
};

// Default compression settings (fallback)
export const DEFAULT_COMPRESSION = {
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 800,
  format: 'webp' as const
};

// Feature flags for production
export const FEATURE_FLAGS = {
  enableWebP: true,
  enableProgressive: true,
  enableBatchUpload: true,
  enableImagePreview: true,
  enableCompressionMetrics: true
};

// Cache settings
export const CACHE_CONFIG = {
  maxCacheSize: 50 * 1024 * 1024, // 50MB
  cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
  enableCaching: true
};

// API endpoints for image operations
export const IMAGE_API_ENDPOINTS = {
  upload: '/api/images/upload',
  compress: '/api/images/compress',
  delete: '/api/images/delete',
  batch: '/api/images/batch'
};

// Browser compatibility checks
export const BROWSER_SUPPORT = {
  webp: () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },
  canvas: () => {
    return !!document.createElement('canvas').getContext;
  },
  fileReader: () => {
    return typeof FileReader !== 'undefined';
  }
};

// Utility function to get config by image type
export function getImageConfig(type: keyof typeof PRODUCTION_IMAGE_CONFIG) {
  return PRODUCTION_IMAGE_CONFIG[type] || DEFAULT_COMPRESSION;
}

// Utility function to validate image
export function validateImageFile(file: File) {
  const errors: string[] = [];
  
  if (!VALIDATION_RULES.allowedFormats.includes(file.type)) {
    errors.push(ERROR_MESSAGES.INVALID_FORMAT);
  }
  
  if (file.size > VALIDATION_RULES.maxFileSizeBytes) {
    errors.push(ERROR_MESSAGES.FILE_TOO_LARGE);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to calculate compression ratio
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

// Export default config
export default PRODUCTION_IMAGE_CONFIG;