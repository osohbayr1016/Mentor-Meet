import { Router } from "express";

import {
  checkOtp,
  MentorCheckemail,
  MentorSignUp,
} from "../controller/mentor-register";

import { MentorLogin } from "../controller/mentor-login";
import { verifyToken } from "../middleware/token-checker";
import { isMentor } from "../middleware/mentor-authorization";
import { MentorCreateProfile1 } from "../controller/mentor-create-profile-1";
import { mentorForgetPass } from "../controller/mentor-forget-Password";
import { MentorGetProfile } from "../controller/mentor-get-profile";
import { findmail } from "../controller/mentor-find-forReset";
import { MentorCreateProfileStep2 } from "../controller/mentor-create-profile-2";
import { MentorCreateProfileStep3 } from "../controller/mentor-create-profile-3";

import { editMentorProfile } from "../controller/mentor-edit-profile";
import { mentorVerify } from "../controller/mentor-verify";
import { getMentorById } from "../controller/mentor-get-by-id";
import { getAllMentors } from "../controller/mentor-get-all";

// ✅ Шинэ controller оруулж байна
import { getEarnings } from "../controller/get-earnings";

export const MentorRouter = Router();

// ✉️ Auth + email
MentorRouter.post("/mentorEmail", MentorCheckemail);
MentorRouter.post("/mentorOtp", checkOtp);
MentorRouter.post("/mentorSignup", MentorSignUp);
MentorRouter.post("/mentorLogin", MentorLogin);
MentorRouter.post("/findMail", findmail);
MentorRouter.put("/mentorResetPassword", mentorForgetPass);
MentorRouter.post("/mentorVerify", mentorVerify);

// 👤 Profile create (3 steps)
MentorRouter.post(
  "/mentorProfile/step1",
  verifyToken,
  isMentor,
  MentorCreateProfile1
);
MentorRouter.patch(
  "/mentorProfile/step2",
  verifyToken,
  isMentor,
  MentorCreateProfileStep2
);
MentorRouter.patch(
  "/mentorProfile/step3",
  verifyToken,
  isMentor,
  MentorCreateProfileStep3
);

// 👁 Profile view + edit
MentorRouter.get("/mentorProfile", verifyToken, isMentor, MentorGetProfile);
MentorRouter.put(
  "/mentorEditProfile",
  verifyToken,
  isMentor,
  editMentorProfile
);

// 🔍 Get single/all mentor
MentorRouter.get("/mentor/:id", getMentorById);
MentorRouter.get("/mentors", getAllMentors);

// 💰 ✅ Get Earnings by mentorId
MentorRouter.get("/earnings/:mentorId", verifyToken, isMentor, getEarnings);
