// Script to verify Google OAuth configuration and provide specific fix instructions
const https = require('https');
const { URL } = require('url');

// Production domains to test
const DOMAINS_TO_TEST = [
  'https://bahaycebu-properties.com',
  'https://api.bahaycebu-properties.com'
];

// Expected redirect URIs that should be configured in Google Cloud Console
const EXPECTED_REDIRECT_URIS = [
  'https://bahaycebu-properties.com/auth/google/callback',
  'https://bahaycebu-properties.com/api/auth/google/callback',
  'https://api.bahaycebu-properties.com/auth/google/callback',
  'https://api.bahaycebu-properties.com/api/auth/google/callback'
];

// Expected JavaScript origins
const EXPECTED_ORIGINS = [
  'https://bahaycebu-properties.com',
  'https://api.bahaycebu-properties.com'
];

function testDomainAccess(domain) {
  return new Promise((resolve) => {
    const url = new URL('/', domain);
    
    console.log(`\n🔍 Testing domain access: ${domain}`);
    
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 10000
    }, (res) => {
      console.log(`✅ Domain accessible - Status: ${res.statusCode}`);
      resolve({ domain, accessible: true, status: res.statusCode });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Domain not accessible - Error: ${error.message}`);
      resolve({ domain, accessible: false, error: error.message });
    });
    
    req.on('timeout', () => {
      console.log(`⏰ Domain timeout`);
      req.destroy();
      resolve({ domain, accessible: false, error: 'Timeout' });
    });
    
    req.end();
  });
}

function testGoogleAuthEndpoint(domain) {
  return new Promise((resolve) => {
    const url = new URL('/api/auth/google', domain);
    
    console.log(`\n🔍 Testing Google Auth endpoint: ${url.toString()}`);
    
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 302) {
          const location = res.headers.location;
          if (location && location.includes('accounts.google.com')) {
            console.log(`✅ Correct redirect to Google - Status: ${res.statusCode}`);
            console.log(`📍 Redirect URL: ${location}`);
            resolve({ domain, working: true, status: res.statusCode, redirect: location });
          } else {
            console.log(`⚠️  Unexpected redirect - Status: ${res.statusCode}`);
            console.log(`📍 Redirect URL: ${location}`);
            resolve({ domain, working: false, status: res.statusCode, redirect: location });
          }
        } else {
          console.log(`❌ Unexpected status - Status: ${res.statusCode}`);
          console.log(`📄 Response: ${data.substring(0, 200)}...`);
          resolve({ domain, working: false, status: res.statusCode, response: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Request failed - Error: ${error.message}`);
      resolve({ domain, working: false, error: error.message });
    });
    
    req.on('timeout', () => {
      console.log(`⏰ Request timeout`);
      req.destroy();
      resolve({ domain, working: false, error: 'Timeout' });
    });
    
    req.end();
  });
}

function generateGoogleCloudConsoleInstructions(results) {
  console.log('\n' + '='.repeat(80));
  console.log('🔧 GOOGLE CLOUD CONSOLE CONFIGURATION INSTRUCTIONS');
  console.log('='.repeat(80));
  
  console.log('\n📋 Step 1: Go to Google Cloud Console');
  console.log('   URL: https://console.cloud.google.com/');
  console.log('   Navigate to: APIs & Services > Credentials');
  
  console.log('\n📋 Step 2: Find your OAuth 2.0 Client ID');
  console.log('   Look for: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
  console.log('   Click on the pencil icon to edit');
  
  console.log('\n📋 Step 3: Update Authorized Redirect URIs');
  console.log('   Add these URIs (remove any old ones that don\'t match):');
  EXPECTED_REDIRECT_URIS.forEach(uri => {
    console.log(`   ✓ ${uri}`);
  });
  
  console.log('\n📋 Step 4: Update Authorized JavaScript Origins');
  console.log('   Add these origins:');
  EXPECTED_ORIGINS.forEach(origin => {
    console.log(`   ✓ ${origin}`);
  });
  
  console.log('\n📋 Step 5: Save Changes');
  console.log('   Click "Save" in Google Cloud Console');
  console.log('   Wait 5-10 minutes for changes to propagate');
  
  console.log('\n📋 Step 6: Test Again');
  console.log('   Run this script again to verify the fix');
  console.log('   Or test manually at: https://bahaycebu-properties.com');
}

function generateEnvironmentVariableCheck() {
  console.log('\n' + '='.repeat(80));
  console.log('🔧 VERCEL ENVIRONMENT VARIABLES CHECK');
  console.log('='.repeat(80));
  
  console.log('\n📋 Run these commands to verify environment variables:');
  console.log('   vercel env ls');
  console.log('');
  console.log('📋 Expected values:');
  console.log('   GOOGLE_CLIENT_ID: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
  console.log('   VITE_GOOGLE_CLIENT_ID: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
  console.log('   GOOGLE_REDIRECT_URI: https://bahaycebu-properties.com/auth/google/callback');
  console.log('   VITE_GOOGLE_REDIRECT_URI: https://bahaycebu-properties.com/auth/google/callback');
  
  console.log('\n📋 If any values are incorrect, update them:');
  console.log('   vercel env rm VARIABLE_NAME');
  console.log('   vercel env add VARIABLE_NAME');
  console.log('   vercel --prod  # Redeploy after changes');
}

async function main() {
  console.log('🚀 Google OAuth Configuration Verification');
  console.log('=' .repeat(60));
  
  const results = [];
  
  // Test domain accessibility
  console.log('\n📍 Testing domain accessibility...');
  for (const domain of DOMAINS_TO_TEST) {
    const result = await testDomainAccess(domain);
    results.push(result);
  }
  
  // Test Google Auth endpoints
  console.log('\n📍 Testing Google Auth endpoints...');
  for (const domain of DOMAINS_TO_TEST) {
    const result = await testGoogleAuthEndpoint(domain);
    results.push(result);
  }
  
  // Generate instructions
  generateGoogleCloudConsoleInstructions(results);
  generateEnvironmentVariableCheck();
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 SUMMARY');
  console.log('='.repeat(80));
  console.log('\nThe "Error 401: invalid_client" is most likely caused by:');
  console.log('1. ❌ Google Cloud Console OAuth client missing redirect URIs');
  console.log('2. ❌ Incorrect domain configuration in Google OAuth client');
  console.log('3. ❌ Mismatch between environment variables and Google Console config');
  
  console.log('\n🔧 Primary fix: Update Google Cloud Console OAuth client configuration');
  console.log('🔧 Secondary fix: Verify Vercel environment variables');
  console.log('🔧 Final step: Redeploy and test');
  
  console.log('\n📞 If issues persist after following these steps:');
  console.log('   1. Check Google Cloud Console audit logs');
  console.log('   2. Verify the OAuth consent screen is properly configured');
  console.log('   3. Ensure the Google+ API is enabled for your project');
  
  console.log('\n✅ Run this script again after making changes to verify the fix.');
}

// Run the verification
main().catch(console.error);