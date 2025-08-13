
/**
 * Production Configuration for BahayCebu Properties
 */

// Image optimization settings for production
export const PRODUCTION_IMAGE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxCompressedSize: 2 * 1024 * 1024, // 2MB after compression
  quality: 0.85,
  maxWidth: 800,
  maxHeight: 800,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
};

// API timeout settings
export const API_TIMEOUTS = {
  agent_update: 30000, // 30 seconds
  agent_create: 30000, // 30 seconds
  image_upload: 60000, // 60 seconds
  default: 15000 // 15 seconds
};

// Performance monitoring
export const PERFORMANCE_CONFIG = {
  enableLogging: true,
  logSlowRequests: true,
  slowRequestThreshold: 5000, // 5 seconds
  enableImageSizeWarnings: true,
  imageSizeWarningThreshold: 1024 * 1024 // 1MB
};

// Error handling
export const ERROR_CONFIG = {
  retryAttempts: 2,
  retryDelay: 1000, // 1 second
  showDetailedErrors: false // Set to true for debugging
};
