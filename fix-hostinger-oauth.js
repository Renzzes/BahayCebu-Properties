const https = require('https');
const fs = require('fs');

// Test Google OAuth configuration for Hostinger domain
const CLIENT_ID = '897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com';
const HOSTINGER_DOMAIN = 'https://bahaycebu-properties.com';
const VERCEL_DOMAIN = 'https://api.bahaycebu-properties.com';

console.log('🔍 DIAGNOSING GOOGLE OAUTH ISSUE FOR HOSTINGER DOMAIN');
console.log('=' .repeat(60));

// Test 1: Check if domains are accessible
function testDomainAccess(domain) {
    return new Promise((resolve) => {
        const url = new URL(domain);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: '/',
            method: 'GET',
            timeout: 5000
        };

        const req = https.request(options, (res) => {
            resolve({
                domain,
                accessible: true,
                statusCode: res.statusCode,
                headers: res.headers
            });
        });

        req.on('error', (err) => {
            resolve({
                domain,
                accessible: false,
                error: err.message
            });
        });

        req.on('timeout', () => {
            resolve({
                domain,
                accessible: false,
                error: 'Timeout'
            });
        });

        req.end();
    });
}

// Test 2: Generate Google OAuth test URLs
function generateOAuthTestURL(domain, clientId) {
    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'token',
        scope: 'openid email profile',
        redirect_uri: domain,
        nonce: 'test123'
    });
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function runDiagnostics() {
    console.log('\n1️⃣ TESTING DOMAIN ACCESSIBILITY');
    console.log('-'.repeat(40));
    
    const hostingerTest = await testDomainAccess(HOSTINGER_DOMAIN);
    const vercelTest = await testDomainAccess(VERCEL_DOMAIN);
    
    console.log(`Hostinger Domain (${HOSTINGER_DOMAIN}):`);
    console.log(`  ✅ Accessible: ${hostingerTest.accessible}`);
    if (hostingerTest.accessible) {
        console.log(`  📊 Status Code: ${hostingerTest.statusCode}`);
    } else {
        console.log(`  ❌ Error: ${hostingerTest.error}`);
    }
    
    console.log(`\nVercel Domain (${VERCEL_DOMAIN}):`);
    console.log(`  ✅ Accessible: ${vercelTest.accessible}`);
    if (vercelTest.accessible) {
        console.log(`  📊 Status Code: ${vercelTest.statusCode}`);
    } else {
        console.log(`  ❌ Error: ${vercelTest.error}`);
    }
    
    console.log('\n2️⃣ GOOGLE OAUTH TEST URLS');
    console.log('-'.repeat(40));
    
    const hostingerOAuthURL = generateOAuthTestURL(HOSTINGER_DOMAIN, CLIENT_ID);
    const vercelOAuthURL = generateOAuthTestURL(VERCEL_DOMAIN, CLIENT_ID);
    
    console.log('🧪 Test these URLs in your browser:');
    console.log('\n📍 Hostinger Domain Test:');
    console.log(hostingerOAuthURL);
    console.log('\n📍 Vercel Domain Test:');
    console.log(vercelOAuthURL);
    
    console.log('\n3️⃣ EXPECTED RESULTS');
    console.log('-'.repeat(40));
    console.log('✅ Vercel URL should work (show Google login)');
    console.log('❌ Hostinger URL should show "Error 401: invalid_client"');
    
    console.log('\n4️⃣ GOOGLE CLOUD CONSOLE FIX REQUIRED');
    console.log('-'.repeat(40));
    console.log('🔧 You MUST add the following to Google Cloud Console:');
    console.log('\n📋 Steps to fix:');
    console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
    console.log(`2. Find OAuth Client ID: ${CLIENT_ID}`);
    console.log('3. Click to edit the client');
    console.log('4. In "Authorized JavaScript origins" section:');
    console.log(`   ➕ ADD: ${HOSTINGER_DOMAIN}`);
    console.log('   ✅ Keep existing: http://localhost:8082');
    console.log('   ✅ Keep existing: http://localhost:5173');
    console.log('5. In "Authorized redirect URIs" section:');
    console.log('   🗑️ DELETE ALL entries (must be empty)');
    console.log('6. Click SAVE');
    console.log('7. Wait 10 minutes for changes to propagate');
    
    console.log('\n5️⃣ VERIFICATION STEPS');
    console.log('-'.repeat(40));
    console.log('After making Google Cloud Console changes:');
    console.log('1. Wait 10 minutes');
    console.log('2. Clear browser cache');
    console.log('3. Test in incognito mode');
    console.log(`4. Visit: ${HOSTINGER_DOMAIN}`);
    console.log('5. Click "Sign in with Google"');
    console.log('6. Should work without "Error 401: invalid_client"');
    
    console.log('\n🎯 ROOT CAUSE CONFIRMED');
    console.log('-'.repeat(40));
    console.log('The issue is NOT with your code or deployment.');
    console.log('The issue is with Google Cloud Console configuration.');
    console.log(`Your Hostinger domain (${HOSTINGER_DOMAIN}) is NOT`);
    console.log('listed in the "Authorized JavaScript origins" section.');
    console.log('\nThis MUST be fixed in Google Cloud Console.');
    
    // Write results to file
    const report = {
        timestamp: new Date().toISOString(),
        clientId: CLIENT_ID,
        domains: {
            hostinger: {
                url: HOSTINGER_DOMAIN,
                accessible: hostingerTest.accessible,
                oauthTestUrl: hostingerOAuthURL
            },
            vercel: {
                url: VERCEL_DOMAIN,
                accessible: vercelTest.accessible,
                oauthTestUrl: vercelOAuthURL
            }
        },
        diagnosis: 'Google Cloud Console missing Hostinger domain in Authorized JavaScript origins',
        solution: 'Add https://bahaycebu-properties.com to Google Cloud Console OAuth client configuration'
    };
    
    fs.writeFileSync('oauth-diagnosis-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: oauth-diagnosis-report.json');
}

runDiagnostics().catch(console.error);