import { Request, Response } from "express";
import { MeetingModel, MeetingStatus } from "../../model/meeting.model";
import { Types } from "mongoose";

export const mentorCancelMeeting = async (req: Request, res: Response) => {
  try {
    const { mentorId } = res.locals;
    const { meetingId } = req.body;

    if (!Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const meeting = await MeetingModel.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (meeting.mentorId.toString() !== mentorId) {
      return res.status(403).json({
        message: "You are not authorized to cancel this meeting.",
      });
    }

    meeting.status = MeetingStatus.CANCELLED;
    await meeting.save();

    return res
      .status(200)
      .json({ message: "Meeting cancelled successfully", meeting });
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
