const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

// Google Cloud configuration
const googleCloudConfig = {
  projectId: process.env.GOOGLE_PROJECT_ID || 'mentormeet-467407',
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

// Initialize Google Auth
const auth = new GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to service account key file
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
});

// Initialize Google Calendar API
const calendar = google.calendar({ version: 'v3', auth });

// Initialize Google People API
const people = google.people({ version: 'v1', auth });

/**
 * Create a Google Meet event
 * @param {string} accessToken - User's OAuth access token
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
async function createGoogleMeetEvent(accessToken, eventData) {
  try {
    const { start, end, mentorEmail, menteeEmail, title, description } = eventData;

    const event = {
      summary: title || 'Mentor Meeting',
      description: description || 'Meeting between mentor and mentee',
      start: {
        dateTime: start,
        timeZone: 'Asia/Ulaanbaatar',
      },
      end: {
        dateTime: end,
        timeZone: 'Asia/Ulaanbaatar',
      },
      attendees: [
        { email: mentorEmail },
        { email: menteeEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      auth: {
        access_token: accessToken,
      },
    });

    return {
      eventId: response.data.id,
      hangoutLink: response.data.hangoutLink,
      startTime: response.data.start.dateTime,
      endTime: response.data.end.dateTime,
    };
  } catch (error) {
    console.error('Error creating Google Meet event:', error);
    throw new Error('Failed to create Google Meet event');
  }
}

/**
 * Get user's calendar events
 * @param {string} accessToken - User's OAuth access token
 * @param {string} timeMin - Start time (ISO string)
 * @param {string} timeMax - End time (ISO string)
 * @returns {Promise<Array>} Calendar events
 */
async function getCalendarEvents(accessToken, timeMin, timeMax) {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      auth: {
        access_token: accessToken,
      },
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Failed to fetch calendar events');
  }
}

/**
 * Get user profile information
 * @param {string} accessToken - User's OAuth access token
 * @returns {Promise<Object>} User profile
 */
async function getUserProfile(accessToken) {
  try {
    const response = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
      auth: {
        access_token: accessToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

/**
 * Check if user has calendar access
 * @param {string} accessToken - User's OAuth access token
 * @returns {Promise<boolean>} Has calendar access
 */
async function hasCalendarAccess(accessToken) {
  try {
    await calendar.calendarList.list({
      auth: {
        access_token: accessToken,
      },
    });
    return true;
  } catch (error) {
    console.error('User does not have calendar access:', error);
    return false;
  }
}

module.exports = {
  googleCloudConfig,
  auth,
  calendar,
  people,
  createGoogleMeetEvent,
  getCalendarEvents,
  getUserProfile,
  hasCalendarAccess,
}; 