import { Router } from "express";
import {
  checkOtp,
  MentorCheckemail,
  MentorSignUp,
} from "../controller/mentor-register";
import { MentorLogin } from "../controller/mentor-login";
import { MentorTokenChecker } from "../middleware/token-checker";
import { isMentor } from "../middleware/mentor-authorization";
import { MentorCreateProfile1 } from "../controller/mentor-create-profile-1";
import { mentorForgetPass } from "../controller/mentor-forget-Password";
<<<<<<< HEAD
import { MentorGetProfile } from "../controller/mentor-get-profile";
=======
import { findmail } from "../controller/mentor-find-forReset";
>>>>>>> 94aca2b (reset)

export const MentorRouter = Router();

MentorRouter.post("/mentorEmail", MentorCheckemail);
MentorRouter.post("/mentorOtp", checkOtp);
MentorRouter.post("/mentorSignup", MentorSignUp);
MentorRouter.post("/mentorProfile", MentorTokenChecker, MentorCreateProfile1);
MentorRouter.get("mentorProfile", MentorTokenChecker, MentorGetProfile);
MentorRouter.post("/mentorLogin", MentorLogin);
MentorRouter.put("/mentorResetPassword", mentorForgetPass);
MentorRouter.put("/mentorResetPassword", mentorForgetPass);
MentorRouter.post("/findMail", findmail);
