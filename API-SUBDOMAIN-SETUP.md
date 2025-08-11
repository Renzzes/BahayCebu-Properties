# API Subdomain Setup Guide

## Overview
This guide provides instructions for setting up the API subdomain (`api.bahaycebu-properties.com`) on Hostinger to fix the issue where the API returns HTML instead of JSON in production.

## Steps to Configure API Subdomain

### 1. Create the API Subdomain in Hostinger
1. Log in to your Hostinger control panel
2. Navigate to the Domains section
3. Select your domain (`bahaycebu-properties.com`)
4. Click on "Subdomains"
5. Create a new subdomain named `api`
6. Point it to the directory where your backend API files are located

### 2. Configure CORS with .htaccess
1. Upload the provided `api-subdomain-htaccess.txt` file to your API subdomain directory
2. Rename it to `.htaccess`

```bash
# .htaccess file content for API subdomain
# Enable rewrite engine
RewriteEngine On

# Set base directory
RewriteBase /

# Enable CORS for API subdomain
<IfModule mod_headers.c>
    # Always set these headers for all responses
    Header always set Access-Control-Allow-Origin "https://bahaycebu-properties.com"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, Accept, cache-control"
    Header always set Access-Control-Allow-Credentials "true"
    
    # Handle preflight OPTIONS requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>

# Force content type for API responses
<IfModule mod_headers.c>
    # Set JSON content type for API responses
    Header set Content-Type "application/json" env=API_RESPONSE
</IfModule>

# Set environment variable for API responses
<IfModule mod_rewrite.c>
    RewriteRule ^api/ - [E=API_RESPONSE:1]
</IfModule>
```

### 3. Update Backend Configuration
1. Make sure your backend server is properly configured to accept requests from both the main domain and the API subdomain
2. Update the CORS configuration in your backend code to include both domains:

```javascript
app.use(cors({
  origin: ['https://bahaycebu-properties.com', 'https://api.bahaycebu-properties.com', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'cache-control']
}));
```

### 4. Update Environment Variables
Ensure your environment variables are correctly set for production:

```
VITE_GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback
VITE_API_URL="https://api.bahaycebu-properties.com"
VITE_BASE_URL="https://bahaycebu-properties.com"
```

## Troubleshooting

### API Returns HTML Instead of JSON
If you're still getting HTML responses instead of JSON:

1. **Check Content-Type Headers**: Ensure your API is setting the correct `Content-Type: application/json` header
2. **Test Direct API Calls**: Use tools like Postman or curl to test API endpoints directly
   ```bash
   curl -v https://api.bahaycebu-properties.com/api/health
   ```
3. **Check Server Logs**: Look for any errors in your server logs
4. **Verify .htaccess is Working**: Some hosting providers require additional configuration to enable .htaccess files

### CORS Issues
If you're experiencing CORS errors:

1. **Check Browser Console**: Look for specific CORS error messages
2. **Verify Headers**: Use browser developer tools to check if CORS headers are being returned properly
3. **Test with Simple Request**: Try a simple GET request first before testing more complex requests

## Additional Resources
- [Hostinger .htaccess Guide](https://www.hostinger.com/tutorials/htaccess)
- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)