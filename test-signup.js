// Test script for signup API
const fetch = require('node-fetch');

async function testSignup() {
  console.log('Testing signup API...');
  
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };
  
  console.log('Test user:', testUser);
  
  try {
    // Test local API
    console.log('\nTesting local API...');
    const localResponse = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const localResponseText = await localResponse.text();
    console.log('Local API response status:', localResponse.status);
    console.log('Local API response text:', localResponseText);
    
    try {
      const localData = JSON.parse(localResponseText);
      console.log('Local API response JSON:', localData);
    } catch (e) {
      console.error('Failed to parse local response as JSON');
    }
    
    // Test production API
    console.log('\nTesting production API...');
    const prodResponse = await fetch('https://api.bahaycebu-properties.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUser,
        email: `test${Date.now() + 1}@example.com` // Use a different email
      })
    });
    
    const prodResponseText = await prodResponse.text();
    console.log('Production API response status:', prodResponse.status);
    console.log('Production API response text:', prodResponseText);
    
    try {
      const prodData = JSON.parse(prodResponseText);
      console.log('Production API response JSON:', prodData);
    } catch (e) {
      console.error('Failed to parse production response as JSON');
    }
    
  } catch (error) {
    console.error('Error testing signup API:', error);
  }
}

testSignup();