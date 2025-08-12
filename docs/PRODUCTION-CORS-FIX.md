# Production CORS Fix - URGENT

## Problem
The production API at `https://api.bahaycebu-properties.com` is missing the CORS fix that handles OPTIONS preflight requests. This causes CORS errors when the frontend tries to make requests from `https://bahaycebu-properties.com`.

**Current Error:** `Method not allowed` for OPTIONS requests

## Available Solutions:

### Option 1: Fix CORS on Vercel (RECOMMENDED)
1. **Update Vercel deployment:**
   - Ensure your `vercel.json` includes proper CORS configuration
   - Deploy the fixed backend code to Vercel
   - The CORS headers are already implemented in `backend-api.js`

### Option 2: Upgrade Hosting Plan
1. **Important Note:** Most Hostinger shared hosting plans don't support Node.js
2. **If you have VPS/Cloud hosting:**
   - Upload files from `deployment-package/` to Hostinger
   - Install dependencies: `npm install`
   - Start API: `node start-api.js`
   - Update frontend `VITE_API_URL` to main domain
   - Redeploy frontend

### Option 3: Alternative Hosting
1. **Consider other Node.js hosting services:**
   - Railway, Render, or Heroku
   - Deploy the API there and update frontend configuration

If you can access the subdomain files:

## Step-by-Step Fix

### Step 1: Upload Backend to Main Domain

1. **Access Hostinger File Manager**
   - Log into your Hostinger account
   - Go to `bahaycebu-properties.com` domain management
   - Open File Manager

2. **Create API Directory**
   - Navigate to `public_html` folder
   - Create a new folder called `api`
   - Upload these files to the `api` folder:
     - `backend-api.js` (from deployment-package)
     - `start-api.js` (from deployment-package)
     - `package.json` (from deployment-package)

3. **Install Dependencies**
   - In Hostinger terminal or via SSH:
   ```bash
   cd public_html/api
   npm install
   ```

4. **Start the API Server**
   ```bash
   node start-api.js
   ```
   Or use PM2 if available:
   ```bash
   pm2 start start-api.js --name "bahaycebu-api"
   ```

### Step 2: Update Frontend Configuration

1. **Update Vercel Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Update `VITE_API_URL` to: `https://bahaycebu-properties.com`
   - Save and redeploy

### Step 3: Test the Fix

1. Wait for Vercel to redeploy (2-3 minutes)
2. Go to `https://bahaycebu-properties.com/admin-login`
3. Try to delete an agent - CORS error should be gone

## Alternative: Quick Vercel Fix

If you prefer to keep using the subdomain:

1. **Deploy Backend to Vercel**
   - Create a new Vercel project for the backend
   - Upload the `deployment-package` files
   - Get the new API URL (e.g., `https://your-api.vercel.app`)
   - Update `VITE_API_URL` to the new Vercel API URL

## Files Ready

- ✅ `deployment-package/backend-api.js` - Fixed CORS handler
- ✅ `deployment-package/start-api.js` - Server startup
- ✅ `deployment-package/package.json` - Dependencies
- ✅ `deploy.zip` - All files compressed

## Why This Works

1. **Same Origin**: Frontend and backend on same domain = no CORS issues
2. **Simple Setup**: No subdomain configuration needed
3. **Reliable**: Uses your existing Hostinger hosting

## Need Help?

If you need assistance:
1. The main issue is that your API subdomain doesn't have the updated code
2. Using the main domain eliminates CORS complexity
3. The backend files are ready in the `deployment-package` folder

**Quick Test**: After uploading, visit `https://bahaycebu-properties.com/api/health` to verify the API is running.