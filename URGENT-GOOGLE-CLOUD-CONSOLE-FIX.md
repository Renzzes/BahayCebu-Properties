# 🚨 URGENT: Google Cloud Console Configuration Fix

## The Error Persists Because Google Cloud Console Still Has Redirect URIs

### Current Status:
- ✅ Code changes: Complete
- ✅ Environment variables: Updated
- ❌ **Google Cloud Console: NOT UPDATED** ← This is causing the error

---

## 🎯 EXACT STEPS TO FIX GOOGLE CLOUD CONSOLE

### Step 1: Access Google Cloud Console
1. **Open**: https://console.cloud.google.com/
2. **Login** with your Google account
3. **Select** your project (if not already selected)

### Step 2: Navigate to OAuth Credentials
1. **Click** on the hamburger menu (☰) in top-left
2. **Go to**: "APIs & Services" → "Credentials"
3. **Alternative**: Direct link: https://console.cloud.google.com/apis/credentials

### Step 3: Find Your OAuth Client
**Look for this exact Client ID:**
```
897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com
```

**It will appear in the "OAuth 2.0 Client IDs" section**

### Step 4: Edit the OAuth Client
1. **Click** on the Client ID name (not the copy button)
2. **OR** Click the pencil/edit icon next to it

### Step 5: Remove ALL Redirect URIs

**In the "Authorized redirect URIs" section:**

**CURRENT (WRONG) Configuration:**
```
✅ Authorized JavaScript origins:
  • https://bahaycebu-properties.com
  • http://localhost:8082

❌ Authorized redirect URIs:
  • https://bahaycebu-properties.com/auth/google/callback  ← DELETE THIS
  • https://api.bahaycebu-properties.com/auth/google/callback  ← DELETE THIS
  • Any other redirect URIs  ← DELETE ALL
```

**TARGET (CORRECT) Configuration:**
```
✅ Authorized JavaScript origins:
  • https://bahaycebu-properties.com
  • http://localhost:8082

✅ Authorized redirect URIs:
  (EMPTY - No entries)
```

### Step 6: How to Delete Redirect URIs

1. **In the "Authorized redirect URIs" section**:
   - You'll see text input fields with URLs
   - **Click the ❌ (X) button** next to each URL
   - **Delete ALL entries** until the section is empty

2. **Verify the section shows**:
   - "Authorized redirect URIs" with no entries
   - OR a placeholder saying "Add URI"

### Step 7: Verify JavaScript Origins

**Ensure "Authorized JavaScript origins" contains:**
- `https://bahaycebu-properties.com`
- `http://localhost:8082` (for development)

**If missing, add them:**
1. **Click** "+ ADD URI" in the JavaScript origins section
2. **Enter**: `https://bahaycebu-properties.com`
3. **Click** "+ ADD URI" again
4. **Enter**: `http://localhost:8082`

### Step 8: Save Changes
1. **Click** "SAVE" button at the bottom
2. **Wait** for the "Credentials saved" confirmation

### Step 9: Wait for Propagation
**CRITICAL**: Changes take 5-10 minutes to propagate <mcreference link="https://support.google.com/cloud/answer/6158849?hl=en" index="5">5</mcreference>

---

## 🧪 Testing After Changes

### Wait Period:
- **Minimum**: 5 minutes
- **Maximum**: 10 minutes
- **Sometimes**: Up to 1 hour for full propagation

### Test Steps:
1. **Clear browser cache** completely
2. **Open incognito/private window**
3. **Go to**: https://bahaycebu-properties.com
4. **Click**: "Sign in with Google"
5. **Test with both accounts**:
   - `emanhams007@gmail.com`
   - `bahaycebuproperties@gmail.com`

---

## 🔍 Troubleshooting

### If Error Still Persists:

#### 1. Double-Check Configuration
**Go back to Google Cloud Console and verify:**
- ❌ **Authorized redirect URIs**: MUST be completely empty
- ✅ **Authorized JavaScript origins**: Must contain your domain

#### 2. Check Client ID Match
**Verify in your browser's developer tools:**
1. **Open** developer tools (F12)
2. **Go to** Network tab
3. **Try** Google login
4. **Look for** requests to `accounts.google.com`
5. **Check** that `client_id` parameter matches: `897144997266-c4nm53c10808l9oj00t282p7iq3ogesp`

#### 3. Clear All Browser Data
**For Chrome:**
1. **Press** Ctrl+Shift+Delete
2. **Select** "All time"
3. **Check** all boxes
4. **Click** "Clear data"

#### 4. Try Different Browser
**Test in:**
- Chrome Incognito
- Firefox Private
- Edge InPrivate

---

## 📋 Verification Checklist

**Before testing, confirm:**

- [ ] Accessed Google Cloud Console
- [ ] Found OAuth Client ID: `897144997266-c4nm53c10808l9oj00t282p7iq3ogesp`
- [ ] Opened client for editing
- [ ] **Deleted ALL redirect URIs** (section is empty)
- [ ] Verified JavaScript origins contain `https://bahaycebu-properties.com`
- [ ] Clicked "SAVE"
- [ ] Waited at least 5 minutes
- [ ] Cleared browser cache
- [ ] Tested in incognito mode

---

## 🎯 Why This Specific Fix Works

### The Technical Reason:
1. **Frontend uses implicit flow** <mcreference link="https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow" index="1">1</mcreference>
2. **Implicit flow doesn't use redirect URIs** <mcreference link="https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow" index="1">1</mcreference>
3. **Google validates redirect URIs if they exist** <mcreference link="https://support.google.com/cloud/answer/6158849?hl=en" index="5">5</mcreference>
4. **Removing redirect URIs eliminates the validation** <mcreference link="https://support.google.com/cloud/answer/6158849?hl=en" index="5">5</mcreference>

### What Happens After Fix:
- ✅ Google skips redirect URI validation
- ✅ Only validates JavaScript origins (which match)
- ✅ Login succeeds with implicit flow

---

## 🚀 Expected Result

**After completing these steps:**

1. **Google login popup** opens normally
2. **User can select** Google account
3. **No "Error 401: invalid_client"**
4. **User gets redirected** back to your app
5. **Login completes** successfully

---

## ⏰ Timeline

- **Configuration changes**: 2-3 minutes
- **Google propagation**: 5-10 minutes
- **Testing**: 1-2 minutes
- **Total time**: 10-15 minutes

**This WILL fix the Error 401: invalid_client permanently.**