/**
 * Detailed Vercel Environment Variable Checker
 * This script will help verify if VITE_GOOGLE_CLIENT_ID is properly set in Vercel
 */

const { execSync } = require('child_process');

console.log('🔍 VERCEL ENVIRONMENT VARIABLES CHECK');
console.log('='.repeat(50));

function runCommand(command, description) {
    console.log(`\n📋 ${description}`);
    console.log('-'.repeat(30));
    
    try {
        const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
        console.log(output.trim());
        return output.trim();
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        if (error.stdout) {
            console.log('Output:', error.stdout.toString());
        }
        if (error.stderr) {
            console.log('Error details:', error.stderr.toString());
        }
        return null;
    }
}

function checkVercelAuth() {
    console.log('\n1. 🔐 CHECKING VERCEL AUTHENTICATION');
    console.log('-'.repeat(30));
    
    const whoami = runCommand('vercel whoami', 'Checking Vercel login status');
    if (!whoami) {
        console.log('\n❌ You are not logged into Vercel!');
        console.log('Please run: vercel login');
        return false;
    }
    
    console.log(`✅ Logged in as: ${whoami}`);
    return true;
}

function listProjects() {
    console.log('\n2. 📁 LISTING VERCEL PROJECTS');
    console.log('-'.repeat(30));
    
    runCommand('vercel projects list', 'Available Vercel projects');
}

function checkEnvironmentVariables() {
    console.log('\n3. 🌍 CHECKING ENVIRONMENT VARIABLES');
    console.log('-'.repeat(30));
    
    console.log('\n📋 All Environment Variables:');
    runCommand('vercel env ls', 'Listing all environment variables');
    
    console.log('\n🔍 Checking specific Google OAuth variables:');
    
    // Check for VITE_GOOGLE_CLIENT_ID
    console.log('\n🔑 VITE_GOOGLE_CLIENT_ID:');
    const viteClientId = runCommand('vercel env ls | findstr VITE_GOOGLE_CLIENT_ID', 'Checking VITE_GOOGLE_CLIENT_ID');
    
    if (!viteClientId || viteClientId.includes('No environment variables found')) {
        console.log('❌ VITE_GOOGLE_CLIENT_ID is NOT set in Vercel!');
        console.log('\n🛠️  TO FIX THIS:');
        console.log('1. Run: vercel env add VITE_GOOGLE_CLIENT_ID');
        console.log('2. Enter value: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
        console.log('3. Select environments: Production, Preview, Development');
        console.log('4. Redeploy: vercel --prod');
    } else {
        console.log('✅ VITE_GOOGLE_CLIENT_ID is set');
    }
}

function checkDeployments() {
    console.log('\n4. 🚀 CHECKING RECENT DEPLOYMENTS');
    console.log('-'.repeat(30));
    
    runCommand('vercel deployments list --limit 5', 'Recent deployments');
}

function provideFix() {
    console.log('\n5. 🛠️  COMPLETE FIX INSTRUCTIONS');
    console.log('-'.repeat(30));
    
    console.log('\n📝 Step-by-step fix:');
    console.log('\n1️⃣  Add missing environment variable:');
    console.log('   vercel env add VITE_GOOGLE_CLIENT_ID');
    console.log('   Value: 897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com');
    console.log('   Environments: Production, Preview, Development (select all)');
    
    console.log('\n2️⃣  Verify the variable was added:');
    console.log('   vercel env ls');
    
    console.log('\n3️⃣  Redeploy to production:');
    console.log('   vercel --prod');
    
    console.log('\n4️⃣  Wait for deployment and test:');
    console.log('   - Wait 2-3 minutes for deployment to complete');
    console.log('   - Clear browser cache');
    console.log('   - Test Google login on https://bahaycebu-properties.com');
    
    console.log('\n🔍 Verification:');
    console.log('   - View page source and search for "897144997266"');
    console.log('   - Should find the client ID in the HTML');
    console.log('   - Google login should work without "invalid_client" error');
}

async function runAllChecks() {
    console.log('Starting comprehensive Vercel environment check...\n');
    
    const isLoggedIn = checkVercelAuth();
    if (!isLoggedIn) {
        return;
    }
    
    listProjects();
    checkEnvironmentVariables();
    checkDeployments();
    provideFix();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 SUMMARY:');
    console.log('The Google OAuth error is likely due to missing VITE_GOOGLE_CLIENT_ID in Vercel.');
    console.log('Follow the fix instructions above to resolve this issue.');
    console.log('='.repeat(50));
}

// Run all checks
runAllChecks().catch(console.error);