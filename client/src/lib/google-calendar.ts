import { google } from "googleapis";

export interface MeetingRequest {
    start: string;
    end: string;
    mentorEmail: string;
    menteeEmail: string;
    title?: string;
    description?: string;
}

export interface MeetingResponse {
    hangoutLink: string;
    eventId: string;
    startTime: string;
    endTime: string;
}

export function createGoogleCalendarClient(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accessToken,
    });

    return google.calendar({ version: "v3", auth: oauth2Client });
}

export async function createGoogleMeetEvent(
    accessToken: string,
    meetingData: MeetingRequest
): Promise<MeetingResponse> {
    const calendar = createGoogleCalendarClient(accessToken);

    const event = {
        summary: meetingData.title || "Mentorship Session",
        description: meetingData.description || "Mentorship session between mentor and mentee",
        start: {
            dateTime: meetingData.start,
            timeZone: "UTC",
        },
        end: {
            dateTime: meetingData.end,
            timeZone: "UTC",
        },
        attendees: [
            { email: meetingData.mentorEmail },
            { email: meetingData.menteeEmail },
        ],
        conferenceData: {
            createRequest: {
                requestId: `meeting-${Date.now()}`,
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
            ],
        },
    };

    try {
        console.log("Creating calendar event with data:", {
            summary: event.summary,
            start: event.start,
            end: event.end,
            attendees: event.attendees,
            hasConferenceData: !!event.conferenceData,
        });

        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
            conferenceDataVersion: 1,
        });

        const createdEvent = response.data;
        console.log("Calendar event created:", {
            eventId: createdEvent.id,
            hasConferenceData: !!createdEvent.conferenceData,
            entryPointsCount: createdEvent.conferenceData?.entryPoints?.length || 0,
            hangoutLink: createdEvent.hangoutLink,
        });

        // Check for Google Meet link in multiple possible locations
        let meetingLink = null;
        if (createdEvent.conferenceData?.entryPoints?.[0]?.uri) {
            meetingLink = createdEvent.conferenceData.entryPoints[0].uri;
        } else if (createdEvent.hangoutLink) {
            meetingLink = createdEvent.hangoutLink;
        }

        if (!meetingLink) {
            console.error("No meeting link found in event:", {
                conferenceData: createdEvent.conferenceData,
                hangoutLink: createdEvent.hangoutLink,
            });
            throw new Error("Failed to create Google Meet link - no meeting URL found in response");
        }

        return {
            hangoutLink: meetingLink,
            eventId: createdEvent.id!,
            startTime: createdEvent.start!.dateTime!,
            endTime: createdEvent.end!.dateTime!,
        };
    } catch (error: any) {
        console.error("Error creating Google Calendar event:", {
            error: error.message,
            status: error.status,
            code: error.code,
            details: error.details,
        });

        if (error.status === 401 || error.code === 401) {
            throw new Error("Authentication failed - please sign in with Google again");
        } else if (error.status === 403 || error.code === 403) {
            throw new Error("Permission denied - please grant calendar access to the application");
        } else if (error.message?.includes("Calendar")) {
            throw new Error(`Calendar API error: ${error.message}`);
        } else {
            throw new Error(`Failed to create meeting: ${error.message}`);
        }
    }
} 