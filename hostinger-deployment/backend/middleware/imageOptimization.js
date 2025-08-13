
/**
 * Image Optimization Middleware for Production
 */

export function imageOptimizationMiddleware(req, res, next) {
  // Skip if not a POST/PUT request with image data
  if (!['POST', 'PUT'].includes(req.method)) {
    return next();
  }
  
  // Check for large image data in request body
  if (req.body && req.body.image && typeof req.body.image === 'string') {
    const imageSize = Math.round((req.body.image.length * 3) / 4);
    const maxSize = 2 * 1024 * 1024; // 2MB limit
    
    if (imageSize > maxSize) {
      console.warn(`Large image detected: ${(imageSize / 1024 / 1024).toFixed(2)}MB`);
      
      // Optionally compress the image here
      // For now, just log the warning
    }
  }
  
  next();
}

export function validateImageData(imageData) {
  if (!imageData || typeof imageData !== 'string') {
    return { isValid: false, error: 'Invalid image data' };
  }
  
  if (!imageData.startsWith('data:image/')) {
    return { isValid: false, error: 'Invalid image format' };
  }
  
  const sizeInBytes = Math.round((imageData.length * 3) / 4);
  const maxSize = 5 * 1024 * 1024; // 5MB limit
  
  if (sizeInBytes > maxSize) {
    return { 
      isValid: false, 
      error: `Image too large: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB (max 5MB)`
    };
  }
  
  return { isValid: true };
}
