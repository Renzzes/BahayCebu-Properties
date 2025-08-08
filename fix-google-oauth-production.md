# Fix Google OAuth Production Error - Error 401: invalid_client

## Problem Analysis

The "Error 401: invalid_client" occurs because the Google Cloud Console OAuth client configuration doesn't match the actual production domain being used.

**Current Configuration Issues:**
1. Environment variables show `GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback`
2. But the actual production site is running on Vercel domains like `*.vercel.app`
3. Google OAuth client in Google Cloud Console is likely configured for `bahaycebu-properties.com`
4. The mismatch between configured domain and actual domain causes the invalid_client error

## Solution Steps

### Step 1: Identify the Correct Production Domain

From the screenshot, the user is accessing: `bahaycebu-properties.com`

This means the custom domain is properly configured, but there might be an issue with the Google OAuth client configuration.

### Step 2: Update Google Cloud Console OAuth Client

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID

3. **Update Authorized Redirect URIs:**
   Add these redirect URIs to cover all possible domains:
   ```
   https://bahaycebu-properties.com/auth/google/callback
   https://bahaycebu-properties.com/api/auth/google/callback
   https://api.bahaycebu-properties.com/auth/google/callback
   https://api.bahaycebu-properties.com/api/auth/google/callback
   ```

4. **Update Authorized JavaScript Origins:**
   Add these origins:
   ```
   https://bahaycebu-properties.com
   https://api.bahaycebu-properties.com
   ```

### Step 3: Verify Environment Variables

Ensure these environment variables are correctly set in Vercel:

```bash
# Check current environment variables
vercel env ls

# Update if needed
vercel env rm GOOGLE_REDIRECT_URI
vercel env add GOOGLE_REDIRECT_URI
# Enter: https://bahaycebu-properties.com/auth/google/callback

vercel env rm VITE_GOOGLE_REDIRECT_URI  
vercel env add VITE_GOOGLE_REDIRECT_URI
# Enter: https://bahaycebu-properties.com/auth/google/callback
```

### Step 4: Update Frontend Configuration

The frontend is using `@react-oauth/google` with implicit flow. Ensure the redirect URI configuration matches:

**In Navbar.tsx, the Google login should use:**
```typescript
const googleLogin = useGoogleLogin({
  onSuccess: handleGoogleSuccess,
  onError: (error) => {
    console.error('Google login error:', error);
  },
  flow: 'implicit',
  scope: 'email profile openid'
});
```

### Step 5: Test the Configuration

1. **Deploy the changes:**
   ```bash
   vercel --prod
   ```

2. **Test Google OAuth:**
   - Visit: https://bahaycebu-properties.com
   - Try to sign in with Google
   - Check browser console for any errors

### Step 6: Alternative Solution - Use Vercel Domain

If the custom domain continues to have issues, temporarily configure Google OAuth for the Vercel domain:

1. **Get the primary Vercel domain:**
   ```bash
   vercel ls | head -5
   ```

2. **Update Google Cloud Console with Vercel domain:**
   - Add redirect URI: `https://your-vercel-domain.vercel.app/auth/google/callback`
   - Add origin: `https://your-vercel-domain.vercel.app`

3. **Update environment variables:**
   ```bash
   vercel env add GOOGLE_REDIRECT_URI
   # Enter: https://your-vercel-domain.vercel.app/auth/google/callback
   
   vercel env add VITE_GOOGLE_REDIRECT_URI
   # Enter: https://your-vercel-domain.vercel.app/auth/google/callback
   ```

## Common Issues and Solutions

### Issue 1: Domain Mismatch
**Problem:** Google OAuth client configured for wrong domain
**Solution:** Update Google Cloud Console with correct production domain

### Issue 2: Missing Redirect URIs
**Problem:** Not all possible redirect URIs are configured
**Solution:** Add all variations of redirect URIs in Google Cloud Console

### Issue 3: Environment Variable Propagation
**Problem:** Updated environment variables not reflected in production
**Solution:** Redeploy after updating environment variables

### Issue 4: CORS Issues
**Problem:** Cross-origin requests blocked
**Solution:** Ensure API endpoints have proper CORS headers

## Verification Steps

1. **Check Google Cloud Console:**
   - Verify OAuth client has correct redirect URIs
   - Verify authorized JavaScript origins

2. **Check Vercel Environment Variables:**
   ```bash
   vercel env ls
   ```

3. **Test Authentication Flow:**
   - Open browser developer tools
   - Navigate to production site
   - Click "Sign in with Google"
   - Check for any console errors
   - Verify redirect URL in address bar

4. **Check Network Requests:**
   - Monitor network tab during Google login
   - Verify API calls are going to correct endpoints
   - Check response status codes

## Next Steps

1. Update Google Cloud Console OAuth client configuration
2. Verify environment variables in Vercel
3. Redeploy the application
4. Test Google authentication in production
5. Monitor for any remaining errors

This should resolve the "Error 401: invalid_client" issue in production.