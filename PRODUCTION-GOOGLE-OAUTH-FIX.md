# Production Google OAuth Error 401: invalid_client - URGENT FIX

## Current Error in Production

```
Access blocked: authorisation error
The OAuth client was not found.
Error 401: invalid_client
```

## Root Cause Analysis

The error occurs because:

1. **Frontend Code**: Uses `@react-oauth/google` with `flow: 'implicit'` (correct)
2. **Google Cloud Console**: Client ID `897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com` is configured with **redirect URIs** 
3. **Mismatch**: Implicit flow doesn't use redirect URIs, but Google expects them because they're configured

## IMMEDIATE FIX REQUIRED

### Step 1: Update Google Cloud Console (CRITICAL)

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Navigate to**: APIs & Services → Credentials
3. **Find**: OAuth 2.0 Client ID `897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com`
4. **Click** on the Client ID to edit

### Step 2: Remove ALL Redirect URIs

**❌ REMOVE these from "Authorized redirect URIs":**
- `https://bahaycebu-properties.com/auth/google/callback`
- Any other redirect URIs listed

**✅ KEEP only "Authorized JavaScript origins":**
- `https://bahaycebu-properties.com`
- `http://localhost:8082` (for development)

### Step 3: Verify Configuration

After editing, your OAuth client should look like:

**Authorized JavaScript origins:**
```
https://bahaycebu-properties.com
http://localhost:8082
```

**Authorized redirect URIs:**
```
(EMPTY - No entries)
```

### Step 4: Update Production Environment Variables

Remove redirect URI variables from production environment:

**Remove these variables:**
```bash
# These are NOT needed for implicit flow
VITE_GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback
GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback
```

**Keep these variables:**
```bash
# These are required
VITE_GOOGLE_CLIENT_ID=897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com
GOOGLE_CLIENT_ID=897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## Why This Happens

### Implicit Flow vs Authorization Code Flow

**Current Frontend (Implicit Flow):**
```typescript
const googleLogin = useGoogleLogin({
  onSuccess: handleGoogleSuccess,
  flow: 'implicit', // ← This doesn't use redirect URIs
  scope: 'email profile openid',
});
```

**Backend (Authorization Code Flow):**
```typescript
// In server.ts - uses redirect URIs
redirect_uri: process.env.GOOGLE_REDIRECT_URI!
```

### The Problem

Google Client ID was configured for **authorization code flow** (backend) but frontend uses **implicit flow**.

## Common Mistakes That Cause This Error

1. **Wrong Client Type**: Using "Web application" with redirect URIs for implicit flow <mcreference link="https://stackoverflow.com/questions/11485271/google-oauth-2-authorization-error-redirect-uri-mismatch" index="1">1</mcreference>
2. **Environment Variable Issues**: Using literal strings instead of actual values <mcreference link="https://stackoverflow.com/questions/51179066/google-oauth2-error-401-invalid-client" index="4">4</mcreference>
3. **URL Mismatches**: HTTP vs HTTPS, www vs non-www, trailing slashes <mcreference link="https://stackoverflow.com/questions/71462058/google-oauth-2-error-400-redirect-uri-mismatch-but-redirect-uri-is-compliant-an" index="5">5</mcreference>

## Verification Steps

### After Making Changes:

1. **Wait 5-10 minutes** for Google changes to propagate
2. **Clear browser cache** completely
3. **Test login** on production site
4. **Check browser console** for any remaining errors

### Expected Behavior:

✅ Google login popup opens
✅ User can select Google account
✅ User gets redirected back to app
✅ Login completes successfully

## Alternative Solution: Switch to Authorization Code Flow

If you prefer to keep redirect URIs, change frontend to authorization code flow:

```typescript
const googleLogin = useGoogleLogin({
  onSuccess: handleGoogleSuccess,
  flow: 'auth-code', // ← Change to authorization code
  scope: 'email profile openid',
});
```

**But this requires:**
- Keeping redirect URIs in Google Cloud Console
- Modifying success handler for authorization codes
- Additional backend processing

## Recommended Action

**STICK WITH IMPLICIT FLOW** - it's simpler and matches current implementation.

## Deployment Platforms

If using Vercel/Netlify/other platforms, also update environment variables there:

```bash
# Remove these
vercel env rm VITE_GOOGLE_REDIRECT_URI
vercel env rm GOOGLE_REDIRECT_URI

# Keep these
vercel env add VITE_GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_ID  
vercel env add GOOGLE_CLIENT_SECRET
```

## Timeline

- **Google Cloud Console changes**: 5-10 minutes to propagate
- **Environment variable updates**: Immediate after deployment
- **Total fix time**: 15-20 minutes

## Support

If the error persists after following these steps:

1. **Double-check** Google Cloud Console has NO redirect URIs
2. **Verify** JavaScript origins include your production domain
3. **Clear** all browser data and try again
4. **Check** that Client ID in environment matches Google Cloud Console

---

**URGENT**: This fix must be applied immediately to restore Google login functionality in production.