// Debug script to check production environment variables
const fs = require('fs');
const path = require('path');

function checkEnvironmentFiles() {
  console.log('🔍 Checking Environment Files...');
  console.log('=' .repeat(50));
  
  const envFiles = [
    '.env',
    '.env.local', 
    '.env.production',
    '.env.vercel'
  ];
  
  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`\n📄 ${file}:`);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      lines.forEach(line => {
        if (line.includes('VITE_API_URL')) {
          console.log(`  ${line}`);
        }
      });
    } else {
      console.log(`\n❌ ${file}: Not found`);
    }
  });
}

function checkViteConfig() {
  console.log('\n🔧 Checking Vite Config...');
  console.log('=' .repeat(50));
  
  const configPath = path.join(process.cwd(), 'vite.config.ts');
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    
    // Extract the API URL logic
    const apiUrlMatch = content.match(/const apiUrl = ([^;]+);/);
    if (apiUrlMatch) {
      console.log('API URL logic in vite.config.ts:');
      console.log(`  ${apiUrlMatch[1]}`);
    }
    
    // Check for fallback URL
    const fallbackMatch = content.match(/'https:\/\/bahaycebu-properties\.com'/);
    if (fallbackMatch) {
      console.log('\n⚠️  Found fallback URL in vite.config.ts:');
      console.log('  https://bahaycebu-properties.com');
      console.log('  This might be causing the issue if VITE_API_URL is not loaded properly.');
    }
  }
}

function generateSolution() {
  console.log('\n🔧 Recommended Solutions:');
  console.log('=' .repeat(50));
  
  console.log('\n1. **Update vite.config.ts fallback URL:**');
  console.log('   Change the fallback from:');
  console.log('   \'https://bahaycebu-properties.com\'');
  console.log('   To:');
  console.log('   \'https://api.bahaycebu-properties.com\'');
  
  console.log('\n2. **Ensure environment variables are loaded in production:**');
  console.log('   - For Vercel: Set VITE_API_URL in Vercel dashboard');
  console.log('   - For Hostinger: Ensure .env.production is uploaded');
  console.log('   - For other hosts: Check deployment configuration');
  
  console.log('\n3. **Test the fix:**');
  console.log('   - Build the project: npm run build');
  console.log('   - Check if environment variables are embedded in the build');
  console.log('   - Deploy and test login functionality');
  
  console.log('\n4. **Alternative fix - Hardcode API URL:**');
  console.log('   If environment variables don\'t work, temporarily hardcode:');
  console.log('   const apiUrl = \'https://api.bahaycebu-properties.com\';');
}

function main() {
  console.log('🚀 Production Environment Debug Tool');
  console.log('This script helps diagnose production login issues\n');
  
  checkEnvironmentFiles();
  checkViteConfig();
  generateSolution();
  
  console.log('\n✅ Debug complete. Follow the recommended solutions above.');
}

if (require.main === module) {
  main();
}

module.exports = { checkEnvironmentFiles, checkViteConfig, generateSolution };