import { Router } from "express";
import {
  Checkemail,
  checkOtp,
  MentorSignUp,
} from "../controller/mentor-signUp";
import { MentorLogin } from "../controller/mentor-login";
import { MentorTokenChecker } from "../middleware/token-checker";
import { isMentor } from "../middleware/mentor-authorization";

export const MentorRouter = Router();

MentorRouter.post("/mentorEmail", Checkemail);
MentorRouter.post("/mentorOtp", checkOtp);
MentorRouter.post("/mentorSignup", MentorSignUp);
MentorRouter.post("/mentorLogin", MentorLogin);
