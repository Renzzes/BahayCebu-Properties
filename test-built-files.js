/**
 * Test Built Files for Google Client ID
 * This script will check if the Google Client ID is present in the built files
 */

const https = require('https');
const http = require('http');

console.log('🔍 TESTING BUILT FILES FOR GOOGLE CLIENT ID');
console.log('='.repeat(60));

// Test URLs
const testUrls = [
    'https://bahaycebu-properties.com',
    'https://bahay-cebu-properties-jcet9b63i-rences-projects-f8660086.vercel.app'
];

const googleClientId = '897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com';

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function testSite(baseUrl) {
    console.log(`\n🌐 TESTING: ${baseUrl}`);
    console.log('-'.repeat(50));
    
    try {
        // Get the main HTML
        const mainResponse = await makeRequest(baseUrl);
        
        if (mainResponse.statusCode !== 200) {
            console.log(`❌ Site not accessible: ${mainResponse.statusCode}`);
            return;
        }
        
        console.log(`✅ Site accessible: ${mainResponse.statusCode}`);
        
        // Check for Google Client ID in HTML
        if (mainResponse.data.includes(googleClientId)) {
            console.log('✅ Google Client ID found in HTML!');
        } else {
            console.log('❌ Google Client ID NOT found in HTML');
        }
        
        // Check for Google services script
        if (mainResponse.data.includes('accounts.google.com/gsi/client') || 
            mainResponse.data.includes('googleapis.com')) {
            console.log('✅ Google services script found');
        } else {
            console.log('❌ Google services script NOT found');
        }
        
        // Extract JavaScript file URLs from HTML
        const jsFileRegex = /src="([^"]*\.js[^"]*)"/g;
        const jsFiles = [];
        let match;
        
        while ((match = jsFileRegex.exec(mainResponse.data)) !== null) {
            let jsUrl = match[1];
            if (jsUrl.startsWith('/')) {
                jsUrl = baseUrl + jsUrl;
            } else if (!jsUrl.startsWith('http')) {
                jsUrl = baseUrl + '/' + jsUrl;
            }
            jsFiles.push(jsUrl);
        }
        
        console.log(`\n📄 Found ${jsFiles.length} JavaScript files:`);
        
        // Test each JavaScript file for Google Client ID
        for (const jsUrl of jsFiles) {
            console.log(`\n🔍 Checking: ${jsUrl.split('/').pop()}`);
            
            try {
                const jsResponse = await makeRequest(jsUrl);
                
                if (jsResponse.statusCode === 200) {
                    if (jsResponse.data.includes(googleClientId)) {
                        console.log('   ✅ Google Client ID found in this file!');
                    } else if (jsResponse.data.includes('GoogleOAuthProvider')) {
                        console.log('   ⚠️  GoogleOAuthProvider found but no client ID');
                    } else {
                        console.log('   ❌ No Google-related code found');
                    }
                    
                    // Check file size
                    const sizeKB = Math.round(jsResponse.data.length / 1024);
                    console.log(`   📊 File size: ${sizeKB} KB`);
                } else {
                    console.log(`   ❌ Failed to load: ${jsResponse.statusCode}`);
                }
            } catch (error) {
                console.log(`   ❌ Error loading JS file: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.log(`❌ Error testing site: ${error.message}`);
    }
}

async function runTests() {
    console.log('Starting built files test...\n');
    
    for (const url of testUrls) {
        await testSite(url);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ANALYSIS COMPLETE');
    console.log('\n💡 WHAT TO LOOK FOR:');
    console.log('✅ If Google Client ID is found in JS files = Environment variables working');
    console.log('❌ If Google Client ID is NOT found = Environment variable issue');
    console.log('⚠️  If GoogleOAuthProvider found but no client ID = Bundling issue');
    console.log('\n🛠️  NEXT STEPS:');
    console.log('1. If client ID not found: Check Vercel environment variables');
    console.log('2. If found but OAuth still fails: Check Google Cloud Console settings');
    console.log('3. If GoogleOAuthProvider without client ID: Check build process');
    console.log('='.repeat(60));
}

// Run the tests
runTests().catch(console.error);