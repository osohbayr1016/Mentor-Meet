import { Router } from "express";
import { MentorTokenChecker } from "../middleware/token-checker";
import { UpdateMentorAvailability } from "../controller/mentor-calendar";
import { getMentorCalendar } from "../controller/mentor-get-calendar";

export const CalendarRouter = Router();

CalendarRouter.post("/Calendar", MentorTokenChecker, UpdateMentorAvailability);

CalendarRouter.get("/calendar/:mentorId", getMentorCalendar);
