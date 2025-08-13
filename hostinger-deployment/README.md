# Hostinger Deployment Package

This folder contains the organized files ready for deployment to your Hostinger hosting.

## Structure

### Frontend (`/frontend/`)
Contains the built React application files that should be uploaded to your Hostinger `public_html` directory.

**Files included:**
- `index.html` - Main HTML file
- `assets/` - CSS, JS, and other static assets
- `.htaccess` - Apache configuration for React Router
- Other static files (favicon, robots.txt, etc.)

### Backend (`/backend/`)
Contains the API files for your backend services.

**Files included:**
- `_db.js` - Database configuration
- `agents/` - Agent-related API endpoints
- `properties/` - Property-related API endpoints
- `auth/` - Authentication endpoints
- `utils/` - Utility functions

## Deployment Instructions

### Frontend Deployment
1. Upload all files from the `frontend/` folder to your Hostinger `public_html` directory
2. Make sure to overwrite existing files
3. Ensure the `.htaccess` file is uploaded for proper routing

### Backend Deployment
1. Upload the `backend/` files to your API directory on Hostinger
2. Configure your database connection in `_db.js`
3. Set up your environment variables

## Important Notes
- Always backup your existing files before uploading
- Test the deployment in a staging environment if possible
- Make sure your database credentials are properly configured
- Verify that all API endpoints are working after deployment

## Last Updated
Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Build version: Latest production build