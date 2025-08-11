/**
 * Comprehensive OAuth Diagnostic Script
 * This script will help identify why Google OAuth is still failing in production
 */

const https = require('https');
const http = require('http');

const CLIENT_ID = '897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com';
const PRODUCTION_URL = 'https://bahaycebu-properties.com';

console.log('🔍 GOOGLE OAUTH DIAGNOSTIC REPORT');
console.log('='.repeat(50));
console.log(`Production URL: ${PRODUCTION_URL}`);
console.log(`Client ID: ${CLIENT_ID}`);
console.log('='.repeat(50));

// Function to make HTTP requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });
        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function checkProductionSite() {
    console.log('\n1. 🌐 CHECKING PRODUCTION SITE ACCESS');
    console.log('-'.repeat(30));
    
    try {
        const response = await makeRequest(PRODUCTION_URL);
        console.log(`✅ Site accessible: ${response.statusCode}`);
        
        // Check if the site contains the Google Client ID
        if (response.data.includes(CLIENT_ID)) {
            console.log('✅ Google Client ID found in HTML');
        } else {
            console.log('❌ Google Client ID NOT found in HTML');
            console.log('   This could indicate environment variable issues');
        }
        
        // Check for Google API script
        if (response.data.includes('accounts.google.com/gsi/client')) {
            console.log('✅ Google Identity Services script loaded');
        } else {
            console.log('❌ Google Identity Services script NOT found');
        }
        
    } catch (error) {
        console.log(`❌ Site not accessible: ${error.message}`);
    }
}

async function checkGoogleOAuthEndpoint() {
    console.log('\n2. 🔐 CHECKING GOOGLE OAUTH ENDPOINT');
    console.log('-'.repeat(30));
    
    // Test Google's OAuth discovery endpoint
    const discoveryUrl = 'https://accounts.google.com/.well-known/openid_configuration';
    
    try {
        const response = await makeRequest(discoveryUrl);
        if (response.statusCode === 200) {
            console.log('✅ Google OAuth service is operational');
            const config = JSON.parse(response.data);
            console.log(`   Authorization endpoint: ${config.authorization_endpoint}`);
        } else {
            console.log(`❌ Google OAuth service issue: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ Cannot reach Google OAuth: ${error.message}`);
    }
}

function checkClientIdFormat() {
    console.log('\n3. 🆔 CHECKING CLIENT ID FORMAT');
    console.log('-'.repeat(30));
    
    const clientIdPattern = /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/;
    
    if (clientIdPattern.test(CLIENT_ID)) {
        console.log('✅ Client ID format is valid');
    } else {
        console.log('❌ Client ID format is invalid');
    }
    
    console.log(`   Client ID: ${CLIENT_ID}`);
    console.log(`   Length: ${CLIENT_ID.length} characters`);
}

function generateTestUrl() {
    console.log('\n4. 🧪 OAUTH TEST URL GENERATION');
    console.log('-'.repeat(30));
    
    const testUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(CLIENT_ID)}&` +
        `response_type=token&` +
        `scope=openid%20email%20profile&` +
        `redirect_uri=${encodeURIComponent(PRODUCTION_URL)}&` +
        `nonce=test123`;
    
    console.log('🔗 Manual test URL (copy and paste in browser):');
    console.log(testUrl);
    console.log('\n📝 Expected behavior:');
    console.log('   - Should show Google account selection');
    console.log('   - Should NOT show "Error 401: invalid_client"');
    console.log('   - If error occurs, note the exact error message');
}

function provideTroubleshootingSteps() {
    console.log('\n5. 🛠️  TROUBLESHOOTING CHECKLIST');
    console.log('-'.repeat(30));
    
    console.log('\n📋 Google Cloud Console Verification:');
    console.log('   1. Go to: https://console.cloud.google.com/apis/credentials');
    console.log('   2. Find client ID: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
    console.log('   3. Verify "Authorized JavaScript origins" contains:');
    console.log('      ✓ https://bahaycebu-properties.com');
    console.log('      ✓ http://localhost:8082');
    console.log('      ✓ http://localhost:5173');
    console.log('   4. Verify "Authorized redirect URIs" is COMPLETELY EMPTY');
    console.log('   5. Click SAVE and wait 10 minutes');
    
    console.log('\n🧹 Browser Cache Clearing:');
    console.log('   1. Open Developer Tools (F12)');
    console.log('   2. Right-click refresh button → "Empty Cache and Hard Reload"');
    console.log('   3. Or use Incognito/Private browsing mode');
    
    console.log('\n🔄 If Still Not Working:');
    console.log('   1. Check if domain DNS is properly configured');
    console.log('   2. Verify SSL certificate is valid');
    console.log('   3. Test from different networks/devices');
    console.log('   4. Check browser console for JavaScript errors');
}

async function runDiagnostics() {
    console.log('Starting comprehensive OAuth diagnostics...\n');
    
    await checkProductionSite();
    await checkGoogleOAuthEndpoint();
    checkClientIdFormat();
    generateTestUrl();
    provideTroubleshootingSteps();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 NEXT STEPS:');
    console.log('1. Review the checklist above');
    console.log('2. Test the manual URL in an incognito window');
    console.log('3. If issues persist, the problem is likely in Google Cloud Console configuration');
    console.log('='.repeat(50));
}

// Run diagnostics
runDiagnostics().catch(console.error);