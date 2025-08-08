# Hostinger Frontend + Vercel Backend Integration Fix

## Issues Identified

### 1. CORS Configuration Problems
**Problem**: The API endpoints were configured with `Access-Control-Allow-Origin: *` which doesn't work with credentials, and the frontend domain wasn't properly whitelisted.

**Solution**: Updated all API endpoints to specifically allow `https://bahaycebu-properties.com`

### 2. API URL Configuration
**Problem**: The frontend was trying to connect to the wrong API URL.

**Solution**: Verified the correct Vercel deployment URL in `src/config/api.ts`

### 3. Database Schema Mismatch
**Problem**: The database is missing the `role` column that the code expects.

**Solution**: Need to run database migrations or update the database schema.

## Files Modified

### 1. Frontend Configuration
- `src/config/api.ts` - Verified correct Vercel API URL

### 2. Vercel Configuration
- `vercel.json` - Updated CORS headers to allow Hostinger domain

### 3. API Endpoints
- `api/auth/signup.ts` - Updated CORS headers
- `api/auth/login.ts` - Updated CORS headers  
- `api/auth/google.ts` - Updated CORS headers

## Deployment Steps

### Step 1: Deploy to Vercel
1. Commit all changes to your repository
2. Push to your main branch
3. Vercel will automatically deploy the changes
4. Verify the deployment URL: `https://bahay-cebu-properties-rences-projects-f8660086.vercel.app`

### Step 2: Update Database Schema
You need to add the missing `role` column to your database. Run this SQL command on your Hostinger database:

```sql
ALTER TABLE User ADD COLUMN role VARCHAR(50) DEFAULT 'USER';
```

Or if you have access to run Prisma migrations:
```bash
npx prisma migrate deploy
```

### Step 3: Environment Variables on Vercel
Ensure these environment variables are set in your Vercel project:

```
DATABASE_URL=mysql://u547531148_bahaycebu_admi:Bahaycebu-1231@153.92.15.81:3306/u547531148_bahaycebu_db
JWT_SECRET=bahaycebu-jwt-secret-2024
GOOGLE_CLIENT_ID=897144997266-c4nm53c1080819oj00t282p7iq3ogesp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=G8C5PX-4PpfFHJ-PJ1L4CTjSZ9nONV1qxt8
NODE_ENV=production
```

### Step 4: Test the Integration
1. Visit your Hostinger site: `https://bahaycebu-properties.com`
2. Try to create a new account
3. Try to login with Google
4. Check browser console for any remaining errors

## Troubleshooting

### If signup still fails:
1. Check Vercel function logs for detailed error messages
2. Verify database connection from Vercel
3. Ensure the `role` column was added to the User table

### If Google login fails:
1. Verify Google OAuth credentials are correct
2. Check that the redirect URI matches: `https://bahaycebu-properties.com/auth/google/callback`
3. Ensure CORS headers are properly set

### If CORS errors persist:
1. Clear browser cache
2. Check that all API endpoints have the correct CORS headers
3. Verify the Vercel deployment includes the updated `vercel.json`

## Security Notes

1. **CORS Configuration**: Now properly configured to only allow requests from your Hostinger domain
2. **Credentials**: `Access-Control-Allow-Credentials` is set to `true` for authenticated requests
3. **Environment Variables**: Ensure sensitive data like `JWT_SECRET` and `GOOGLE_CLIENT_SECRET` are properly secured in Vercel

## Next Steps

1. Deploy the changes to Vercel
2. Update the database schema
3. Test all authentication flows
4. Monitor Vercel function logs for any issues

The main issue was that your frontend (Hostinger) and backend (Vercel) weren't properly configured to communicate with each other due to CORS restrictions and incorrect API URLs. These changes should resolve the "Failed to fetch" errors you were experiencing.