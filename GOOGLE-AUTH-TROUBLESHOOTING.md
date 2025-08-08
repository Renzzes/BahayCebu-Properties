# Google Authentication Troubleshooting Guide

## Overview

This guide provides comprehensive troubleshooting steps for resolving Google authentication issues in the BahayCebu Properties application.

## Common Issues and Solutions

### 1. Database Connection Errors

**Symptoms:**
- Error message: `PrismaClientInitializationError` with error code `P1000`
- Authentication fails with database connection errors
- Server logs show authentication failures related to database

**Solutions:**

1. **Verify Database Credentials**
   - Check that the database credentials in `.env` and `.env.api` are correct
   - Current credentials should be:
     ```
     Host: 153.92.15.81
     User: u547531148_bahaycebu_admi
     Password: Bahaycebu123
     Database: u547531148_bahaycebu_db
     ```

2. **Test Database Connection**
   - Run the database connection test script:
     ```bash
     node test-db-connection.js
     ```
   - This will verify if the database is accessible with the provided credentials

3. **Check Database Server Status**
   - Verify that the database server is running and accessible
   - Check if there are any firewall rules blocking the connection
   - Ensure the database user has the necessary permissions

### 2. CORS Issues

**Symptoms:**
- Browser console shows CORS errors
- Authentication requests fail with CORS-related errors
- Preflight OPTIONS requests fail

**Solutions:**

1. **Check CORS Configuration in Server**
   - Verify that the CORS configuration in `src/server.ts` includes the correct origins:
     ```typescript
     const corsOptions = {
       origin: [
         "http://localhost:3000",
         "http://localhost:4000",
         "http://localhost:5173",
         "http://localhost:8080",
         "http://localhost:8081",
         process.env.PRODUCTION_URL || "",
         "https://bahaycebu-properties.com",
         "https://api.bahaycebu-properties.com",
         "https://bahaycebu-properties.vercel.app"
       ].filter((url): url is string => !!url),
       credentials: true,
       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
       allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
       exposedHeaders: ['Set-Cookie'],
     };
     ```

2. **Check .htaccess Configuration**
   - Ensure the `.htaccess` file for the API subdomain has the correct CORS headers:
     ```apache
     # Enable CORS for API subdomain
     <IfModule mod_headers.c>
         # Always set these headers for all responses
         Header always set Access-Control-Allow-Origin "https://bahaycebu-properties.com"
         Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
         Header always set Access-Control-Allow-Headers "Content-Type, Authorization, Accept"
         Header always set Access-Control-Allow-Credentials "true"
         
         # Add additional origins if needed
         # SetEnvIf Origin "^http(s)?://(.+\.)?localhost:\d+$" CORS_ORIGIN=$0
         # Header always set Access-Control-Allow-Origin %{CORS_ORIGIN}e env=CORS_ORIGIN
     </IfModule>
     ```

3. **Test CORS with Browser Extensions**
   - Use browser extensions like CORS Unblock to test if CORS is the issue
   - Try making the request from a different origin to see if CORS is properly configured

### 3. Google OAuth Configuration Issues

**Symptoms:**
- Google login button doesn't work
- Authentication fails with Google OAuth errors
- Redirect URI errors

**Solutions:**

1. **Verify Google OAuth Credentials**
   - Check that the Google OAuth credentials in `.env` and `.env.api` are correct
   - Current credentials should be:
     ```
     GOOGLE_CLIENT_ID=897144997266-c4nm53c1080819oj00t282p7iq3ogesp.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=G8C5PX-4PpfFHJ-PJ1L4CTjSZ9nONV1qxt8
     GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback
     ```

2. **Check Google Cloud Console Configuration**
   - Verify that the Google OAuth credentials are properly configured in Google Cloud Console
   - Ensure the authorized JavaScript origins include:
     - `https://bahaycebu-properties.com`
     - `https://api.bahaycebu-properties.com`
     - `http://localhost:8081` (for development)
   - Ensure the authorized redirect URIs include:
     - `https://bahaycebu-properties.com/auth/google/callback`
     - `http://localhost:8081/auth/google/callback` (for development)

3. **Test Google Authentication**
   - Run the Google authentication test script:
     ```bash
     node test-google-auth.js
     ```
   - This will verify if the Google authentication API is working correctly

### 4. JWT Token Issues

**Symptoms:**
- Authentication succeeds but subsequent requests fail
- Token validation errors
- Unauthorized access errors

**Solutions:**

1. **Verify JWT Secret**
   - Check that the JWT secret in `.env` and `.env.api` is correct and consistent
   - Current JWT secret should be:
     ```
     JWT_SECRET=bahaycebu-jwt-secret-2024
     ```

2. **Check Token Generation**
   - Verify that the token is being generated correctly in the authentication endpoint
   - Ensure the token includes the necessary claims (userId, email, name)
   - Check that the token expiration is set correctly (24 hours)

3. **Test Token Validation**
   - Create a script to test token validation
   - Verify that the token can be validated with the same JWT secret

## Debugging Steps

### 1. Check Server Logs

- Look for error messages in the server logs
- Check for database connection errors
- Look for authentication-related errors

### 2. Use Browser Developer Tools

- Open the browser developer tools (F12)
- Go to the Network tab
- Make an authentication request and check the response
- Look for CORS errors in the Console tab

### 3. Test API Endpoints Directly

- Use tools like Postman or curl to test API endpoints directly
- Test the Google authentication endpoint with sample data
- Check the response for error messages

### 4. Verify Environment Variables

- Check that all required environment variables are set
- Verify that the environment variables are being loaded correctly
- Test with hardcoded values to rule out environment variable issues

## Standardizing Authentication Implementation

To avoid future issues, consider standardizing the authentication implementation:

1. **Choose One Implementation**
   - Decide whether to use the Express Backend or Standalone API approach
   - Remove or disable the unused implementations

2. **Consistent Error Handling**
   - Ensure all authentication endpoints return consistent error formats
   - Log detailed error messages for debugging

3. **Comprehensive Testing**
   - Create automated tests for authentication flows
   - Test in all deployment environments

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [JWT Documentation](https://jwt.io/introduction)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)

## Contact Support

If you continue to experience issues, please contact the development team for assistance.