/**
 * Test Fresh Deployment - Google OAuth Verification
 * This script will test the newly deployed production site
 */

const https = require('https');

const PRODUCTION_URL = 'https://bahaycebu-properties.com';
const VERCEL_URL = 'https://bahay-cebu-properties-md2f21ssv-rences-projects-f8660086.vercel.app';
const CLIENT_ID = '897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com';

console.log('🚀 TESTING FRESH DEPLOYMENT');
console.log('='.repeat(50));
console.log(`Production Domain: ${PRODUCTION_URL}`);
console.log(`Vercel URL: ${VERCEL_URL}`);
console.log(`Expected Client ID: ${CLIENT_ID}`);
console.log('='.repeat(50));

// Function to make HTTP requests
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        }).on('error', reject);
    });
}

async function testSite(url, siteName) {
    console.log(`\n🌐 TESTING ${siteName}`);
    console.log('-'.repeat(30));
    
    try {
        const response = await makeRequest(url);
        console.log(`✅ Site accessible: ${response.statusCode}`);
        
        // Check if the site contains the Google Client ID
        if (response.data.includes(CLIENT_ID)) {
            console.log('✅ Google Client ID found in HTML');
            
            // Extract the context around the client ID
            const clientIdIndex = response.data.indexOf(CLIENT_ID);
            const start = Math.max(0, clientIdIndex - 100);
            const end = Math.min(response.data.length, clientIdIndex + CLIENT_ID.length + 100);
            const context = response.data.substring(start, end);
            console.log(`📄 Context: ...${context}...`);
        } else {
            console.log('❌ Google Client ID NOT found in HTML');
            console.log('   This indicates environment variable issues');
        }
        
        // Check for Google API script
        if (response.data.includes('accounts.google.com')) {
            console.log('✅ Google services script references found');
        } else {
            console.log('❌ Google services script NOT found');
        }
        
        // Check for React OAuth provider
        if (response.data.includes('GoogleOAuthProvider') || response.data.includes('google-oauth')) {
            console.log('✅ Google OAuth provider code found');
        } else {
            console.log('⚠️  Google OAuth provider code not clearly visible (may be bundled)');
        }
        
        return response.data.includes(CLIENT_ID);
        
    } catch (error) {
        console.log(`❌ Site not accessible: ${error.message}`);
        return false;
    }
}

function generateTestInstructions(workingSite) {
    console.log('\n🧪 MANUAL TESTING INSTRUCTIONS');
    console.log('-'.repeat(30));
    
    if (workingSite) {
        console.log('✅ Environment variables are properly configured!');
        console.log('\n📋 Next steps to test Google OAuth:');
        console.log('\n1️⃣  Clear browser cache completely:');
        console.log('   - Press Ctrl+Shift+Delete');
        console.log('   - Select "All time" and clear everything');
        console.log('   - Or use Incognito/Private browsing mode');
        
        console.log('\n2️⃣  Test the production site:');
        console.log(`   - Visit: ${PRODUCTION_URL}`);
        console.log('   - Click "Sign in with Google" button');
        console.log('   - Should show Google account selection');
        console.log('   - Should NOT show "Error 401: invalid_client"');
        
        console.log('\n3️⃣  If still getting errors:');
        console.log('   - Check Google Cloud Console configuration');
        console.log('   - Ensure JavaScript origins include: https://bahaycebu-properties.com');
        console.log('   - Ensure redirect URIs are EMPTY');
        console.log('   - Wait 10 minutes after any Google Console changes');
        
    } else {
        console.log('❌ Environment variables are still not working!');
        console.log('\n🛠️  Additional troubleshooting needed:');
        console.log('\n1️⃣  Check Vercel environment variables again:');
        console.log('   vercel env ls');
        console.log('\n2️⃣  Ensure VITE_GOOGLE_CLIENT_ID is set for Production');
        console.log('\n3️⃣  Try redeploying again:');
        console.log('   vercel --prod');
    }
}

function generateDirectTestURL() {
    console.log('\n🔗 DIRECT GOOGLE OAUTH TEST');
    console.log('-'.repeat(30));
    
    const testUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(CLIENT_ID)}&` +
        `response_type=token&` +
        `scope=openid%20email%20profile&` +
        `redirect_uri=${encodeURIComponent(PRODUCTION_URL)}&` +
        `nonce=test123`;
    
    console.log('🧪 Test this URL in a new incognito window:');
    console.log(testUrl);
    console.log('\n📝 Expected result:');
    console.log('   ✅ Google account selection page');
    console.log('   ❌ Should NOT show "Error 401: invalid_client"');
}

async function runTests() {
    console.log('Starting fresh deployment verification...\n');
    
    // Test both URLs
    const productionWorking = await testSite(PRODUCTION_URL, 'PRODUCTION DOMAIN');
    const vercelWorking = await testSite(VERCEL_URL, 'VERCEL DEPLOYMENT');
    
    const anyWorking = productionWorking || vercelWorking;
    
    generateTestInstructions(anyWorking);
    generateDirectTestURL();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 SUMMARY:');
    if (anyWorking) {
        console.log('✅ Google Client ID is now properly configured!');
        console.log('✅ Fresh deployment successful!');
        console.log('🧪 Test Google OAuth manually using the instructions above.');
    } else {
        console.log('❌ Google Client ID still not found in deployment.');
        console.log('🔧 Additional troubleshooting required.');
    }
    console.log('='.repeat(50));
}

// Run tests
runTests().catch(console.error);