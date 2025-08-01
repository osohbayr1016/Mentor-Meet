import { Request, Response } from "express";
import { createGoogleMeetEvent, getCalendarEvents, getUserProfile, hasCalendarAccess } from "../config/google-cloud";

/**
 * Create a Google Meet event
 */
export const createMeeting = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.headers;
    const { start, end, mentorEmail, menteeEmail, title, description } = req.body;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Validate required fields
    if (!start || !end || !mentorEmail || !menteeEmail) {
      return res.status(400).json({
        error: "Missing required fields: start, end, mentorEmail, menteeEmail"
      });
    }

    // Check if user has calendar access
    const hasAccess = await hasCalendarAccess(accessToken as string);
    if (!hasAccess) {
      return res.status(403).json({
        error: "Calendar access required. Please grant calendar permissions."
      });
    }

    // Create the meeting
    const meetingData = await createGoogleMeetEvent(accessToken as string, {
      start,
      end,
      mentorEmail,
      menteeEmail,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: meetingData,
    });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({
      error: "Failed to create meeting",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get user's calendar events
 */
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.headers;
    const { timeMin, timeMax } = req.query;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Validate time parameters
    if (!timeMin || !timeMax) {
      return res.status(400).json({
        error: "Missing required parameters: timeMin, timeMax"
      });
    }

    // Check if user has calendar access
    const hasAccess = await hasCalendarAccess(accessToken as string);
    if (!hasAccess) {
      return res.status(403).json({
        error: "Calendar access required. Please grant calendar permissions."
      });
    }

    // Get calendar events
    const events = await getCalendarEvents(
      accessToken as string,
      timeMin as string,
      timeMax as string
    );

    res.status(200).json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      error: "Failed to fetch calendar events",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Get user profile information
 */
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.headers;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Get user profile
    const profile = await getUserProfile(accessToken as string);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      error: "Failed to fetch user profile",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Check calendar access
 */
export const checkCalendarAccess = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.headers;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Check if user has calendar access
    const hasAccess = await hasCalendarAccess(accessToken as string);

    res.status(200).json({
      success: true,
      hasCalendarAccess: hasAccess,
    });
  } catch (error) {
    console.error("Error checking calendar access:", error);
    res.status(500).json({
      error: "Failed to check calendar access",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}; 