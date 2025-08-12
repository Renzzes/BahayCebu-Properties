# Fix CORS on Vercel - Simple Steps

## Problem
Your API is hosted on Vercel (`api.bahaycebu-properties.com`) and the frontend is on Hostinger (`bahaycebu-properties.com`), causing CORS errors.

## Solution
Update your Vercel deployment with the CORS-enabled backend code.

## Steps:

### 1. Update Vercel Project
1. **Access your Vercel dashboard**
2. **Find your API project** (`api.bahaycebu-properties.com`)
3. **Go to the project settings**

### 2. Deploy Fixed Code
1. **Option A: If connected to GitHub:**
   - Push the updated `backend-api.js` from `deployment-package/` to your repository
   - Vercel will auto-deploy

2. **Option B: Manual upload:**
   - Download the `deployment-package/backend-api.js` file
   - Upload it to replace your current backend file in Vercel
   - Trigger a new deployment

### 3. Verify Fix
1. **Test the API endpoint:**
   ```
   https://api.bahaycebu-properties.com/api/agents
   ```
2. **Check if CORS headers are present**
3. **Test from your main website**

## What's Fixed
The updated `backend-api.js` includes:
- Proper CORS headers for all requests
- Support for OPTIONS preflight requests
- Specific origin allowance for your domain

## Expected Result
- No more CORS errors
- API calls work from `bahaycebu-properties.com`
- All functionality restored

---
**Note:** This is the simplest solution since both your API and the fix are already set up for Vercel deployment.