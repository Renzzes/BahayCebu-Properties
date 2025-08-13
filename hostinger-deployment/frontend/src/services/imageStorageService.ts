/**
 * Enhanced Image Storage Service for Production
 * Handles proper image storage, optimization, and retrieval
 */

export interface ImageUploadResponse {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  error?: string;
  metadata?: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: string;
    processingTime: number;
  };
}

export interface ImageStorageConfig {
  maxFileSize: number;
  allowedFormats: string[];
  quality: number;
  maxWidth: number;
  maxHeight: number;
}

const DEFAULT_CONFIG: ImageStorageConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 0.85,
  maxWidth: 800,
  maxHeight: 800
};

/**
 * Enhanced Image Storage Service
 * Provides better image handling for production environments
 */
export class ImageStorageService {
  private config: ImageStorageConfig;
  private apiBaseUrl: string;

  constructor(config: Partial<ImageStorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.apiBaseUrl = this.getApiBaseUrl();
  }

  private getApiBaseUrl(): string {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
        return 'http://localhost:3000';
      }
      return 'https://api.bahaycebu-properties.com';
    }
    return process.env.VITE_API_URL || 'https://api.bahaycebu-properties.com';
  }

  /**
   * Validates an image file
   */
  private validateImage(file: File): { isValid: boolean; error?: string } {
    if (!this.config.allowedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file format. Allowed: ${this.config.allowedFormats.join(', ')}`
      };
    }

    if (file.size > this.config.maxFileSize) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${this.formatFileSize(this.config.maxFileSize)}`
      };
    }

    return { isValid: true };
  }

  /**
   * Compresses an image while maintaining quality
   */
  private async compressImage(file: File): Promise<{ blob: Blob; dataUrl: string; metadata: any }> {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate optimal dimensions
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > this.config.maxWidth) {
          width = this.config.maxWidth;
          height = width / aspectRatio;
        }

        if (height > this.config.maxHeight) {
          height = this.config.maxHeight;
          width = height * aspectRatio;
        }

        // Set canvas dimensions
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to blob for better performance
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const dataUrl = canvas.toDataURL('image/jpeg', this.config.quality);
            const processingTime = Date.now() - startTime;
            const compressionRatio = ((1 - blob.size / file.size) * 100).toFixed(1);

            resolve({
              blob,
              dataUrl,
              metadata: {
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: `${compressionRatio}%`,
                processingTime
              }
            });
          },
          'image/jpeg',
          this.config.quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Uploads an image for agent profiles
   */
  async uploadAgentImage(file: File): Promise<ImageUploadResponse> {
    try {
      // Validate the image
      const validation = this.validateImage(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Compress the image
      const compressed = await this.compressImage(file);

      // For now, return the data URL (can be enhanced to use cloud storage)
      return {
        success: true,
        imageUrl: compressed.dataUrl,
        metadata: compressed.metadata
      };

    } catch (error) {
      console.error('Error uploading agent image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image'
      };
    }
  }

  /**
   * Optimizes image for better performance
   */
  async optimizeForPerformance(imageUrl: string): Promise<string> {
    // If it's already a data URL, return as is
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    // If it's a URL, we could implement caching or CDN optimization here
    return imageUrl;
  }

  /**
   * Preloads images for better UX
   */
  async preloadImage(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }

  /**
   * Formats file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export a default instance
export const imageStorageService = new ImageStorageService();

// Export utility functions
export const uploadAgentImage = (file: File) => imageStorageService.uploadAgentImage(file);
export const optimizeImageForPerformance = (imageUrl: string) => imageStorageService.optimizeForPerformance(imageUrl);
export const preloadImage = (imageUrl: string) => imageStorageService.preloadImage(imageUrl);