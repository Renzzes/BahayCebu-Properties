# Hostinger Deployment Guide

## Backend API Deployment

### Option 1: Deploy to Hostinger VPS (Recommended)

1. **Create a VPS on Hostinger**
   - Log into your Hostinger account
   - Go to VPS section
   - Create a new VPS with Node.js support
   - Choose Ubuntu or CentOS

2. **Upload Backend Files**
   ```bash
   # Upload these files to your VPS:
   - backend-api.js
   - backend-package.json (rename to package.json)
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Environment Variables**
   ```bash
   # Create .env file
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=bahaycebu_db
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   PORT=3001
   ```

5. **Start the Server**
   ```bash
   npm start
   ```

6. **Set up PM2 (for production)**
   ```bash
   npm install -g pm2
   pm2 start backend-api.js --name "bahaycebu-api"
   pm2 startup
   pm2 save
   ```

7. **Configure Domain**
   - Point `api.bahaycebu-properties.com` to your VPS IP
   - Set up SSL certificate

### Option 2: Deploy to Hostinger Shared Hosting

1. **Create a subdomain**
   - Go to Hostinger control panel
   - Create subdomain: `api.bahaycebu-properties.com`

2. **Upload Files**
   - Upload `backend-api.js` and `package.json` to the subdomain directory

3. **Set up Node.js**
   - Enable Node.js in Hostinger control panel
   - Set the entry point to `backend-api.js`

4. **Configure Environment Variables**
   - Set environment variables in Hostinger control panel

### Option 3: Use External Backend Service

1. **Railway.app (Free tier available)**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Render.com (Free tier available)**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Heroku (Paid)**
   ```bash
   # Install Heroku CLI
   heroku create bahaycebu-api
   git push heroku main
   ```

## Frontend Configuration

### Update API URL

1. **For VPS deployment:**
   ```javascript
   const authEndpoint = 'https://api.bahaycebu-properties.com/api/auth/google';
   ```

2. **For Railway:**
   ```javascript
   const authEndpoint = 'https://your-app-name.railway.app/api/auth/google';
   ```

3. **For Render:**
   ```javascript
   const authEndpoint = 'https://your-app-name.onrender.com/api/auth/google';
   ```

## Database Setup

### MySQL Database Schema

```sql
CREATE TABLE User (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  profilePicture VARCHAR(500),
  googleId VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'USER',
  lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  otp VARCHAR(10),
  otpExpiry DATETIME
);
```

## Environment Variables

### Backend (.env)
```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=bahaycebu_db
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3001
```

### Frontend (.env)
```
VITE_API_URL=https://api.bahaycebu-properties.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
VITE_GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback
```

## Testing

1. **Test Backend API**
   ```bash
   curl -X GET https://api.bahaycebu-properties.com/api/health
   ```

2. **Test Google Authentication**
   - Try logging in with Google on your website
   - Check browser console for any errors
   - Check backend logs for authentication flow

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure CORS is properly configured in backend
   - Check that the frontend domain is in the allowed origins

2. **Database Connection Issues**
   - Verify database credentials
   - Check if database is accessible from your hosting provider
   - Ensure SSL is configured correctly

3. **Google OAuth Issues**
   - Verify Google OAuth credentials
   - Check redirect URI matches exactly
   - Ensure HTTPS is enabled

### Debug Steps

1. **Check Backend Logs**
   ```bash
   # If using PM2
   pm2 logs bahaycebu-api
   
   # If running directly
   node backend-api.js
   ```

2. **Check Frontend Console**
   - Open browser developer tools
   - Look for network errors
   - Check for JavaScript errors

3. **Test API Endpoints**
   ```bash
   # Health check
   curl https://api.bahaycebu-properties.com/api/health
   
   # Test Google auth (with proper data)
   curl -X POST https://api.bahaycebu-properties.com/api/auth/google \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User","googleId":"123"}'
   ``` 