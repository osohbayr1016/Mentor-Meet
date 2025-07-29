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
        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
            conferenceDataVersion: 1,
        });

        const createdEvent = response.data;

        if (!createdEvent.conferenceData?.entryPoints?.[0]?.uri) {
            throw new Error("Failed to create Google Meet link");
        }

        return {
            hangoutLink: createdEvent.conferenceData.entryPoints[0].uri,
            eventId: createdEvent.id!,
            startTime: createdEvent.start!.dateTime!,
            endTime: createdEvent.end!.dateTime!,
        };
    } catch (error) {
        console.error("Error creating Google Calendar event:", error);
        throw new Error("Failed to create meeting");
    }
} 