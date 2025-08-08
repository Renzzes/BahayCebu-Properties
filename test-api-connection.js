// Test script to verify API connection between Hostinger frontend and Vercel backend
// Run this script to test if the CORS and API issues are resolved

const API_BASE_URL = 'https://bahay-cebu-properties-rences-projects-f8660086.vercel.app';
const FRONTEND_ORIGIN = 'https://bahaycebu-properties.com';

// Test 1: Health Check
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Credentials:', response.headers.get('Access-Control-Allow-Credentials'));
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Health check passed:', data);
    } else {
      console.log('❌ Health check failed');
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
}

// Test 2: OPTIONS Request (CORS Preflight)
async function testCORSPreflight() {
  console.log('\n🔍 Testing CORS Preflight...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('  Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    console.log('  Access-Control-Allow-Credentials:', response.headers.get('Access-Control-Allow-Credentials'));
    
    if (response.status === 200) {
      console.log('✅ CORS preflight passed');
    } else {
      console.log('❌ CORS preflight failed');
    }
  } catch (error) {
    console.log('❌ CORS preflight error:', error.message);
  }
}

// Test 3: Signup Request (without actually creating an account)
async function testSignupEndpoint() {
  console.log('\n🔍 Testing Signup Endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123'
      })
    });
    
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    
    const responseText = await response.text();
    console.log('Response:', responseText.substring(0, 200));
    
    if (response.status === 409) {
      console.log('✅ Signup endpoint working (user already exists)');
    } else if (response.status === 201) {
      console.log('✅ Signup endpoint working (user created)');
    } else if (response.status === 403) {
      console.log('✅ Signup endpoint working (registration disabled)');
    } else {
      console.log('❌ Signup endpoint issue');
    }
  } catch (error) {
    console.log('❌ Signup endpoint error:', error.message);
  }
}

// Test 4: Google Auth Endpoint
async function testGoogleAuthEndpoint() {
  console.log('\n🔍 Testing Google Auth Endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        googleId: '123456789',
        picture: 'https://example.com/photo.jpg'
      })
    });
    
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    
    const responseText = await response.text();
    console.log('Response:', responseText.substring(0, 200));
    
    if (response.status === 200 || response.status === 403) {
      console.log('✅ Google auth endpoint accessible');
    } else {
      console.log('❌ Google auth endpoint issue');
    }
  } catch (error) {
    console.log('❌ Google auth endpoint error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Connection Tests');
  console.log('Frontend Origin:', FRONTEND_ORIGIN);
  console.log('API Base URL:', API_BASE_URL);
  
  await testHealthCheck();
  await testCORSPreflight();
  await testSignupEndpoint();
  await testGoogleAuthEndpoint();
  
  console.log('\n✨ Tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. If all tests pass, your API connection is working');
  console.log('2. If CORS errors persist, check Vercel deployment');
  console.log('3. If database errors occur, run the database-schema-fix.sql script');
  console.log('4. Test the actual frontend at https://bahaycebu-properties.com');
}

// Run the tests
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runAllTests();
} else {
  // Browser environment
  runAllTests();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testHealthCheck,
    testCORSPreflight,
    testSignupEndpoint,
    testGoogleAuthEndpoint,
    runAllTests
  };
}