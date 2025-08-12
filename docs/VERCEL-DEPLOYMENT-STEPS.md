# How to Update Your Vercel Project with Fixed Backend Code

## Overview
Your API is currently hosted on Vercel at `api.bahaycebu-properties.com`. You need to update it with the CORS-fixed version from your `deployment-package/backend-api.js` file.

## Method 1: GitHub Connected Project (Recommended)

If your Vercel project is connected to a GitHub repository:

### Step 1: Update Your Repository
1. **Open your GitHub repository** (the one connected to your Vercel API project)
2. **Navigate to your backend file** (likely named `backend-api.js` or similar)
3. **Replace the content** with the fixed version from `deployment-package/backend-api.js`
4. **Commit and push** the changes:
   ```
   git add .
   git commit -m "Fix CORS headers for production"
   git push origin main
   ```

### Step 2: Automatic Deployment
- Vercel will automatically detect the changes
- A new deployment will start within 1-2 minutes
- You'll receive a notification when deployment is complete

## Method 2: Manual Upload via Vercel Dashboard

If your project is not connected to GitHub:

### Step 1: Access Vercel Dashboard
1. **Go to** [vercel.com](https://vercel.com)
2. **Log into your account**
3. **Find your API project** (`api.bahaycebu-properties.com`)
4. **Click on the project**

### Step 2: Upload New Files
1. **Go to the "Deployments" tab**
2. **Click "Deploy" or "New Deployment"**
3. **Upload your files:**
   - Upload the fixed `backend-api.js` from `deployment-package/`
   - Include `package.json` if it has changed
   - Include any other necessary files

### Step 3: Deploy
1. **Click "Deploy"**
2. **Wait for deployment to complete** (usually 1-3 minutes)
3. **Check the deployment logs** for any errors

## Method 3: Vercel CLI (Advanced)

If you have Vercel CLI installed:

### Step 1: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### Step 2: Login and Deploy
```bash
vercel login
cd deployment-package
vercel --prod
```

## Verification Steps

### Step 1: Test the API
1. **Open your browser**
2. **Go to:** `https://api.bahaycebu-properties.com/api/health`
3. **Check if it loads without errors**

### Step 2: Test CORS
1. **Open your main website:** `https://bahaycebu-properties.com`
2. **Try to perform actions** that previously failed (like deleting agents)
3. **Check browser console** for CORS errors

### Step 3: Verify Headers
Open browser developer tools and check that API responses include:
```
Access-Control-Allow-Origin: https://bahaycebu-properties.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## What the Fix Does

The updated `backend-api.js` includes:
- **Proper CORS headers** for all API responses
- **OPTIONS method support** for preflight requests
- **Specific origin allowance** for your domain
- **All necessary HTTP methods** (GET, POST, PUT, DELETE)

## Expected Results
- ✅ No more CORS errors
- ✅ API calls work from your main website
- ✅ All admin functions restored
- ✅ Agent management works properly

---
**Note:** The deployment usually takes 1-3 minutes. If you still see CORS errors after deployment, wait a few minutes for DNS propagation and try clearing your browser cache.