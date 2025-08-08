// test-production-api.js
const fetch = require('node-fetch');

async function testProductionAPI() {
  const API_URL = 'https://api.bahaycebu-properties.com';
  
  console.log('🔍 Testing Production API...');
  console.log('API URL:', API_URL);
  console.log('=' .repeat(50));
  
  try {
    // Test health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Production-Test-Script'
      }
    });
    
    const healthText = await healthResponse.text();
    
    console.log('Status:', healthResponse.status);
    console.log('Content-Type:', healthResponse.headers.get('content-type'));
    console.log('Response length:', healthText.length);
    console.log('Response preview:', healthText.substring(0, 200));
    
    if (healthText.startsWith('<!DOCTYPE') || healthText.includes('<html>')) {
      console.log('❌ API is returning HTML instead of JSON');
      console.log('This indicates the API subdomain is not properly configured.');
      console.log('\nPossible causes:');
      console.log('- API subdomain not created');
      console.log('- Backend not deployed to API subdomain');
      console.log('- Hosting provider serving default page');
      return false;
    }
    
    try {
      const healthJson = JSON.parse(healthText);
      console.log('✅ Health endpoint returning valid JSON:', healthJson);
    } catch (e) {
      console.log('⚠️ Health endpoint not returning valid JSON');
    }
    
    // Test login endpoint with invalid credentials
    console.log('\n2️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Production-Test-Script'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    const loginText = await loginResponse.text();
    console.log('Status:', loginResponse.status);
    console.log('Content-Type:', loginResponse.headers.get('content-type'));
    console.log('Response length:', loginText.length);
    console.log('Response preview:', loginText.substring(0, 200));
    
    if (loginText.startsWith('<!DOCTYPE') || loginText.includes('<html>')) {
      console.log('❌ Login endpoint is returning HTML instead of JSON');
      return false;
    } else {
      try {
        const loginJson = JSON.parse(loginText);
        console.log('✅ Login endpoint returning valid JSON:', loginJson);
      } catch (e) {
        console.log('⚠️ Login endpoint not returning valid JSON');
      }
    }
    
    // Test CORS headers
    console.log('\n3️⃣ Testing CORS headers...');
    const corsResponse = await fetch(`${API_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://bahaycebu-properties.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('CORS Status:', corsResponse.status);
    console.log('Access-Control-Allow-Origin:', corsResponse.headers.get('access-control-allow-origin'));
    console.log('Access-Control-Allow-Methods:', corsResponse.headers.get('access-control-allow-methods'));
    console.log('Access-Control-Allow-Headers:', corsResponse.headers.get('access-control-allow-headers'));
    
    if (corsResponse.headers.get('access-control-allow-origin')) {
      console.log('✅ CORS headers are present');
    } else {
      console.log('⚠️ CORS headers missing - this may cause frontend issues');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n🔍 DNS Resolution failed.');
      console.log('This means the API subdomain does not exist or is not properly configured.');
      console.log('\nNext steps:');
      console.log('1. Create the API subdomain in your hosting control panel');
      console.log('2. Deploy the backend API to the subdomain');
      console.log('3. Ensure DNS is properly configured');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔍 Connection refused.');
      console.log('The subdomain exists but no service is running on it.');
      console.log('\nNext steps:');
      console.log('1. Deploy the backend API to the subdomain');
      console.log('2. Ensure the Node.js service is running');
    }
    
    return false;
  }
}

async function testAlternativeAPIs() {
  console.log('\n🔄 Testing alternative API configurations...');
  
  const alternatives = [
    'https://bahaycebu-properties.com/api',
    'https://bahaycebu-properties.com',
    'https://api.bahaycebu-properties.com'
  ];
  
  for (const apiUrl of alternatives) {
    try {
      console.log(`\nTesting: ${apiUrl}/api/health`);
      const response = await fetch(`${apiUrl}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      const text = await response.text();
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${text.substring(0, 100)}...`);
      
      if (response.ok && !text.includes('<html>')) {
        console.log(`✅ Found working API at: ${apiUrl}`);
      }
    } catch (error) {
      console.log(`❌ ${apiUrl}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 Production API Diagnostic Tool');
  console.log('This script will test your production API configuration\n');
  
  const success = await testProductionAPI();
  
  if (!success) {
    await testAlternativeAPIs();
    
    console.log('\n📋 Summary of Issues Found:');
    console.log('- API subdomain is not properly configured');
    console.log('- Backend API is not deployed or not responding');
    console.log('- This is causing login to return HTML instead of JSON');
    
    console.log('\n🛠️ Recommended Actions:');
    console.log('1. Read the fix-production-login.md guide');
    console.log('2. Deploy backend API to api.bahaycebu-properties.com');
    console.log('3. Verify environment variables are correct');
    console.log('4. Test again with this script');
  } else {
    console.log('\n✅ API appears to be working correctly!');
    console.log('If you\'re still experiencing login issues, the problem may be:');
    console.log('- Frontend not using the correct API URL');
    console.log('- Environment variables not properly set');
    console.log('- Caching issues in the browser');
  }
}

main().catch(console.error);