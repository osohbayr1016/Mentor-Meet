# Google Meet Integration

This document explains how the Google Meet integration works in the Mentor Meet platform and how to set it up.

## Overview

The Google Meet integration allows mentors and students to automatically create Google Meet meetings when booking mentorship sessions. The integration includes:

- Automatic Google Meet link generation during booking
- Meeting management dashboard for mentors
- Calendar integration for scheduled meetings
- Email invitations to all participants

## Features

### ✅ Completed Features

1. **Automatic Meet Creation**: When a mentor marks their availability and confirms a booking, Google Meet links are automatically generated for each time slot.

2. **Enhanced Booking Modal**: 
   - Shows multiple Google Meet links for multiple time slots
   - Better error handling with user-friendly messages
   - Copy functionality for meeting links
   - Direct meeting access buttons

3. **Meeting Management Dashboard**:
   - View all upcoming and past meetings
   - Cancel meetings directly from the dashboard
   - Copy meeting links
   - Join meetings with one click

4. **Calendar Integration**: Meetings are added to Google Calendar with:
   - Automatic Google Meet links
   - Email reminders (24 hours and 10 minutes before)
   - Attendee invitations

5. **Multi-page Integration**:
   - Meeting manager integrated into mentor dashboard
   - Dedicated meetings page (`/meetings`)
   - Easy navigation between calendar and meetings

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Calendar API
   - Google People API (for profile information)

### 2. OAuth 2.0 Configuration

1. Go to "APIs & Services" > "Credentials"
2. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

### 3. Environment Variables

Copy the provided `client/env.example` to `client/.env.local` and fill in your credentials:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console

# API Configuration
NEXT_PUBLIC_API_URL=https://mentor-meet-o3rp.onrender.com
```

### 4. Required Scopes

The application requests the following Google OAuth scopes:
- `openid` - Basic authentication
- `email` - User email address
- `profile` - User profile information
- `https://www.googleapis.com/auth/calendar` - Full calendar access
- `https://www.googleapis.com/auth/calendar.events` - Calendar events management

## API Endpoints

### Meeting Creation
- **Endpoint**: `POST /api/create-meeting`
- **Purpose**: Creates a Google Calendar event with Google Meet link
- **Authentication**: Requires valid Google OAuth session

### Get Meetings
- **Endpoint**: `GET /api/get-meetings`
- **Purpose**: Retrieves upcoming mentorship meetings from Google Calendar
- **Authentication**: Requires valid Google OAuth session

### Cancel Meeting
- **Endpoint**: `DELETE /api/cancel-meeting`
- **Purpose**: Cancels a meeting by deleting the Google Calendar event
- **Authentication**: Requires valid Google OAuth session

## File Structure

```
client/src/
├── app/
│   ├── api/
│   │   ├── create-meeting/route.ts     # Meeting creation API
│   │   ├── get-meetings/route.ts       # Meeting retrieval API
│   │   └── cancel-meeting/route.ts     # Meeting cancellation API
│   ├── meetings/page.tsx               # Dedicated meetings page
│   └── mentor-dashboard/page.tsx       # Enhanced with meeting manager
├── components/
│   ├── BookingModal.tsx                # Enhanced booking flow
│   └── MeetingManager.tsx              # Meeting management component
└── lib/
    ├── auth.ts                         # NextAuth configuration
    └── google-calendar.ts              # Google Calendar API utilities
```

## User Flow

### For Mentors:

1. **Setup Availability**:
   - Go to mentor calendar
   - Select available time slots
   - Confirm availability

2. **Automatic Meeting Creation**:
   - System creates Google Calendar events
   - Google Meet links are generated automatically
   - Email invitations sent to participants

3. **Manage Meetings**:
   - View meetings in dashboard or dedicated meetings page
   - Cancel meetings if needed
   - Copy meeting links to share
   - Join meetings directly

### For Students:

1. **Book Sessions**:
   - Browse mentor availability
   - Select desired time slots
   - Complete booking process

2. **Receive Meeting Details**:
   - Get Google Calendar invitation
   - Receive email with meeting link
   - Automatic reminders

## Error Handling

The integration includes comprehensive error handling:

- **Authentication Errors**: Clear messages for OAuth issues
- **API Errors**: User-friendly error messages in Mongolian
- **Network Issues**: Retry mechanisms and fallback options
- **Permission Errors**: Specific handling for insufficient permissions

## Security Considerations

- OAuth tokens are handled securely through NextAuth
- Meeting creation requires authenticated sessions
- Only meeting creators can cancel meetings
- All API calls are server-side to protect credentials

## Monitoring and Debugging

- All Google Calendar API calls are logged
- Error responses include specific error codes
- Debug information available in browser console
- Meeting creation status is clearly communicated to users

## Future Enhancements

- Integration with payment system for paid sessions
- Recurring meeting support
- Advanced calendar features (multiple calendars)
- Meeting recording integration
- Waitlist functionality for popular time slots

## Troubleshooting

### Common Issues:

1. **"Authentication required" errors**:
   - Ensure user is signed in with Google
   - Check OAuth scopes are properly configured

2. **"Failed to create meeting" errors**:
   - Verify Google Calendar API is enabled
   - Check API quotas and limits
   - Ensure proper OAuth scopes

3. **Meeting links not appearing**:
   - Check Google Meet is enabled for the Google Workspace
   - Verify conferenceData.createRequest is properly set

### Debug Steps:

1. Check browser console for API errors
2. Verify OAuth token is present in session
3. Test Google Calendar API access manually
4. Check Google Cloud Console for API usage and errors

## Support

For technical support or questions about the Google Meet integration, please refer to:
- Google Calendar API documentation
- NextAuth.js documentation
- The project's issue tracker