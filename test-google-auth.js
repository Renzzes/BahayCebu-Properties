// Load environment variables from .env.api file
require('dotenv').config({ path: './.env.api' });
const fetch = require('node-fetch');

// Test data for Google authentication
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  picture: 'https://example.com/profile.jpg',
  googleId: '123456789'
};

// Function to test the Google authentication API
async function testGoogleAuth() {
  console.log('Testing Google authentication API...');
  console.log('API URL:', process.env.PRODUCTION_API_URL || 'https://api.bahaycebu-properties.com');
  console.log('Test user:', testUser);
  
  try {
    // Make a request to the Google authentication API
    const response = await fetch(`${process.env.PRODUCTION_API_URL || 'https://api.bahaycebu-properties.com'}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    // Get the response data
    const data = await response.json();
    
    // Check if the response is successful
    if (response.ok) {
      console.log('Google authentication successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error('Google authentication failed!');
      console.error('Response:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('Error testing Google authentication:', error);
    return false;
  }
}

// Run the test
testGoogleAuth()
  .then(success => {
    if (success) {
      console.log('Google authentication test completed successfully.');
    } else {
      console.log('Google authentication test failed.');
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });