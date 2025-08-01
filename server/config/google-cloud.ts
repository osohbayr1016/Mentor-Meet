import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

// Google Cloud configuration
const googleCloudConfig = {
    projectId: process.env.GOOGLE_PROJECT_ID || "mentormeet-467407",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

// Initialize Google Auth
const auth = new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to service account key file
    scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ],
});

// Initialize Google Calendar API
const calendar = google.calendar({ version: "v3", auth });

// Initialize Google People API
const people = google.people({ version: "v1", auth });

interface EventData {
    start: string;
    end: string;
    mentorEmail: string;
    menteeEmail: string;
    title?: string;
    description?: string;
}

interface CreatedEvent {
    eventId: string;
    hangoutLink?: string;
    startTime: string;
    endTime: string;
}

/**
 * Create a Google Meet event
 * @param accessToken - User's OAuth access token
 * @param eventData - Event data
 * @returns Created event
 */
async function createGoogleMeetEvent(accessToken: string, eventData: EventData): Promise<CreatedEvent> {
    try {
        const { start, end, mentorEmail, menteeEmail, title, description } = eventData;

        const event = {
            summary: title || "Mentor Meeting",
            description: description || "Meeting between mentor and mentee",
            start: {
                dateTime: start,
                timeZone: "Asia/Ulaanbaatar",
            },
            end: {
                dateTime: end,
                timeZone: "Asia/Ulaanbaatar",
            },
            attendees: [{ email: mentorEmail }, { email: menteeEmail }],
            conferenceData: {
                createRequest: {
                    requestId: `meet-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet" as const,
                    },
                },
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: "email" as const, minutes: 24 * 60 },
                    { method: "popup" as const, minutes: 10 },
                ],
            },
        };

        // Create a new auth client with the access token
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
            conferenceDataVersion: 1,
            auth: oauth2Client,
        });

        return {
            eventId: response.data.id!,
            hangoutLink: response.data.hangoutLink || undefined,
            startTime: response.data.start!.dateTime!,
            endTime: response.data.end!.dateTime!,
        };
    } catch (error) {
        console.error("Error creating Google Meet event:", error);
        throw new Error("Failed to create Google Meet event");
    }
}

/**
 * Get user's calendar events
 * @param accessToken - User's OAuth access token
 * @param timeMin - Start time (ISO string)
 * @param timeMax - End time (ISO string)
 * @returns Calendar events
 */
async function getCalendarEvents(accessToken: string, timeMin: string, timeMax: string): Promise<any[]> {
    try {
        // Create a new auth client with the access token
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const response = await calendar.events.list({
            calendarId: "primary",
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
            auth: oauth2Client,
        });

        return response.data.items || [];
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw new Error("Failed to fetch calendar events");
    }
}

/**
 * Get user profile information
 * @param accessToken - User's OAuth access token
 * @returns User profile
 */
async function getUserProfile(accessToken: string): Promise<any> {
    try {
        // Create a new auth client with the access token
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const response = await people.people.get({
            resourceName: "people/me",
            personFields: "names,emailAddresses,photos",
            auth: oauth2Client,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Failed to fetch user profile");
    }
}

/**
 * Check if user has calendar access
 * @param accessToken - User's OAuth access token
 * @returns Has calendar access
 */
async function hasCalendarAccess(accessToken: string): Promise<boolean> {
    try {
        // Create a new auth client with the access token
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        await calendar.calendarList.list({
            auth: oauth2Client,
        });
        return true;
    } catch (error) {
        console.error("User does not have calendar access:", error);
        return false;
    }
}

export {
    googleCloudConfig,
    auth,
    calendar,
    people,
    createGoogleMeetEvent,
    getCalendarEvents,
    getUserProfile,
    hasCalendarAccess,
}; 