require('dotenv').config({ path: '.env.api' });
const fetch = require('node-fetch');

async function testLogin() {
  console.log('🔍 Testing Login Functionality...');
  
  const API_URL = 'https://api.bahaycebu-properties.com';
  
  // First, create a test user
  const testUser = {
    name: 'Login Test User',
    email: `logintest${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };
  
  console.log('\n1️⃣ Creating test user for login...');
  try {
    const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://bahaycebu-properties.com'
      },
      body: JSON.stringify(testUser)
    });
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('✅ Test user created successfully');
      console.log('User ID:', signupData.id);
    } else {
      console.log('❌ Failed to create test user');
      return;
    }
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    return;
  }
  
  // Now test login
  console.log('\n2️⃣ Testing login with created user...');
  try {
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://bahaycebu-properties.com'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    console.log('Login Status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('Token received:', loginData.token ? 'Yes' : 'No');
      console.log('User data:', {
        id: loginData.user?.id,
        email: loginData.user?.email,
        name: loginData.user?.name,
        role: loginData.user?.role
      });
    } else {
      const errorData = await loginResponse.text();
      console.log('❌ Login failed');
      console.log('Error response:', errorData);
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
  }
}

testLogin().catch(console.error);