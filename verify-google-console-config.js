const https = require('https');
const fs = require('fs');

// Comprehensive Google OAuth Configuration Verification
const CLIENT_ID = '897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com';
const HOSTINGER_DOMAIN = 'https://bahaycebu-properties.com';
const VERCEL_DOMAIN = 'https://api.bahaycebu-properties.com';

console.log('🔍 COMPREHENSIVE GOOGLE OAUTH VERIFICATION');
console.log('=' .repeat(60));
console.log(`Client ID: ${CLIENT_ID}`);
console.log(`Hostinger Domain: ${HOSTINGER_DOMAIN}`);
console.log(`Vercel Domain: ${VERCEL_DOMAIN}`);

// Test OAuth URLs directly
function testOAuthURL(domain, description) {
    return new Promise((resolve) => {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            response_type: 'token',
            scope: 'openid email profile',
            redirect_uri: domain,
            nonce: 'test123'
        });
        
        const oauthURL = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        
        console.log(`\n🧪 Testing ${description}:`);
        console.log(`URL: ${oauthURL}`);
        
        const url = new URL(oauthURL);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname + url.search,
            method: 'GET',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const isError = data.includes('Error 401') || data.includes('invalid_client') || data.includes('OAuth client was not found');
                const hasGoogleLogin = data.includes('Sign in') || data.includes('Choose an account') || data.includes('accounts.google.com');
                
                console.log(`  Status: ${res.statusCode}`);
                console.log(`  Has Error 401: ${isError ? '❌ YES' : '✅ NO'}`);
                console.log(`  Has Google Login: ${hasGoogleLogin ? '✅ YES' : '❌ NO'}`);
                
                if (isError) {
                    console.log(`  🚨 ERROR DETECTED: OAuth client not found for ${domain}`);
                }
                
                resolve({
                    domain,
                    description,
                    statusCode: res.statusCode,
                    hasError: isError,
                    hasGoogleLogin: hasGoogleLogin,
                    working: !isError && hasGoogleLogin
                });
            });
        });

        req.on('error', (err) => {
            console.log(`  ❌ Request Error: ${err.message}`);
            resolve({
                domain,
                description,
                error: err.message,
                working: false
            });
        });

        req.on('timeout', () => {
            console.log(`  ⏰ Request Timeout`);
            resolve({
                domain,
                description,
                error: 'Timeout',
                working: false
            });
        });

        req.end();
    });
}

// Check domain accessibility
function checkDomainAccess(domain) {
    return new Promise((resolve) => {
        const url = new URL(domain);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: '/',
            method: 'HEAD',
            timeout: 5000
        };

        const req = https.request(options, (res) => {
            resolve({
                domain,
                accessible: true,
                statusCode: res.statusCode
            });
        });

        req.on('error', () => {
            resolve({
                domain,
                accessible: false
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

async function runComprehensiveTest() {
    console.log('\n1️⃣ DOMAIN ACCESSIBILITY TEST');
    console.log('-'.repeat(40));
    
    const hostingerAccess = await checkDomainAccess(HOSTINGER_DOMAIN);
    const vercelAccess = await checkDomainAccess(VERCEL_DOMAIN);
    
    console.log(`Hostinger (${HOSTINGER_DOMAIN}): ${hostingerAccess.accessible ? '✅ Accessible' : '❌ Not Accessible'}`);
    console.log(`Vercel (${VERCEL_DOMAIN}): ${vercelAccess.accessible ? '✅ Accessible' : '❌ Not Accessible'}`);
    
    console.log('\n2️⃣ GOOGLE OAUTH DIRECT TESTS');
    console.log('-'.repeat(40));
    
    const hostingerOAuth = await testOAuthURL(HOSTINGER_DOMAIN, 'Hostinger Domain');
    const vercelOAuth = await testOAuthURL(VERCEL_DOMAIN, 'Vercel Domain');
    
    console.log('\n3️⃣ TEST RESULTS SUMMARY');
    console.log('-'.repeat(40));
    
    console.log(`\n📊 Hostinger Domain (${HOSTINGER_DOMAIN}):`);
    console.log(`  OAuth Working: ${hostingerOAuth.working ? '✅ YES' : '❌ NO'}`);
    if (!hostingerOAuth.working) {
        console.log(`  🚨 Issue: OAuth client not configured for this domain`);
    }
    
    console.log(`\n📊 Vercel Domain (${VERCEL_DOMAIN}):`);
    console.log(`  OAuth Working: ${vercelOAuth.working ? '✅ YES' : '❌ NO'}`);
    
    console.log('\n4️⃣ DIAGNOSIS AND NEXT STEPS');
    console.log('-'.repeat(40));
    
    if (!hostingerOAuth.working && vercelOAuth.working) {
        console.log('🎯 CONFIRMED ISSUE: Google Cloud Console Configuration');
        console.log('\n❌ Problem: Your Hostinger domain is STILL not properly configured');
        console.log('\n🔧 REQUIRED ACTIONS:');
        console.log('\n1. Double-check Google Cloud Console:');
        console.log('   - Go to: https://console.cloud.google.com/apis/credentials');
        console.log(`   - Find: ${CLIENT_ID}`);
        console.log('   - Verify "Authorized JavaScript origins" contains:');
        console.log(`     ✅ ${HOSTINGER_DOMAIN}`);
        console.log('     ✅ http://localhost:8082');
        console.log('     ✅ http://localhost:5173');
        console.log('\n2. Verify "Authorized redirect URIs" is COMPLETELY EMPTY');
        console.log('\n3. If settings look correct, try these steps:');
        console.log('   a) Remove the Hostinger domain from JavaScript origins');
        console.log('   b) Save the configuration');
        console.log('   c) Wait 2 minutes');
        console.log('   d) Add the Hostinger domain back');
        console.log('   e) Save again');
        console.log('   f) Wait 15 minutes for propagation');
        console.log('\n4. Alternative: Create a NEW OAuth client specifically for production');
        
    } else if (hostingerOAuth.working && vercelOAuth.working) {
        console.log('🎉 SUCCESS: Both domains are working!');
        console.log('\nIf you\'re still seeing errors, try:');
        console.log('1. Clear browser cache completely');
        console.log('2. Test in incognito/private mode');
        console.log('3. Try different browsers');
        console.log('4. Check for browser extensions blocking OAuth');
        
    } else if (!hostingerOAuth.working && !vercelOAuth.working) {
        console.log('🚨 CRITICAL: Both domains are failing!');
        console.log('\nThis suggests:');
        console.log('1. Wrong Client ID being used');
        console.log('2. OAuth client was deleted or disabled');
        console.log('3. Google Cloud project issues');
        console.log('\nVerify your Client ID and Google Cloud project status.');
    }
    
    console.log('\n5️⃣ MANUAL VERIFICATION URLS');
    console.log('-'.repeat(40));
    console.log('\n🧪 Test these URLs manually in your browser:');
    console.log('\n📍 Hostinger Test (should work after fix):');
    console.log(hostingerOAuth.domain ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(HOSTINGER_DOMAIN)}&nonce=test123` : 'Error generating URL');
    console.log('\n📍 Vercel Test (should work):');
    console.log(vercelOAuth.domain ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(VERCEL_DOMAIN)}&nonce=test123` : 'Error generating URL');
    
    // Save detailed report
    const report = {
        timestamp: new Date().toISOString(),
        clientId: CLIENT_ID,
        testResults: {
            hostinger: {
                domain: HOSTINGER_DOMAIN,
                accessible: hostingerAccess.accessible,
                oauthWorking: hostingerOAuth.working,
                hasError: hostingerOAuth.hasError,
                statusCode: hostingerOAuth.statusCode
            },
            vercel: {
                domain: VERCEL_DOMAIN,
                accessible: vercelAccess.accessible,
                oauthWorking: vercelOAuth.working,
                hasError: vercelOAuth.hasError,
                statusCode: vercelOAuth.statusCode
            }
        },
        diagnosis: hostingerOAuth.working ? 'OAuth working on both domains' : 'Hostinger domain not configured in Google Cloud Console',
        nextSteps: hostingerOAuth.working ? 'Clear browser cache and test' : 'Update Google Cloud Console configuration'
    };
    
    fs.writeFileSync('comprehensive-oauth-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: comprehensive-oauth-report.json');
}

runComprehensiveTest().catch(console.error);

// Additional helper: Generate exact Google Cloud Console configuration
console.log('\n6️⃣ EXACT GOOGLE CLOUD CONSOLE CONFIGURATION');
console.log('-'.repeat(40));
console.log('\n📋 Copy this EXACT configuration to Google Cloud Console:');
console.log('\n🔧 Authorized JavaScript origins (add these exactly):');
console.log('https://bahaycebu-properties.com');
console.log('http://localhost:8082');
console.log('http://localhost:5173');
console.log('\n🔧 Authorized redirect URIs:');
console.log('(LEAVE COMPLETELY EMPTY - delete all entries)');
console.log('\n⚠️ IMPORTANT: Make sure there are NO extra spaces, NO trailing slashes!');
console.log('The domain must be EXACTLY: https://bahaycebu-properties.com');
console.log('NOT: https://bahaycebu-properties.com/');
console.log('NOT: https://www.bahaycebu-properties.com');
console.log('NOT: http://bahaycebu-properties.com');