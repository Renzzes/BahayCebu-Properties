const fetch = require('node-fetch');

const API_BASE_URL = 'https://bahay-cebu-properties-rences-projects-f8660086.vercel.app';
const FRONTEND_ORIGIN = 'https://bahaycebu-properties.com';

// Generate unique test data
const timestamp = Date.now();
const testUser = {
  name: 'Test User',
  email: `testuser${timestamp}@example.com`,
  password: 'TestPassword123!' // Strong password
};

console.log('🚀 Starting Comprehensive Authentication Tests');
console.log('Test User:', testUser);
console.log('');

async function testSignup() {
  console.log('🔍 Testing Signup with Strong Password...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_ORIGIN
      },
      body: JSON.stringify(testUser)
    });

    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.ok) {
      console.log('✅ Signup successful');
      return JSON.parse(responseText);
    } else {
      console.log('❌ Signup failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Signup error:', error.message);
    return null;
  }
}

async function testLogin() {
  console.log('\n🔍 Testing Login...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_ORIGIN
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.ok) {
      console.log('✅ Login successful');
      return JSON.parse(responseText);
    } else {
      console.log('❌ Login failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

async function testGoogleAuth() {
  console.log('\n🔍 Testing Google Auth Endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_ORIGIN
      },
      body: JSON.stringify({
        // Mock Google token data - this will fail but should show proper error handling
        token: 'mock_google_token',
        email: 'test@gmail.com',
        name: 'Test Google User'
      })
    });

    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.status === 400 || response.status === 401) {
      console.log('✅ Google auth endpoint responding (expected validation error)');
    } else if (response.ok) {
      console.log('✅ Google auth successful');
    } else {
      console.log('❌ Google auth unexpected error');
    }
  } catch (error) {
    console.log('❌ Google auth error:', error.message);
  }
}

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Direct Database Connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Origin': FRONTEND_ORIGIN
      }
    });

    console.log('Status:', response.status);
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.ok) {
      console.log('✅ Database connection healthy');
    } else {
      console.log('❌ Database connection issue');
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
  }
}

async function runTests() {
  // Test database connection first
  await testDatabaseConnection();
  
  // Test signup
  const signupResult = await testSignup();
  
  // Test login only if signup was successful
  if (signupResult) {
    await testLogin();
  }
  
  // Test Google auth endpoint
  await testGoogleAuth();
  
  console.log('\n✨ Comprehensive authentication tests completed!');
}

runTests().catch(console.error);