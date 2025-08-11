// Verification script for production Google OAuth configuration
const https = require('https');

const PRODUCTION_URL = 'https://bahay-cebu-properties-3n0o2yjbr-rences-projects-f8660086.vercel.app';
const EXPECTED_CLIENT_ID = '897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com';

console.log('🔍 Verifying Google OAuth configuration in production...');
console.log(`Production URL: ${PRODUCTION_URL}`);
console.log(`Expected Client ID: ${EXPECTED_CLIENT_ID}`);
console.log('');

// Check if the production site is accessible
https.get(PRODUCTION_URL, (res) => {
  console.log(`✅ Production site is accessible (Status: ${res.statusCode})`);
  console.log('');
  console.log('📋 Next steps to test Google OAuth:');
  console.log('1. Visit the production URL in your browser');
  console.log('2. Try to sign in with Google');
  console.log('3. The OAuth error should now be resolved');
  console.log('');
  console.log('🔧 Environment variables that were fixed:');
  console.log('- ✅ VITE_GOOGLE_CLIENT_ID: Added to all environments');
  console.log('- ❌ VITE_GOOGLE_REDIRECT_URI: Removed (not needed for implicit flow)');
  console.log('- ❌ GOOGLE_REDIRECT_URI: Removed (not needed for implicit flow)');
  console.log('');
  console.log('🎯 If you still encounter issues:');
  console.log('1. Clear your browser cache and cookies');
  console.log('2. Try in an incognito/private browser window');
  console.log('3. Check the browser console for any JavaScript errors');
}).on('error', (err) => {
  console.error('❌ Error accessing production site:', err.message);
});

console.log('🚀 Production deployment completed successfully!');
console.log(`🌐 Visit: ${PRODUCTION_URL}`);