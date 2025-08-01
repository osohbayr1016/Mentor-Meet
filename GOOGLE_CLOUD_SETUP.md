# Google Cloud Platform Setup for Mentor-Meet

This guide will help you set up Google Cloud Platform integration for the Mentor-Meet project.

## Prerequisites

1. Google Cloud Platform account
2. Project ID: `mentormeet-467407`
3. Node.js and npm installed

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/welcome?inv=1&invt=Ab4Rww&project=mentormeet-467407)
2. Select or create the project with ID: `mentormeet-467407`

### 1.2 Enable Required APIs

Enable the following APIs in your Google Cloud project:

```bash
# Google Calendar API
gcloud services enable calendar-json.googleapis.com

# Google OAuth2 API
gcloud services enable oauth2.googleapis.com

# Google People API (for profile information)
gcloud services enable people.googleapis.com
```

### 1.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Configure the OAuth consent screen:

   - User Type: External
   - App name: Mentor-Meet
   - User support email: your-email@domain.com
   - Developer contact information: your-email@domain.com

4. Add scopes:

   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`

5. Add test users (your email addresses)

6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Mentor-Meet Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3001` (development)
     - `https://your-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)

## Step 2: Environment Configuration

### 2.1 Client Environment Variables

Create/update `client/.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your-api-key-optional
```

### 2.2 Server Environment Variables

Create/update `server/.env`:

```env
# Database
MONGODB_URI=mongodb+srv://anandoctane4:uVPeDYELoaGaO46X@food-delivery.wdjmkc7.mongodb.net/mentor-meet

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-2024

# Google Cloud (for server-side operations)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_PROJECT_ID=mentormeet-467407
```

## Step 3: Google Calendar Integration

### 3.1 Calendar API Setup

The project already includes Google Calendar integration in:

- `client/src/lib/google-calendar.ts` - Calendar API functions
- `client/src/app/api/create-meeting/route.ts` - Meeting creation endpoint
- `client/src/app/api/mark-availability/route.ts` - Availability marking

### 3.2 Calendar Permissions

Ensure your Google account has:

1. Calendar access enabled
2. Permission to create calendar events
3. Permission to read calendar availability

## Step 4: Testing the Integration

### 4.1 Start the Development Servers

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

### 4.2 Test Authentication

1. Navigate to `http://localhost:3001/auth/signin`
2. Click "Google-аар нэвтрэх" (Sign in with Google)
3. Complete the OAuth flow
4. Verify you're redirected to the mentor calendar

### 4.3 Test Calendar Integration

1. Sign in as a mentor
2. Navigate to the mentor calendar
3. Try creating a meeting or marking availability
4. Verify calendar events are created in Google Calendar

## Step 5: Production Deployment

### 5.1 Update OAuth Credentials

For production deployment:

1. Update OAuth 2.0 Client ID in Google Cloud Console:

   - Add your production domain to authorized origins
   - Add production callback URL

2. Update environment variables:
   - Set `NEXTAUTH_URL` to your production domain
   - Use production Google credentials

### 5.2 Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **OAuth Scopes**: Only request necessary scopes
3. **API Keys**: Rotate keys regularly
4. **HTTPS**: Always use HTTPS in production

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch"**: Check authorized redirect URIs in Google Cloud Console
2. **"invalid_client"**: Verify client ID and secret
3. **Calendar permissions**: Ensure user has granted calendar access
4. **CORS issues**: Check authorized JavaScript origins

### Debug Mode

Enable debug mode in development:

```env
NODE_ENV=development
NEXTAUTH_DEBUG=true
```

## API Endpoints

The following endpoints are available for Google integration:

- `POST /api/create-meeting` - Create Google Meet events
- `POST /api/mark-availability` - Mark mentor availability
- `GET /api/get-available-mentors` - Get available mentors

## Support

For issues with Google Cloud setup:

1. Check Google Cloud Console logs
2. Verify OAuth consent screen configuration
3. Ensure all required APIs are enabled
4. Check environment variable configuration
