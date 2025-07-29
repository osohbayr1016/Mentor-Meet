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
import { MentorGetProfile } from "../controller/mentor-get-profile";
import { findmail } from "../controller/mentor-find-forReset";
import { MentorCreateProfileStep2 } from "../controller/mentor-create-profile-2";
import { MentorCreateProfileStep3 } from "../controller/mentor-create-profile-3";
import { verify } from "../controller/verify";

export const MentorRouter = Router();

MentorRouter.post("/mentorEmail", MentorCheckemail);
MentorRouter.post("/mentorOtp", checkOtp);
MentorRouter.post("/mentorSignup", MentorSignUp);
<<<<<<< HEAD
MentorRouter.post("/mentorProfile/step1", MentorTokenChecker, MentorCreateProfile1);
MentorRouter.patch("/mentorProfile/step2", MentorTokenChecker, MentorCreateProfileStep2)
MentorRouter.patch("/mentorProfile/step3", MentorTokenChecker, MentorCreateProfileStep3)
MentorRouter.get("/mentorProfile", MentorTokenChecker, MentorGetProfile);
=======
MentorRouter.post(
  "/mentorProfile/step1",
  MentorTokenChecker,
  MentorCreateProfile1
);
MentorRouter.patch(
  "/mentorProfile/step2",
  MentorTokenChecker,
  MentorCreateProfileStep2
);
MentorRouter.patch(
  "mentorProfile/step3",
  MentorTokenChecker,
  MentorCreateProfileStep3
);
MentorRouter.get("mentorProfile", MentorTokenChecker, MentorGetProfile);
>>>>>>> 7a9649c (verify)
MentorRouter.post("/mentorLogin", MentorLogin);
MentorRouter.put("/mentorResetPassword", mentorForgetPass);
MentorRouter.put("/mentorResetPassword", mentorForgetPass);
MentorRouter.post("/findMail", findmail);
MentorRouter.post("/verify", verify);
