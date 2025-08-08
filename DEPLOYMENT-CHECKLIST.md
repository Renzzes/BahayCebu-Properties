# BahayCebu Properties Deployment Checklist

## Database Configuration

- [x] Update database credentials in `.env` file
  - Host: `153.92.15.81`
  - User: `u547531148_bahaycebu_admi`
  - Password: `Bahaycebu123`
  - Database: `u547531148_bahaycebu_db`

- [x] Create `.env.api` file for standalone API with correct credentials

- [x] Test database connection with `node test-db-connection.js`

## API Subdomain Setup

- [x] Update `.htaccess` file for API subdomain
  - Enable CORS for main domain
  - Set proper content type for API responses
  - Enable gzip compression

- [ ] Upload `.htaccess` file to API subdomain root directory

## Google Authentication

- [x] Verify Google OAuth credentials in `.env` file
  - Client ID: `897144997266-c4nm53c1080819oj00t282p7iq3ogesp.apps.googleusercontent.com`
  - Client Secret: `G8C5PX-4PpfFHJ-PJ1L4CTjSZ9nONV1qxt8`
  - Redirect URI: `https://bahaycebu-properties.com/auth/google/callback`

- [ ] Ensure Google OAuth is properly configured in Google Cloud Console
  - Authorized JavaScript origins: `https://bahaycebu-properties.com`
  - Authorized redirect URIs: `https://bahaycebu-properties.com/auth/google/callback`

## Deployment Steps

### Backend API (Hostinger VPS or Shared Hosting)

- [ ] Upload `backend-api.js` and `package.json` to server
- [ ] Upload `.env.api` file to server
- [ ] Install dependencies with `npm install`
- [ ] Start the API server with `node start-api.js`
- [ ] For production, set up PM2:
  ```bash
  npm install -g pm2
  pm2 start start-api.js --name bahaycebu-api
  pm2 startup
  pm2 save
  ```

### Frontend (Vercel or Hostinger)

- [ ] Build the frontend with `npm run build`
- [ ] Deploy the `dist` directory to the hosting provider
- [ ] Ensure environment variables are properly set in the hosting provider

## Testing

- [ ] Test API endpoints
  - Health check: `https://api.bahaycebu-properties.com/api/health`
  - Google auth: `https://api.bahaycebu-properties.com/api/auth/google`

- [ ] Test frontend
  - Google login
  - Property listings
  - User profile

## Troubleshooting

### CORS Issues

- Check browser console for CORS errors
- Verify `.htaccess` file is properly configured
- Ensure API server has proper CORS headers

### Database Connection Issues

- Verify database credentials
- Check if database server is accessible from the hosting provider
- Test connection with `node test-db-connection.js`

### Google OAuth Issues

- Verify Google OAuth credentials
- Check if redirect URI is properly configured
- Ensure Google OAuth is enabled in Google Cloud Console