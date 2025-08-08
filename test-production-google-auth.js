// Test script to verify Google OAuth configuration in production
const https = require('https');
const { URL } = require('url');

// Production API URL
const PRODUCTION_API_URL = 'https://bahaycebu-properties.com';
const PRODUCTION_API_SUBDOMAIN = 'https://api.bahaycebu-properties.com';

function testGoogleAuthEndpoint(baseUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/auth/google', baseUrl);
    
    console.log(`\n🔍 Testing Google Auth endpoint: ${url.toString()}`);
    
    const req = https.get(url.toString(), (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 302) {
          const location = res.headers.location;
          if (location && location.includes('accounts.google.com')) {
            console.log('✅ Google OAuth redirect working correctly');
            console.log(`Redirect URL: ${location}`);
            
            // Check if client_id is in the redirect URL
            if (location.includes('client_id=897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com')) {
              console.log('✅ New Google Client ID found in redirect URL');
              resolve({ success: true, url: baseUrl, redirectUrl: location });
            } else {
              console.log('❌ Old or incorrect Client ID in redirect URL');
              resolve({ success: false, url: baseUrl, redirectUrl: location, error: 'Wrong client ID' });
            }
          } else {
            console.log('❌ Invalid redirect URL');
            resolve({ success: false, url: baseUrl, error: 'Invalid redirect' });
          }
        } else {
          console.log('❌ Unexpected status code');
          console.log('Response:', data);
          resolve({ success: false, url: baseUrl, error: `Status ${res.statusCode}` });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      reject({ success: false, url: baseUrl, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Request timeout');
      req.destroy();
      reject({ success: false, url: baseUrl, error: 'Timeout' });
    });
  });
}

async function testProductionGoogleAuth() {
  console.log('🚀 Testing Production Google OAuth Configuration');
  console.log('=' .repeat(60));
  
  const results = [];
  
  try {
    // Test main domain
    console.log('\n📍 Testing main domain...');
    const mainResult = await testGoogleAuthEndpoint(PRODUCTION_API_URL);
    results.push(mainResult);
    
    // Test API subdomain
    console.log('\n📍 Testing API subdomain...');
    const apiResult = await testGoogleAuthEndpoint(PRODUCTION_API_SUBDOMAIN);
    results.push(apiResult);
    
  } catch (error) {
    console.error('Test failed:', error);
    results.push(error);
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  results.forEach((result, index) => {
    const domain = index === 0 ? 'Main Domain' : 'API Subdomain';
    console.log(`\n${domain}:`);
    if (result.success) {
      console.log('  ✅ Status: WORKING');
      console.log(`  🔗 Redirect: ${result.redirectUrl?.substring(0, 100)}...`);
    } else {
      console.log('  ❌ Status: FAILED');
      console.log(`  🚨 Error: ${result.error}`);
    }
  });
  
  const workingCount = results.filter(r => r.success).length;
  console.log(`\n🎯 Result: ${workingCount}/${results.length} endpoints working`);
  
  if (workingCount > 0) {
    console.log('\n✅ Google OAuth configuration appears to be working!');
    console.log('🔍 Try logging in at: https://bahaycebu-properties.com');
  } else {
    console.log('\n❌ Google OAuth configuration needs attention.');
    console.log('🔧 Check Vercel environment variables and Google Cloud Console settings.');
  }
}

// Run the test
testProductionGoogleAuth().catch(console.error);