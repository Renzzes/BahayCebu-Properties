// Script to check Vercel environment variables
const { execSync } = require('child_process');

console.log('🔍 Checking Vercel Environment Variables...');
console.log('=' .repeat(60));

try {
  // Check if Vercel CLI is installed
  console.log('\n📋 Vercel CLI Status:');
  try {
    const vercelVersion = execSync('vercel --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Vercel CLI installed: ${vercelVersion}`);
  } catch (error) {
    console.log('❌ Vercel CLI not installed. Install with: npm i -g vercel');
    process.exit(1);
  }

  // List environment variables
  console.log('\n📋 Current Environment Variables:');
  const envList = execSync('vercel env ls', { encoding: 'utf8' });
  console.log(envList);

  console.log('\n🎯 Required Variables for Google OAuth:');
  console.log('✅ VITE_GOOGLE_CLIENT_ID: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
  console.log('✅ GOOGLE_CLIENT_ID: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
  console.log('✅ GOOGLE_CLIENT_SECRET: (should be set)');
  console.log('❌ VITE_GOOGLE_REDIRECT_URI: (should NOT be set)');
  console.log('❌ GOOGLE_REDIRECT_URI: (should NOT be set)');

  console.log('\n🔧 Commands to fix missing variables:');
  console.log('vercel env add VITE_GOOGLE_CLIENT_ID');
  console.log('# Enter: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
  console.log('# Select: Production, Preview, Development');
  
  console.log('\nvercel env add GOOGLE_CLIENT_ID');
  console.log('# Enter: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
  console.log('# Select: Production, Preview, Development');

  console.log('\n🔧 Commands to remove problematic variables:');
  console.log('vercel env rm VITE_GOOGLE_REDIRECT_URI');
  console.log('vercel env rm GOOGLE_REDIRECT_URI');

  console.log('\n🚀 After making changes, redeploy:');
  console.log('vercel --prod');

} catch (error) {
  console.error('❌ Error checking Vercel environment:', error.message);
  
  if (error.message.includes('not found') || error.message.includes('command not found')) {
    console.log('\n💡 Vercel CLI not found. Install it first:');
    console.log('npm install -g vercel');
    console.log('vercel login');
  } else if (error.message.includes('not linked')) {
    console.log('\n💡 Project not linked to Vercel. Link it first:');
    console.log('vercel link');
  }
}

console.log('\n' + '=' .repeat(60));
console.log('🎯 Next Steps:');
console.log('1. Ensure VITE_GOOGLE_CLIENT_ID is set in Vercel');
console.log('2. Remove any REDIRECT_URI variables');
console.log('3. Redeploy the application');
console.log('4. Test Google OAuth in production');
console.log('=' .repeat(60));