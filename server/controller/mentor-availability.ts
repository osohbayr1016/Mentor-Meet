import { Request, Response } from "express";
import { MentorAvailability } from "../model/mentor-availability-model";

// Set mentor availability
export const setMentorAvailability = async (req: Request, res: Response) => {
  try {
    const { mentorId, availabilities } = req.body;

    if (!mentorId || !availabilities || !Array.isArray(availabilities)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    // Process each availability
    const availabilityPromises = availabilities.map(async (availability) => {
      const { date, times } = availability;

      if (!date || !times || !Array.isArray(times)) {
        throw new Error("Invalid availability data");
      }

      // Convert date string to Date object
      const dateObj = new Date(date);

      // Use upsert to either create new or update existing
      return await MentorAvailability.findOneAndUpdate(
        { mentorId, date: dateObj },
        {
          mentorId,
          date: dateObj,
          availableTimes: times,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    });

    const results = await Promise.all(availabilityPromises);

    res.status(200).json({
      success: true,
      message: "Mentor availability set successfully",
      data: results,
    });
  } catch (error) {
    console.error("SET MENTOR AVAILABILITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

// Get mentor availability
export const getMentorAvailability = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: "Mentor ID is required",
      });
    }

    const availabilities = await MentorAvailability.find({
      mentorId,
      isActive: true,
    }).sort({ date: 1 });

    // Transform data to match frontend expectations
    const transformedData = availabilities.map((availability) => {
      const dateStr = availability.date.toISOString().split("T")[0]; // YYYY-MM-DD
      const day = dateStr.split("-")[2]; // Get day part

      return {
        date: day,
        times: availability.availableTimes,
      };
    });

    res.status(200).json({
      success: true,
      message: "Mentor availability retrieved successfully",
      data: transformedData,
    });
  } catch (error) {
    console.error("GET MENTOR AVAILABILITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

// Update mentor availability
export const updateMentorAvailability = async (req: Request, res: Response) => {
  try {
    const { mentorId, availabilities } = req.body;

    if (!mentorId || !availabilities || !Array.isArray(availabilities)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    // First, deactivate all existing availabilities for this mentor
    await MentorAvailability.updateMany({ mentorId }, { isActive: false });

    // Then set new availabilities
    const availabilityPromises = availabilities.map(async (availability) => {
      const { date, times } = availability;

      if (!date || !times || !Array.isArray(times)) {
        throw new Error("Invalid availability data");
      }

      const dateObj = new Date(date);

      return await MentorAvailability.findOneAndUpdate(
        { mentorId, date: dateObj },
        {
          mentorId,
          date: dateObj,
          availableTimes: times,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    });

    const results = await Promise.all(availabilityPromises);

    res.status(200).json({
      success: true,
      message: "Mentor availability updated successfully",
      data: results,
    });
  } catch (error) {
    console.error("UPDATE MENTOR AVAILABILITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

// Delete mentor availability
export const deleteMentorAvailability = async (req: Request, res: Response) => {
  try {
    const { mentorId, date } = req.params;

    if (!mentorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Mentor ID and date are required",
      });
    }

    const dateObj = new Date(date);

    const result = await MentorAvailability.findOneAndDelete({
      mentorId,
      date: dateObj,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Availability not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor availability deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MENTOR AVAILABILITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};
