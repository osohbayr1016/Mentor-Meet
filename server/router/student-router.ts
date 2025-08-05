import { Router } from "express";
import {
  Checkemail,
  checkOtp,
  createPassword,
  StudentNameNumber,
} from "../controller/student-signup";
import { StudentLogin } from "../controller/student-login";
import { studentForgetPass } from "../controller/student-forgot-password";
import { studentVerify } from "../controller/student-verify";
import {
  getStudentBookings,
  cancelBooking,
  joinMeeting,
  getStudentProfile,
} from "../controller/student-dashboard";
import { createBooking } from "../controller/create-booking";

export const StudentRouter = Router();

StudentRouter.post("/Checkemail", Checkemail);
StudentRouter.post("/checkOtp", checkOtp);
StudentRouter.post("/createPassword", createPassword);
StudentRouter.post("/StudentNameNumber", StudentNameNumber);
StudentRouter.post("/studentLogin", StudentLogin);
StudentRouter.put("/StudentForgotPassword", studentForgetPass);
StudentRouter.put("/studentVerify", studentVerify);

// Student Dashboard routes
StudentRouter.post("/bookings", createBooking);
StudentRouter.get("/bookings/:studentId", getStudentBookings);
StudentRouter.put("/bookings/:bookingId/cancel", cancelBooking);
StudentRouter.post("/bookings/:bookingId/join", joinMeeting);
StudentRouter.get("/profile/:studentId", getStudentProfile);
