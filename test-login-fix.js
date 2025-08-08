// Test script to verify login functionality after API URL fix
const fetch = require('node-fetch');

async function testLoginEndpoints() {
  const API_URL = 'http://localhost:4000';
  
  console.log('🔍 Testing Local API Endpoints...');
  console.log('API URL:', API_URL);
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Health Check
    console.log('\n1. Testing Health Endpoint...');
    const healthResponse = await fetch(`${API_URL}/api/health`);
    const healthData = await healthResponse.text();
    
    console.log('Health Status:', healthResponse.status);
    console.log('Health Response:', healthData.substring(0, 200));
    
    if (healthResponse.status === 200) {
      try {
        const healthJson = JSON.parse(healthData);
        console.log('✅ Health endpoint returns valid JSON');
      } catch (e) {
        console.log('❌ Health endpoint returns HTML instead of JSON');
        return false;
      }
    }
    
    // Test 2: Login Endpoint (with invalid credentials)
    console.log('\n2. Testing Login Endpoint...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    const loginData = await loginResponse.text();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', loginData.substring(0, 200));
    
    if (loginData.startsWith('<!DOCTYPE')) {
      console.log('❌ Login endpoint returns HTML instead of JSON');
      console.log('This indicates the API is not properly configured');
      return false;
    } else {
      try {
        const loginJson = JSON.parse(loginData);
        console.log('✅ Login endpoint returns valid JSON');
      } catch (e) {
        console.log('❌ Login endpoint returns invalid JSON');
        return false;
      }
    }
    
    // Test 3: Google Auth Endpoint
    console.log('\n3. Testing Google Auth Endpoint...');
    const googleAuthResponse = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        googleId: '123456789',
        picture: 'https://example.com/photo.jpg'
      })
    });
    
    const googleAuthData = await googleAuthResponse.text();
    console.log('Google Auth Status:', googleAuthResponse.status);
    console.log('Google Auth Response:', googleAuthData.substring(0, 200));
    
    if (googleAuthData.startsWith('<!DOCTYPE')) {
      console.log('❌ Google Auth endpoint returns HTML instead of JSON');
      return false;
    } else {
      try {
        const googleAuthJson = JSON.parse(googleAuthData);
        console.log('✅ Google Auth endpoint returns valid JSON');
      } catch (e) {
        console.log('❌ Google Auth endpoint returns invalid JSON');
        return false;
      }
    }
    
    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('The login issue should now be resolved.');
    return true;
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Login Fix Verification Tool');
  console.log('This script tests if the API URL fix resolved the login issues\n');
  
  const success = await testLoginEndpoints();
  
  if (!success) {
    console.log('\n❌ Issues found. Please check:');
    console.log('1. Backend API server is running on port 4000');
    console.log('2. Frontend environment variables are correct');
    console.log('3. No CORS issues between frontend and backend');
  } else {
    console.log('\n✅ Login functionality should now work correctly!');
    console.log('Try logging in through the frontend interface.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { testLoginEndpoints };