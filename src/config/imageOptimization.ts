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

// Performance thresholds for monitoring
export const PERFORMANCE_THRESHOLDS = {
  // Maximum processing time per image (ms)
  maxProcessingTime: 5000,
  
  // Minimum compression ratio (0-1)
  minCompressionRatio: 0.3,
  
  // Maximum file size after compression
  maxCompressedSize: 1024 * 1024, // 1MB
  
  // Batch processing limits
  maxBatchSize: 10,
  maxConcurrentProcessing: 3,
};

// CDN and caching configuration
export const CDN_CONFIG = {
  // Enable lazy loading for property images
  enableLazyLoading: true,
  
  // Preload critical images (hero, first property image)
  preloadCritical: true,
  
  // Cache duration in seconds
  cacheMaxAge: 31536000, // 1 year
  
  // Enable responsive images
  enableResponsiveImages: true,
  
  // Breakpoints for responsive images
  responsiveBreakpoints: [480, 768, 1024, 1440, 1920],
};

// Error handling and fallback configuration
export const ERROR_CONFIG = {
  // Maximum retry attempts for failed optimizations
  maxRetries: 3,
  
  // Retry delay in milliseconds
  retryDelay: 1000,
  
  // Fallback to original image if optimization fails
  fallbackToOriginal: true,
  
  // Log optimization errors in production
  logErrors: true,
  
  // Show user-friendly error messages
  showUserErrors: true,
};

// Development vs Production settings
export const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // Enable performance monitoring
    enablePerformanceMonitoring: isDevelopment,
    
    // Enable detailed logging
    enableDetailedLogging: isDevelopment,
    
    // Use lower quality in development for faster processing
    developmentQualityReduction: isDevelopment ? 0.1 : 0,
    
    // Skip optimization in development if needed
    skipOptimizationInDev: false,
    
    // Enable image format conversion
    enableFormatConversion: true,
    
    // Enable EXIF data removal for privacy and size reduction
    removeExifData: true,
  };
};

// Validation rules for uploaded images
export const VALIDATION_RULES = {
  // Allowed file types
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  
  // Maximum original file size (before optimization)
  maxOriginalSize: 10 * 1024 * 1024, // 10MB
  
  // Minimum image dimensions
  minWidth: 200,
  minHeight: 200,
  
  // Maximum image dimensions (before resizing)
  maxWidth: 4000,
  maxHeight: 4000,
  
  // Maximum number of images per property
  maxImagesPerProperty: 20,
};

// Export default configuration based on environment
export const getOptimizationConfig = (imageType: keyof typeof PRODUCTION_IMAGE_CONFIG) => {
  const envConfig = getEnvironmentConfig();
  const baseConfig = PRODUCTION_IMAGE_CONFIG[imageType];
  
  return {
    ...baseConfig,
    quality: Math.max(0.1, baseConfig.quality - envConfig.developmentQualityReduction),
    enableProgressive: baseConfig.enableProgressive && !envConfig.skipOptimizationInDev,
    removeExifData: envConfig.removeExifData,
  };
};

// Utility function to get optimal settings for property images
export const getPropertyImageSettings = (imageCount: number) => {
  // Adjust quality based on number of images to balance quality vs loading time
  let qualityAdjustment = 0;
  
  if (imageCount > 15) {
    qualityAdjustment = -0.05; // Slightly lower quality for many images
  } else if (imageCount > 10) {
    qualityAdjustment = -0.03;
  }
  
  const baseConfig = getOptimizationConfig('property');
  
  return {
    ...baseConfig,
    quality: Math.max(0.6, baseConfig.quality + qualityAdjustment),
  };
};