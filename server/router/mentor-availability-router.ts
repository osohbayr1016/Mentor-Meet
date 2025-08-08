import { Router } from "express";
import {
  setMentorAvailability,
  getMentorAvailability,
  updateMentorAvailability,
  deleteMentorAvailability,
} from "../controller/mentor-availability";

export const MentorAvailabilityRouter = Router();

// Set mentor availability
MentorAvailabilityRouter.post("/set-availability", setMentorAvailability);

// Get mentor availability
MentorAvailabilityRouter.get(
  "/get-availability/:mentorId",
  getMentorAvailability
);

// Update mentor availability
MentorAvailabilityRouter.put("/update-availability", updateMentorAvailability);

// Delete mentor availability
MentorAvailabilityRouter.delete(
  "/delete-availability/:mentorId/:date",
  deleteMentorAvailability
);
