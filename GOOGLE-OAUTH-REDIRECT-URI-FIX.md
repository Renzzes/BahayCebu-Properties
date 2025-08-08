# Google OAuth Redirect URI Mismatch Fix

## Problem Description

The application is experiencing a "redirect_uri_mismatch" error when users try to log in with Google. The error shows:

```
Error 401: invalid_client
The OAuth client was not found.
```

## Root Cause

The issue occurs because:

1. **Frontend Implementation**: Uses `@react-oauth/google` with **implicit flow** (no redirect URI needed)
2. **Google Cloud Console Configuration**: The Client ID is configured for **authorization code flow** (requires redirect URIs)
3. **Mismatch**: Google expects a redirect URI but the implicit flow doesn't provide one

## Solution

You need to update the Google Cloud Console configuration to support implicit flow properly.

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID: `897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com`

### Step 2: Update OAuth Client Configuration

1. Click on your OAuth 2.0 Client ID to edit it
2. **Remove all Authorized redirect URIs** (this is crucial for implicit flow)
3. **Keep only Authorized JavaScript origins**:
   - For development: `http://localhost:8082`
   - For production: `https://bahaycebu-properties.com`

### Step 3: Verify Configuration

Your OAuth client should have:

**✅ Authorized JavaScript origins:**
- `http://localhost:8082` (development)
- `https://bahaycebu-properties.com` (production)

**❌ Authorized redirect URIs:**
- Should be **EMPTY** for implicit flow

### Step 4: Update Environment Variables (Optional)

Since we're using implicit flow, you can remove redirect URI environment variables:

```bash
# Remove these from .env files (they're not needed for implicit flow)
# VITE_GOOGLE_REDIRECT_URI=...
# GOOGLE_REDIRECT_URI=...
```

## Technical Explanation

### Implicit Flow vs Authorization Code Flow

**Implicit Flow (Current Frontend Implementation):**
- Uses `useGoogleLogin({ flow: 'implicit' })`
- Returns access token directly
- No redirect URI needed
- Only requires JavaScript origins

**Authorization Code Flow (Backend Implementation):**
- Returns authorization code first
- Requires server-side token exchange
- Needs redirect URIs
- Used in `src/server.ts`

### Why This Happened

The application has both implementations:
1. **Frontend**: Implicit flow in `Navbar.tsx`
2. **Backend**: Authorization code flow in `server.ts`

The Google Client ID was configured for the backend flow, causing the frontend to fail.

## Verification

After making the changes:

1. Clear browser cache and cookies
2. Try logging in with Google
3. Check browser console for any remaining errors
4. Verify the login flow completes successfully

## Alternative Solution: Switch to Authorization Code Flow

If you prefer to use authorization code flow in the frontend:

```typescript
const googleLogin = useGoogleLogin({
  onSuccess: handleGoogleSuccess,
  onError: (error) => {
    console.error('Google login error:', error);
  },
  flow: 'auth-code', // Change to authorization code flow
  scope: 'email profile openid',
});
```

But this would require:
1. Keeping redirect URIs in Google Cloud Console
2. Modifying the success handler to work with authorization codes
3. Additional backend endpoint to exchange codes for tokens

## Recommended Approach

Stick with **implicit flow** as it's simpler for frontend-only authentication and matches the current implementation.

## Files Modified

- `src/components/layout/Navbar.tsx` - Updated debug logging to remove redirect URI references

## Next Steps

1. Update Google Cloud Console as described above
2. Test the login functionality
3. Remove unused redirect URI environment variables
4. Update deployment configurations if needed