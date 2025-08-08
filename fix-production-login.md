# Fix Production Login Issue

## Problem
The login functionality returns HTML instead of JSON in production because the API endpoints are not properly configured on the production domain.

## Root Cause
The frontend is trying to reach `https://api.bahaycebu-properties.com/api/auth/login` but the API subdomain is either:
1. Not properly configured
2. Not serving the backend API
3. Returning HTML (likely a hosting provider's default page)

## Solution Steps

### Step 1: Verify API Subdomain Status
Test if the API subdomain is responding correctly:

```bash
# Test health endpoint
curl -v https://api.bahaycebu-properties.com/api/health

# Test login endpoint
curl -X POST https://api.bahaycebu-properties.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Step 2: Deploy Backend to API Subdomain

#### Option A: Hostinger Shared Hosting
1. **Create API Subdomain**
   - Login to Hostinger control panel
   - Go to Domains → Subdomains
   - Create subdomain: `api`
   - Point to a new directory (e.g., `/public_html/api`)

2. **Upload Backend Files**
   - Upload `backend-api.js` to the API subdomain directory
   - Upload `package.json` (rename from `backend-package.json`)
   - Upload `.env.api` file with production settings

3. **Configure Node.js**
   - Enable Node.js in Hostinger control panel
   - Set entry point: `backend-api.js`
   - Install dependencies

4. **Upload .htaccess**
   - Copy `api-subdomain-htaccess.txt` to API subdomain directory
   - Rename to `.htaccess`

#### Option B: External Service (Recommended)
Deploy the backend to a service like Railway, Render, or Vercel:

1. **Railway.app**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Update API URL**
   Update `.env.production` with the Railway URL:
   ```
   VITE_API_URL=https://your-app-name.railway.app
   ```

### Step 3: Update Environment Configuration

Ensure `.env.production` has the correct API URL:
```
VITE_API_URL=https://api.bahaycebu-properties.com
# OR if using external service:
# VITE_API_URL=https://your-app-name.railway.app
```

### Step 4: Test the Fix

1. **Test API Health**
   ```bash
   curl https://api.bahaycebu-properties.com/api/health
   ```
   Should return JSON: `{"status":"ok","timestamp":"...","environment":"production"}`

2. **Test Login Endpoint**
   ```bash
   curl -X POST https://api.bahaycebu-properties.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","password":"your-password"}'
   ```
   Should return JSON with token or error message (not HTML)

3. **Test from Frontend**
   - Deploy the updated frontend with correct API URL
   - Try logging in with your credentials
   - Check browser console for any remaining errors

### Step 5: Redeploy Frontend

After fixing the API configuration:
1. Build the frontend with production environment
2. Deploy to your hosting provider
3. Test the login functionality

## Quick Test Script

Create and run this test script to verify the API:

```javascript
// test-production-api.js
const fetch = require('node-fetch');

async function testProductionAPI() {
  const API_URL = 'https://api.bahaycebu-properties.com';
  
  console.log('Testing Production API...');
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/api/health`);
    const healthText = await healthResponse.text();
    
    console.log('Status:', healthResponse.status);
    console.log('Content-Type:', healthResponse.headers.get('content-type'));
    console.log('Response:', healthText.substring(0, 200));
    
    if (healthText.startsWith('<!DOCTYPE') || healthText.includes('<html>')) {
      console.log('❌ API is returning HTML instead of JSON');
      console.log('This means the API subdomain is not properly configured.');
      return;
    }
    
    // Test login endpoint
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    const loginText = await loginResponse.text();
    console.log('Status:', loginResponse.status);
    console.log('Content-Type:', loginResponse.headers.get('content-type'));
    console.log('Response:', loginText.substring(0, 200));
    
    if (loginText.startsWith('<!DOCTYPE') || loginText.includes('<html>')) {
      console.log('❌ Login endpoint is returning HTML instead of JSON');
    } else {
      console.log('✅ API is responding with JSON (as expected)');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testProductionAPI();
```

## Common Issues and Solutions

### Issue: API returns 404
- **Cause**: API subdomain not created or backend not deployed
- **Solution**: Follow Step 2 to deploy backend to API subdomain

### Issue: API returns HTML
- **Cause**: Hosting provider's default page is being served
- **Solution**: Ensure backend files are uploaded to correct directory and Node.js is enabled

### Issue: CORS errors
- **Cause**: Backend CORS configuration doesn't include frontend domain
- **Solution**: Update CORS configuration in `backend-api.js`

### Issue: Database connection errors
- **Cause**: Environment variables not set correctly in production
- **Solution**: Verify database credentials in production environment

## Next Steps

1. Run the test script to confirm the current API status
2. Follow the deployment steps based on your hosting setup
3. Update environment variables
4. Redeploy frontend
5. Test login functionality

If you continue to have issues, please share the output of the test script for further diagnosis.