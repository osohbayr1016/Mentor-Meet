import { Router } from "express";
import { MentorSignUp } from "../controller/mentor-signup";

export const MentorRouter = Router();

MentorRouter.post("/mentorSignup", MentorSignUp);
