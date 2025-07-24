import { Router } from "express";
import { MentorSignUp } from "../controller/mentor-signUp";

export const MentorRouter = Router();

MentorRouter.post("/mentorSignup", MentorSignUp);
