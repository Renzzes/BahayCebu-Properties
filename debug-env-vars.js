/**
 * Debug Environment Variables
 * This script will help us understand what's happening with environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUGGING ENVIRONMENT VARIABLES');
console.log('='.repeat(50));

// Check if .env files exist
function checkEnvFiles() {
    console.log('\n📁 CHECKING .ENV FILES');
    console.log('-'.repeat(30));
    
    const envFiles = ['.env', '.env.local', '.env.production', '.env.production.local'];
    
    envFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${file} exists`);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                if (content.includes('VITE_GOOGLE_CLIENT_ID')) {
                    console.log(`   📝 Contains VITE_GOOGLE_CLIENT_ID`);
                } else {
                    console.log(`   ❌ Does NOT contain VITE_GOOGLE_CLIENT_ID`);
                }
            } catch (error) {
                console.log(`   ❌ Error reading file: ${error.message}`);
            }
        } else {
            console.log(`❌ ${file} does not exist`);
        }
    });
}

// Check current process environment
function checkProcessEnv() {
    console.log('\n🌍 CHECKING PROCESS ENVIRONMENT');
    console.log('-'.repeat(30));
    
    const googleEnvVars = Object.keys(process.env)
        .filter(key => key.includes('GOOGLE') || key.includes('VITE'))
        .sort();
    
    if (googleEnvVars.length > 0) {
        console.log('✅ Found Google/Vite related environment variables:');
        googleEnvVars.forEach(key => {
            const value = process.env[key];
            if (key.includes('SECRET') || key.includes('PASSWORD')) {
                console.log(`   ${key}: [HIDDEN]`);
            } else if (value && value.length > 50) {
                console.log(`   ${key}: ${value.substring(0, 20)}...${value.substring(value.length - 10)}`);
            } else {
                console.log(`   ${key}: ${value || 'NOT SET'}`);
            }
        });
    } else {
        console.log('❌ No Google/Vite related environment variables found');
    }
}

// Test Vite environment loading
function testViteEnvLoading() {
    console.log('\n⚡ TESTING VITE ENVIRONMENT LOADING');
    console.log('-'.repeat(30));
    
    try {
        // Try to load environment variables the same way Vite does
        const { loadEnv } = require('vite');
        
        const modes = ['development', 'production'];
        
        modes.forEach(mode => {
            console.log(`\n🔧 Testing mode: ${mode}`);
            try {
                const env = loadEnv(mode, process.cwd(), '');
                
                if (env.VITE_GOOGLE_CLIENT_ID) {
                    console.log(`   ✅ VITE_GOOGLE_CLIENT_ID loaded: ${env.VITE_GOOGLE_CLIENT_ID.substring(0, 20)}...`);
                } else {
                    console.log(`   ❌ VITE_GOOGLE_CLIENT_ID NOT loaded`);
                }
                
                if (env.VITE_API_URL) {
                    console.log(`   ✅ VITE_API_URL loaded: ${env.VITE_API_URL}`);
                } else {
                    console.log(`   ❌ VITE_API_URL NOT loaded`);
                }
                
            } catch (error) {
                console.log(`   ❌ Error loading env for ${mode}: ${error.message}`);
            }
        });
        
    } catch (error) {
        console.log(`❌ Cannot load Vite: ${error.message}`);
        console.log('   This is expected if running outside of Vite context');
    }
}

// Check main.tsx file
function checkMainTsx() {
    console.log('\n📄 CHECKING MAIN.TSX FILE');
    console.log('-'.repeat(30));
    
    const mainTsxPath = path.join(process.cwd(), 'src', 'main.tsx');
    
    if (fs.existsSync(mainTsxPath)) {
        console.log('✅ main.tsx exists');
        try {
            const content = fs.readFileSync(mainTsxPath, 'utf8');
            if (content.includes('import.meta.env.VITE_GOOGLE_CLIENT_ID')) {
                console.log('✅ Uses import.meta.env.VITE_GOOGLE_CLIENT_ID');
            } else {
                console.log('❌ Does NOT use import.meta.env.VITE_GOOGLE_CLIENT_ID');
            }
            
            if (content.includes('GoogleOAuthProvider')) {
                console.log('✅ Uses GoogleOAuthProvider');
            } else {
                console.log('❌ Does NOT use GoogleOAuthProvider');
            }
        } catch (error) {
            console.log(`❌ Error reading main.tsx: ${error.message}`);
        }
    } else {
        console.log('❌ main.tsx does not exist');
    }
}

// Provide recommendations
function provideRecommendations() {
    console.log('\n🛠️  RECOMMENDATIONS');
    console.log('-'.repeat(30));
    
    console.log('\n1️⃣  Create a local .env file for testing:');
    console.log('   echo "VITE_GOOGLE_CLIENT_ID=897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com" > .env');
    
    console.log('\n2️⃣  Test locally:');
    console.log('   npm run dev');
    console.log('   # Check if Google login works locally');
    
    console.log('\n3️⃣  If local works but production doesn\'t:');
    console.log('   # The issue is with Vercel environment variable configuration');
    console.log('   # Double-check that VITE_GOOGLE_CLIENT_ID is set for Production environment');
    
    console.log('\n4️⃣  Alternative approach - hardcode temporarily:');
    console.log('   # In main.tsx, temporarily replace:');
    console.log('   # clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}');
    console.log('   # with:');
    console.log('   # clientId="897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com"');
    console.log('   # This will confirm if the issue is environment variables or something else');
}

async function runDebug() {
    console.log('Starting environment variable debugging...\n');
    
    checkEnvFiles();
    checkProcessEnv();
    testViteEnvLoading();
    checkMainTsx();
    provideRecommendations();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 DEBUG COMPLETE');
    console.log('Review the output above to identify the issue.');
    console.log('='.repeat(50));
}

// Run debug
runDebug().catch(console.error);