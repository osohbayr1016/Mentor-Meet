# Google OAuth 403 Error Fix Guide

## 🚨 **Current Issue**

You're getting a 403 access_denied error when trying to authenticate with Google OAuth.

## 🔍 **Root Cause Analysis**

The error shows:

- **Redirect URI**: `http://localhost:3000/api/auth/callback/google`
- **Your App**: Running on `http://localhost:3001`
- **Mismatch**: Port 3000 vs 3001

## ✅ **Step-by-Step Fix**

### 1. **Update Google Cloud Console OAuth Settings**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project: `mentormeet-467407`
3. Go to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID and click **Edit**

### 2. **Fix Authorized Redirect URIs**

Update the **Authorized redirect URIs** to include:

```
http://localhost:3001/api/auth/callback/google
```

**NOT** `http://localhost:3000/api/auth/callback/google`

### 3. **Fix Authorized JavaScript Origins**

Update the **Authorized JavaScript origins** to include:

```
http://localhost:3001
```

### 4. **Configure OAuth Consent Screen**

1. Go to **APIs & Services** > **OAuth consent screen**
2. Make sure these scopes are added:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`

### 5. **Add Test Users**

1. In **OAuth consent screen**, go to **Test users**
2. Click **Add Users**
3. Add your email address(es) that you'll use for testing

### 6. **Update Environment Variables**

Make sure your `client/.env.local` has:

```env
NEXTAUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=your-actual-client-id
GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

### 7. **Verify Client Configuration**

Check that your `client/src/lib/auth.ts` has the correct scopes:

```typescript
scope: [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
].join(" "),
```

## 🧪 **Testing Steps**

### 1. **Clear Browser Cache**

- Clear all browser data for localhost
- Or use incognito/private mode

### 2. **Restart Development Servers**

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

### 3. **Test Authentication**

1. Go to `http://localhost:3001/auth/signin`
2. Click "Google-аар нэвтрэх"
3. Should now work without 403 error

## 🔧 **Alternative Quick Fix**

If you want to use port 3000 instead:

### Update client/.env.local:

```env
NEXTAUTH_URL=http://localhost:3000
```

### Update client/package.json scripts:

```json
"dev": "next dev -p 3000"
```

### Update Google Cloud Console:

- Add `http://localhost:3000` to JavaScript origins
- Add `http://localhost:3000/api/auth/callback/google` to redirect URIs

## 🚨 **Common Issues & Solutions**

### Issue 1: "App not verified by Google"

**Solution**: Add your email as a test user in OAuth consent screen

### Issue 2: "Invalid client"

**Solution**: Double-check client ID and secret in environment variables

### Issue 3: "redirect_uri_mismatch"

**Solution**: Ensure redirect URI exactly matches what's in Google Cloud Console

### Issue 4: "access_denied"

**Solution**: Make sure you're using a test user email

## 📋 **Verification Checklist**

- [ ] Google Cloud Console redirect URI updated to port 3001
- [ ] Google Cloud Console JavaScript origins updated to port 3001
- [ ] OAuth consent screen has all required scopes
- [ ] Test users added to OAuth consent screen
- [ ] Environment variables updated with correct port
- [ ] Browser cache cleared
- [ ] Development servers restarted
- [ ] Authentication flow tested

## 🆘 **Still Having Issues?**

1. **Check Google Cloud Console logs** for detailed error messages
2. **Verify all environment variables** are correctly set
3. **Ensure you're using a test user email** for development
4. **Check that your app is actually running** on the correct port

## 📞 **Next Steps**

After fixing the OAuth issue:

1. Test the complete authentication flow
2. Test Google Calendar integration
3. Test meeting creation functionality
4. Deploy to production with updated credentials
