/**
 * Production Issues Fix Script
 * Addresses image display and performance issues in production
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  backendDir: './hostinger-deployment/backend',
  frontendDir: './hostinger-deployment/frontend',
  apiDir: './api',
  srcDir: './src'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if directory exists
function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

// Copy file with error handling
function copyFile(src, dest) {
  try {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    return true;
  } catch (error) {
    logError(`Failed to copy ${src} to ${dest}: ${error.message}`);
    return false;
  }
}

// Read file with error handling
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    logError(`Failed to read ${filePath}: ${error.message}`);
    return null;
  }
}

// Write file with error handling
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    logError(`Failed to write ${filePath}: ${error.message}`);
    return false;
  }
}

// Fix 1: Update agent API to handle large images better
function fixAgentAPI() {
  logSection('🔧 Fixing Agent API Performance Issues');
  
  const agentApiPath = path.join(CONFIG.apiDir, 'agents', '[id].js');
  
  if (!fileExists(agentApiPath)) {
    logError('Agent API file not found');
    return false;
  }
  
  let content = readFile(agentApiPath);
  if (!content) return false;
  
  // Add request size limit and timeout handling
  const improvements = `
// Add request size validation
if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 50 * 1024 * 1024) {
  return res.status(413).json({ error: 'Request too large. Maximum size is 50MB.' });
}

// Add request timeout handling
const timeout = setTimeout(() => {
  if (!res.headersSent) {
    res.status(408).json({ error: 'Request timeout' });
  }
}, 30000); // 30 second timeout

// Clear timeout on response
res.on('finish', () => clearTimeout(timeout));
`;
  
  // Insert improvements after CORS handling
  const corsEndIndex = content.indexOf('return res.status(200).end();');
  if (corsEndIndex !== -1) {
    const insertIndex = content.indexOf('\n', corsEndIndex) + 1;
    content = content.slice(0, insertIndex) + improvements + content.slice(insertIndex);
    
    if (writeFile(agentApiPath, content)) {
      logSuccess('Agent API performance improvements added');
      return true;
    }
  }
  
  logWarning('Could not automatically update Agent API. Manual update required.');
  return false;
}

// Fix 2: Create image optimization middleware
function createImageOptimizationMiddleware() {
  logSection('🖼️  Creating Image Optimization Middleware');
  
  const middlewareContent = `
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
      console.warn(\`Large image detected: \${(imageSize / 1024 / 1024).toFixed(2)}MB\`);
      
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
      error: \`Image too large: \${(sizeInBytes / 1024 / 1024).toFixed(2)}MB (max 5MB)\`
    };
  }
  
  return { isValid: true };
}
`;
  
  const middlewarePath = path.join(CONFIG.apiDir, 'middleware', 'imageOptimization.js');
  
  if (writeFile(middlewarePath, middlewareContent)) {
    logSuccess('Image optimization middleware created');
    return true;
  }
  
  return false;
}

// Fix 3: Update deployment package with fixes
function updateDeploymentPackage() {
  logSection('📦 Updating Deployment Package');
  
  let success = true;
  
  // Copy updated API files
  const apiFiles = [
    'agents/[id].js',
    'agents/index.js',
    'middleware/imageOptimization.js'
  ];
  
  apiFiles.forEach(file => {
    const srcPath = path.join(CONFIG.apiDir, file);
    const destPath = path.join(CONFIG.backendDir, file);
    
    if (fileExists(srcPath)) {
      if (copyFile(srcPath, destPath)) {
        logSuccess(`Updated ${file}`);
      } else {
        success = false;
      }
    } else {
      logWarning(`Source file not found: ${file}`);
    }
  });
  
  // Copy optimized services
  const serviceFiles = [
    'services/optimizedAgentService.ts',
    'services/imageStorageService.ts'
  ];
  
  serviceFiles.forEach(file => {
    const srcPath = path.join(CONFIG.srcDir, file);
    const destPath = path.join(CONFIG.frontendDir, 'src', file);
    
    if (fileExists(srcPath)) {
      if (copyFile(srcPath, destPath)) {
        logSuccess(`Updated ${file}`);
      } else {
        success = false;
      }
    } else {
      logWarning(`Source file not found: ${file}`);
    }
  });
  
  return success;
}

// Fix 4: Create production debugging tools
function createDebuggingTools() {
  logSection('🔍 Creating Production Debugging Tools');
  
  // Copy the test file to deployment package
  const testFileSrc = './test-image-upload.html';
  const testFileDest = path.join(CONFIG.frontendDir, 'debug-tools.html');
  
  if (fileExists(testFileSrc)) {
    if (copyFile(testFileSrc, testFileDest)) {
      logSuccess('Debug tools copied to deployment package');
      return true;
    }
  }
  
  logWarning('Debug tools not created');
  return false;
}

// Fix 5: Create production configuration
function createProductionConfig() {
  logSection('⚙️  Creating Production Configuration');
  
  const configContent = `
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
`;
  
  const configPath = path.join(CONFIG.srcDir, 'config', 'production.ts');
  
  if (writeFile(configPath, configContent)) {
    logSuccess('Production configuration created');
    return true;
  }
  
  return false;
}

// Main execution
function main() {
  logSection('🚀 BahayCebu Properties - Production Issues Fix');
  
  logInfo('This script will fix image display and performance issues in production.');
  logInfo('Make sure to backup your files before running this script.');
  
  console.log('\n');
  
  let allSuccess = true;
  
  // Run all fixes
  allSuccess &= fixAgentAPI();
  allSuccess &= createImageOptimizationMiddleware();
  allSuccess &= updateDeploymentPackage();
  allSuccess &= createDebuggingTools();
  allSuccess &= createProductionConfig();
  
  // Summary
  logSection('📋 Summary');
  
  if (allSuccess) {
    logSuccess('All fixes applied successfully!');
    console.log('\n');
    logInfo('Next steps:');
    logInfo('1. Upload the updated hostinger-deployment folder to your server');
    logInfo('2. Test the debug tools at: https://your-domain.com/debug-tools.html');
    logInfo('3. Monitor the console for performance metrics');
    logInfo('4. Check agent image uploads and updates');
  } else {
    logWarning('Some fixes could not be applied automatically.');
    logInfo('Please review the errors above and apply fixes manually.');
  }
  
  console.log('\n');
  logInfo('For support, check the console logs and performance metrics.');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixAgentAPI,
  createImageOptimizationMiddleware,
  updateDeploymentPackage,
  createDebuggingTools,
  createProductionConfig
};