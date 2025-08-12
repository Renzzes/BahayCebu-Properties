# Hostinger Upload Guide - Fix CORS Error

## What You Need to Do

You're currently in your Hostinger file manager - perfect! Here's exactly what to do:

## Step 1: Create API Folder

1. **Click on `public_html` folder** (the blue folder in your file manager)
2. **Click "New folder"** button (you can see it in the left sidebar)
3. **Name the folder**: `api`
4. **Enter the new `api` folder**

## Step 2: Upload Backend Files

You need to upload these 3 files from your computer to the `api` folder:

### Files to Upload:
- `backend-api.js` (from your `deployment-package` folder)
- `start-api.js` (from your `deployment-package` folder) 
- `package.json` (from your `deployment-package` folder)

### How to Upload:
1. **Click "New file"** or look for an "Upload" button
2. **Select each file** from your `C:\Users\clare\BahayCebu-Properties\deployment-package\` folder
3. **Upload all 3 files** to the `api` folder

## Step 3: Install Dependencies

If Hostinger has a terminal/SSH access:
1. **Navigate to**: `/public_html/api/`
2. **Run**: `npm install`

If no terminal access, the basic files should work without additional packages.

## Step 4: Start the API

### Option A: If Hostinger supports Node.js apps
- Look for "Node.js" in your Hostinger control panel
- Set the startup file to: `start-api.js`
- Set the application root to: `/public_html/api/`

### Option B: Manual start (if you have SSH/terminal)
```bash
cd /public_html/api/
node start-api.js
```

## Step 5: Update Your Frontend

1. **Go to Vercel dashboard**
2. **Find your project** (BahayCebu Properties)
3. **Go to Settings > Environment Variables**
4. **Change `VITE_API_URL`** from:
   ```
   https://api.bahaycebu-properties.com
   ```
   to:
   ```
   https://bahaycebu-properties.com
   ```
5. **Save and redeploy**

## Step 6: Test

1. **Wait 2-3 minutes** for Vercel to redeploy
2. **Visit**: `https://bahaycebu-properties.com/api/health`
   - You should see: `{"status":"ok",...}`
3. **Go to your admin page** and try deleting an agent
   - CORS error should be gone!

## Files Location on Your Computer

The files you need to upload are here:
```
C:\Users\clare\BahayCebu-Properties\deployment-package\
├── backend-api.js  ← Upload this
├── start-api.js    ← Upload this  
└── package.json    ← Upload this
```

## Quick Summary

✅ **Current**: Frontend calls `https://api.bahaycebu-properties.com` (has CORS issues)
✅ **New**: Frontend calls `https://bahaycebu-properties.com/api` (no CORS issues)

## Need Help?

If you can't find the upload button:
- Look for "Upload", "New file", or a "+" button
- Some file managers have drag-and-drop support
- You might need to right-click in the file area

The key is getting those 3 files into a new `api` folder inside your `public_html` directory!