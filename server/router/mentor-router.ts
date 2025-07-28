import { Router } from "express";
import {
  Checkemail,
  checkOtp,
  MentorSignUp,
} from "../controller/mentor-register";
import { MentorLogin } from "../controller/mentor-login";
import { MentorTokenChecker } from "../middleware/token-checker";
import { isMentor } from "../middleware/mentor-authorization";
import { MentorCreateProfile1 } from "../controller/mentor-create-profile-1";
import { mentorForgetPass } from "../controller/mentor-forget-Password";

export const MentorRouter = Router();

MentorRouter.post("/mentorEmail", Checkemail);
MentorRouter.post("/mentorOtp", checkOtp);
MentorRouter.post("/mentorSignup", MentorSignUp);
// MentorRouter.post("/mentorProfile", [MentorTokenChecker, isMentor], MentorCreateProfile1)
MentorRouter.post("/mentorProfile", MentorCreateProfile1);
MentorRouter.post("/mentorLogin", MentorLogin);
MentorRouter.put("/mentorResetPassword", mentorForgetPass);
