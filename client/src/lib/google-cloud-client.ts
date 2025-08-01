import { getSession } from "next-auth/react";

/**
 * Google Cloud API client for client-side operations
 */
export class GoogleCloudClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }

  /**
   * Get the current session's access token
   */
  private async getAccessToken(): Promise<string | null> {
    const session = await getSession();
    return session?.accessToken || null;
  }

  /**
   * Make an authenticated request to the Google Cloud API
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const accessToken = await this.getAccessToken();
    
    if (!accessToken) {
      throw new Error("No access token available. Please sign in.");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response;
  }

  /**
   * Create a Google Meet event
   */
  async createMeeting(meetingData: {
    start: string;
    end: string;
    mentorEmail: string;
    menteeEmail: string;
    title?: string;
    description?: string;
  }) {
    const response = await this.makeRequest("/google/meeting", {
      method: "POST",
      body: JSON.stringify(meetingData),
    });

    return response.json();
  }

  /**
   * Get calendar events for a time range
   */
  async getEvents(timeMin: string, timeMax: string) {
    const response = await this.makeRequest(
      `/google/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`
    );

    return response.json();
  }

  /**
   * Get user profile information
   */
  async getUserProfile() {
    const response = await this.makeRequest("/google/user");
    return response.json();
  }

  /**
   * Check if user has calendar access
   */
  async checkCalendarAccess() {
    const response = await this.makeRequest("/google/calendar-access");
    return response.json();
  }

  /**
   * Create a meeting using the existing client-side API
   */
  async createMeetingViaClientAPI(meetingData: {
    start: string;
    end: string;
    mentorEmail: string;
    menteeEmail: string;
    title?: string;
    description?: string;
  }) {
    const response = await fetch("/api/create-meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Mark mentor availability
   */
  async markAvailability(availabilityData: {
    start: string;
    end: string;
    mentorEmail: string;
    date: string;
    time: string;
  }) {
    const response = await fetch("/api/mark-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(availabilityData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get available mentors
   */
  async getAvailableMentors(category?: string) {
    const params = new URLSearchParams();
    if (category && category !== "all") {
      params.append("category", category);
    }

    const response = await fetch(`/api/get-available-mentors?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

// Export a singleton instance
export const googleCloudClient = new GoogleCloudClient(); 