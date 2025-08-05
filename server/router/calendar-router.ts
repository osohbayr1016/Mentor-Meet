import { Router } from "express";
import { verifyToken } from "../middleware/token-checker";
import { isMentor } from "../middleware/mentor-authorization";
import { UpdateMentorAvailability } from "../controller/mentor-calendar";
import { getMentorCalendar } from "../controller/mentor-get-calendar";
import { createBooking } from "../controller/student-booking";

export const CalendarRouter = Router();

CalendarRouter.post(
  "/Calendar",
  verifyToken,
  isMentor,
  UpdateMentorAvailability
);

CalendarRouter.get("/calendar/:mentorId", getMentorCalendar);
CalendarRouter.post("/booking", createBooking)

